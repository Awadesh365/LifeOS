import { models } from '../../../../models';
import { shortId } from '../../../../utils/id';

export async function listProjects() {
  return models.Project.findAll({ raw: true });
}

export async function createProject(input: Record<string, any>) {
  const created = await models.Project.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateProject(id: string, input: Record<string, any>) {
  await models.Project.update(input, { where: { id } });
  return models.Project.findByPk(id, { raw: true });
}

export async function deleteProject(id: string) {
  await models.Project.destroy({ where: { id } });
  return { ok: true };
}
