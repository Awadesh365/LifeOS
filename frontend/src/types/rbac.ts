export type FeatureStatus = boolean;

export interface FeatureConfig {
  IS_ACTIVE: FeatureStatus;
  SUB_FEATURES?: Record<string, FeatureConfig | FeatureStatus>;
  [key: string]: any; // Allow for extra metadata like labels, icons, etc.
}

export interface FeatureTree {
  [key: string]: FeatureConfig;
}

export interface RbacState {
  tree: FeatureTree | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// User Roles for LifeOS
export enum UserRole {
  CITIZEN = "CITIZEN",
  OFFICIAL_DM = "OFFICIAL_DM", // District Magistrate
  OFFICIAL_CLERK = "OFFICIAL_CLERK",
  SUPER_ADMIN = "SUPER_ADMIN",
}
