import assert from 'node:assert/strict';
import test from 'node:test';
import { decideProgression, estimateOneRepMax, type ProgressionSet } from '../../services/training/progression.js';

const prescription = { repMin: 6, repMax: 10, targetRir: 2, targetSets: 3, restSeconds: 180, increment: 2.5 };
const set = (sessionId: string, date: string, reps: number, overrides: Partial<ProgressionSet> = {}): ProgressionSet => ({
  sessionId, date, reps, load: 80, rir: 2, setType: 'working', techniqueQuality: 'good', painScore: 0, restSeconds: 180, ...overrides,
});

test('requires repeated top-range exposures before adding load', () => {
  const sets = [
    set('second', '2026-08-14', 10), set('second', '2026-08-14', 10), set('second', '2026-08-14', 10),
    set('first', '2026-08-10', 10), set('first', '2026-08-10', 10), set('first', '2026-08-10', 10),
  ];
  const result = decideProgression(sets, prescription);
  assert.equal(result.action, 'increase_load');
  assert.equal(result.recommendedLoad, 82.5);
});

test('pain prevents progression even when repetitions are high', () => {
  const sets = [set('latest', '2026-08-14', 10, { painScore: 3 })];
  assert.equal(decideProgression(sets, prescription).action, 'hold_for_safety');
});

test('short rest and large rep loss recommends more rest before load reduction', () => {
  const sets = [set('latest', '2026-08-14', 10, { restSeconds: 100 }), set('latest', '2026-08-14', 8, { restSeconds: 100 }), set('latest', '2026-08-14', 6, { restSeconds: 100 })];
  assert.equal(decideProgression(sets, prescription).action, 'extend_rest');
});

test('estimated one-rep max is deterministic and bounded for high reps', () => {
  assert.equal(estimateOneRepMax(100, 6), 120);
  assert.equal(estimateOneRepMax(100, 30), 140);
});
