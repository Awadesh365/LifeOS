import { models } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = typeof THEME_PREFERENCES[number];

export function normalizeUserId(value: unknown) {
  const userId = String(value ?? '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(userId)) {
    throw createHttpError(400, 'Invalid user id');
  }
  return userId;
}

export function normalizeTheme(value: unknown): ThemePreference {
  if (typeof value !== 'string' || !THEME_PREFERENCES.includes(value as ThemePreference)) {
    throw createHttpError(400, 'Theme must be system, light, or dark');
  }
  return value as ThemePreference;
}

export async function getThemePreference(userIdInput: unknown) {
  const userId = normalizeUserId(userIdInput);
  const row = await models.UserPreference.findByPk(userId, { raw: true }) as Record<string, unknown> | null;
  return { userId, theme: row ? normalizeTheme(row.theme) : null };
}

export async function setThemePreference(userIdInput: unknown, themeInput: unknown) {
  const userId = normalizeUserId(userIdInput);
  const theme = normalizeTheme(themeInput);
  const updatedAt = new Date();
  await models.UserPreference.upsert({ userId, theme, updatedAt });
  return { userId, theme, updatedAt };
}
