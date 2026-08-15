import type { Exercise, ProgressionDecision, TodayTraining, TrainingProfile, TrainingProgram, TrainingReview, WorkoutSession } from './types';

const BASE = `${import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:3001/api'}/training`;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Training request failed' }));
    throw new Error(payload.error || payload.message || 'Training request failed');
  }
  return response.json();
}

export const trainingApi = {
  getProfile: () => request<TrainingProfile | null>('/profile'),
  updateProfile: (profile: Partial<TrainingProfile>) => request<TrainingProfile>('/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getToday: (date: string) => request<TodayTraining>(`/today?date=${encodeURIComponent(date)}`),
  listExercises: (params: { search?: string; muscle?: string; equipment?: string } = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value) as Array<[string, string]>).toString();
    return request<Exercise[]>(`/exercises${query ? `?${query}` : ''}`);
  },
  getExercise: (id: string) => request<Exercise>(`/exercises/${id}`),
  getProgression: (exerciseId: string, programExerciseId: string) => request<ProgressionDecision>(`/exercises/${exerciseId}/progression?programExerciseId=${encodeURIComponent(programExerciseId)}`),
  listPrograms: () => request<TrainingProgram[]>('/programs'),
  activateProgram: (id: string) => request<TrainingProgram[]>(`/programs/${id}/activate`, { method: 'POST' }),
  startSession: (programWorkoutId: string, date: string) => request<WorkoutSession>('/sessions', { method: 'POST', body: JSON.stringify({ programWorkoutId, date }) }),
  logSet: (sessionId: string, payload: Record<string, unknown>) => request<{ set: WorkoutSession['sets'][number]; safety: null | { level: string; message: string } }>(`/sessions/${sessionId}/sets`, { method: 'POST', body: JSON.stringify(payload) }),
  completeSession: (sessionId: string, payload: { sessionRpe?: number; notes?: string }) => request<WorkoutSession>(`/sessions/${sessionId}/complete`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getReview: (from: string, to: string) => request<TrainingReview>(`/review?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
};
