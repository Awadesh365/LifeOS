import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  HabitWithDone, RoutineGroup, LearningTree, LearningItem, GoalWithMilestones,
  Dream, Job, DashboardSummary, HealthLog, WealthEntry, Investment,
  WealthSummary, Debt, EmergencyFund, FundSummary, Contact, Project,
  Relationship, Relative, FuturePlan, DietLog, Supplement, CareerEntry,
} from '../../scopes/personal/types';
import { api } from '../../scopes/personal/api/client';

// ─── State Shape ──────────────────────────────────────────────

interface DomainState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

interface DomainStateSingle<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface PersonalState {
  habits: DomainState<HabitWithDone>;
  dashboard: DomainStateSingle<DashboardSummary | null>;
  learning: DomainStateSingle<LearningTree>;
  goals: DomainState<GoalWithMilestones>;
  dreams: DomainState<Dream>;
  jobs: DomainState<Job>;
  routines: DomainStateSingle<RoutineGroup[]>;
  health: {
    log: HealthLog | null;
    weekly: HealthLog[];
    loading: boolean;
    error: string | null;
  };
  wealth: {
    entries: WealthEntry[];
    investments: Investment[];
    summary: WealthSummary | null;
    loading: boolean;
    error: string | null;
  };
  debts: DomainState<Debt>;
  funds: {
    items: EmergencyFund[];
    summary: FundSummary | null;
    loading: boolean;
    error: string | null;
  };
  contacts: DomainState<Contact>;
  projects: DomainState<Project>;
  relationships: DomainStateSingle<{ relationship: Relationship | null; relatives: Relative[] }>;
  futurePlans: DomainState<FuturePlan>;
  diet: {
    logs: DietLog[];
    history: DietLog[];
    supplements: Supplement[];
    loading: boolean;
    error: string | null;
  };
  career: DomainState<CareerEntry>;
}

const initialState: PersonalState = {
  habits: { items: [], loading: false, error: null },
  dashboard: { data: null, loading: false, error: null },
  learning: { data: [], loading: false, error: null },
  goals: { items: [], loading: false, error: null },
  dreams: { items: [], loading: false, error: null },
  jobs: { items: [], loading: false, error: null },
  routines: { data: [], loading: false, error: null },
  health: { log: null, weekly: [], loading: false, error: null },
  wealth: { entries: [], investments: [], summary: null, loading: false, error: null },
  debts: { items: [], loading: false, error: null },
  funds: { items: [], summary: null, loading: false, error: null },
  contacts: { items: [], loading: false, error: null },
  projects: { items: [], loading: false, error: null },
  relationships: { data: { relationship: null, relatives: [] }, loading: false, error: null },
  futurePlans: { items: [], loading: false, error: null },
  diet: { logs: [], history: [], supplements: [], loading: false, error: null },
  career: { items: [], loading: false, error: null },
};

// ─── Async Thunks ─────────────────────────────────────────────

// Habits
export const fetchHabits = createAsyncThunk(
  'personal/fetchHabits',
  async (date: string, { rejectWithValue }) => {
    try {
      return await api.getHabits(date) as HabitWithDone[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load habits');
    }
  }
);

export const toggleHabit = createAsyncThunk(
  'personal/toggleHabit',
  async ({ id, date }: { id: string; date: string }, { rejectWithValue }) => {
    try {
      await api.toggleHabit(id, date);
      return { id };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to toggle habit');
    }
  }
);

export const createHabit = createAsyncThunk(
  'personal/createHabit',
  async (habit: { name: string; icon: string; category: string }, { rejectWithValue }) => {
    try {
      return await api.createHabit(habit) as HabitWithDone;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create habit');
    }
  }
);

// Dashboard
export const fetchDashboard = createAsyncThunk(
  'personal/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const [habits, learning, goals, _dreams, jobs, strongStack] = await Promise.allSettled([
        api.getHabits(new Date().toISOString().slice(0, 10)),
        api.getLearning(),
        api.getGoals(),
        api.getDreams(),
        api.getJobs(),
        api.getStrongStack(),
      ]);

      const habitRows = habits.status === 'fulfilled' ? (habits.value as HabitWithDone[]) : [];
      const learningData = learning.status === 'fulfilled' ? (learning.value as LearningTree) : [];
      const goalsData = goals.status === 'fulfilled' ? (goals.value as GoalWithMilestones[]) : [];
      const jobsData = jobs.status === 'fulfilled' ? (jobs.value as Job[]) : [];
      const rawStack = strongStack.status === 'fulfilled' ? strongStack.value : null;
      const stack = rawStack && typeof rawStack === 'object' && !Array.isArray(rawStack)
        ? rawStack as { frontend: string[]; backend: string[]; cloud: string[] }
        : { frontend: [], backend: [], cloud: [] };

      const allItems = learningData.flatMap((s) => s.items || []);
      const completedLearning = allItems.filter((i) => i.status === 'completed').length;
      const inProgressLearning = allItems.filter((i) => i.status === 'in_progress').length;

      const goalsWithProgress = goalsData.map((g) => {
        const milestones = g.milestones || [];
        const doneMilestones = milestones.filter((m) => m.done).length;
        return milestones.length > 0 ? Math.round((doneMilestones / milestones.length) * 100) : 0;
      });
      const overallGoalProgress = goalsWithProgress.length > 0
        ? Math.round(goalsWithProgress.reduce((acc, p) => acc + p, 0) / goalsWithProgress.length)
        : 0;

      return {
        habitsCompleted: habitRows.filter((h) => h.done).length,
        habitsTotal: habitRows.length,
        streak: 0,
        completedLearning,
        totalLearning: allItems.length,
        inProgressLearning,
        jobsApplied: jobsData.length,
        interviews: jobsData.filter((j) => j.status === 'interview').length,
        overallGoalProgress,
        strongStack: stack,
      } as DashboardSummary;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load dashboard');
    }
  }
);

// Learning
export const fetchLearning = createAsyncThunk(
  'personal/fetchLearning',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getLearning() as LearningTree;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load learning');
    }
  }
);

export const createLearningSection = createAsyncThunk(
  'personal/createLearningSection',
  async (title: string, { rejectWithValue }) => {
    try {
      return await api.createLearningSection(title);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create section');
    }
  }
);

export const updateLearningSection = createAsyncThunk(
  'personal/updateLearningSection',
  async ({ id, data }: { id: string; data: { title: string } }, { rejectWithValue }) => {
    try {
      return await api.updateLearningSection(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update section');
    }
  }
);

export const deleteLearningSection = createAsyncThunk(
  'personal/deleteLearningSection',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteLearningSection(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete section');
    }
  }
);

export const createLearningItem = createAsyncThunk(
  'personal/createLearningItem',
  async (item: { sectionId: string; topic: string; date?: string; info?: string; source?: string }, { rejectWithValue }) => {
    try {
      return await api.createLearningItem(item as any);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create item');
    }
  }
);

export const updateLearningItem = createAsyncThunk(
  'personal/updateLearningItem',
  async ({ id, data }: { id: string; data: { topic: string; date?: string; info?: string; source?: string; status?: string } }, { rejectWithValue }) => {
    try {
      return await api.updateLearningItem(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update item');
    }
  }
);

export const updateLearningItemStatus = createAsyncThunk(
  'personal/updateLearningItemStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await api.updateLearningItemStatus(id, status);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update item status');
    }
  }
);

export const deleteLearningItem = createAsyncThunk(
  'personal/deleteLearningItem',
  async ({ sectionId, itemId }: { sectionId: string; itemId: string }, { rejectWithValue }) => {
    try {
      await api.deleteLearningItem(itemId);
      return { sectionId, itemId };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete item');
    }
  }
);

export const reorderLearningItems = createAsyncThunk(
  'personal/reorderLearningItems',
  async (order: { id: string; sectionId: string; orderIndex: number }[], { rejectWithValue }) => {
    try {
      await api.reorderLearningItems(order as any);
      return order;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to reorder items');
    }
  }
);

// Goals
export const fetchGoals = createAsyncThunk(
  'personal/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getGoals() as GoalWithMilestones[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load goals');
    }
  }
);

export const updateGoal = createAsyncThunk(
  'personal/updateGoal',
  async ({ goalId, data }: { goalId: string; data: Partial<GoalWithMilestones> }, { rejectWithValue }) => {
    try {
      return await api.updateGoal(goalId, data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update goal');
    }
  }
);

export const toggleMilestone = createAsyncThunk(
  'personal/toggleMilestone',
  async ({ goalId, milestoneId, done }: { goalId: string; milestoneId: string; done: boolean }, { rejectWithValue }) => {
    try {
      const updated = await api.updateMilestone(milestoneId, done);
      return { goalId, milestoneId, updated };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to toggle milestone');
    }
  }
);

// Dreams
export const fetchDreams = createAsyncThunk(
  'personal/fetchDreams',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getDreams() as Dream[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load dreams');
    }
  }
);

// Jobs
export const fetchJobs = createAsyncThunk(
  'personal/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getJobs() as Job[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'personal/createJob',
  async (job: { company: string; role: string; salary?: string; date: string }, { rejectWithValue }) => {
    try {
      return await api.createJob(job as any) as Job;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'personal/updateJob',
  async ({ id, data }: { id: string; data: Partial<Job> }, { rejectWithValue }) => {
    try {
      return await api.updateJob(id, data) as Job;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update job');
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  'personal/updateJobStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await api.updateJobStatus(id, status) as Job;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update job status');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'personal/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteJob(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete job');
    }
  }
);

// Routines
export const fetchRoutines = createAsyncThunk(
  'personal/fetchRoutines',
  async (type: string | undefined, { rejectWithValue }) => {
    try {
      return await api.getRoutines(type) as RoutineGroup[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load routines');
    }
  }
);

export const updateRoutine = createAsyncThunk(
  'personal/updateRoutine',
  async ({ type, items }: { type: string; items: any[] }, { rejectWithValue }) => {
    try {
      return await api.updateRoutine(type, items);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update routine');
    }
  }
);

// Health
const HEALTH_API = import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:3001/api';

export const fetchHealth = createAsyncThunk(
  'personal/fetchHealth',
  async (date: string, { rejectWithValue }) => {
    try {
      const [healthRes, weekRes] = await Promise.all([
        fetch(`${HEALTH_API}/health?date=${date}`).then((r) => r.json()),
        fetch(`${HEALTH_API}/health/weekly`).then((r) => r.json()),
      ]);
      return { log: healthRes as HealthLog, weekly: weekRes as HealthLog[] };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load health data');
    }
  }
);

export const saveHealth = createAsyncThunk(
  'personal/saveHealth',
  async (data: Omit<HealthLog, 'id'>, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to save health data');
    }
  }
);

// Wealth
export const fetchWealth = createAsyncThunk(
  'personal/fetchWealth',
  async ({ month, year }: { month: number; year: number }, { rejectWithValue }) => {
    try {
      const [entriesRes, invRes, sumRes] = await Promise.all([
        fetch(`${HEALTH_API}/wealth/entries?month=${month}&year=${year}`).then((r) => r.json()),
        fetch(`${HEALTH_API}/wealth/investments`).then((r) => r.json()),
        fetch(`${HEALTH_API}/wealth/summary?month=${month}&year=${year}`).then((r) => r.json()),
      ]);
      return {
        entries: entriesRes as WealthEntry[],
        investments: invRes as Investment[],
        summary: sumRes as WealthSummary,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load wealth data');
    }
  }
);

export const addWealthEntry = createAsyncThunk(
  'personal/addWealthEntry',
  async (entry: Omit<WealthEntry, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/wealth/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      return await res.json() as WealthEntry;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add wealth entry');
    }
  }
);

export const deleteWealthEntry = createAsyncThunk(
  'personal/deleteWealthEntry',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/wealth/entries/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete wealth entry');
    }
  }
);

export const addInvestment = createAsyncThunk(
  'personal/addInvestment',
  async (inv: Omit<Investment, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/wealth/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inv),
      });
      return await res.json() as Investment;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add investment');
    }
  }
);

// Debts
export const fetchDebts = createAsyncThunk(
  'personal/fetchDebts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetch(`${HEALTH_API}/debts`).then((r) => r.json()) as Debt[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load debts');
    }
  }
);

export const addDebt = createAsyncThunk(
  'personal/addDebt',
  async (debt: { personName: string; totalAmount: number; targetMonth: string; notes: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/debts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debt),
      });
      return await res.json() as Debt;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add debt');
    }
  }
);

export const payDebt = createAsyncThunk(
  'personal/payDebt',
  async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/debts/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to pay debt');
    }
  }
);

export const deleteDebt = createAsyncThunk(
  'personal/deleteDebt',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/debts/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete debt');
    }
  }
);

// Emergency Funds
export const fetchFunds = createAsyncThunk(
  'personal/fetchFunds',
  async (_, { rejectWithValue }) => {
    try {
      const [fundsRes, sumRes] = await Promise.all([
        fetch(`${HEALTH_API}/funds`).then((r) => r.json()),
        fetch(`${HEALTH_API}/funds/summary`).then((r) => r.json()),
      ]);
      return { items: fundsRes as EmergencyFund[], summary: sumRes as FundSummary };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load funds');
    }
  }
);

export const addFund = createAsyncThunk(
  'personal/addFund',
  async (fund: { bankName: string; amount: number; targetAmount: number; type: string; notes: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fund),
      });
      return await res.json() as EmergencyFund;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add fund');
    }
  }
);

export const depositFund = createAsyncThunk(
  'personal/depositFund',
  async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/funds/${id}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to deposit to fund');
    }
  }
);

// Contacts
export const fetchContacts = createAsyncThunk(
  'personal/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetch(`${HEALTH_API}/contacts`).then((r) => r.json()) as Contact[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load contacts');
    }
  }
);

export const addContact = createAsyncThunk(
  'personal/addContact',
  async (contact: Omit<Contact, 'id' | 'lastContactDate'> & { lastContactDate?: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          lastContactDate: contact.lastContactDate || new Date().toISOString().slice(0, 10),
        }),
      });
      return await res.json() as Contact;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'personal/updateContact',
  async ({ id, updates }: { id: string; updates: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await res.json() as Contact;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'personal/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/contacts/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete contact');
    }
  }
);

// Projects
export const fetchProjects = createAsyncThunk(
  'personal/fetchProjects',
  async () => {
    try {
      const res = await fetch(`${HEALTH_API}/projects`);
      if (!res.ok) return [] as Project[];
      return await res.json() as Project[];
    } catch {
      return [] as Project[];
    }
  }
);

export const addProject = createAsyncThunk(
  'personal/addProject',
  async (project: Omit<Project, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      return await res.json() as Project;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'personal/updateProject',
  async ({ id, data }: { id: string; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json() as Project;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'personal/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/projects/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete project');
    }
  }
);

// Relationships
export const fetchRelationships = createAsyncThunk(
  'personal/fetchRelationships',
  async () => {
    try {
      const res = await fetch(`${HEALTH_API}/relationships`);
      if (!res.ok) return { relationship: null, relatives: [] };
      return await res.json() as { relationship: Relationship | null; relatives: Relative[] };
    } catch {
      return { relationship: null, relatives: [] };
    }
  }
);

export const updateRelationship = createAsyncThunk(
  'personal/updateRelationship',
  async (data: Partial<Relationship>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/relationships`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json() as Relationship;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update relationship');
    }
  }
);

export const addRelative = createAsyncThunk(
  'personal/addRelative',
  async (relative: Omit<Relative, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/relationships/relatives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(relative),
      });
      return await res.json() as Relative;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add relative');
    }
  }
);

export const deleteRelative = createAsyncThunk(
  'personal/deleteRelative',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/relationships/relatives/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete relative');
    }
  }
);

// Future Plans
export const fetchFuturePlans = createAsyncThunk(
  'personal/fetchFuturePlans',
  async (_, { rejectWithValue }) => {
    try {
      return await fetch(`${HEALTH_API}/future-plans`).then((r) => r.json()) as FuturePlan[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load future plans');
    }
  }
);

export const addFuturePlan = createAsyncThunk(
  'personal/addFuturePlan',
  async (plan: Omit<FuturePlan, 'id'> & { status?: FuturePlan['status'] }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/future-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, status: plan.status || 'planned' }),
      });
      return await res.json() as FuturePlan;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add future plan');
    }
  }
);

export const updateFuturePlan = createAsyncThunk(
  'personal/updateFuturePlan',
  async ({ id, updates }: { id: string; updates: Partial<FuturePlan> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/future-plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await res.json() as FuturePlan;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update future plan');
    }
  }
);

export const deleteFuturePlan = createAsyncThunk(
  'personal/deleteFuturePlan',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/future-plans/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete future plan');
    }
  }
);

// Diet
export const fetchDiet = createAsyncThunk(
  'personal/fetchDiet',
  async (date: string, { rejectWithValue }) => {
    try {
      const [logsRes, historyRes, suppRes] = await Promise.all([
        fetch(`${HEALTH_API}/diet/logs?date=${date}`).then((r) => r.json()),
        fetch(`${HEALTH_API}/diet/logs`).then((r) => r.json()),
        fetch(`${HEALTH_API}/diet/supplements`).then((r) => r.json()),
      ]);
      return {
        logs: logsRes as DietLog[],
        history: historyRes as DietLog[],
        supplements: suppRes as Supplement[],
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load diet data');
    }
  }
);

export const addDietLog = createAsyncThunk(
  'personal/addDietLog',
  async (log: Omit<DietLog, 'id'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/diet/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      return await res.json() as DietLog;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add diet log');
    }
  }
);

export const deleteDietLog = createAsyncThunk(
  'personal/deleteDietLog',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/diet/logs/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete diet log');
    }
  }
);

export const addSupplement = createAsyncThunk(
  'personal/addSupplement',
  async (supp: Omit<Supplement, 'id' | 'remainingDays'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/diet/supplements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supp),
      });
      return await res.json() as Supplement;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add supplement');
    }
  }
);

export const consumeSupplement = createAsyncThunk(
  'personal/consumeSupplement',
  async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/diet/supplements/${id}/consume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to consume supplement');
    }
  }
);

// Career
export const fetchCareer = createAsyncThunk(
  'personal/fetchCareer',
  async (_, { rejectWithValue }) => {
    try {
      return await fetch(`${HEALTH_API}/career`).then((r) => r.json()) as CareerEntry[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load career entries');
    }
  }
);

export const addCareerEntry = createAsyncThunk(
  'personal/addCareerEntry',
  async (entry: Omit<CareerEntry, 'id' | 'startDate'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/career`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, startDate: new Date().toISOString().slice(0, 10) }),
      });
      return await res.json() as CareerEntry;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add career entry');
    }
  }
);

export const updateCareerEntry = createAsyncThunk(
  'personal/updateCareerEntry',
  async ({ id, updates }: { id: string; updates: Partial<CareerEntry> }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${HEALTH_API}/career/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await res.json() as CareerEntry;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update career entry');
    }
  }
);

export const deleteCareerEntry = createAsyncThunk(
  'personal/deleteCareerEntry',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${HEALTH_API}/career/${id}`, { method: 'DELETE' });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete career entry');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────

const personalSlice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    clearPersonalError(state, action: PayloadAction<keyof PersonalState>) {
      state[action.payload].error = null;
    },
    resetPersonal(_state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── Habits ────────────────────────────────────────
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.habits.loading = true;
        state.habits.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.habits.loading = false;
        state.habits.items = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.habits.loading = false;
        state.habits.error = action.payload as string;
      })
      .addCase(toggleHabit.fulfilled, (state, action) => {
        const habit = state.habits.items.find((h) => h.id === action.payload.id);
        if (habit) habit.done = !habit.done;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.items.push(action.payload);
      });

    // ── Dashboard ─────────────────────────────────────
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload as string;
      });

    // ── Learning ──────────────────────────────────────
    builder
      .addCase(fetchLearning.pending, (state) => {
        state.learning.loading = true;
        state.learning.error = null;
      })
      .addCase(fetchLearning.fulfilled, (state, action) => {
        state.learning.loading = false;
        state.learning.data = action.payload;
      })
      .addCase(fetchLearning.rejected, (state, action) => {
        state.learning.loading = false;
        state.learning.error = action.payload as string;
      })
      .addCase(createLearningSection.fulfilled, (state, action) => {
        state.learning.data.push({ ...action.payload, items: [] });
      })
      .addCase(updateLearningSection.fulfilled, (state, action) => {
        const idx = state.learning.data.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.learning.data[idx] = { ...state.learning.data[idx], ...action.payload };
      })
      .addCase(deleteLearningSection.fulfilled, (state, action) => {
        state.learning.data = state.learning.data.filter((s) => s.id !== action.payload);
      })
      .addCase(createLearningItem.fulfilled, (state, action) => {
        const section = state.learning.data.find((s) => s.id === action.payload.sectionId);
        if (section) section.items.push(action.payload as LearningItem);
      })
      .addCase(updateLearningItem.fulfilled, (state, action) => {
        for (const section of state.learning.data) {
          const idx = section.items.findIndex((i) => i.id === action.payload.id);
          if (idx !== -1) {
            section.items[idx] = { ...section.items[idx], ...action.payload } as LearningItem;
            break;
          }
        }
      })
      .addCase(updateLearningItemStatus.fulfilled, (state, action) => {
        for (const section of state.learning.data) {
          const idx = section.items.findIndex((i) => i.id === action.payload.id);
          if (idx !== -1) {
            section.items[idx] = { ...section.items[idx], ...action.payload } as LearningItem;
            break;
          }
        }
      })
      .addCase(deleteLearningItem.fulfilled, (state, action) => {
        const section = state.learning.data.find((s) => s.id === action.payload.sectionId);
        if (section) {
          section.items = section.items.filter((i) => i.id !== action.payload.itemId);
        }
      });

    // ── Goals ─────────────────────────────────────────
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.goals.loading = true;
        state.goals.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.goals.loading = false;
        state.goals.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.goals.loading = false;
        state.goals.error = action.payload as string;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.goals.items.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.goals.items[idx] = action.payload;
      })
      .addCase(toggleMilestone.fulfilled, (state, action) => {
        const goal = state.goals.items.find((g) => g.id === action.payload.goalId);
        if (goal) {
          const milestone = goal.milestones.find((m) => m.id === action.payload.milestoneId);
          if (milestone) {
            milestone.done = action.payload.updated.done;
          }
        }
      });

    // ── Dreams ────────────────────────────────────────
    builder
      .addCase(fetchDreams.pending, (state) => {
        state.dreams.loading = true;
        state.dreams.error = null;
      })
      .addCase(fetchDreams.fulfilled, (state, action) => {
        state.dreams.loading = false;
        state.dreams.items = action.payload;
      })
      .addCase(fetchDreams.rejected, (state, action) => {
        state.dreams.loading = false;
        state.dreams.error = action.payload as string;
      });

    // ── Jobs ──────────────────────────────────────────
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.jobs.loading = true;
        state.jobs.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs.loading = false;
        state.jobs.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobs.loading = false;
        state.jobs.error = action.payload as string;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.items.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.jobs.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.jobs.items[idx] = action.payload;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const idx = state.jobs.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.jobs.items[idx] = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs.items = state.jobs.items.filter((j) => j.id !== action.payload);
      });

    // ── Routines ──────────────────────────────────────
    builder
      .addCase(fetchRoutines.pending, (state) => {
        state.routines.loading = true;
        state.routines.error = null;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.routines.loading = false;
        state.routines.data = action.payload;
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.routines.loading = false;
        state.routines.error = action.payload as string;
      })
      .addCase(updateRoutine.fulfilled, (state, action) => {
        const idx = state.routines.data.findIndex((r) => r.type === action.meta.arg.type);
        if (idx !== -1) {
          state.routines.data[idx].items = action.meta.arg.items;
        } else {
          state.routines.data.push({ type: action.meta.arg.type as 'weekday' | 'weekend', items: action.meta.arg.items });
        }
      });

    // ── Health ────────────────────────────────────────
    builder
      .addCase(fetchHealth.pending, (state) => {
        state.health.loading = true;
        state.health.error = null;
      })
      .addCase(fetchHealth.fulfilled, (state, action) => {
        state.health.loading = false;
        state.health.log = action.payload.log;
        state.health.weekly = action.payload.weekly;
      })
      .addCase(fetchHealth.rejected, (state, action) => {
        state.health.loading = false;
        state.health.error = action.payload as string;
      })
      .addCase(saveHealth.fulfilled, (state, action) => {
        state.health.log = action.payload;
      });

    // ── Wealth ────────────────────────────────────────
    builder
      .addCase(fetchWealth.pending, (state) => {
        state.wealth.loading = true;
        state.wealth.error = null;
      })
      .addCase(fetchWealth.fulfilled, (state, action) => {
        state.wealth.loading = false;
        state.wealth.entries = action.payload.entries;
        state.wealth.investments = action.payload.investments;
        state.wealth.summary = action.payload.summary;
      })
      .addCase(fetchWealth.rejected, (state, action) => {
        state.wealth.loading = false;
        state.wealth.error = action.payload as string;
      })
      .addCase(addWealthEntry.fulfilled, (state, action) => {
        state.wealth.entries.unshift(action.payload);
      })
      .addCase(deleteWealthEntry.fulfilled, (state, action) => {
        state.wealth.entries = state.wealth.entries.filter((e) => e.id !== action.payload);
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.wealth.investments.push(action.payload);
      });

    // ── Debts ─────────────────────────────────────────
    builder
      .addCase(fetchDebts.pending, (state) => {
        state.debts.loading = true;
        state.debts.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.debts.loading = false;
        state.debts.items = action.payload;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.debts.loading = false;
        state.debts.error = action.payload as string;
      })
      .addCase(addDebt.fulfilled, (state, action) => {
        state.debts.items.unshift(action.payload);
      })
      .addCase(payDebt.fulfilled, (state, action) => {
        const debt = state.debts.items.find((d) => d.id === action.payload);
        if (debt) {
          debt.status = 'paid';
        }
      })
      .addCase(deleteDebt.fulfilled, (state, action) => {
        state.debts.items = state.debts.items.filter((d) => d.id !== action.payload);
      });

    // ── Funds ─────────────────────────────────────────
    builder
      .addCase(fetchFunds.pending, (state) => {
        state.funds.loading = true;
        state.funds.error = null;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.funds.loading = false;
        state.funds.items = action.payload.items;
        state.funds.summary = action.payload.summary;
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.funds.loading = false;
        state.funds.error = action.payload as string;
      })
      .addCase(addFund.fulfilled, (state, action) => {
        state.funds.items.push(action.payload);
      })
      .addCase(depositFund.fulfilled, (_state) => {
        // Refetch summary after deposit
      });

    // ── Contacts ──────────────────────────────────────
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.contacts.loading = true;
        state.contacts.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts.loading = false;
        state.contacts.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contacts.loading = false;
        state.contacts.error = action.payload as string;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.items.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const idx = state.contacts.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.contacts.items[idx] = action.payload;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts.items = state.contacts.items.filter((c) => c.id !== action.payload);
      });

    // ── Projects ──────────────────────────────────────
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.projects.loading = true;
        state.projects.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects.loading = false;
        state.projects.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.projects.loading = false;
        state.projects.error = action.payload as string;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.items.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects.items[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects.items = state.projects.items.filter((p) => p.id !== action.payload);
      });

    // ── Relationships ─────────────────────────────────
    builder
      .addCase(fetchRelationships.pending, (state) => {
        state.relationships.loading = true;
        state.relationships.error = null;
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.relationships.loading = false;
        state.relationships.data = action.payload;
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.relationships.loading = false;
        state.relationships.error = action.payload as string;
      })
      .addCase(updateRelationship.fulfilled, (state, action) => {
        state.relationships.data.relationship = action.payload;
      })
      .addCase(addRelative.fulfilled, (state, action) => {
        state.relationships.data.relatives.push(action.payload);
      })
      .addCase(deleteRelative.fulfilled, (state, action) => {
        state.relationships.data.relatives = state.relationships.data.relatives.filter(
          (r) => r.id !== action.payload
        );
      });

    // ── Future Plans ──────────────────────────────────
    builder
      .addCase(fetchFuturePlans.pending, (state) => {
        state.futurePlans.loading = true;
        state.futurePlans.error = null;
      })
      .addCase(fetchFuturePlans.fulfilled, (state, action) => {
        state.futurePlans.loading = false;
        state.futurePlans.items = action.payload;
      })
      .addCase(fetchFuturePlans.rejected, (state, action) => {
        state.futurePlans.loading = false;
        state.futurePlans.error = action.payload as string;
      })
      .addCase(addFuturePlan.fulfilled, (state, action) => {
        state.futurePlans.items.push(action.payload);
      })
      .addCase(updateFuturePlan.fulfilled, (state, action) => {
        const idx = state.futurePlans.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.futurePlans.items[idx] = action.payload;
      })
      .addCase(deleteFuturePlan.fulfilled, (state, action) => {
        state.futurePlans.items = state.futurePlans.items.filter((p) => p.id !== action.payload);
      });

    // ── Diet ──────────────────────────────────────────
    builder
      .addCase(fetchDiet.pending, (state) => {
        state.diet.loading = true;
        state.diet.error = null;
      })
      .addCase(fetchDiet.fulfilled, (state, action) => {
        state.diet.loading = false;
        state.diet.logs = action.payload.logs;
        state.diet.history = action.payload.history;
        state.diet.supplements = action.payload.supplements;
      })
      .addCase(fetchDiet.rejected, (state, action) => {
        state.diet.loading = false;
        state.diet.error = action.payload as string;
      })
      .addCase(addDietLog.fulfilled, (state, action) => {
        state.diet.logs.push(action.payload);
        state.diet.history.push(action.payload);
      })
      .addCase(deleteDietLog.fulfilled, (state, action) => {
        state.diet.logs = state.diet.logs.filter((l) => l.id !== action.payload);
        state.diet.history = state.diet.history.filter((l) => l.id !== action.payload);
      })
      .addCase(addSupplement.fulfilled, (state, action) => {
        state.diet.supplements.push(action.payload);
      })
      .addCase(consumeSupplement.fulfilled, (_state) => {
        // Refetch after consume
      });

    // ── Career ────────────────────────────────────────
    builder
      .addCase(fetchCareer.pending, (state) => {
        state.career.loading = true;
        state.career.error = null;
      })
      .addCase(fetchCareer.fulfilled, (state, action) => {
        state.career.loading = false;
        state.career.items = action.payload;
      })
      .addCase(fetchCareer.rejected, (state, action) => {
        state.career.loading = false;
        state.career.error = action.payload as string;
      })
      .addCase(addCareerEntry.fulfilled, (state, action) => {
        state.career.items.unshift(action.payload);
      })
      .addCase(updateCareerEntry.fulfilled, (state, action) => {
        const idx = state.career.items.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.career.items[idx] = action.payload;
      })
      .addCase(deleteCareerEntry.fulfilled, (state, action) => {
        state.career.items = state.career.items.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearPersonalError, resetPersonal } = personalSlice.actions;
export default personalSlice.reducer;
