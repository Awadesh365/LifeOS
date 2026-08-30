import { describe, expect, it } from 'vitest';
import { getPersonalNavItem, PERSONAL_NAV_GROUPS } from './navigation';

describe('personal navigation', () => {
  it('keeps daily activities separate from health and nutrition', () => {
    const daily = PERSONAL_NAV_GROUPS.find((group) => group.section === 'Daily');
    const wellbeing = PERSONAL_NAV_GROUPS.find(
      (group) => group.section === 'Health & Nutrition',
    );

    expect(daily?.items.map((item) => item.path)).toEqual(['/habits', '/routine']);
    expect(wellbeing?.items.map((item) => item.path)).toEqual([
      '/health',
      '/diet',
      '/training',
    ]);
  });

  it('resolves top-level and nested workspace routes for mobile context', () => {
    expect(getPersonalNavItem('/app')?.label).toBe('Dashboard');
    expect(getPersonalNavItem('/app/diet/history')?.label).toBe('Diet & Nutrition');
    expect(getPersonalNavItem('/app/settings/appearance')?.section).toBe('Settings');
  });
});
