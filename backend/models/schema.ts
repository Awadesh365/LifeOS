import type { Model, ModelStatic, Sequelize } from 'sequelize';
import { DataTypes } from 'sequelize';

export type LifeTrackerModel = ModelStatic<Model<any, any>>;

export type LifeTrackerModels = {
  User: LifeTrackerModel;
  UserPreference: LifeTrackerModel;
  Habit: LifeTrackerModel;
  HabitLog: LifeTrackerModel;
  Routine: LifeTrackerModel;
  LearningSection: LifeTrackerModel;
  LearningItem: LifeTrackerModel;
  Goal: LifeTrackerModel;
  Milestone: LifeTrackerModel;
  Dream: LifeTrackerModel;
  Job: LifeTrackerModel;
  HealthLog: LifeTrackerModel;
  WealthEntry: LifeTrackerModel;
  Investment: LifeTrackerModel;
  Debt: LifeTrackerModel;
  DebtPayment: LifeTrackerModel;
  EmergencyFund: LifeTrackerModel;
  Contact: LifeTrackerModel;
  Project: LifeTrackerModel;
  Relationship: LifeTrackerModel;
  Relative: LifeTrackerModel;
  FuturePlan: LifeTrackerModel;
  DietLog: LifeTrackerModel;
  Supplement: LifeTrackerModel;
  NutritionRecord: LifeTrackerModel;
  CareerEntry: LifeTrackerModel;
  TrainingProfile: LifeTrackerModel;
  Exercise: LifeTrackerModel;
  ExerciseAlternative: LifeTrackerModel;
  TrainingProgram: LifeTrackerModel;
  ProgramWorkout: LifeTrackerModel;
  ProgramExercise: LifeTrackerModel;
  WorkoutSession: LifeTrackerModel;
  PerformedSet: LifeTrackerModel;
  MaintenanceArea: LifeTrackerModel;
  MaintenanceItem: LifeTrackerModel;
  MaintenanceOccurrence: LifeTrackerModel;
  MaintenanceAsset: LifeTrackerModel;
  RepairCase: LifeTrackerModel;
  WeeklyMaintenancePlan: LifeTrackerModel;
  FinancialAccount: LifeTrackerModel;
  MoneyTransaction: LifeTrackerModel;
  LedgerPosting: LifeTrackerModel;
};

const baseOptions = {
  timestamps: false,
  underscored: true,
};

export const defineLifeTrackerModels = (sequelize: Sequelize): LifeTrackerModels => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    passwordHash: { type: DataTypes.TEXT, allowNull: false, field: 'password_hash' },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
    isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_verified' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'users' });

  const UserPreference = sequelize.define('UserPreference', {
    userId: { type: DataTypes.STRING, primaryKey: true, field: 'user_id' },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'system',
      validate: { isIn: [['system', 'light', 'dark']] },
    },
    primaryColor: { type: DataTypes.STRING(7), allowNull: false, defaultValue: '#E55555', field: 'primary_color' },
    secondaryColor: { type: DataTypes.STRING(7), allowNull: false, defaultValue: '#1E2530', field: 'secondary_color' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'user_preferences' });

  const Habit = sequelize.define('Habit', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
  }, { ...baseOptions, tableName: 'habits' });

  const HabitLog = sequelize.define('HabitLog', {
    id: { type: DataTypes.STRING, primaryKey: true },
    habitId: { type: DataTypes.STRING, field: 'habit_id' },
    date: { type: DataTypes.STRING, allowNull: false },
    done: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { ...baseOptions, tableName: 'habit_logs' });

  const Routine = sequelize.define('Routine', {
    id: { type: DataTypes.STRING, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false },
    task: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING },
    note: { type: DataTypes.TEXT },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'order_index' },
  }, { ...baseOptions, tableName: 'routines' });

  const LearningSection = sequelize.define('LearningSection', {
    id: { type: DataTypes.STRING, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'order_index' },
  }, { ...baseOptions, tableName: 'learning_sections' });

  const LearningItem = sequelize.define('LearningItem', {
    id: { type: DataTypes.STRING, primaryKey: true },
    sectionId: { type: DataTypes.STRING, field: 'section_id' },
    topic: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING },
    info: { type: DataTypes.TEXT },
    source: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'not_started' },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'order_index' },
  }, { ...baseOptions, tableName: 'learning_items' });

  const Goal = sequelize.define('Goal', {
    id: { type: DataTypes.STRING, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    target: { type: DataTypes.FLOAT, allowNull: false },
    current: { type: DataTypes.FLOAT, defaultValue: 0 },
    unit: { type: DataTypes.STRING },
  }, { ...baseOptions, tableName: 'goals' });

  const Milestone = sequelize.define('Milestone', {
    id: { type: DataTypes.STRING, primaryKey: true },
    goalId: { type: DataTypes.STRING, field: 'goal_id' },
    label: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    done: { type: DataTypes.BOOLEAN, defaultValue: false },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'order_index' },
  }, { ...baseOptions, tableName: 'milestones' });

  const Dream = sequelize.define('Dream', {
    id: { type: DataTypes.STRING, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.STRING, allowNull: false },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'order_index' },
  }, { ...baseOptions, tableName: 'dreams' });

  const Job = sequelize.define('Job', {
    id: { type: DataTypes.STRING, primaryKey: true },
    company: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING },
    salary: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'applied' },
    link: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'jobs' });

  const HealthLog = sequelize.define('HealthLog', {
    id: { type: DataTypes.STRING, primaryKey: true },
    date: { type: DataTypes.STRING, allowNull: false },
    gymMinutes: { type: DataTypes.INTEGER, defaultValue: 0, field: 'gym_minutes' },
    walkMinutes: { type: DataTypes.INTEGER, defaultValue: 0, field: 'walk_minutes' },
    meditationMinutes: { type: DataTypes.INTEGER, defaultValue: 0, field: 'meditation_minutes' },
    sleepHours: { type: DataTypes.FLOAT, defaultValue: 0, field: 'sleep_hours' },
    sleepQuality: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sleep_quality' },
    waterLiters: { type: DataTypes.FLOAT, defaultValue: 0, field: 'water_liters' },
    dietScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'diet_score' },
    socializationMinutes: { type: DataTypes.INTEGER, defaultValue: 0, field: 'socialization_minutes' },
    mentalPeaceScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'mental_peace_score' },
    moodScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'mood_score' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'health_logs' });

  const WealthEntry = sequelize.define('WealthEntry', {
    id: { type: DataTypes.STRING, primaryKey: true },
    date: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    account: { type: DataTypes.STRING },
    recurring: { type: DataTypes.BOOLEAN, defaultValue: false },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'wealth_entries' });

  const Investment = sequelize.define('Investment', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    monthlyAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'monthly_amount' },
    investedAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'invested_amount' },
    currentValue: { type: DataTypes.FLOAT, defaultValue: 0, field: 'current_value' },
    startDate: { type: DataTypes.STRING, field: 'start_date' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'investments' });

  const Debt = sequelize.define('Debt', {
    id: { type: DataTypes.STRING, primaryKey: true },
    personName: { type: DataTypes.STRING, allowNull: false, field: 'person_name' },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false, field: 'total_amount' },
    paidAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'paid_amount' },
    remainingAmount: { type: DataTypes.FLOAT, allowNull: false, field: 'remaining_amount' },
    targetMonth: { type: DataTypes.STRING, field: 'target_month' },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'debts' });

  const DebtPayment = sequelize.define('DebtPayment', {
    id: { type: DataTypes.STRING, primaryKey: true },
    debtId: { type: DataTypes.STRING, field: 'debt_id' },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentDate: { type: DataTypes.STRING, allowNull: false, field: 'payment_date' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'debt_payments' });

  const EmergencyFund = sequelize.define('EmergencyFund', {
    id: { type: DataTypes.STRING, primaryKey: true },
    bankName: { type: DataTypes.STRING, allowNull: false, field: 'bank_name' },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    targetAmount: { type: DataTypes.FLOAT, defaultValue: 100000, field: 'target_amount' },
    type: { type: DataTypes.STRING, defaultValue: 'fd' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'emergency_funds' });

  const Contact = sequelize.define('Contact', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.STRING, defaultValue: 'medium' },
    lastContactDate: { type: DataTypes.STRING, field: 'last_contact_date' },
    nextFollowUpDate: { type: DataTypes.STRING, field: 'next_follow_up_date' },
    circleQualityScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'circle_quality_score' },
    discardFlag: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'discard_flag' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'contacts' });

  const Project = sequelize.define('Project', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'planned' },
    nextAction: { type: DataTypes.TEXT, field: 'next_action' },
    startDate: { type: DataTypes.STRING, field: 'start_date' },
    targetDate: { type: DataTypes.STRING, field: 'target_date' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'projects' });

  const Relationship = sequelize.define('Relationship', {
    id: { type: DataTypes.STRING, primaryKey: true },
    status: { type: DataTypes.STRING, defaultValue: 'single' },
    partnerName: { type: DataTypes.STRING, field: 'partner_name' },
    sinceDate: { type: DataTypes.STRING, field: 'since_date' },
    familyRelationshipScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'family_relationship_score' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'relationships' });

  const Relative = sequelize.define('Relative', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    relation: { type: DataTypes.STRING, allowNull: false },
    closenessScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'closeness_score' },
    lastContactDate: { type: DataTypes.STRING, field: 'last_contact_date' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'relatives' });

  const FuturePlan = sequelize.define('FuturePlan', {
    id: { type: DataTypes.STRING, primaryKey: true },
    planType: { type: DataTypes.STRING, allowNull: false, field: 'plan_type' },
    title: { type: DataTypes.STRING, allowNull: false },
    targetDate: { type: DataTypes.STRING, field: 'target_date' },
    status: { type: DataTypes.STRING, defaultValue: 'planned' },
    budget: { type: DataTypes.FLOAT },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'future_plans' });

  const DietLog = sequelize.define('DietLog', {
    id: { type: DataTypes.STRING, primaryKey: true },
    date: { type: DataTypes.STRING, allowNull: false },
    mealType: { type: DataTypes.STRING, allowNull: false, field: 'meal_type' },
    items: { type: DataTypes.TEXT, allowNull: false },
    protein: { type: DataTypes.FLOAT },
    calories: { type: DataTypes.FLOAT },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'diet_logs' });

  const Supplement = sequelize.define('Supplement', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.FLOAT, defaultValue: 0 },
    unit: { type: DataTypes.STRING, defaultValue: 'g' },
    dailyUsage: { type: DataTypes.FLOAT, defaultValue: 0, field: 'daily_usage' },
    remainingDays: { type: DataTypes.FLOAT, defaultValue: 0, field: 'remaining_days' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'supplements' });

  const NutritionRecord = sequelize.define('NutritionRecord', {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.JSONB, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'nutrition_records' });

  const CareerEntry = sequelize.define('CareerEntry', {
    id: { type: DataTypes.STRING, primaryKey: true },
    companyName: { type: DataTypes.STRING, allowNull: false, field: 'company_name' },
    roleTitle: { type: DataTypes.STRING, allowNull: false, field: 'role_title' },
    startDate: { type: DataTypes.STRING, field: 'start_date' },
    payAmount: { type: DataTypes.FLOAT, defaultValue: 0, field: 'pay_amount' },
    companyHealthScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'company_health_score' },
    managerBehaviorScore: { type: DataTypes.INTEGER, defaultValue: 0, field: 'manager_behavior_score' },
    workEnvironmentNotes: { type: DataTypes.TEXT, field: 'work_environment_notes' },
    stayLeavePlan: { type: DataTypes.STRING, defaultValue: 'unsure', field: 'stay_leave_plan' },
    targetExitDate: { type: DataTypes.STRING, field: 'target_exit_date' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'career_entries' });

  const TrainingProfile = sequelize.define('TrainingProfile', {
    id: { type: DataTypes.STRING, primaryKey: true },
    goal: { type: DataTypes.STRING, allowNull: false, defaultValue: 'general_fitness' },
    experience: { type: DataTypes.STRING, allowNull: false, defaultValue: 'beginner' },
    daysPerWeek: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3, field: 'days_per_week' },
    minutesPerSession: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60, field: 'minutes_per_session' },
    loadUnit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'kg', field: 'load_unit' },
    smallestIncrement: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 2.5, field: 'smallest_increment' },
    availableEquipment: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'available_equipment' },
    limitations: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    excludedExerciseIds: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'excluded_exercise_ids' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'training_profiles' });

  const Exercise = sequelize.define('Exercise', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    aliases: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    classification: { type: DataTypes.STRING, allowNull: false },
    movementPattern: { type: DataTypes.STRING, allowNull: false, field: 'movement_pattern' },
    primaryMuscles: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'primary_muscles' },
    secondaryMuscles: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'secondary_muscles' },
    equipment: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    difficulty: { type: DataTypes.STRING, allowNull: false, defaultValue: 'beginner' },
    setupSteps: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'setup_steps' },
    executionSteps: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'execution_steps' },
    coachingCue: { type: DataTypes.TEXT, allowNull: false, field: 'coaching_cue' },
    commonFaults: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'common_faults' },
    safetyNotes: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'safety_notes' },
    evidenceSummary: { type: DataTypes.TEXT, allowNull: false, field: 'evidence_summary' },
    evidenceConfidence: { type: DataTypes.STRING, allowNull: false, defaultValue: 'moderate', field: 'evidence_confidence' },
    defaultRestSeconds: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 120, field: 'default_rest_seconds' },
    loadUnit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'kg', field: 'load_unit' },
    searchTerms: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'search_terms' },
  }, { ...baseOptions, tableName: 'exercises' });

  const ExerciseAlternative = sequelize.define('ExerciseAlternative', {
    id: { type: DataTypes.STRING, primaryKey: true },
    exerciseId: { type: DataTypes.STRING, allowNull: false, field: 'exercise_id' },
    alternativeExerciseId: { type: DataTypes.STRING, allowNull: false, field: 'alternative_exercise_id' },
    relationship: { type: DataTypes.STRING, allowNull: false, defaultValue: 'equivalent' },
    rationale: { type: DataTypes.TEXT, allowNull: false },
  }, { ...baseOptions, tableName: 'exercise_alternatives' });

  const TrainingProgram = sequelize.define('TrainingProgram', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    goal: { type: DataTypes.STRING, allowNull: false },
    experience: { type: DataTypes.STRING, allowNull: false },
    durationWeeks: { type: DataTypes.INTEGER, allowNull: false, field: 'duration_weeks' },
    daysPerWeek: { type: DataTypes.INTEGER, allowNull: false, field: 'days_per_week' },
    isTemplate: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_template' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_active' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, { ...baseOptions, tableName: 'training_programs' });

  const ProgramWorkout = sequelize.define('ProgramWorkout', {
    id: { type: DataTypes.STRING, primaryKey: true },
    programId: { type: DataTypes.STRING, allowNull: false, field: 'program_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    dayIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'day_index' },
    description: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'program_workouts' });

  const ProgramExercise = sequelize.define('ProgramExercise', {
    id: { type: DataTypes.STRING, primaryKey: true },
    programWorkoutId: { type: DataTypes.STRING, allowNull: false, field: 'program_workout_id' },
    exerciseId: { type: DataTypes.STRING, allowNull: false, field: 'exercise_id' },
    orderIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'order_index' },
    targetSets: { type: DataTypes.INTEGER, allowNull: false, field: 'target_sets' },
    repMin: { type: DataTypes.INTEGER, allowNull: false, field: 'rep_min' },
    repMax: { type: DataTypes.INTEGER, allowNull: false, field: 'rep_max' },
    targetRir: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2, field: 'target_rir' },
    restSeconds: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 120, field: 'rest_seconds' },
    setType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'working', field: 'set_type' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'program_exercises' });

  const WorkoutSession = sequelize.define('WorkoutSession', {
    id: { type: DataTypes.STRING, primaryKey: true },
    programWorkoutId: { type: DataTypes.STRING, field: 'program_workout_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'in_progress' },
    startedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'started_at' },
    completedAt: { type: DataTypes.DATE, field: 'completed_at' },
    sessionRpe: { type: DataTypes.FLOAT, field: 'session_rpe' },
    notes: { type: DataTypes.TEXT },
  }, { ...baseOptions, tableName: 'workout_sessions' });

  const PerformedSet = sequelize.define('PerformedSet', {
    id: { type: DataTypes.STRING, primaryKey: true },
    workoutSessionId: { type: DataTypes.STRING, allowNull: false, field: 'workout_session_id' },
    programExerciseId: { type: DataTypes.STRING, field: 'program_exercise_id' },
    exerciseId: { type: DataTypes.STRING, allowNull: false, field: 'exercise_id' },
    setNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'set_number' },
    setType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'working', field: 'set_type' },
    targetRepsMin: { type: DataTypes.INTEGER, field: 'target_reps_min' },
    targetRepsMax: { type: DataTypes.INTEGER, field: 'target_reps_max' },
    actualReps: { type: DataTypes.INTEGER, allowNull: false, field: 'actual_reps' },
    targetLoad: { type: DataTypes.FLOAT, field: 'target_load' },
    actualLoad: { type: DataTypes.FLOAT, allowNull: false, field: 'actual_load' },
    targetRir: { type: DataTypes.INTEGER, field: 'target_rir' },
    actualRir: { type: DataTypes.INTEGER, field: 'actual_rir' },
    restSeconds: { type: DataTypes.INTEGER, field: 'rest_seconds' },
    techniqueQuality: { type: DataTypes.STRING, allowNull: false, defaultValue: 'good', field: 'technique_quality' },
    painScore: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'pain_score' },
    painLocation: { type: DataTypes.STRING, field: 'pain_location' },
    painNotes: { type: DataTypes.TEXT, field: 'pain_notes' },
    source: { type: DataTypes.STRING, allowNull: false, defaultValue: 'manual' },
    completedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'completed_at' },
  }, { ...baseOptions, tableName: 'performed_sets' });

  const MaintenanceArea = sequelize.define('MaintenanceArea', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    parentAreaId: { type: DataTypes.STRING, field: 'parent_area_id' },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.STRING(40), allowNull: false },
    icon: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'home_repair_service' },
    standard: { type: DataTypes.TEXT },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_default' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, { ...baseOptions, tableName: 'maintenance_areas' });

  const MaintenanceAsset = sequelize.define('MaintenanceAsset', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    areaId: { type: DataTypes.STRING, field: 'area_id' },
    name: { type: DataTypes.STRING(140), allowNull: false },
    category: { type: DataTypes.STRING(60), allowNull: false, defaultValue: 'other' },
    brand: { type: DataTypes.STRING(100) },
    model: { type: DataTypes.STRING(100) },
    serialNumber: { type: DataTypes.STRING(160), field: 'serial_number' },
    purchaseDate: { type: DataTypes.STRING(10), field: 'purchase_date' },
    purchaseCost: { type: DataTypes.DECIMAL(12, 2), field: 'purchase_cost' },
    warrantyEndsAt: { type: DataTypes.STRING(10), field: 'warranty_ends_at' },
    location: { type: DataTypes.STRING(140) },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'active' },
    notes: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, { ...baseOptions, tableName: 'maintenance_assets' });

  const MaintenanceItem = sequelize.define('MaintenanceItem', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    areaId: { type: DataTypes.STRING, allowNull: false, field: 'area_id' },
    assetId: { type: DataTypes.STRING, field: 'asset_id' },
    name: { type: DataTypes.STRING(160), allowNull: false },
    scheduleType: { type: DataTypes.STRING(40), allowNull: false, field: 'schedule_type' },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'active' },
    intervalDays: { type: DataTypes.INTEGER, field: 'interval_days' },
    windowStartDays: { type: DataTypes.INTEGER, field: 'window_start_days' },
    windowEndDays: { type: DataTypes.INTEGER, field: 'window_end_days' },
    nextDate: { type: DataTypes.STRING(10), field: 'next_date' },
    lastCompletedAt: { type: DataTypes.DATE, field: 'last_completed_at' },
    conditionState: { type: DataTypes.STRING(30), field: 'condition_state' },
    effort: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'light' },
    durationMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30, field: 'duration_minutes' },
    priority: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'should' },
    notes: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'maintenance_items' });

  const MaintenanceOccurrence = sequelize.define('MaintenanceOccurrence', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    itemId: { type: DataTypes.STRING, allowNull: false, field: 'item_id' },
    action: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'completed' },
    plannedDate: { type: DataTypes.STRING(10), field: 'planned_date' },
    completedAt: { type: DataTypes.DATE, field: 'completed_at' },
    deferredUntil: { type: DataTypes.STRING(10), field: 'deferred_until' },
    durationMinutes: { type: DataTypes.INTEGER, field: 'duration_minutes' },
    cost: { type: DataTypes.DECIMAL(12, 2) },
    notes: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, { ...baseOptions, tableName: 'maintenance_occurrences' });

  const RepairCase = sequelize.define('RepairCase', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    assetId: { type: DataTypes.STRING, field: 'asset_id' },
    areaId: { type: DataTypes.STRING, field: 'area_id' },
    title: { type: DataTypes.STRING(160), allowNull: false },
    issue: { type: DataTypes.TEXT, allowNull: false },
    state: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'reported' },
    nextAction: { type: DataTypes.TEXT, field: 'next_action' },
    waitingOn: { type: DataTypes.STRING(140), field: 'waiting_on' },
    followUpDate: { type: DataTypes.STRING(10), field: 'follow_up_date' },
    openedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'opened_at' },
    closedAt: { type: DataTypes.DATE, field: 'closed_at' },
    outcome: { type: DataTypes.TEXT },
    cost: { type: DataTypes.DECIMAL(12, 2) },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'repair_cases' });

  const WeeklyMaintenancePlan = sequelize.define('WeeklyMaintenancePlan', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    weekStart: { type: DataTypes.STRING(10), allowNull: false, field: 'week_start' },
    capacityMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 240, field: 'capacity_minutes' },
    selectedItems: { type: DataTypes.JSONB, allowNull: false, defaultValue: [], field: 'selected_items' },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'draft' },
    notes: { type: DataTypes.TEXT },
    committedAt: { type: DataTypes.DATE, field: 'committed_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'weekly_maintenance_plans' });

  const FinancialAccount = sequelize.define('FinancialAccount', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    name: { type: DataTypes.STRING(140), allowNull: false },
    type: { type: DataTypes.STRING(32), allowNull: false },
    institution: { type: DataTypes.STRING(140) },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'INR' },
    includeInNetWorth: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'include_in_net_worth' },
    status: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'active' },
    valuationAsOf: { type: DataTypes.STRING(10), field: 'valuation_as_of' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'financial_accounts' });

  const MoneyTransaction = sequelize.define('MoneyTransaction', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    semanticType: { type: DataTypes.STRING(40), allowNull: false, field: 'semantic_type' },
    occurredOn: { type: DataTypes.STRING(10), allowNull: false, field: 'occurred_on' },
    amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'INR' },
    description: { type: DataTypes.STRING(180), allowNull: false },
    merchant: { type: DataTypes.STRING(180) },
    category: { type: DataTypes.STRING(100) },
    notes: { type: DataTypes.TEXT },
    source: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'manual' },
    rawNarration: { type: DataTypes.TEXT, field: 'raw_narration' },
    reconciliationStatus: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'unreconciled', field: 'reconciliation_status' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
  }, { ...baseOptions, tableName: 'money_transactions' });

  const LedgerPosting = sequelize.define('LedgerPosting', {
    id: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    transactionId: { type: DataTypes.STRING, allowNull: false, field: 'transaction_id' },
    accountId: { type: DataTypes.STRING, allowNull: false, field: 'account_id' },
    amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    role: { type: DataTypes.STRING(40), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
  }, { ...baseOptions, tableName: 'ledger_postings' });

  Habit.hasMany(HabitLog, { foreignKey: 'habitId' });
  HabitLog.belongsTo(Habit, { foreignKey: 'habitId' });
  LearningSection.hasMany(LearningItem, { foreignKey: 'sectionId' });
  LearningItem.belongsTo(LearningSection, { foreignKey: 'sectionId' });
  Goal.hasMany(Milestone, { foreignKey: 'goalId' });
  Milestone.belongsTo(Goal, { foreignKey: 'goalId' });
  Debt.hasMany(DebtPayment, { foreignKey: 'debtId' });
  DebtPayment.belongsTo(Debt, { foreignKey: 'debtId' });
  Exercise.hasMany(ExerciseAlternative, { foreignKey: 'exerciseId', as: 'alternatives' });
  ExerciseAlternative.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });
  ExerciseAlternative.belongsTo(Exercise, { foreignKey: 'alternativeExerciseId', as: 'alternative' });
  TrainingProgram.hasMany(ProgramWorkout, { foreignKey: 'programId', as: 'workouts' });
  ProgramWorkout.belongsTo(TrainingProgram, { foreignKey: 'programId', as: 'program' });
  ProgramWorkout.hasMany(ProgramExercise, { foreignKey: 'programWorkoutId', as: 'exercises' });
  ProgramExercise.belongsTo(ProgramWorkout, { foreignKey: 'programWorkoutId', as: 'workout' });
  ProgramExercise.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });
  WorkoutSession.belongsTo(ProgramWorkout, { foreignKey: 'programWorkoutId', as: 'programWorkout' });
  WorkoutSession.hasMany(PerformedSet, { foreignKey: 'workoutSessionId', as: 'sets' });
  PerformedSet.belongsTo(WorkoutSession, { foreignKey: 'workoutSessionId', as: 'session' });
  PerformedSet.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });
  MaintenanceArea.hasMany(MaintenanceItem, { foreignKey: 'areaId', as: 'items' });
  MaintenanceItem.belongsTo(MaintenanceArea, { foreignKey: 'areaId', as: 'area' });
  MaintenanceAsset.hasMany(MaintenanceItem, { foreignKey: 'assetId', as: 'maintenanceItems' });
  MaintenanceItem.belongsTo(MaintenanceAsset, { foreignKey: 'assetId', as: 'asset' });
  MaintenanceItem.hasMany(MaintenanceOccurrence, { foreignKey: 'itemId', as: 'occurrences' });
  MaintenanceOccurrence.belongsTo(MaintenanceItem, { foreignKey: 'itemId', as: 'item' });
  MaintenanceAsset.hasMany(RepairCase, { foreignKey: 'assetId', as: 'repairCases' });
  RepairCase.belongsTo(MaintenanceAsset, { foreignKey: 'assetId', as: 'asset' });
  FinancialAccount.hasMany(LedgerPosting, { foreignKey: 'accountId', as: 'postings' });
  LedgerPosting.belongsTo(FinancialAccount, { foreignKey: 'accountId', as: 'account' });
  MoneyTransaction.hasMany(LedgerPosting, { foreignKey: 'transactionId', as: 'postings' });
  LedgerPosting.belongsTo(MoneyTransaction, { foreignKey: 'transactionId', as: 'transaction' });

  return {
    User,
    UserPreference,
    Habit,
    HabitLog,
    Routine,
    LearningSection,
    LearningItem,
    Goal,
    Milestone,
    Dream,
    Job,
    HealthLog,
    WealthEntry,
    Investment,
    Debt,
    DebtPayment,
    EmergencyFund,
    Contact,
    Project,
    Relationship,
    Relative,
    FuturePlan,
    DietLog,
    Supplement,
    NutritionRecord,
    CareerEntry,
    TrainingProfile,
    Exercise,
    ExerciseAlternative,
    TrainingProgram,
    ProgramWorkout,
    ProgramExercise,
    WorkoutSession,
    PerformedSet,
    MaintenanceArea,
    MaintenanceItem,
    MaintenanceOccurrence,
    MaintenanceAsset,
    RepairCase,
    WeeklyMaintenancePlan,
    FinancialAccount,
    MoneyTransaction,
    LedgerPosting,
  };
};
