import { models } from '../../../models/index.js';
import { createHttpError } from '../../../utils/httpError.js';
import { shortId } from '../../../utils/id.js';

export async function listFunds() {
  return models.EmergencyFund.findAll({ raw: true });
}

export async function createFund(input: Record<string, any>) {
  const created = await models.EmergencyFund.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateFund(id: string, input: Record<string, any>) {
  await models.EmergencyFund.update(input, { where: { id } });
  return models.EmergencyFund.findByPk(id, { raw: true });
}

export async function depositFund(id: string, amount: number) {
  const fund = await models.EmergencyFund.findByPk(id);
  if (!fund) {
    throw createHttpError(404, 'Fund not found');
  }

  const currentAmount = Number(fund.get('amount') || 0);
  await fund.update({ amount: currentAmount + amount });
  return fund.toJSON();
}

export async function getSummary() {
  const all = await models.EmergencyFund.findAll({ raw: true });
  const total = all.reduce((sum: number, fund: any) => sum + fund.amount, 0);
  const target = all.reduce((sum: number, fund: any) => sum + (fund.targetAmount || 0), 0);
  return { total, target, progress: target > 0 ? (total / target) * 100 : 0 };
}
