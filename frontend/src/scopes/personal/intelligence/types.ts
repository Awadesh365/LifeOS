export type Domain =
  | "money"
  | "productivity"
  | "learning"
  | "maintenance"
  | "fitness"
  | "cross-domain";
export interface IntelligenceArtifact {
  id: string;
  domain: Domain;
  kind: string;
  state: string;
  generatedAt: string;
  dataThrough: string | null;
  payload: {
    title: string;
    value?: number;
    lower?: number;
    upper?: number;
    unit?: string;
    horizon?: string;
    baseline?: number;
    readiness?: string;
    modelVersion?: string;
    formulaVersion?: string;
    formula?: string;
    template?: string;
    uncertainty?: string;
    source?: string;
    caveat?: string;
    assumptions?: Record<string, number>;
    explanation?: string[];
    featureSnapshot?: Record<string, unknown>;
    expiresAt?: string;
    rationale?: string;
    options?: string[];
    constraints?: string[];
    usesML?: boolean;
    action?: { path: string };
    outcome?: {
      actual: number;
      absoluteError: number;
      covered: boolean;
      resolvedAt: string;
      source: string;
    };
    [key: string]: unknown;
  };
}
export interface Readiness {
  id: string;
  domain: Domain;
  name: string;
  target: string;
  horizon: string;
  baseline: string;
  metric: string;
  minimumLabels: number;
  minimumDays: number;
  events: number;
  labels: number;
  historyDays: number;
  state: string;
  reason: string;
  policyVersion: string;
  dataThrough: string | null;
  productMetric: string;
}
export interface Version {
  id: string;
  definitionId: string;
  stage: string;
  createdAt: string;
  payload: {
    currency: string;
    validation: string;
    algorithm: string;
    dataHash: string;
    featureSetVersion: string;
    trainedAt: string;
    trainingWindow: string[];
    metrics: Record<string, number>;
    gates: Record<string, boolean>;
    folds: Record<string, unknown>[];
    [key: string]: unknown;
  };
}
export interface Preferences {
  notifications: boolean;
  materialChangePercent: number;
  quietStart: number;
  quietEnd: number;
  retentionDays: number;
  explanations: boolean;
}
export interface Summary {
  generatedAt: string;
  enabledDomains: Domain[];
  counts: Record<string, number>;
  artifacts: IntelligenceArtifact[];
  readiness: Readiness[];
  versions: Version[];
  preferences: Preferences;
  sourceStatus: { domain: string; owned: boolean }[];
  quality: { sampleCount: number; mae: number; scope: string } | null;
}
export interface Consent {
  domain: Domain;
  enabled: boolean;
  purpose: string;
  updatedAt?: string;
}
export interface Diagnostics extends Summary {
  events: Record<string, unknown>[];
  audit: Record<string, unknown>[];
  schemas: Record<string, unknown>[];
  contracts: Record<string, unknown>[];
  definitions: Record<string, unknown>[];
}
