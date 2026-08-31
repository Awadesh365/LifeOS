import { Op } from 'sequelize';
import { models, sequelize } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';
import { shortId } from '../../utils/id.js';
import { calculateNeedState, nextFixedOccurrenceDate, SCHEDULE_TYPES } from './schedule.js';

const DEFAULT_AREAS = [
  ['Home', 'home', 'home'],
  ['Clothing & Laundry', 'clothing', 'local_laundry_service'],
  ['Personal Care', 'personal-care', 'self_care'],
  ['Health Admin', 'health-admin', 'health_and_safety'],
  ['Devices & Assets', 'devices', 'devices'],
  ['Life Admin', 'admin', 'description'],
  ['Digital', 'digital', 'cloud_sync'],
  ['Errands', 'errands', 'location_on'],
] as const;

const ITEM_STATUSES = ['active', 'backlog', 'paused', 'archived'] as const;
const PRIORITIES = ['must', 'should', 'can_wait'] as const;
const EFFORTS = ['light', 'moderate', 'heavy'] as const;
const REPAIR_STATES = ['reported', 'diagnosing', 'in_service', 'waiting', 'ready_to_collect', 'resolved', 'closed'] as const;

type Row = Record<string, any>;

function requiredString(value: unknown, name: string, max = 160) {
  if (typeof value !== 'string' || !value.trim()) throw createHttpError(400, `${name} is required`);
  return value.trim().slice(0, max);
}

function optionalString(value: unknown, max = 2000) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;
}

function enumValue<T extends readonly string[]>(value: unknown, allowed: T, name: string, fallback?: T[number]) {
  if ((value === undefined || value === null || value === '') && fallback) return fallback;
  if (typeof value !== 'string' || !allowed.includes(value as T[number])) {
    throw createHttpError(400, `${name} must be one of: ${allowed.join(', ')}`);
  }
  return value as T[number];
}

function optionalDate(value: unknown, name: string) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())) {
    throw createHttpError(400, `${name} must be a valid YYYY-MM-DD date`);
  }
  return value;
}

function optionalPositiveInt(value: unknown, name: string, max = 100_000) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0 || number > max) throw createHttpError(400, `${name} must be a positive integer`);
  return number;
}

function userId(value: unknown) {
  return requiredString(value, 'Authenticated user', 64).toLowerCase();
}

async function owned(model: any, id: string, ownerId: string) {
  const row = await model.findOne({ where: { id, userId: ownerId } });
  if (!row) throw createHttpError(404, 'Maintenance record not found');
  return row;
}

export async function ensureDefaultAreas(userIdInput: unknown) {
  const ownerId = userId(userIdInput);
  await sequelize.transaction(async (transaction) => {
    await sequelize.query('SELECT pg_advisory_xact_lock(72460392, hashtext(:ownerId))', { replacements: { ownerId }, transaction });
    const existing = await models.MaintenanceArea.count({ where: { userId: ownerId }, transaction });
    if (existing) return;
    await models.MaintenanceArea.bulkCreate(DEFAULT_AREAS.map(([name, type, icon]) => ({
      id: shortId(), userId: ownerId, name, type, icon, active: true, isDefault: true,
    })), { transaction });
  });
}

export async function listAreas(userIdInput: unknown) {
  const ownerId = userId(userIdInput);
  await ensureDefaultAreas(ownerId);
  const areas = await models.MaintenanceArea.findAll({ where: { userId: ownerId, active: true }, order: [['isDefault', 'DESC'], ['name', 'ASC']], raw: true }) as Row[];
  const itemCounts = await models.MaintenanceItem.findAll({
    where: { userId: ownerId, status: { [Op.ne]: 'archived' } },
    attributes: ['areaId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['areaId'], raw: true,
  }) as Row[];
  const counts = new Map(itemCounts.map((entry) => [entry.areaId, Number(entry.count)]));
  return areas.map((area) => ({ ...area, itemCount: counts.get(area.id) ?? 0 }));
}

export async function createArea(userIdInput: unknown, input: unknown) {
  const ownerId = userId(userIdInput);
  const body = (input ?? {}) as Row;
  const created = await models.MaintenanceArea.create({
    id: shortId(), userId: ownerId,
    name: requiredString(body.name, 'Area name', 100),
    type: optionalString(body.type, 40) ?? 'custom',
    icon: optionalString(body.icon, 40) ?? 'home_repair_service',
    standard: optionalString(body.standard), active: true, isDefault: false,
  });
  return created.toJSON();
}

function serializeItem(row: Row) {
  const plain = typeof row.toJSON === 'function' ? row.toJSON() : row;
  const need = calculateNeedState(plain);
  return { ...plain, needState: need.state, needReason: need.reason, calculatedTargetDate: need.targetDate, daysUntilTarget: need.daysUntilTarget };
}

export async function listItems(userIdInput: unknown, query: Row = {}) {
  const ownerId = userId(userIdInput);
  await ensureDefaultAreas(ownerId);
  const where: Row = { userId: ownerId, status: query.includeArchived === 'true' ? { [Op.ne]: null } : { [Op.ne]: 'archived' } };
  if (query.areaId) where.areaId = query.areaId;
  if (query.status) where.status = query.status;
  if (query.search) where.name = { [Op.iLike]: `%${String(query.search).slice(0, 80)}%` };
  const items = await models.MaintenanceItem.findAll({
    where,
    include: [
      { model: models.MaintenanceArea, as: 'area', attributes: ['id', 'name', 'type', 'icon'] },
      { model: models.MaintenanceAsset, as: 'asset', attributes: ['id', 'name'] },
    ],
    order: [['updatedAt', 'DESC']],
  });
  return items.map((item) => serializeItem(item));
}

function normalizeItemInput(body: Row, partial = false) {
  const output: Row = {};
  if (!partial || body.name !== undefined) output.name = requiredString(body.name, 'Item name');
  if (!partial || body.areaId !== undefined) output.areaId = requiredString(body.areaId, 'Area');
  if (!partial || body.scheduleType !== undefined) output.scheduleType = enumValue(body.scheduleType, SCHEDULE_TYPES, 'scheduleType', 'condition');
  if (!partial || body.status !== undefined) output.status = enumValue(body.status, ITEM_STATUSES, 'status', 'active');
  if (!partial || body.priority !== undefined) output.priority = enumValue(body.priority, PRIORITIES, 'priority', 'should');
  if (!partial || body.effort !== undefined) output.effort = enumValue(body.effort, EFFORTS, 'effort', 'light');
  for (const field of ['intervalDays', 'windowStartDays', 'windowEndDays', 'durationMinutes']) {
    if (!partial || body[field] !== undefined) output[field] = optionalPositiveInt(body[field], field) ?? (field === 'durationMinutes' ? 30 : null);
  }
  for (const field of ['nextDate']) if (!partial || body[field] !== undefined) output[field] = optionalDate(body[field], field);
  for (const field of ['assetId', 'conditionState', 'notes']) if (!partial || body[field] !== undefined) output[field] = optionalString(body[field]);
  if (output.windowStartDays && output.windowEndDays && output.windowStartDays > output.windowEndDays) {
    throw createHttpError(400, 'windowStartDays cannot be after windowEndDays');
  }
  const scheduleType = output.scheduleType ?? body.scheduleType;
  if (!partial && scheduleType === 'interval' && !output.intervalDays) throw createHttpError(400, 'intervalDays is required for interval schedules');
  if (!partial && scheduleType === 'fixed_recurring' && (!output.intervalDays || !output.nextDate)) throw createHttpError(400, 'Fixed recurring schedules require a next date and interval');
  if (!partial && scheduleType === 'flexible_window' && (!output.windowStartDays || !output.windowEndDays)) throw createHttpError(400, 'Flexible schedules require a start and end window');
  if (!partial && ['hard_deadline', 'seasonal'].includes(scheduleType) && !output.nextDate) throw createHttpError(400, `${scheduleType} schedules require a date`);
  return output;
}

export async function createItem(userIdInput: unknown, input: unknown) {
  const ownerId = userId(userIdInput);
  const body = (input ?? {}) as Row;
  const values = normalizeItemInput(body);
  await owned(models.MaintenanceArea, values.areaId, ownerId);
  if (values.assetId) await owned(models.MaintenanceAsset, values.assetId, ownerId);
  const created = await models.MaintenanceItem.create({ id: shortId(), userId: ownerId, ...values, updatedAt: new Date() });
  return serializeItem(created);
}

export async function updateItem(userIdInput: unknown, id: string, input: unknown) {
  const ownerId = userId(userIdInput);
  const item = await owned(models.MaintenanceItem, id, ownerId);
  const values = normalizeItemInput((input ?? {}) as Row, true);
  if (values.areaId) await owned(models.MaintenanceArea, values.areaId, ownerId);
  if (values.assetId) await owned(models.MaintenanceAsset, values.assetId, ownerId);
  await item.update({ ...values, updatedAt: new Date() });
  return serializeItem(item);
}

export async function completeItem(userIdInput: unknown, id: string, input: unknown) {
  const ownerId = userId(userIdInput);
  const item = await owned(models.MaintenanceItem, id, ownerId);
  const body = (input ?? {}) as Row;
  const completedAt = body.completedAt ? new Date(body.completedAt) : new Date();
  if (Number.isNaN(completedAt.getTime()) || completedAt.getTime() > Date.now() + 300_000) throw createHttpError(400, 'completedAt is invalid');
  const occurrence = await sequelize.transaction(async (transaction) => {
    const created = await models.MaintenanceOccurrence.create({
      id: shortId(), userId: ownerId, itemId: id, action: 'completed', completedAt,
      durationMinutes: optionalPositiveInt(body.durationMinutes, 'durationMinutes') ?? item.get('durationMinutes'),
      cost: body.cost === undefined || body.cost === '' ? null : Math.max(0, Number(body.cost)),
      notes: optionalString(body.notes),
    }, { transaction });
    const completionUpdate: Row = { lastCompletedAt: completedAt, updatedAt: new Date() };
    if (item.get('scheduleType') === 'fixed_recurring' && item.get('nextDate') && item.get('intervalDays')) {
      completionUpdate.nextDate = nextFixedOccurrenceDate(String(item.get('nextDate')), Number(item.get('intervalDays')), completedAt);
    }
    if (item.get('scheduleType') === 'hard_deadline') completionUpdate.status = 'archived';
    await item.update(completionUpdate, { transaction });
    return created;
  });
  return { item: serializeItem(item), occurrence: occurrence.toJSON() };
}

export async function getItemHistory(userIdInput: unknown, id: string) {
  const ownerId = userId(userIdInput);
  await owned(models.MaintenanceItem, id, ownerId);
  return models.MaintenanceOccurrence.findAll({ where: { userId: ownerId, itemId: id }, order: [['createdAt', 'DESC']], raw: true });
}

export async function listAssets(userIdInput: unknown) {
  const ownerId = userId(userIdInput);
  return models.MaintenanceAsset.findAll({ where: { userId: ownerId, status: { [Op.ne]: 'archived' } }, order: [['name', 'ASC']], raw: true });
}

export async function createAsset(userIdInput: unknown, input: unknown) {
  const ownerId = userId(userIdInput);
  const body = (input ?? {}) as Row;
  if (body.areaId) await owned(models.MaintenanceArea, body.areaId, ownerId);
  const created = await models.MaintenanceAsset.create({
    id: shortId(), userId: ownerId, name: requiredString(body.name, 'Asset name', 140),
    areaId: optionalString(body.areaId), category: optionalString(body.category, 60) ?? 'other',
    brand: optionalString(body.brand, 100), model: optionalString(body.model, 100), serialNumber: optionalString(body.serialNumber, 160),
    purchaseDate: optionalDate(body.purchaseDate, 'purchaseDate'), warrantyEndsAt: optionalDate(body.warrantyEndsAt, 'warrantyEndsAt'),
    purchaseCost: body.purchaseCost === undefined || body.purchaseCost === '' ? null : Math.max(0, Number(body.purchaseCost)),
    location: optionalString(body.location, 140), notes: optionalString(body.notes), status: 'active',
  });
  return created.toJSON();
}

export async function listRepairs(userIdInput: unknown) {
  const ownerId = userId(userIdInput);
  return models.RepairCase.findAll({
    where: { userId: ownerId },
    include: [{ model: models.MaintenanceAsset, as: 'asset', attributes: ['id', 'name'] }],
    order: [['updatedAt', 'DESC']],
  });
}

export async function createRepair(userIdInput: unknown, input: unknown) {
  const ownerId = userId(userIdInput);
  const body = (input ?? {}) as Row;
  if (body.assetId) await owned(models.MaintenanceAsset, body.assetId, ownerId);
  if (body.areaId) await owned(models.MaintenanceArea, body.areaId, ownerId);
  const created = await models.RepairCase.create({
    id: shortId(), userId: ownerId, title: requiredString(body.title, 'Case title'), issue: requiredString(body.issue, 'Issue', 4000),
    assetId: optionalString(body.assetId), areaId: optionalString(body.areaId), state: 'reported',
    nextAction: optionalString(body.nextAction), followUpDate: optionalDate(body.followUpDate, 'followUpDate'), updatedAt: new Date(),
  });
  return created.toJSON();
}

export async function updateRepair(userIdInput: unknown, id: string, input: unknown) {
  const ownerId = userId(userIdInput);
  const repair = await owned(models.RepairCase, id, ownerId);
  const body = (input ?? {}) as Row;
  const values: Row = { updatedAt: new Date() };
  if (body.state !== undefined) values.state = enumValue(body.state, REPAIR_STATES, 'state');
  if (body.nextAction !== undefined) values.nextAction = optionalString(body.nextAction);
  if (body.waitingOn !== undefined) values.waitingOn = optionalString(body.waitingOn, 140);
  if (body.followUpDate !== undefined) values.followUpDate = optionalDate(body.followUpDate, 'followUpDate');
  if (body.outcome !== undefined) values.outcome = optionalString(body.outcome);
  if (values.state === 'resolved' || values.state === 'closed') values.closedAt = new Date();
  await repair.update(values);
  return repair.toJSON();
}

function weekStart(date = new Date()) {
  const value = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() - day + 1);
  return value.toISOString().slice(0, 10);
}

export async function getCurrentPlan(userIdInput: unknown) {
  const ownerId = userId(userIdInput);
  const start = weekStart();
  const [plan] = await models.WeeklyMaintenancePlan.findOrCreate({
    where: { userId: ownerId, weekStart: start },
    defaults: { id: shortId(), userId: ownerId, weekStart: start, capacityMinutes: 240, selectedItems: [], status: 'draft', updatedAt: new Date() },
  });
  return plan.toJSON();
}

export async function updateCurrentPlan(userIdInput: unknown, input: unknown) {
  const ownerId = userId(userIdInput);
  const plan = await getCurrentPlan(ownerId) as Row;
  const record = await owned(models.WeeklyMaintenancePlan, plan.id, ownerId);
  const body = (input ?? {}) as Row;
  const values: Row = { updatedAt: new Date() };
  if (body.capacityMinutes !== undefined) values.capacityMinutes = optionalPositiveInt(body.capacityMinutes, 'capacityMinutes', 10_080);
  if (body.selectedItems !== undefined) {
    if (!Array.isArray(body.selectedItems) || body.selectedItems.length > 200) throw createHttpError(400, 'selectedItems must be an array');
    values.selectedItems = body.selectedItems.map((entry: Row) => ({ itemId: requiredString(entry.itemId, 'itemId'), priority: enumValue(entry.priority, PRIORITIES, 'priority', 'should') }));
    const uniqueItemIds = [...new Set(values.selectedItems.map((entry: Row) => entry.itemId))];
    if (uniqueItemIds.length !== values.selectedItems.length) throw createHttpError(400, 'selectedItems cannot contain duplicates');
    const ownedItemCount = uniqueItemIds.length
      ? await models.MaintenanceItem.count({ where: { userId: ownerId, id: { [Op.in]: uniqueItemIds } } })
      : 0;
    if (ownedItemCount !== uniqueItemIds.length) throw createHttpError(400, 'selectedItems contains an unknown maintenance item');
  }
  if (body.status !== undefined) {
    values.status = enumValue(body.status, ['draft', 'committed', 'complete'] as const, 'status');
    if (values.status === 'committed') values.committedAt = new Date();
  }
  if (body.notes !== undefined) values.notes = optionalString(body.notes);
  await record.update(values);
  return record.toJSON();
}

export async function getSummary(userIdInput: unknown) {
  const ownerId = userId(userIdInput);
  const [items, areas, assets, repairs, plan] = await Promise.all([
    listItems(ownerId), listAreas(ownerId), listAssets(ownerId), listRepairs(ownerId), getCurrentPlan(ownerId),
  ]);
  const attentionStates = new Set(['due', 'needs_attention', 'overdue']);
  const openRepairs = repairs.filter((entry: any) => !['resolved', 'closed'].includes(entry.state));
  const hardDeadlines = items.filter((item) => item.scheduleType === 'hard_deadline' && item.needState !== 'can_wait');
  const activeItems = items.filter((item) => item.status === 'active');
  return {
    counts: {
      needsAttention: activeItems.filter((item) => attentionStates.has(item.needState)).length,
      hardDeadlines: hardDeadlines.length,
      openRepairs: openRepairs.length,
      waiting: openRepairs.filter((entry: any) => entry.state === 'waiting').length,
      backlog: items.filter((item) => item.status === 'backlog').length,
      assets: assets.length,
    },
    attention: activeItems.filter((item) => attentionStates.has(item.needState)).slice(0, 8),
    upcoming: activeItems.filter((item) => item.needState === 'approaching').slice(0, 8),
    hardDeadlines: hardDeadlines.slice(0, 6), areas, repairs: openRepairs.slice(0, 6), plan,
  };
}
