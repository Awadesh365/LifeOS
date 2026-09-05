import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateNeedState, nextFixedOccurrenceDate, scheduleSnapshot } from '../../services/maintenance/schedule.js';

const now = new Date('2026-08-31T12:00:00.000Z');

describe('maintenance need-state engine', () => {
  it('reserves overdue for true hard deadlines', () => {
    assert.equal(calculateNeedState({ scheduleType: 'hard_deadline', nextDate: '2026-08-30' }, now).state, 'overdue');
    assert.equal(calculateNeedState({ scheduleType: 'fixed_recurring', nextDate: '2026-08-30' }, now).state, 'needs_attention');
  });

  it('moves flexible windows through calm, interpretable states', () => {
    const base = { scheduleType: 'flexible_window' as const, windowStartDays: 10, windowEndDays: 14 };
    assert.equal(calculateNeedState({ ...base, lastCompletedAt: '2026-08-25' }, now).state, 'can_wait');
    assert.equal(calculateNeedState({ ...base, lastCompletedAt: '2026-08-22' }, now).state, 'approaching');
    assert.equal(calculateNeedState({ ...base, lastCompletedAt: '2026-08-19' }, now).state, 'due');
    assert.equal(calculateNeedState({ ...base, lastCompletedAt: '2026-08-10' }, now).state, 'needs_attention');
  });

  it('resets interval timing from actual completion', () => {
    const result = calculateNeedState({ scheduleType: 'interval', intervalDays: 30, lastCompletedAt: '2026-08-04' }, now);
    assert.equal(result.state, 'approaching');
    assert.equal(result.targetDate, '2026-09-03');
  });

  it('keeps fixed recurrence anchored when completion is early or late', () => {
    assert.equal(nextFixedOccurrenceDate('2026-08-30', 7, new Date('2026-08-28T12:00:00Z')), '2026-09-06');
    assert.equal(nextFixedOccurrenceDate('2026-08-30', 7, new Date('2026-09-09T12:00:00Z')), '2026-09-13');
  });

  it('uses explicit condition and backlog states', () => {
    assert.equal(calculateNeedState({ scheduleType: 'condition', conditionState: 'needs_attention' }, now).state, 'needs_attention');
    assert.equal(calculateNeedState({ scheduleType: 'seasonal', status: 'backlog' }, now).state, 'backlog');
  });

  it('snapshots schedule context for immutable completion history', () => {
    assert.deepEqual(scheduleSnapshot({ scheduleType: 'flexible_window', lastCompletedAt: '2026-08-20', windowStartDays: 10, windowEndDays: 14 }), {
      plannedDate: null, windowStart: '2026-08-30', windowEnd: '2026-09-03', hardDueAt: null,
    });
    assert.deepEqual(scheduleSnapshot({ scheduleType: 'hard_deadline', nextDate: '2026-09-16' }), {
      plannedDate: null, windowStart: null, windowEnd: null, hardDueAt: '2026-09-16',
    });
  });
});
