import { models } from '../../../models/index.js';
import { shortId } from '../../../utils/id.js';

export async function listFuturePlans() {
  return models.FuturePlan.findAll({ raw: true });
}

export async function createFuturePlan(input: Record<string, any>) {
  const created = await models.FuturePlan.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateFuturePlan(id: string, input: Record<string, any>) {
  await models.FuturePlan.update(input, { where: { id } });
  return models.FuturePlan.findByPk(id, { raw: true });
}

export async function deleteFuturePlan(id: string) {
  await models.FuturePlan.destroy({ where: { id } });
  return { ok: true };
}
