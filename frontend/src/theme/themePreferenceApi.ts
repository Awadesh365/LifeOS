import type { ThemePreference } from "./ThemeModeProvider";

const API_BASE = import.meta.env.VITE_PERSONAL_API_URL || "http://localhost:5000/api";
const USER_ID = import.meta.env.VITE_LIFEOS_USER_ID || "awadesh";
const endpoint = `${API_BASE}/preferences/${encodeURIComponent(USER_ID)}/theme`;

interface ThemePreferenceResponse {
  userId: string;
  theme: ThemePreference | null;
}

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

export async function loadThemePreference(): Promise<ThemePreference | null> {
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Could not load theme preference");
  const body = await response.json() as ThemePreferenceResponse;
  return isThemePreference(body.theme) ? body.theme : null;
}

export async function saveThemePreference(theme: ThemePreference) {
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  });
  if (!response.ok) throw new Error("Could not save theme preference");
}
