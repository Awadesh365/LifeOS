import { models } from '../../../../models';
import { shortId } from '../../../../utils/id';

export async function listGoals() {
  const allGoals = await models.Goal.findAll({ raw: true });
  const allMilestones = await models.Milestone.findAll({ order: [['orderIndex', 'ASC']], raw: true });

  return allGoals.map((goal: any) => ({
    ...goal,
    milestones: allMilestones.filter((milestone: any) => milestone.goalId === goal.id),
  }));
}

export async function createGoal(input: Record<string, any>) {
  const created = await models.Goal.create({
    id: shortId(),
    title: input.title,
    category: input.category,
    icon: input.icon,
    target: input.target,
    current: input.current || 0,
    unit: input.unit || '',
  });
  return created.toJSON();
}

export async function updateGoal(id: string, input: Record<string, any>) {
  await models.Goal.update(input, { where: { id } });
  return models.Goal.findByPk(id, { raw: true });
}

export async function deleteGoal(id: string) {
  await models.Milestone.destroy({ where: { goalId: id } });
  await models.Goal.destroy({ where: { id } });
  return { ok: true };
}

export async function createMilestone(goalId: string, input: Record<string, any>) {
  const created = await models.Milestone.create({
    id: shortId(),
    goalId,
    label: input.label,
    value: input.value,
    done: false,
    orderIndex: await models.Milestone.count({ where: { goalId } }),
  });
  return created.toJSON();
}

export async function updateMilestoneStatus(id: string, done: boolean) {
  await models.Milestone.update({ done }, { where: { id } });
  return models.Milestone.findByPk(id, { raw: true });
}

export async function deleteMilestone(id: string) {
  await models.Milestone.destroy({ where: { id } });
  return { ok: true };
}
