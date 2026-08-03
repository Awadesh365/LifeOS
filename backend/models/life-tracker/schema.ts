import type { Model, ModelStatic, Sequelize } from 'sequelize';
import { DataTypes } from 'sequelize';

export type LifeTrackerModel = ModelStatic<Model<any, any>>;

export type LifeTrackerModels = {
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
  CareerEntry: LifeTrackerModel;
};

const baseOptions = {
  timestamps: false,
  underscored: true,
};

export const defineLifeTrackerModels = (sequelize: Sequelize): LifeTrackerModels => {
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
    protein: { type: DataTypes.FLOAT, defaultValue: 0 },
    calories: { type: DataTypes.FLOAT, defaultValue: 0 },
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

  Habit.hasMany(HabitLog, { foreignKey: 'habitId' });
  HabitLog.belongsTo(Habit, { foreignKey: 'habitId' });
  LearningSection.hasMany(LearningItem, { foreignKey: 'sectionId' });
  LearningItem.belongsTo(LearningSection, { foreignKey: 'sectionId' });
  Goal.hasMany(Milestone, { foreignKey: 'goalId' });
  Milestone.belongsTo(Goal, { foreignKey: 'goalId' });
  Debt.hasMany(DebtPayment, { foreignKey: 'debtId' });
  DebtPayment.belongsTo(Debt, { foreignKey: 'debtId' });

  return {
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
    CareerEntry,
  };
};
