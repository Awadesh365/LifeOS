import { models } from '../../models/index.js';
import { shortId } from '../../utils/id.js';

export async function listCareerEntries() {
  return models.CareerEntry.findAll({ raw: true });
}

export async function createCareerEntry(input: Record<string, any>) {
  const created = await models.CareerEntry.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateCareerEntry(id: string, input: Record<string, any>) {
  await models.CareerEntry.update(input, { where: { id } });
  return models.CareerEntry.findByPk(id, { raw: true });
}

export async function deleteCareerEntry(id: string) {
  await models.CareerEntry.destroy({ where: { id } });
  return { ok: true };
}
