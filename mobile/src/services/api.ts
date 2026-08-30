import { Platform } from 'react-native';
import { z } from 'zod';

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
const LIFEOS_USER_ID = process.env.EXPO_PUBLIC_LIFEOS_USER_ID ?? 'awadesh';

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

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
  themePreference: (signal?: AbortSignal) =>
    request<{ userId: string; theme: ThemePreference | null }>(
      `/preferences/${encodeURIComponent(LIFEOS_USER_ID)}/theme`,
      { signal },
    ),
  saveThemePreference: (theme: ThemePreference) =>
    request<{ userId: string; theme: ThemePreference }>(
      `/preferences/${encodeURIComponent(LIFEOS_USER_ID)}/theme`,
      { method: 'PUT', body: { theme } },
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
  healthCheck: (signal?: AbortSignal) =>
    request<{ ok: boolean }>('/health-check', { signal }),
};
