import { models } from '../../models/index.js';
import { todayIsoDate } from '../../utils/date.js';
import { shortId } from '../../utils/id.js';

export async function getHealthLog(date = todayIsoDate()) {
  return models.HealthLog.findOne({ where: { date }, raw: true });
}

export async function upsertHealthLog(input: Record<string, any>) {
  const logDate = input.date || todayIsoDate();
  const payload = {
    gymMinutes: input.gymMinutes,
    walkMinutes: input.walkMinutes,
    meditationMinutes: input.meditationMinutes,
    sleepHours: input.sleepHours,
    sleepQuality: input.sleepQuality,
    waterLiters: input.waterLiters,
    dietScore: input.dietScore,
    socializationMinutes: input.socializationMinutes,
    mentalPeaceScore: input.mentalPeaceScore,
    moodScore: input.moodScore,
    notes: input.notes,
  };

  const existing = await models.HealthLog.findOne({ where: { date: logDate } });

  if (existing) {
    await existing.update(payload);
    return existing.toJSON();
  }

  const created = await models.HealthLog.create({ id: shortId(), date: logDate, ...payload });
  return created.toJSON();
}

export async function getWeeklyHealthLogs() {
  const logs = await models.HealthLog.findAll({ order: [['date', 'ASC']], raw: true });
  return logs.slice(-7);
}
