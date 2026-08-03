export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  done: boolean;
}

export interface HabitWithDone extends Habit {
  done: boolean;
}

export interface Routine {
  id: string;
  type: string;
  time: string;
  task: string;
  icon: string;
  duration: string | null;
  note: string | null;
  orderIndex: number;
}

export interface RoutineGroup {
  type: string;
  items: Routine[];
}

export interface LearningSection {
  id: string;
  title: string;
  orderIndex: number;
}

export interface LearningItem {
  id: string;
  sectionId: string;
  topic: string;
  date: string;
  info: string;
  source: string;
  status: string;
  orderIndex: number;
}

export interface LearningTree extends LearningSection {
  items: LearningItem[];
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  icon: string;
  target: number;
  current: number;
  unit: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  label: string;
  value: number;
  done: boolean;
  orderIndex: number;
}

export interface GoalWithMilestones extends Goal {
  milestones: Milestone[];
}

export interface Dream {
  id: string;
  text: string;
  icon: string;
  priority: string;
  orderIndex: number;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  date: string;
  salary: string;
  status: string;
  link: string;
  notes: string;
}

export interface DashboardSummary {
  habits: {
    total: number;
    completedToday: number;
  };
  learning: {
    total: number;
    completed: number;
  };
  goals: {
    total: number;
    milestones: number;
    completedMilestones: number;
  };
  dreams: number;
  jobs: number;
}

export interface HealthLog {
  id: string;
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

export interface WealthEntry {
  id: string;
  date: string;
  type: string;
  amount: number;
  category: string;
  account: string;
  recurring: boolean;
  notes: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  monthlyAmount: number;
  investedAmount: number;
  currentValue: number;
  startDate: string;
  notes: string;
}

export interface WealthSummary {
  income: number;
  expenses: number;
  investments: number;
  savings: number;
}

export interface Debt {
  id: string;
  personName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  targetMonth: string;
  status: string;
  notes: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  paymentDate: string;
  notes: string;
}

export interface EmergencyFund {
  id: string;
  bankName: string;
  amount: number;
  targetAmount: number;
  type: string;
  notes: string;
}

export interface FundSummary {
  total: number;
  target: number;
  progress: number;
}

export interface Contact {
  id: string;
  name: string;
  type: string;
  priority: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  circleQualityScore: number;
  discardFlag: boolean;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  nextAction: string;
  startDate: string;
  targetDate: string;
  notes: string;
}

export interface Relationship {
  id: string;
  status: string;
  partnerName: string;
  sinceDate: string;
  familyRelationshipScore: number;
  notes: string;
}

export interface Relative {
  id: string;
  name: string;
  relation: string;
  closenessScore: number;
  lastContactDate: string;
  notes: string;
}

export interface FuturePlan {
  id: string;
  planType: string;
  title: string;
  targetDate: string;
  status: string;
  budget: number;
  notes: string;
}

export interface DietLog {
  id: string;
  date: string;
  mealType: string;
  items: string;
  protein: number;
  calories: number;
  notes: string;
}

export interface Supplement {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dailyUsage: number;
  remainingDays: number;
  notes: string;
}

export interface CareerEntry {
  id: string;
  companyName: string;
  roleTitle: string;
  startDate: string;
  payAmount: number;
  companyHealthScore: number;
  managerBehaviorScore: number;
  workEnvironmentNotes: string;
  stayLeavePlan: string;
  targetExitDate: string;
  notes: string;
}

export interface ArticleTree {
  id: string;
  title: string;
  url: string;
  category: string;
  summary: string;
  savedDate: string;
  orderIndex: number;
}

export interface Content {
  id: string;
  type: string;
  title: string;
  body: string;
  source: string;
  date: string;
}

export interface StrongStack {
  id: string;
  category: string;
  items: string[];
  lastUpdated: string;
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>;
