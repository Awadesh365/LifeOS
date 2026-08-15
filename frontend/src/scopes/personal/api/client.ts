import type {
  HabitWithDone,
  Habit,
  HabitLog,
  RoutineGroup,
  Job,
  GoalWithMilestones,
  Goal,
  Milestone,
  Dream,
  LearningTree,
  LearningSection,
  LearningItem,
  ArticleTree,
  Content,
  StrongStack,
  HealthLog,
  WealthEntry,
  Investment,
  WealthSummary,
  Debt,
  DebtPayment,
  EmergencyFund,
  FundSummary,
  Contact,
  Project,
  Relationship,
  Relative,
  FuturePlan,
  DietLog,
  Supplement,
  CareerEntry,
  QueryParams,
} from '../types/index';

const API_BASE = import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:5000/api';

function withQuery(path: string, params: QueryParams = {}): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Habits
  getHabits: (date: string) =>
    request<HabitWithDone[]>(withQuery('/habits', { date })),
  toggleHabit: (id: string, date: string) =>
    request<HabitWithDone>(`/habits/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
  createHabit: (habit: Omit<Habit, 'id'>) =>
    request<Habit>('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    }),
  getHabitHistory: (date: string) =>
    request<HabitLog[]>(`/habits/history/${date}`),

  // Jobs
  getJobs: () => request<Job[]>('/jobs'),
  createJob: (job: Omit<Job, 'id'>) =>
    request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    }),
  updateJob: (id: string, data: Partial<Omit<Job, 'id'>>) =>
    request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateJobStatus: (id: string, status: string) =>
    request<Job>(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteJob: (id: string) =>
    request(`/jobs/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request<GoalWithMilestones[]>('/goals'),
  updateGoal: (goalId: string, data: Partial<Omit<Goal, 'id'>>) =>
    request<GoalWithMilestones>(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleMilestone: (goalId: string, index: number) =>
    request<Milestone>(`/goals/${goalId}/milestone/${index}`, { method: 'PUT' }),
  updateMilestone: (id: string, done: boolean) =>
    request<Milestone>(`/goals/milestone/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
    }),

  // Dreams
  getDreams: () => request<Dream[]>('/dreams'),

  // Learning
  getLearning: () => request<LearningTree[]>('/learning'),
  getArticles: () => request<ArticleTree[]>('/articles'),
  getContent: () => request<Content[]>('/content'),
  getStrongStack: () => request<StrongStack[]>('/content/strong-stack'),
  getQuote: () => request<Content>('/content/quote'),
  createLearningSection: (title: string) =>
    request<LearningSection>('/learning/section', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  updateLearningSection: (id: string, data: Partial<Omit<LearningSection, 'id'>>) =>
    request<LearningSection>(`/learning/section/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteLearningSection: (id: string) =>
    request(`/learning/section/${id}`, { method: 'DELETE' }),
  createLearningItem: (item: Omit<LearningItem, 'id'>) =>
    request<LearningItem>('/learning/item', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  updateLearningItem: (id: string, data: Partial<Omit<LearningItem, 'id'>>) =>
    request<LearningItem>(`/learning/item/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateLearningItemStatus: (id: string, status: string) =>
    request<LearningItem>(`/learning/item/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteLearningItem: (id: string) =>
    request(`/learning/item/${id}`, { method: 'DELETE' }),
  reorderLearningItems: (order: string[]) =>
    request(`/learning/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ order }),
    }),

  // Routines
  getRoutines: (type?: string) => request<RoutineGroup[]>(withQuery('/routines', { type })),
  updateRoutine: (type: string, items: Omit<import('../types/index').Routine, 'id'>[]) =>
    request(`/routines/${type}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),

  // Health
  getHealthLog: (date: string) =>
    request<HealthLog>(withQuery('/health', { date })),
  upsertHealthLog: (data: Omit<HealthLog, 'id'>) =>
    request<HealthLog>('/health', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getWeeklyHealthLogs: () => request<HealthLog[]>('/health/weekly'),

  // Wealth
  getWealthEntries: (month?: number, year?: number) =>
    request<WealthEntry[]>(withQuery('/wealth/entries', { month, year })),
  createWealthEntry: (data: Omit<WealthEntry, 'id'>) =>
    request<WealthEntry>('/wealth/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteWealthEntry: (id: string) =>
    request(`/wealth/entries/${id}`, { method: 'DELETE' }),
  getInvestments: () => request<Investment[]>('/wealth/investments'),
  createInvestment: (data: Omit<Investment, 'id'>) =>
    request<Investment>('/wealth/investments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateInvestment: (id: string, data: Partial<Omit<Investment, 'id'>>) =>
    request<Investment>(`/wealth/investments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getWealthSummary: (month?: number, year?: number) =>
    request<WealthSummary>(withQuery('/wealth/summary', { month, year })),

  // Debts
  getDebts: () => request<Debt[]>('/debts'),
  createDebt: (data: Omit<Debt, 'id' | 'paidAmount' | 'remainingAmount'>) =>
    request<Debt>('/debts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  payDebt: (id: string, data: { amount: number; paymentDate: string; notes?: string }) =>
    request<DebtPayment>(`/debts/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDebtPayments: (id: string) =>
    request<DebtPayment[]>(`/debts/${id}/payments`),
  deleteDebt: (id: string) =>
    request(`/debts/${id}`, { method: 'DELETE' }),

  // Emergency Funds
  getFunds: () => request<EmergencyFund[]>('/funds'),
  createFund: (data: Omit<EmergencyFund, 'id'>) =>
    request<EmergencyFund>('/funds', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFund: (id: string, data: Partial<Omit<EmergencyFund, 'id'>>) =>
    request<EmergencyFund>(`/funds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  depositFund: (id: string, amount: number) =>
    request<EmergencyFund>(`/funds/${id}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  getFundSummary: () => request<FundSummary>('/funds/summary'),

  // Contacts
  getContacts: () => request<Contact[]>('/contacts'),
  createContact: (data: Omit<Contact, 'id'>) =>
    request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateContact: (id: string, data: Partial<Omit<Contact, 'id'>>) =>
    request<Contact>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteContact: (id: string) =>
    request(`/contacts/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request<Project[]>('/projects'),
  createProject: (data: Omit<Project, 'id'>) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: Partial<Omit<Project, 'id'>>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    request(`/projects/${id}`, { method: 'DELETE' }),

  // Relationships
  getRelationships: () => request<Relationship[]>('/relationships'),
  upsertRelationship: (data: Omit<Relationship, 'id'>) =>
    request<Relationship>('/relationships', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createRelative: (data: Omit<Relative, 'id'>) =>
    request<Relative>('/relationships/relatives', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRelative: (id: string, data: Partial<Omit<Relative, 'id'>>) =>
    request<Relative>(`/relationships/relatives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRelative: (id: string) =>
    request(`/relationships/relatives/${id}`, { method: 'DELETE' }),

  // Future Plans
  getFuturePlans: () => request<FuturePlan[]>('/future-plans'),
  createFuturePlan: (data: Omit<FuturePlan, 'id'>) =>
    request<FuturePlan>('/future-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFuturePlan: (id: string, data: Partial<Omit<FuturePlan, 'id'>>) =>
    request<FuturePlan>(`/future-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFuturePlan: (id: string) =>
    request(`/future-plans/${id}`, { method: 'DELETE' }),

  // Diet
  getDietLogs: (date: string) =>
    request<DietLog[]>(withQuery('/diet', { date })),
  createDietLog: (data: Omit<DietLog, 'id'>) =>
    request<DietLog>('/diet', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteDietLog: (id: string) =>
    request(`/diet/${id}`, { method: 'DELETE' }),
  getSupplements: () => request<Supplement[]>('/diet/supplements'),
  createSupplement: (data: Omit<Supplement, 'id'>) =>
    request<Supplement>('/diet/supplements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSupplement: (id: string, data: Partial<Omit<Supplement, 'id'>>) =>
    request<Supplement>(`/diet/supplements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  consumeSupplement: (id: string, amount: number) =>
    request<Supplement>(`/diet/supplements/${id}/consume`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  // Career
  getCareerEntries: () => request<CareerEntry[]>('/career'),
  createCareerEntry: (data: Omit<CareerEntry, 'id'>) =>
    request<CareerEntry>('/career', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCareerEntry: (id: string, data: Partial<Omit<CareerEntry, 'id'>>) =>
    request<CareerEntry>(`/career/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCareerEntry: (id: string) =>
    request(`/career/${id}`, { method: 'DELETE' }),
};

export const API = API_BASE;
