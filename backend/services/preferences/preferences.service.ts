import { models } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = typeof THEME_PREFERENCES[number];
export const DEFAULT_PRIMARY_COLOR = '#E55555';
export const DEFAULT_SECONDARY_COLOR = '#1E2530';

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

export function normalizeBrandColor(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) {
    throw createHttpError(400, `${fieldName} must be a 6-digit hex color`);
  }
  return value.toUpperCase();
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

export async function getAppearancePreference(userIdInput: unknown) {
  const userId = normalizeUserId(userIdInput);
  const row = await models.UserPreference.findByPk(userId, { raw: true }) as Record<string, unknown> | null;
  return {
    userId,
    theme: row ? normalizeTheme(row.theme) : 'system' as ThemePreference,
    primaryColor: row?.primaryColor
      ? normalizeBrandColor(row.primaryColor, 'primaryColor')
      : DEFAULT_PRIMARY_COLOR,
    secondaryColor: row?.secondaryColor
      ? normalizeBrandColor(row.secondaryColor, 'secondaryColor')
      : DEFAULT_SECONDARY_COLOR,
  };
}

export async function setAppearancePreference(userIdInput: unknown, input: unknown) {
  const userId = normalizeUserId(userIdInput);
  const body = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const current = await getAppearancePreference(userId);
  const theme = body.theme === undefined ? current.theme : normalizeTheme(body.theme);
  const primaryColor = body.primaryColor === undefined
    ? current.primaryColor
    : normalizeBrandColor(body.primaryColor, 'primaryColor');
  const secondaryColor = body.secondaryColor === undefined
    ? current.secondaryColor
    : normalizeBrandColor(body.secondaryColor, 'secondaryColor');
  const updatedAt = new Date();
  await models.UserPreference.upsert({ userId, theme, primaryColor, secondaryColor, updatedAt });
  return { userId, theme, primaryColor, secondaryColor, updatedAt };
}
