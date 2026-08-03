import { models } from '../../../../models';
import { createHttpError } from '../../../../utils/httpError';
import { shortId } from '../../../../utils/id';

const ROUTINE_TYPES = new Set(['weekday', 'weekend']);

type RoutineItemInput = {
  id?: string;
  time?: unknown;
  task?: unknown;
  icon?: unknown;
  duration?: unknown;
  note?: unknown;
};

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeRoutineItem(item: RoutineItemInput, orderIndex: number, type: string) {
  return {
    id: normalizeText(item.id) || shortId(),
    type,
    time: normalizeText(item.time),
    task: normalizeText(item.task),
    icon: normalizeText(item.icon) || '•',
    duration: normalizeText(item.duration) || null,
    note: normalizeText(item.note) || null,
    orderIndex,
  };
}

function groupRoutines(rows: any[]) {
  return ['weekday', 'weekend'].map((type) => ({
    type,
    items: rows.filter((item) => item.type === type),
  }));
}

export async function listRoutines(type?: string) {
  if (type) {
    return models.Routine.findAll({ where: { type }, order: [['orderIndex', 'ASC']], raw: true });
  }

  const all = await models.Routine.findAll({ order: [['orderIndex', 'ASC']], raw: true });
  return groupRoutines(all);
}

export async function createRoutine(input: Record<string, unknown>) {
  const type = String(input.type || '');
  const time = normalizeText(input.time);
  const task = normalizeText(input.task);

  if (!ROUTINE_TYPES.has(type) || !task || !time) {
    throw createHttpError(400, 'Type, time, and task are required');
  }

  const orderIndex = await models.Routine.count({ where: { type } });
  const created = await models.Routine.create({
    id: shortId(),
    type,
    time,
    task,
    icon: normalizeText(input.icon) || '•',
    duration: normalizeText(input.duration) || null,
    note: normalizeText(input.note) || null,
    orderIndex,
  });
  return created.toJSON();
}

export async function reorderRoutines(order: unknown) {
  if (!Array.isArray(order)) {
    throw createHttpError(400, 'Order must be an array of routine ids');
  }

  for (let i = 0; i < order.length; i++) {
    await models.Routine.update({ orderIndex: i }, { where: { id: String(order[i]) } });
  }

  return { ok: true };
}

export async function replaceRoutineType(type: string, items: unknown) {
  if (!ROUTINE_TYPES.has(type)) {
    return null;
  }

  if (!Array.isArray(items)) {
    throw createHttpError(400, 'Items must be an array');
  }

  const normalized = items
    .map((item: RoutineItemInput, index: number) => normalizeRoutineItem(item, index, type))
    .filter((item) => item.time && item.task);

  await models.Routine.destroy({ where: { type } });
  if (normalized.length > 0) {
    await models.Routine.bulkCreate(normalized);
  }

  const saved = await models.Routine.findAll({ where: { type }, order: [['orderIndex', 'ASC']], raw: true });
  return { type, items: saved };
}

export async function updateRoutine(id: string, input: Record<string, unknown>) {
  const time = normalizeText(input.time);
  const task = normalizeText(input.task);

  if (!task || !time) {
    throw createHttpError(400, 'Time and task are required');
  }

  await models.Routine.update({
    time,
    task,
    icon: normalizeText(input.icon) || '•',
    duration: normalizeText(input.duration) || null,
    note: normalizeText(input.note) || null,
  }, { where: { id } });

  const updated = await models.Routine.findByPk(id, { raw: true });
  if (!updated) {
    throw createHttpError(404, 'Routine item not found');
  }
  return updated;
}

export async function deleteRoutine(id: string) {
  await models.Routine.destroy({ where: { id } });
  return { ok: true };
}
