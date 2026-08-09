/**
 * LifeOS Top Navigation Configuration
 * All 12 modules with their respective sidebar items
 * Uses i18n translation keys instead of hardcoded labels
 * Created: December 17, 2025
 */

import { NavItem } from "../../types/navigation";
import {
  DISTRICT_ADMIN_MODULE,
  STATE_ADMIN_MODULE,
  CITIZEN_SERVICES_MODULE,
  DEV_SCHEMES_MODULE,
  EMERGENCY_MODULE,
  REVENUE_MODULE,
  HEALTH_MODULE,
  EDUCATION_MODULE,
  POLICE_MODULE,
  ENVIRONMENT_MODULE,
  ANALYTICS_MODULE,
  SYSTEM_ADMIN_MODULE,
} from "./navigation_modules";

// Top Nav Item Interface
export interface TopNavItem {
  key: string;
  labelKey: string; // i18n translation key for label
  descriptionKey: string; // i18n translation key for description
  icon: string;
  color: string;
  enabled: boolean;
  route?: string;
  items: NavItem[];
}

// Module key to translation key mapping
export const MODULE_TRANSLATION_KEYS: Record<
  string,
  { title: string; description: string }
> = {
  "district-admin": {
    title: "modules.districtAdmin.title",
    description: "modules.districtAdmin.description",
  },
  "state-admin": {
    title: "modules.stateAdmin.title",
    description: "modules.stateAdmin.description",
  },
  "citizen-services": {
    title: "modules.citizenServices.title",
    description: "modules.citizenServices.description",
  },
  "dev-schemes": {
    title: "modules.devSchemes.title",
    description: "modules.devSchemes.description",
  },
  emergency: {
    title: "modules.emergency.title",
    description: "modules.emergency.description",
  },
  revenue: {
    title: "modules.revenue.title",
    description: "modules.revenue.description",
  },
  health: {
    title: "modules.health.title",
    description: "modules.health.description",
  },
  education: {
    title: "modules.education.title",
    description: "modules.education.description",
  },
  police: {
    title: "modules.police.title",
    description: "modules.police.description",
  },
  environment: {
    title: "modules.environment.title",
    description: "modules.environment.description",
  },
  analytics: {
    title: "modules.analytics.title",
    description: "modules.analytics.description",
  },
  "system-admin": {
    title: "modules.systemAdmin.title",
    description: "modules.systemAdmin.description",
  },
};

// =============================================================================
// TOP NAVIGATION ITEMS (12 Modules)
// =============================================================================
export const TOP_NAV_ITEMS: TopNavItem[] = [
  {
    key: "district-admin",
    labelKey: "modules.districtAdmin.title",
    descriptionKey: "modules.districtAdmin.description",
    icon: "account_balance",
    color: "#3b82f6", // Blue
    enabled: true,
    items: DISTRICT_ADMIN_MODULE,
  },
  {
    key: "state-admin",
    labelKey: "modules.stateAdmin.title",
    descriptionKey: "modules.stateAdmin.description",
    icon: "domain",
    color: "#8b5cf6", // Violet
    enabled: true,
    items: STATE_ADMIN_MODULE,
  },
  {
    key: "citizen-services",
    labelKey: "modules.citizenServices.title",
    descriptionKey: "modules.citizenServices.description",
    icon: "groups",
    color: "#10b981", // Emerald
    enabled: true,
    items: CITIZEN_SERVICES_MODULE,
  },
  {
    key: "dev-schemes",
    labelKey: "modules.devSchemes.title",
    descriptionKey: "modules.devSchemes.description",
    icon: "trending_up",
    color: "#f59e0b", // Amber
    enabled: true,
    items: DEV_SCHEMES_MODULE,
  },
  {
    key: "emergency",
    labelKey: "modules.emergency.title",
    descriptionKey: "modules.emergency.description",
    icon: "warning",
    color: "#ef4444", // Red
    enabled: true,
    items: EMERGENCY_MODULE,
  },
  {
    key: "revenue",
    labelKey: "modules.revenue.title",
    descriptionKey: "modules.revenue.description",
    icon: "gavel",
    color: "#78716c", // Stone
    enabled: true,
    items: REVENUE_MODULE,
  },
  {
    key: "health",
    labelKey: "modules.health.title",
    descriptionKey: "modules.health.description",
    icon: "local_hospital",
    color: "#ec4899", // Pink
    enabled: true,
    items: HEALTH_MODULE,
  },
  {
    key: "education",
    labelKey: "modules.education.title",
    descriptionKey: "modules.education.description",
    icon: "school",
    color: "#06b6d4", // Cyan
    enabled: true,
    items: EDUCATION_MODULE,
  },
  {
    key: "police",
    labelKey: "modules.police.title",
    descriptionKey: "modules.police.description",
    icon: "local_police",
    color: "#1e3a8a", // Navy
    enabled: true,
    items: POLICE_MODULE,
  },
  {
    key: "environment",
    labelKey: "modules.environment.title",
    descriptionKey: "modules.environment.description",
    icon: "eco",
    color: "#22c55e", // Green
    enabled: true,
    items: ENVIRONMENT_MODULE,
  },
  {
    key: "analytics",
    labelKey: "modules.analytics.title",
    descriptionKey: "modules.analytics.description",
    icon: "insights",
    color: "#6366f1", // Indigo
    enabled: true,
    items: ANALYTICS_MODULE,
  },
  {
    key: "system-admin",
    labelKey: "modules.systemAdmin.title",
    descriptionKey: "modules.systemAdmin.description",
    icon: "settings",
    color: "#64748b", // Slate
    enabled: true,
    items: SYSTEM_ADMIN_MODULE,
  },
];

// Helper: Get module by key
export const getModuleByKey = (key: string): TopNavItem | undefined => {
  return TOP_NAV_ITEMS.find((item) => item.key === key);
};

// Helper: Get sidebar items for a module
export const getSidebarItems = (moduleKey: string): NavItem[] => {
  const module = getModuleByKey(moduleKey);
  return module?.items || [];
};

// Helper: Get module color
export const getModuleColor = (moduleKey: string): string => {
  const module = getModuleByKey(moduleKey);
  return module?.color || "#3b82f6";
};

// Helper: Get module icon
export const getModuleIcon = (moduleKey: string): string => {
  const module = getModuleByKey(moduleKey);
  return module?.icon || "dashboard";
};

// Helper: Get translation keys for a module
export const getModuleTranslationKeys = (
  moduleKey: string
): { title: string; description: string } => {
  return (
    MODULE_TRANSLATION_KEYS[moduleKey] || {
      title: moduleKey,
      description: moduleKey,
    }
  );
};
