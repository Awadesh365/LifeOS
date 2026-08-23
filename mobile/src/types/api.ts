export interface DashboardSummary {
  habits: { total: number; completedToday: number };
  learning: { total: number; completed: number };
  goals: { total: number; milestones: number; completedMilestones: number };
  dreams: number;
  jobs: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  icon: string;
  target: number;
  current: number;
  unit: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  goalId: string;
  label: string;
  value: number;
  done: boolean;
  orderIndex: number;
}

export interface Routine {
  id: string;
  type: 'weekday' | 'weekend';
  time: string;
  task: string;
  icon: string;
  duration: string | null;
  note: string | null;
  orderIndex: number;
}

export interface RoutineGroup {
  type: 'weekday' | 'weekend';
  items: Routine[];
}

export interface HealthLog {
  id?: string;
  date: string;
  gymMinutes: number;
  walkMinutes: number;
  meditationMinutes: number;
  sleepHours: number;
  sleepQuality: number;
  waterLiters: number;
  dietScore: number;
  socializationMinutes: number;
  mentalPeaceScore: number;
  moodScore: number;
  notes: string;
}

export type GenericRecord = Record<string, unknown>;
