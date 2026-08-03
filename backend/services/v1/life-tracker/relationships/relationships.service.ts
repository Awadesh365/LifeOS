import { models } from '../../../../models';
import { shortId } from '../../../../utils/id';

export async function getRelationships() {
  const relationshipRows = await models.Relationship.findAll({ raw: true });
  const relativeRows = await models.Relative.findAll({ raw: true });
  return { relationship: relationshipRows[0] || null, relatives: relativeRows };
}

export async function upsertRelationship(input: Record<string, any>) {
  const existing = await models.Relationship.findOne();

  if (existing) {
    await existing.update(input);
    return existing.toJSON();
  }

  const created = await models.Relationship.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function createRelative(input: Record<string, any>) {
  const created = await models.Relative.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateRelative(id: string, input: Record<string, any>) {
  await models.Relative.update(input, { where: { id } });
  return models.Relative.findByPk(id, { raw: true });
}

export async function deleteRelative(id: string) {
  await models.Relative.destroy({ where: { id } });
  return { ok: true };
}
