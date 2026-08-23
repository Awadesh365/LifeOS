import { describe, expect, it } from 'vitest';

import { friendlyDate, localIsoDate } from './date';

describe('date helpers', () => {
  it('formats local dates without shifting them through UTC', () => {
    expect(localIsoDate(new Date(2026, 7, 24, 0, 5))).toBe('2026-08-24');
  });

  it('produces a human-readable dashboard date', () => {
    expect(friendlyDate(new Date(2026, 7, 24)).toLowerCase()).toContain('august');
  });
});
