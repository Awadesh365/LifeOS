import { models } from '../../../../models';
import { shortId } from '../../../../utils/id';

export async function listDreams() {
  return models.Dream.findAll({ order: [['orderIndex', 'ASC']], raw: true });
}

export async function createDream(input: Record<string, any>) {
  const created = await models.Dream.create({
    id: shortId(),
    text: input.text,
    icon: input.icon,
    priority: input.priority,
    orderIndex: await models.Dream.count(),
  });
  return created.toJSON();
}

export async function updateDream(id: string, input: Record<string, any>) {
  await models.Dream.update(input, { where: { id } });
  return models.Dream.findByPk(id, { raw: true });
}

export async function deleteDream(id: string) {
  await models.Dream.destroy({ where: { id } });
  return { ok: true };
}

export async function reorderDreams(order: string[]) {
  for (let i = 0; i < order.length; i++) {
    await models.Dream.update({ orderIndex: i }, { where: { id: order[i] } });
  }
  return { ok: true };
}
