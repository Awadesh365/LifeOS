export type ScheduleType =
  | "fixed_recurring"
  | "interval"
  | "flexible_window"
  | "condition"
  | "hard_deadline"
  | "seasonal"
  | "repair"
  | "project";
export type NeedState =
  | "can_wait"
  | "approaching"
  | "due"
  | "needs_attention"
  | "overdue"
  | "backlog"
  | "paused";
export type PlanPriority = "must" | "should" | "can_wait";

export interface MaintenanceArea {
  id: string;
  name: string;
  type: string;
  icon: string;
  standard?: string | null;
  itemCount: number;
  isDefault: boolean;
}

export interface MaintenanceAsset {
  id: string;
  areaId?: string | null;
  name: string;
  category: string;
  brand?: string | null;
  model?: string | null;
  purchaseDate?: string | null;
  warrantyEndsAt?: string | null;
  location?: string | null;
  status: string;
}

export interface MaintenanceItem {
  id: string;
  areaId: string;
  assetId?: string | null;
  name: string;
  scheduleType: ScheduleType;
  status: "active" | "backlog" | "paused" | "archived";
  intervalDays?: number | null;
  windowStartDays?: number | null;
  windowEndDays?: number | null;
  nextDate?: string | null;
  lastCompletedAt?: string | null;
  conditionState?: string | null;
  effort: "light" | "moderate" | "heavy";
  durationMinutes: number;
  priority: PlanPriority;
  notes?: string | null;
  needState: NeedState;
  needReason: string;
  calculatedTargetDate?: string | null;
  daysUntilTarget?: number | null;
  area?: Pick<MaintenanceArea, "id" | "name" | "type" | "icon">;
  asset?: Pick<MaintenanceAsset, "id" | "name"> | null;
}

export interface RepairCase {
  id: string;
  assetId?: string | null;
  areaId?: string | null;
  title: string;
  issue: string;
  state:
    | "reported"
    | "diagnosing"
    | "in_service"
    | "waiting"
    | "ready_to_collect"
    | "resolved"
    | "closed";
  nextAction?: string | null;
  waitingOn?: string | null;
  followUpDate?: string | null;
  openedAt: string;
  asset?: Pick<MaintenanceAsset, "id" | "name"> | null;
}

export interface WeeklyPlan {
  id: string;
  weekStart: string;
  capacityMinutes: number;
  selectedItems: Array<{ itemId: string; priority: PlanPriority }>;
  status: "draft" | "committed" | "complete";
  notes?: string | null;
  committedAt?: string | null;
}

export interface MaintenanceSummary {
  counts: {
    needsAttention: number;
    hardDeadlines: number;
    openRepairs: number;
    waiting: number;
    backlog: number;
    assets: number;
  };
  attention: MaintenanceItem[];
  upcoming: MaintenanceItem[];
  hardDeadlines: MaintenanceItem[];
  areas: MaintenanceArea[];
  repairs: RepairCase[];
  plan: WeeklyPlan;
}
