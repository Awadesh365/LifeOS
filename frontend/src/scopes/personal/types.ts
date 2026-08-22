// Habits
export interface HabitWithDone {
  id: string;
  name: string;
  icon: string;
  category: string;
  done: boolean;
}

// Routines
export interface RoutineItem {
  id?: string;
  time: string;
  task: string;
  icon: string;
  duration: string;
  note: string;
}

export interface RoutineGroup {
  type: 'weekday' | 'weekend';
  items: RoutineItem[];
}

// Learning
export interface LearningItem {
  id: string;
  topic: string;
  date: string;
  info: string;
  source: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface LearningSection {
  id: string;
  title: string;
  items: LearningItem[];
}

export type LearningTree = LearningSection[];

// Goals
export interface Milestone {
  id: string;
  label: string;
  done: boolean;
}

export interface GoalWithMilestones {
  id: string;
  goalId?: string;
  title: string;
  icon: string;
  category: string;
  milestones: Milestone[];
}

// Dreams
export interface Dream {
  id: string;
  icon: string;
  text: string;
  priority: 'now' | 'mid' | 'long';
}

// Jobs
export interface Job {
  id: string;
  date: string;
  company: string;
  role: string;
  salary: string;
  status: 'applied' | 'interview' | 'offered' | 'rejected';
}

// Dashboard
export interface DashboardSummary {
  habitsCompleted: number;
  habitsTotal: number;
  streak: number;
  completedLearning: number;
  totalLearning: number;
  inProgressLearning: number;
  jobsApplied: number;
  interviews: number;
  overallGoalProgress: number;
  strongStack: {
    frontend: string[];
    backend: string[];
    cloud: string[];
  };
}

// Health
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

// Wealth
export interface WealthEntry {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'investment';
  amount: number;
  category: string;
  notes: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'SIP' | 'stock' | 'mutual_fund' | 'gold' | 'fd' | 'rd';
  monthlyAmount: number;
  investedAmount: number;
  currentValue: number;
  notes: string;
}

export interface WealthSummary {
  income: number;
  expenses: number;
  investments: number;
  savings: number;
}

// Debts
export interface Debt {
  id: string;
  personName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  targetMonth: string;
  status: 'active' | 'paid';
  notes: string;
}

// Emergency Funds
export interface EmergencyFund {
  id: string;
  bankName: string;
  amount: number;
  targetAmount: number;
  type: 'fd' | 'rd' | 'savings';
  notes: string;
}

export interface FundSummary {
  total: number;
  target: number;
  progress: number;
}

// Contacts
export interface Contact {
  id: string;
  name: string;
  type: 'colleague' | 'friend' | 'mentor' | 'family' | 'other';
  priority: 'high' | 'medium' | 'low';
  circleQualityScore: number;
  lastContactDate: string;
  nextFollowUpDate: string;
  notes: string;
}

// Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  icon: string;
  color: string;
  status: 'Active' | 'Planned' | 'Completed';
}

// Relationships
export interface Relationship {
  id: string;
  type: string;
  name: string;
  notes: string;
}

export interface Relative {
  id: string;
  name: string;
  relationship: string;
  age: number;
  notes: string;
}

// Future Plans
export interface FuturePlan {
  id: string;
  planType: 'home' | 'real_estate' | 'marriage' | 'company' | 'other';
  title: string;
  targetDate: string;
  budget: number;
  status: 'planned' | 'in_progress' | 'completed';
  notes: string;
}

// Diet
export interface DietLog {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: string;
  protein: number | null;
  calories: number | null;
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

// Career
export interface CareerEntry {
  id: string;
  companyName: string;
  roleTitle: string;
  payAmount: number;
  startDate: string;
  companyHealthScore: number;
  managerBehaviorScore: number;
  workEnvironmentNotes: string;
  stayLeavePlan: 'stay' | 'leave' | 'unsure';
  notes: string;
}
