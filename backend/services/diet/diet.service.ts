import { models } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';
import { shortId } from '../../utils/id.js';

export async function listLogs(date?: string) {
  const where = date ? { date } : undefined;
  return models.DietLog.findAll({ where, raw: true });
}

export async function createLog(input: Record<string, any>) {
  const created = await models.DietLog.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function deleteLog(id: string) {
  await models.DietLog.destroy({ where: { id } });
  return { ok: true };
}

export async function listSupplements() {
  return models.Supplement.findAll({ raw: true });
}

export async function createSupplement(input: Record<string, any>) {
  const remainingDays = input.dailyUsage > 0 ? input.quantity / input.dailyUsage : 0;
  const created = await models.Supplement.create({
    id: shortId(),
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
    dailyUsage: input.dailyUsage,
    remainingDays,
    notes: input.notes,
  });
  return created.toJSON();
}

export async function updateSupplement(id: string, input: Record<string, any>) {
  const remainingDays = input.dailyUsage > 0 ? input.quantity / input.dailyUsage : 0;
  await models.Supplement.update({
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
    dailyUsage: input.dailyUsage,
    remainingDays,
    notes: input.notes,
  }, { where: { id } });
  return models.Supplement.findByPk(id, { raw: true });
}

export async function consumeSupplement(id: string, amount: number) {
  const supplement = await models.Supplement.findByPk(id);
  if (!supplement) {
    throw createHttpError(404, 'Supplement not found');
  }

  const newQuantity = Math.max(0, Number(supplement.get('quantity') || 0) - amount);
  const dailyUsage = Number(supplement.get('dailyUsage') || 0);
  const remainingDays = dailyUsage > 0 ? newQuantity / dailyUsage : 0;
  await supplement.update({ quantity: newQuantity, remainingDays });
  return supplement.toJSON();
}
