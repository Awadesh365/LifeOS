import type { BrandColors, ThemePreference } from './ThemeModeProvider';
import { secureFetch } from '../auth/authApi';

const API_BASE = import.meta.env.VITE_PERSONAL_API_URL || "http://localhost:5000/api";
const endpoint = `${API_BASE}/preferences/me/appearance`;

export interface AppearancePreferenceResponse extends BrandColors {
  userId: string;
  theme: ThemePreference;
}

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";
const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

export async function loadAppearancePreference(): Promise<AppearancePreferenceResponse> {
  const response = await secureFetch(endpoint, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error('Could not load appearance preference');
  const body = await response.json() as AppearancePreferenceResponse;
  if (!isThemePreference(body.theme) || !isHexColor(body.primaryColor) || !isHexColor(body.secondaryColor)) {
    throw new Error('Invalid appearance preference');
  }
  return body;
}

export async function saveAppearancePreference(preference: Partial<BrandColors> & { theme?: ThemePreference }) {
  const response = await secureFetch(endpoint, {
    method: "PUT",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(preference),
  });
  if (!response.ok) throw new Error('Could not save appearance preference');
}
