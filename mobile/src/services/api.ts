import { Platform } from 'react-native';
import { z } from 'zod';
import * as SecureStore from 'expo-secure-store';

import type {
  DashboardSummary,
  GenericRecord,
  Goal,
  Habit,
  HealthLog,
  RoutineGroup,
} from '@/types/api';

const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? `http://${fallbackHost}:5000/api`
).replace(/\/$/, '');

const errorSchema = z.object({ error: z.string().optional(), message: z.string().optional() });

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };
type ThemePreference = 'system' | 'light' | 'dark';
type AppearancePreference = {
  userId: string;
  theme: ThemePreference;
  primaryColor: string;
  secondaryColor: string;
};
let csrfToken: string | null = null;
const SESSION_COOKIE_KEY = 'lifeos-server-session-cookie';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthSession {
  authenticated: boolean;
  registrationOpen: boolean;
  user?: AuthUser;
  csrfToken?: string;
}

export function setApiCsrfToken(value: string | null) {
  csrfToken = value;
}

export interface MobileMaintenanceItem {
  id: string;
  name: string;
  durationMinutes: number;
  needState: 'can_wait' | 'approaching' | 'due' | 'needs_attention' | 'overdue' | 'backlog' | 'paused';
  needReason: string;
  area?: { name: string };
}

export interface MobileMaintenanceSummary {
  counts: { needsAttention: number; hardDeadlines: number; openRepairs: number; waiting: number; backlog: number; assets: number };
  attention: MobileMaintenanceItem[];
  upcoming: MobileMaintenanceItem[];
  areas: { id: string; name: string; icon: string; itemCount: number }[];
  repairs: { id: string; title: string; state: string; nextAction?: string }[];
  plan: { capacityMinutes: number; selectedItems: { itemId: string; priority: string }[] };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const nativeCookie = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(SESSION_COOKIE_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
      ...(!['GET', 'HEAD', 'OPTIONS'].includes(method) && csrfToken
        ? { 'X-CSRF-Token': csrfToken }
        : {}),
      ...(nativeCookie ? { Cookie: nativeCookie } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (Platform.OS !== 'web') {
    const setCookie = response.headers.get('set-cookie');
    const sessionCookie = setCookie?.split(';', 1)[0];
    if (sessionCookie && /=.+/.test(sessionCookie)) {
      await SecureStore.setItemAsync(SESSION_COOKIE_KEY, sessionCookie, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    }
    if (response.status === 401 || path === '/auth/logout') {
      await SecureStore.deleteItemAsync(SESSION_COOKIE_KEY);
    }
  }

  if (!response.ok) {
    const rawError: unknown = await response.json().catch(() => undefined);
    const parsedError = errorSchema.safeParse(rawError);
    const message = parsedError.success
      ? (parsedError.data.error ?? parsedError.data.message ?? 'Request failed')
      : 'Could not reach LifeOS';
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const dateQuery = (date: string) => `?date=${encodeURIComponent(date)}`;

export const api = {
  authSession: (signal?: AbortSignal) => request<AuthSession>('/auth/session', { signal }),
  login: (email: string, password: string) =>
    request<AuthSession>('/auth/login', { method: 'POST', body: { email, password } }),
  register: (displayName: string, email: string, password: string) =>
    request<AuthSession>('/auth/register', { method: 'POST', body: { displayName, email, password } }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  themePreference: (signal?: AbortSignal) =>
    request<{ userId: string; theme: ThemePreference | null }>(
      '/preferences/me/theme',
      { signal },
    ),
  saveThemePreference: (theme: ThemePreference) =>
    request<{ userId: string; theme: ThemePreference }>(
      '/preferences/me/theme',
      { method: 'PUT', body: { theme } },
    ),
  appearancePreference: (signal?: AbortSignal) =>
    request<AppearancePreference>(
      '/preferences/me/appearance',
      { signal },
    ),
  saveAppearancePreference: (preference: Partial<Omit<AppearancePreference, 'userId'>>) =>
    request<AppearancePreference>(
      '/preferences/me/appearance',
      { method: 'PUT', body: preference },
    ),
  dashboard: (signal?: AbortSignal) =>
    request<DashboardSummary>('/dashboard', { signal }),
  habits: (date: string, signal?: AbortSignal) =>
    request<Habit[]>(`/habits${dateQuery(date)}`, { signal }),
  toggleHabit: (id: string, date: string) =>
    request<{ ok: boolean }>(`/habits/${id}/toggle`, {
      method: 'POST',
      body: { date },
    }),
  createHabit: (input: Pick<Habit, 'name' | 'icon' | 'category'>) =>
    request<Habit>('/habits', { method: 'POST', body: input }),
  goals: (signal?: AbortSignal) => request<Goal[]>('/goals', { signal }),
  updateMilestone: (id: string, done: boolean) =>
    request(`/goals/milestone/${id}`, { method: 'PATCH', body: { done } }),
  routines: (signal?: AbortSignal) => request<RoutineGroup[]>('/routines', { signal }),
  health: (date: string, signal?: AbortSignal) =>
    request<HealthLog | null>(`/health${dateQuery(date)}`, { signal }),
  weeklyHealth: (signal?: AbortSignal) => request<HealthLog[]>('/health/weekly', { signal }),
  saveHealth: (input: HealthLog) =>
    request<HealthLog>('/health', { method: 'POST', body: input }),
  module: (endpoint: string, signal?: AbortSignal) =>
    request<GenericRecord[]>(endpoint, { signal }),
  maintenanceSummary: (signal?: AbortSignal) =>
    request<MobileMaintenanceSummary>('/maintenance/summary', { signal }),
  completeMaintenanceItem: (id: string) =>
    request<{ item: MobileMaintenanceItem }>(`/maintenance/items/${id}/complete`, { method: 'POST', body: {} }),
  healthCheck: (signal?: AbortSignal) =>
    request<{ ok: boolean }>('/health-check', { signal }),
};
