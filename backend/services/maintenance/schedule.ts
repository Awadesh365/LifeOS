export const SCHEDULE_TYPES = [
  'fixed_recurring',
  'interval',
  'flexible_window',
  'condition',
  'hard_deadline',
  'seasonal',
  'none',
] as const;

export type ScheduleType = typeof SCHEDULE_TYPES[number];
export type NeedState = 'can_wait' | 'approaching' | 'due' | 'needs_attention' | 'overdue' | 'backlog' | 'paused';

export interface MaintenanceSchedule {
  scheduleType: ScheduleType;
  lastCompletedAt?: string | Date | null;
  nextDate?: string | null;
  intervalDays?: number | null;
  windowStartDays?: number | null;
  windowEndDays?: number | null;
  conditionState?: 'okay' | 'low' | 'needs_attention' | null;
  status?: string | null;
}

export interface NeedStateResult {
  state: NeedState;
  reason: string;
  targetDate: string | null;
  daysUntilTarget: number | null;
}

const DAY_MS = 86_400_000;

function startOfUtcDay(value: string | Date) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error('Invalid schedule date');
  return Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
}

function daysBetween(from: string | Date, to: string | Date) {
  return Math.round((startOfUtcDay(to) - startOfUtcDay(from)) / DAY_MS);
}

function toIsoDate(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

export function scheduleSnapshot(schedule: MaintenanceSchedule) {
  if (schedule.scheduleType === 'flexible_window' && schedule.lastCompletedAt && schedule.windowStartDays && schedule.windowEndDays) {
    const anchor = startOfUtcDay(schedule.lastCompletedAt);
    return {
      plannedDate: null,
      windowStart: toIsoDate(anchor + schedule.windowStartDays * DAY_MS),
      windowEnd: toIsoDate(anchor + schedule.windowEndDays * DAY_MS),
      hardDueAt: null,
    };
  }
  return {
    plannedDate: schedule.scheduleType === 'hard_deadline' ? null : schedule.nextDate ?? null,
    windowStart: null,
    windowEnd: null,
    hardDueAt: schedule.scheduleType === 'hard_deadline' ? schedule.nextDate ?? null : null,
  };
}

export function nextFixedOccurrenceDate(currentDate: string, intervalDays: number, completedAt: Date) {
  if (!Number.isInteger(intervalDays) || intervalDays <= 0) throw new Error('Fixed recurrence interval must be positive');
  let next = startOfUtcDay(currentDate) + intervalDays * DAY_MS;
  const completionDay = startOfUtcDay(completedAt);
  while (next <= completionDay) next += intervalDays * DAY_MS;
  return toIsoDate(next);
}

export function calculateNeedState(schedule: MaintenanceSchedule, now: Date = new Date()): NeedStateResult {
  if (schedule.status === 'paused' || schedule.status === 'archived') {
    return { state: 'paused', reason: 'This item is paused.', targetDate: null, daysUntilTarget: null };
  }
  if (schedule.status === 'backlog') {
    return { state: 'backlog', reason: 'This item is in the non-urgent backlog.', targetDate: null, daysUntilTarget: null };
  }

  if (schedule.scheduleType === 'condition') {
    const state = schedule.conditionState === 'needs_attention'
      ? 'needs_attention'
      : schedule.conditionState === 'low' ? 'approaching' : 'can_wait';
    return {
      state,
      reason: schedule.conditionState === 'needs_attention'
        ? 'The observed condition needs attention.'
        : schedule.conditionState === 'low'
          ? 'The observed condition is getting low.'
          : 'The observed condition is okay.',
      targetDate: null,
      daysUntilTarget: null,
    };
  }

  if (schedule.scheduleType === 'hard_deadline' && schedule.nextDate) {
    const days = daysBetween(now, schedule.nextDate);
    const state: NeedState = days < 0 ? 'overdue' : days <= 7 ? 'needs_attention' : days <= 21 ? 'approaching' : 'can_wait';
    return {
      state,
      reason: days < 0
        ? `The external deadline passed ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago.`
        : days === 0 ? 'The external deadline is today.' : `The external deadline is in ${days} days.`,
      targetDate: schedule.nextDate,
      daysUntilTarget: days,
    };
  }

  if (schedule.scheduleType === 'flexible_window' && schedule.lastCompletedAt && schedule.windowStartDays && schedule.windowEndDays) {
    const elapsed = daysBetween(schedule.lastCompletedAt, now);
    const start = schedule.windowStartDays;
    const end = schedule.windowEndDays;
    const startDate = toIsoDate(startOfUtcDay(schedule.lastCompletedAt) + start * DAY_MS);
    const state: NeedState = elapsed < Math.max(0, start - Math.max(2, Math.round(start * 0.2)))
      ? 'can_wait' : elapsed < start ? 'approaching' : elapsed <= end ? 'due' : 'needs_attention';
    return {
      state,
      reason: elapsed < start
        ? `The preferred window starts in ${start - elapsed} days.`
        : elapsed <= end ? `Inside the preferred ${start}–${end} day window.`
          : `Past the preferred window by ${elapsed - end} days; this is not a hard deadline.`,
      targetDate: startDate,
      daysUntilTarget: start - elapsed,
    };
  }

  if (schedule.scheduleType === 'interval' && schedule.lastCompletedAt && schedule.intervalDays) {
    const elapsed = daysBetween(schedule.lastCompletedAt, now);
    const days = schedule.intervalDays - elapsed;
    const approachingAt = Math.max(2, Math.round(schedule.intervalDays * 0.2));
    const state: NeedState = days < 0 ? 'needs_attention' : days === 0 ? 'due' : days <= approachingAt ? 'approaching' : 'can_wait';
    return {
      state,
      reason: days < 0
        ? `${Math.abs(days)} days beyond the usual interval; this is not a hard deadline.`
        : days === 0 ? 'The usual interval is reached today.' : `${days} days until the usual interval.`,
      targetDate: toIsoDate(startOfUtcDay(schedule.lastCompletedAt) + schedule.intervalDays * DAY_MS),
      daysUntilTarget: days,
    };
  }

  if (schedule.nextDate) {
    const days = daysBetween(now, schedule.nextDate);
    const state: NeedState = days < 0 ? 'needs_attention' : days <= 7 ? 'due' : days <= 21 ? 'approaching' : 'can_wait';
    return {
      state,
      reason: days < 0
        ? `The planned date passed ${Math.abs(days)} days ago; this is not a hard deadline.`
        : days === 0 ? 'Planned for today.' : `Planned in ${days} days.`,
      targetDate: schedule.nextDate,
      daysUntilTarget: days,
    };
  }

  return { state: 'can_wait', reason: 'No current timing signal requires attention.', targetDate: null, daysUntilTarget: null };
}
