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

export type MoneyAccountType = 'bank' | 'cash' | 'credit_card' | 'loan' | 'deposit' | 'investment' | 'manual_asset' | 'manual_liability';
export type MoneyTransactionType = 'income' | 'expense' | 'transfer' | 'refund' | 'fee' | 'deposit_funding' | 'investment_contribution' | 'debt_payment' | 'adjustment';

export interface MoneyAccount {
  id: string;
  name: string;
  type: MoneyAccountType;
  institution?: string | null;
  currency: string;
  includeInNetWorth: boolean;
  balance: string;
  balanceKind: 'asset' | 'liability';
}

export interface MoneyPosting {
  id: string;
  accountId: string;
  amount: string;
  role: string;
  account: Pick<MoneyAccount, 'id' | 'name' | 'type'>;
}

export interface MoneyTransaction {
  id: string;
  semanticType: MoneyTransactionType;
  occurredOn: string;
  amount: string;
  currency: string;
  description: string;
  merchant?: string | null;
  category?: string | null;
  reconciliationStatus: string;
  postings: MoneyPosting[];
}

export interface MoneyOverview {
  totals: { netWorth: string; assets: string; liabilities: string; cash: string; investments: string };
  cashflow: { income: string; spending: string; savedInvested: string; debtCost: string; net: string };
  completeness: { current: number; stale: number; issues: number; status: 'current' | 'empty' };
  accounts: MoneyAccount[];
  recent: MoneyTransaction[];
}
