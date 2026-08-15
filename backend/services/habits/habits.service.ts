import { models } from '../../models/index.js';
import { todayIsoDate } from '../../utils/date.js';
import { shortId } from '../../utils/id.js';

export async function listHabits(date = todayIsoDate()) {
  const allHabits = await models.Habit.findAll({ raw: true });
  const logs = await models.HabitLog.findAll({ where: { date }, raw: true });

  return allHabits.map((habit: any) => ({
    ...habit,
    done: logs.some((log: any) => log.habitId === habit.id && log.done),
  }));
}

export async function createHabit(input: Record<string, any>) {
  const created = await models.Habit.create({ id: shortId(), ...input });
  return created.toJSON();
}

export async function updateHabit(id: string, input: Record<string, any>) {
  await models.Habit.update(input, { where: { id } });
  return models.Habit.findByPk(id, { raw: true });
}

export async function deleteHabit(id: string) {
  await models.HabitLog.destroy({ where: { habitId: id } });
  await models.Habit.destroy({ where: { id } });
  return { ok: true };
}

export async function toggleHabit(id: string, date: string) {
  const existing = await models.HabitLog.findOne({ where: { habitId: id, date } });

  if (existing) {
    await existing.update({ done: !existing.get('done') });
    return { ok: true };
  }

  await models.HabitLog.create({ id: shortId(), habitId: id, date, done: true });
  return { ok: true };
}

export async function getHabitHistory(date: string) {
  return models.HabitLog.findAll({ where: { date }, raw: true });
}
