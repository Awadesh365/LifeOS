import { models } from '../../models/index.js';
import { shortId } from '../../utils/id.js';

export async function getLearningTree() {
  const sections = await models.LearningSection.findAll({ order: [['orderIndex', 'ASC']], raw: true });
  const items = await models.LearningItem.findAll({ order: [['orderIndex', 'ASC']], raw: true });

  return sections.map((section: any) => ({
    ...section,
    items: items.filter((item: any) => item.sectionId === section.id),
  }));
}

export async function createSection(title: string) {
  const created = await models.LearningSection.create({
    id: shortId(),
    title,
    orderIndex: await models.LearningSection.count(),
  });
  return created.toJSON();
}

export async function updateSection(id: string, title: string) {
  await models.LearningSection.update({ title }, { where: { id } });
  return models.LearningSection.findByPk(id, { raw: true });
}

export async function deleteSection(id: string) {
  await models.LearningItem.destroy({ where: { sectionId: id } });
  await models.LearningSection.destroy({ where: { id } });
  return { ok: true };
}

export async function createItem(input: Record<string, string>) {
  const created = await models.LearningItem.create({
    id: shortId(),
    sectionId: input.sectionId,
    topic: input.topic,
    date: input.date || '',
    info: input.info || '',
    source: input.source || '',
    status: 'not_started',
    orderIndex: await models.LearningItem.count({ where: { sectionId: input.sectionId } }),
  });
  return created.toJSON();
}

export async function updateItem(id: string, input: Record<string, any>) {
  await models.LearningItem.update(input, { where: { id } });
  return models.LearningItem.findByPk(id, { raw: true });
}

export async function updateItemStatus(id: string, status: string) {
  await models.LearningItem.update({ status }, { where: { id } });
  return models.LearningItem.findByPk(id, { raw: true });
}

export async function deleteItem(id: string) {
  await models.LearningItem.destroy({ where: { id } });
  return { ok: true };
}

export async function reorderItems(order: Array<{ id: string; orderIndex: number; sectionId: string }>) {
  for (const item of order) {
    await models.LearningItem.update({ orderIndex: item.orderIndex, sectionId: item.sectionId }, { where: { id: item.id } });
  }
  return { ok: true };
}
