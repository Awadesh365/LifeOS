import { NavItem } from "../../types/navigation";
import {
  DISTRICT_ADMIN_MODULE,
  CITIZEN_SERVICES_MODULE,
  STATE_ADMIN_MODULE,
  SYSTEM_ADMIN_MODULE,
  ANALYTICS_MODULE,
} from "./navigation";

// Define the Top-Level Navigation Items (The "Navbar" Items)
// Each of these will map to a Sidebar Module
export interface TopNavItem {
  key: string;
  label: string;
  enabled: boolean;
  route?: string; // If the top item is clickable itself
  items?: NavItem[]; // The items to show in Sidebar when this is active
}

export const TOP_NAV_ITEMS: TopNavItem[] = [
  {
    key: "district-admin",
    label: "Zila (District)",
    enabled: true,
    items: DISTRICT_ADMIN_MODULE,
  },
  {
    key: "citizen-services",
    label: "Nagrik (Citizen)",
    enabled: true,
    items: CITIZEN_SERVICES_MODULE,
  },
  {
    key: "state-admin",
    label: "Rajya (State)",
    enabled: true,
    items: STATE_ADMIN_MODULE,
  },
  {
    key: "analytics",
    label: "Vishleshan (Analytics)",
    enabled: true,
    items: ANALYTICS_MODULE,
  },
  {
    key: "system-admin",
    label: "System Admin",
    enabled: true,
    items: SYSTEM_ADMIN_MODULE,
  },
];
