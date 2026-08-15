export type TrainingView = 'today' | 'program' | 'exercises' | 'progress';

export interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  classification: 'compound' | 'isolation';
  movementPattern: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: string;
  setupSteps: string[];
  executionSteps: string[];
  coachingCue: string;
  commonFaults: Array<{ fault: string; cue: string }>;
  safetyNotes: string[];
  evidenceSummary: string;
  evidenceConfidence: string;
  defaultRestSeconds: number;
  alternatives?: Array<{ id: string; relationship: string; rationale: string; alternative: Exercise }>;
}

export interface ProgramExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  targetSets: number;
  repMin: number;
  repMax: number;
  targetRir: number;
  restSeconds: number;
  setType: string;
  notes?: string;
  exercise: Exercise;
}

export interface ProgramWorkout {
  id: string;
  name: string;
  dayIndex: number;
  description?: string;
  exercises: ProgramExercise[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  goal: string;
  experience: string;
  durationWeeks: number;
  daysPerWeek: number;
  isTemplate: boolean;
  isActive: boolean;
  workouts: ProgramWorkout[];
}

export interface PerformedSet {
  id: string;
  workoutSessionId: string;
  programExerciseId: string;
  exerciseId: string;
  setNumber: number;
  setType: string;
  actualReps: number;
  actualLoad: number;
  actualRir: number | null;
  restSeconds: number | null;
  techniqueQuality: string;
  painScore: number;
  painLocation?: string;
  completedAt: string;
  exercise?: Exercise;
}

export interface WorkoutSession {
  id: string;
  programWorkoutId: string;
  name: string;
  date: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string;
  sets: PerformedSet[];
}

export interface TodayTraining {
  program: { id: string; name: string; goal: string } | null;
  workout: ProgramWorkout | null;
  activeSession: WorkoutSession | null;
  previousByExercise: Record<string, Array<PerformedSet & { session?: { date: string } }>>;
}

export interface TrainingProfile {
  id: string;
  goal: string;
  experience: string;
  daysPerWeek: number;
  minutesPerSession: number;
  loadUnit: 'kg' | 'lb';
  smallestIncrement: number;
  availableEquipment: string[];
  limitations: string[];
  excludedExerciseIds: string[];
}

export interface TrainingReview {
  from: string;
  to: string;
  sessionsPlanned: number;
  sessionsCompleted: number;
  workingSets: number;
  muscleSets: Record<string, number>;
  painFlags: number;
  bestPerformance: null | { exercise: string; estimatedOneRepMax: number; load: number; reps: number };
  sessions: WorkoutSession[];
}

export interface ProgressionDecision {
  action: string;
  recommendedLoad: number | null;
  confidence: string;
  reasonCodes: string[];
  explanation: string;
}
