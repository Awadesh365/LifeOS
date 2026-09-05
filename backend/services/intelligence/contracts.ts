export const DOMAINS = [
  "money",
  "productivity",
  "learning",
  "maintenance",
  "fitness",
  "cross-domain",
] as const;
export type Domain = (typeof DOMAINS)[number];
export const DEFINITIONS = [
  {
    id: "FIN-01",
    domain: "money",
    name: "Month-end spend",
    target: "final monthly eligible spend",
    horizon: "end of month",
    baseline: "previous complete month",
    metric: "MAE",
    minimumLabels: 18,
    minimumDays: 540,
    algorithm: "rolling median",
    productMetric: "forecast reviewed before month end",
  },
  {
    id: "FIN-02",
    domain: "money",
    name: "Unusual transaction",
    target: "reviewed unusual transaction",
    horizon: "transaction time",
    baseline: "robust category threshold",
    metric: "review precision",
    minimumLabels: 50,
    minimumDays: 90,
    algorithm: "reviewed anomaly baseline",
    productMetric: "useful reviews per alert",
  },
  {
    id: "PROD-01",
    domain: "productivity",
    name: "Task completion",
    target: "completed inside planned window",
    horizon: "planned day",
    baseline: "historical completion rate",
    metric: "Brier score",
    minimumLabels: 60,
    minimumDays: 60,
    algorithm: "rolling completion rate",
    productMetric: "plans reviewed",
  },
  {
    id: "PROD-02",
    domain: "productivity",
    name: "Task duration",
    target: "actual active minutes",
    horizon: "task completion",
    baseline: "median similar task duration",
    metric: "MAE in minutes",
    minimumLabels: 60,
    minimumDays: 60,
    algorithm: "rolling median",
    productMetric: "planning estimate error",
  },
  {
    id: "LEARN-01",
    domain: "learning",
    name: "Course completion",
    target: "resolved course completion date",
    horizon: "course completion",
    baseline: "remaining units / weekly pace",
    metric: "MAE in days",
    minimumLabels: 30,
    minimumDays: 90,
    algorithm: "pace residual model",
    productMetric: "scenario usage",
  },
  {
    id: "MAINT-01",
    domain: "maintenance",
    name: "Maintenance completion",
    target: "completed inside proposed week",
    horizon: "planned week",
    baseline: "recent completion rate",
    metric: "Brier score",
    minimumLabels: 60,
    minimumDays: 90,
    algorithm: "rolling completion rate",
    productMetric: "weekly plan reviewed",
  },
  {
    id: "FIT-01",
    domain: "fitness",
    name: "Workout adherence",
    target: "planned workout completed",
    horizon: "planned week",
    baseline: "recent adherence rate",
    metric: "Brier score",
    minimumLabels: 60,
    minimumDays: 90,
    algorithm: "rolling completion rate",
    productMetric: "training plans reviewed",
  },
] as const;
export const EVENT_SCHEMAS = [
  {
    domain: "money",
    entityType: "transaction",
    types: [
      "TRANSACTION_RECORDED",
      "TRANSACTION_UPDATED",
      "TRANSACTION_DELETED",
    ],
    fields: ["amount", "currency", "semanticType", "occurredOn"],
  },
  {
    domain: "maintenance",
    entityType: "maintenance",
    types: ["PLANNED", "COMPLETED", "DEFERRED", "ITEM_DUE_STATE_CHANGED"],
    fields: [
      "durationMinutes",
      "plannedFor",
      "completedAt",
      "action",
      "itemId",
    ],
  },
  {
    domain: "productivity",
    entityType: "task",
    types: [
      "CREATED",
      "PLANNED",
      "RESCHEDULED",
      "STARTED",
      "PAUSED",
      "COMPLETED",
      "CANCELLED",
    ],
    fields: [
      "plannedFor",
      "completedAt",
      "durationMinutes",
      "estimatedMinutes",
    ],
  },
  {
    domain: "learning",
    entityType: "learning",
    types: [
      "SESSION_PLANNED",
      "STARTED",
      "COMPLETED",
      "QUIZ_RECORDED",
      "REVISION_DONE",
    ],
    fields: [
      "plannedFor",
      "completedAt",
      "durationMinutes",
      "completedUnits",
      "totalUnits",
    ],
  },
  {
    domain: "fitness",
    entityType: "workout",
    types: ["WORKOUT_PLANNED", "STARTED", "COMPLETED", "SET_LOGGED"],
    fields: ["plannedFor", "completedAt", "durationMinutes", "sets"],
  },
].map((s) => ({
  ...s,
  version: 1,
  cutoff:
    "Both eventTime and recordedAt must be at or before featureTime. Later edits never rewrite old events.",
}));
export const AGENT_CONTRACTS = [
  {
    name: "get_analytics",
    method: "GET",
    path: "/summary",
    permission: "domain consent",
    mutatesDomain: false,
  },
  {
    name: "run_projection",
    method: "POST",
    path: "/projections",
    permission: "domain consent",
    mutatesDomain: false,
  },
  {
    name: "get_prediction",
    method: "GET",
    path: "/artifacts/:id",
    permission: "ownership + current consent",
    mutatesDomain: false,
  },
  {
    name: "get_recommendations",
    method: "GET",
    path: "/artifacts?kind=recommendation",
    permission: "domain consent",
    mutatesDomain: false,
  },
];
export type Event = {
  id: string;
  domain: Domain;
  entityId: string;
  eventType: string;
  eventTime: string;
  recordedAt: string;
  attributes: Record<string, any>;
};
export type Artifact = {
  id: string;
  domain: Domain;
  kind: string;
  generatedAt: string;
  dataThrough: string | null;
  payload: Record<string, any>;
};
