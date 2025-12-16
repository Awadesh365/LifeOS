/**
 * CityOS Top Navigation Configuration
 * All 12 modules with their respective sidebar items
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
  label: string;
  labelHindi: string;
  icon: string;
  color: string;
  enabled: boolean;
  route?: string;
  items: NavItem[];
}

// =============================================================================
// TOP NAVIGATION ITEMS (12 Modules)
// =============================================================================
export const TOP_NAV_ITEMS: TopNavItem[] = [
  {
    key: "district-admin",
    label: "District",
    labelHindi: "जिला प्रशासन",
    icon: "account_balance",
    color: "#3b82f6", // Blue
    enabled: true,
    items: DISTRICT_ADMIN_MODULE,
  },
  {
    key: "state-admin",
    label: "State",
    labelHindi: "राज्य प्रशासन",
    icon: "domain",
    color: "#8b5cf6", // Violet
    enabled: true,
    items: STATE_ADMIN_MODULE,
  },
  {
    key: "citizen-services",
    label: "Citizen",
    labelHindi: "नागरिक सेवा",
    icon: "groups",
    color: "#10b981", // Emerald
    enabled: true,
    items: CITIZEN_SERVICES_MODULE,
  },
  {
    key: "dev-schemes",
    label: "Schemes",
    labelHindi: "विकास योजना",
    icon: "trending_up",
    color: "#f59e0b", // Amber
    enabled: true,
    items: DEV_SCHEMES_MODULE,
  },
  {
    key: "emergency",
    label: "Emergency",
    labelHindi: "आपातकाल",
    icon: "warning",
    color: "#ef4444", // Red
    enabled: true,
    items: EMERGENCY_MODULE,
  },
  {
    key: "revenue",
    label: "Revenue",
    labelHindi: "राजस्व भूमि",
    icon: "gavel",
    color: "#78716c", // Stone
    enabled: true,
    items: REVENUE_MODULE,
  },
  {
    key: "health",
    label: "Health",
    labelHindi: "स्वास्थ्य",
    icon: "local_hospital",
    color: "#ec4899", // Pink
    enabled: true,
    items: HEALTH_MODULE,
  },
  {
    key: "education",
    label: "Education",
    labelHindi: "शिक्षा",
    icon: "school",
    color: "#06b6d4", // Cyan
    enabled: true,
    items: EDUCATION_MODULE,
  },
  {
    key: "police",
    label: "Police",
    labelHindi: "पुलिस सुरक्षा",
    icon: "local_police",
    color: "#1e3a8a", // Navy
    enabled: true,
    items: POLICE_MODULE,
  },
  {
    key: "environment",
    label: "Environment",
    labelHindi: "पर्यावरण",
    icon: "eco",
    color: "#22c55e", // Green
    enabled: true,
    items: ENVIRONMENT_MODULE,
  },
  {
    key: "analytics",
    label: "Analytics",
    labelHindi: "विश्लेषण",
    icon: "insights",
    color: "#6366f1", // Indigo
    enabled: true,
    items: ANALYTICS_MODULE,
  },
  {
    key: "system-admin",
    label: "System",
    labelHindi: "व्यवस्था",
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
