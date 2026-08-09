/**
 * Navigation Configuration
 * Defines the navigation structure for the LifeOS application
 * Adapted for Indian Administrative Context (State & District Levels)
 */

import { NavItem } from "../../types/navigation";

// =============================================================================
// ROLES DEFINITION
// =============================================================================
export const ROLES = {
  STATE_ADMIN: "state_admin", // Chief Minister (CM), Chief Secretary, PMO
  DISTRICT_ADMIN: "district_admin", // District Magistrate (DM), Collector, Municipal Commissioner
  DEPARTMENT_HEAD: "dept_head", // SP (Police), CMO (Health), Chief Engineer
  FIELD_STAFF: "field_staff", // Constable, Doctor, Sanitation Worker
  CITIZEN: "citizen", // Nagrik
};

// =============================================================================
// MODULES
// =============================================================================

// 1. STATE ADMIN MODULE (Rajya Prashasan) - Super Admin View
// For Chief Minister, PMO, Chief Secretary
export const STATE_ADMIN_MODULE: NavItem[] = [
  {
    key: "state-dashboard",
    label: "Rajya Dashboard (State)",
    icon: "account_balance",
    route: "/state/dashboard",
    enabled: true,
  },
  {
    key: "district-monitoring",
    label: "Zila Nigrani (Districts)",
    icon: "map",
    enabled: true,
    items: [
      {
        key: "district-performance",
        label: "District Performance",
        icon: "analytics",
        route: "/state/districts/performance",
        enabled: true,
      },
      {
        key: "district-reports",
        label: "Monthly Reports",
        icon: "assessment",
        route: "/state/districts/reports",
        enabled: true,
      },
    ],
  },
  {
    key: "schemes-policies",
    label: "Yojana & Policies",
    icon: "policy",
    enabled: true,
    items: [
      {
        key: "central-schemes",
        label: "Central Schemes (PM)",
        icon: "flag",
        route: "/state/schemes/central",
        enabled: true,
      },
      {
        key: "state-schemes",
        label: "State Schemes (CM)",
        icon: "campaign",
        route: "/state/schemes/state",
        enabled: true,
      },
    ],
  },
  {
    key: "high-command-reports",
    label: "High Command Reports",
    icon: "summarize",
    route: "/state/reports",
    enabled: true,
  },
];

// 2. DISTRICT ADMIN MODULE (Zila Prashasan) - Tenant Admin View
// For District Magistrate (DM), Collector, Municipal Commissioner
export const DISTRICT_ADMIN_MODULE: NavItem[] = [
  {
    key: "district-dashboard",
    label: "Zila Dashboard (District)",
    icon: "dashboard",
    route: "/dashboard",
    enabled: true,
  },
  {
    key: "emergency-response",
    label: "Aapatkaleen (Emergency)",
    icon: "warning",
    enabled: true,
    items: [
      {
        key: "active-incidents",
        label: "Active Incidents",
        icon: "notifications_active",
        route: "emergency/incidents/active",
        enabled: true,
      },
      {
        key: "dispatch-queue",
        label: "Dispatch Queue",
        icon: "local_shipping",
        route: "emergency/dispatch",
        enabled: true,
      },
      {
        key: "resource-map",
        label: "Live Resource Map",
        icon: "map",
        route: "emergency/map",
        enabled: true,
      },
    ],
  },
  {
    key: "department-ops",
    label: "Vibhag (Departments)",
    icon: "business",
    enabled: true,
    items: [
      {
        key: "police-dept",
        label: "Police & Security",
        icon: "local_police",
        route: "ops/police",
        enabled: true,
      },
      {
        key: "health-dept",
        label: "Health & Medical",
        icon: "local_hospital",
        route: "ops/health",
        enabled: true,
      },
      {
        key: "fire-dept",
        label: "Fire & Safety",
        icon: "local_fire_department",
        route: "ops/fire",
        enabled: true,
      },
      {
        key: "public-works",
        label: "PWD & Utilities",
        icon: "engineering",
        route: "ops/public-works",
        enabled: true,
      },
    ],
  },
  {
    key: "grievance-redressal",
    label: "Jan Shikayat (Grievance)",
    icon: "support_agent",
    enabled: true,
    items: [
      {
        key: "citizen-reports",
        label: "Citizen Reports",
        icon: "report_problem",
        route: "grievance/reports",
        enabled: true,
      },
      {
        key: "ticket-status",
        label: "Nivaran Status",
        icon: "assignment",
        route: "grievance/tickets",
        enabled: true,
      },
    ],
  },
];

// 3. CITIZEN SERVICES MODULE (Nagrik Sewa)
// For Citizens and Front Desk Operators
export const CITIZEN_SERVICES_MODULE: NavItem[] = [
  {
    key: "services-overview",
    label: "Suvidha Overview",
    icon: "category",
    route: "/services/overview",
    enabled: true,
  },
  {
    key: "civic-services",
    label: "Nagar Nigam Sewa",
    icon: "location_city",
    enabled: true,
    items: [
      {
        key: "birth-death",
        label: "Janam-Mrityu (Birth/Death)",
        icon: "child_friendly",
        route: "services/registry",
        enabled: true,
      },
      {
        key: "utilities",
        label: "Bill Payment (Bijli/Pani)",
        icon: "water_drop",
        route: "services/utilities",
        enabled: true,
      },
      {
        key: "property-tax",
        label: "Sampatti Kar (Property Tax)",
        icon: "receipt_long",
        route: "services/tax",
        enabled: true,
      },
    ],
  },
];

// 4. ANALYTICS MODULE (Vishleshan)
// For Decision Makers (DM, CM, Planners)
export const ANALYTICS_MODULE: NavItem[] = [
  {
    key: "analytics-overview",
    label: "Vishleshan Dashboard",
    icon: "insights",
    route: "/analytics/overview",
    enabled: true,
  },
  {
    key: "crime-analysis",
    label: "Apradh (Crime)",
    icon: "policy",
    enabled: true,
    items: [
      {
        key: "hotspots",
        label: "Crime Hotspots",
        icon: "whatshot",
        route: "analytics/crime/hotspots",
        enabled: true,
      },
      {
        key: "trends",
        label: "Crime Trends",
        icon: "trending_up",
        route: "analytics/crime/trends",
        enabled: true,
      },
    ],
  },
  {
    key: "health-metrics",
    label: "Swasthya (Health)",
    icon: "monitor_heart",
    enabled: true,
    items: [
      {
        key: "disease-outbreaks",
        label: "Mahamari (Outbreaks)",
        icon: "coronavirus",
        route: "analytics/health/outbreaks",
        enabled: true,
      },
      {
        key: "hospital-capacity",
        label: "Hospital Beds",
        icon: "local_hotel",
        route: "analytics/health/capacity",
        enabled: true,
      },
    ],
  },
];

// 5. SYSTEM ADMIN MODULE (System Config)
// For IT Admin / Technical Staff
export const SYSTEM_ADMIN_MODULE: NavItem[] = [
  {
    key: "admin-overview",
    label: "System Status",
    icon: "dns",
    route: "/admin/status",
    enabled: true,
  },
  {
    key: "user-management",
    label: "User Management",
    icon: "manage_accounts",
    enabled: true,
    items: [
      {
        key: "staff-directory",
        label: "Staff Directory",
        icon: "badge",
        route: "admin/users/staff",
        enabled: true,
      },
      {
        key: "roles-permissions",
        label: "Roles & Permissions",
        icon: "security",
        route: "admin/users/roles",
        enabled: true,
      },
    ],
  },
  {
    key: "resource-catalog",
    label: "Resource Catalog",
    icon: "inventory_2",
    enabled: true,
    items: [
      {
        key: "manage-stations",
        label: "Thana/Stations",
        icon: "ev_station",
        route: "admin/resources/stations",
        enabled: true,
      },
      {
        key: "manage-hospitals",
        label: "Hospitals",
        icon: "local_hospital",
        route: "admin/resources/hospitals",
        enabled: true,
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: "settings_suggest",
    enabled: true,
    items: [
      {
        key: "routing-rules",
        label: "Routing Rules",
        icon: "alt_route",
        route: "admin/settings/routing",
        enabled: true,
      },
      {
        key: "tenant-config",
        label: "District/Tenant Config",
        icon: "domain",
        route: "admin/settings/tenant",
        enabled: true,
      },
    ],
  },
];

// Combine for backward compatibility or default view if needed
export const NAV_SIDEBAR_ITEMS: NavItem[] = [
  ...DISTRICT_ADMIN_MODULE,
  ...CITIZEN_SERVICES_MODULE,
  ...ANALYTICS_MODULE,
  ...SYSTEM_ADMIN_MODULE,
];

/**
 * Filter navigation items by permissions
 * This is a placeholder - implement your own RBAC logic here
 */
export const filterSidebarItemsByPermissions = (
  items: NavItem[]
): NavItem[] => {
  // TODO: Implement permission-based filtering
  // For now, return all enabled items
  return items.filter((item) => item.enabled);
};
