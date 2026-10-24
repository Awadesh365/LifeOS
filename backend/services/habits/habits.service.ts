import { Op, Transaction } from "sequelize";
import { models, sequelize } from "../../models/index.js";
import { todayIsoDate } from "../../utils/date.js";
import { shortId } from "../../utils/id.js";
import { createHttpError } from "../../utils/httpError.js";
import {
  habitDate,
  habitInput,
  completionValue,
  habitWeek,
} from "./habits.validation.js";

export async function getHabitWeek(endInput: unknown = todayIsoDate()) {
  const dates = habitWeek(habitDate(endInput));
  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
    async (transaction) => {
      const habits = await models.Habit.findAll({
        order: [
          ["name", "ASC"],
          ["id", "ASC"],
        ],
        raw: true,
        transaction,
      });
      const logs = await models.HabitLog.findAll({
        where: { date: { [Op.in]: dates } },
        raw: true,
        transaction,
      });
      const days = dates.map((date) => {
        const items = habits.map((habit: any) => ({
          ...habit,
          done: logs.some(
            (log: any) =>
              log.date === date && log.habitId === habit.id && log.done,
          ),
        }));
        return {
          date,
          habits: items,
          completed: items.filter((item) => item.done).length,
          total: items.length,
        };
      });
      return { days };
    },
  );
}

export async function listHabits(dateInput: unknown = todayIsoDate()) {
  const { days } = await getHabitWeek(dateInput);
  return days[6].habits;
}

export async function createHabit(input: unknown) {
  const created = await models.Habit.create({
    id: shortId(),
    ...habitInput(input),
  });
  return { ...created.toJSON(), done: false };
}

async function lockedHabit(id: string, transaction: Transaction) {
  const row = await models.Habit.findByPk(id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!row) throw createHttpError(404, "Habit not found");
  return row;
}

export async function updateHabit(id: string, input: unknown) {
  const values = habitInput(input, true);
  return sequelize.transaction(async (transaction) => {
    const row = await lockedHabit(id, transaction);
    await row.update(values, { transaction });
    return row.toJSON();
  });
}

export async function deleteHabit(id: string) {
  return sequelize.transaction(async (transaction) => {
    const row = await lockedHabit(id, transaction);
    await models.HabitLog.destroy({ where: { habitId: id }, transaction });
    await row.destroy({ transaction });
    return { ok: true };
  });
}

async function writeCompletion(
  id: string,
  date: string,
  done: boolean | undefined,
  transaction: Transaction,
) {
  const row = await lockedHabit(id, transaction);
  const logs = await models.HabitLog.findAll({
    where: { habitId: id, date },
    transaction,
  });
  const next = done ?? !logs.some((log) => log.get("done"));
  // Parent row lock serializes all writers, including old toggle clients.
  // Consolidate any historical duplicate logs without losing their effective state.
  await models.HabitLog.destroy({ where: { habitId: id, date }, transaction });
  await models.HabitLog.create(
    { id: shortId(), habitId: id, date, done: next },
    { transaction },
  );
  return { ...row.toJSON(), done: next };
}

export async function setCompletion(
  id: string,
  dateInput: unknown,
  doneInput: unknown,
) {
  const date = habitDate(dateInput);
  const done = completionValue(doneInput);
  return sequelize.transaction((transaction) =>
    writeCompletion(id, date, done, transaction),
  );
}

export async function setCompletions(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw createHttpError(400, "Completion details are required");
  }
  const input = value as Record<string, unknown>;
  const date = habitDate(input.date);
  const done = completionValue(input.done);
  if (
    !Array.isArray(input.ids) ||
    !input.ids.length ||
    input.ids.length > 1000 ||
    input.ids.some((id) => typeof id !== "string" || !id)
  )
    throw createHttpError(400, "Provide 1–1000 habit ids");
  const ids = [...new Set(input.ids as string[])].sort();
  return sequelize.transaction(async (transaction) => {
    const rows = [];
    for (const id of ids)
      rows.push(await writeCompletion(id, date, done, transaction));
    return rows;
  });
}

export async function toggleHabit(id: string, dateInput: unknown) {
  const date = habitDate(dateInput);
  return sequelize.transaction((transaction) =>
    writeCompletion(id, date, undefined, transaction),
  );
}

export async function getHabitHistory(dateInput: unknown) {
  const date = habitDate(dateInput);
  const logs = await models.HabitLog.findAll({
    where: { date },
    order: [["id", "ASC"]],
    raw: true,
  });
  const byHabit = new Map<string, any>();
  for (const log of logs as any[]) {
    const previous = byHabit.get(log.habitId);
    byHabit.set(log.habitId, {
      ...log,
      done: Boolean(previous?.done || log.done),
    });
  }
  return [...byHabit.values()];
}
