/**
 * Navigation Configuration
 * Defines the navigation structure for the CityOS application
 */

/**
 * Navigation Configuration
 * Defines the navigation structure for the CityOS application
 * Based on PRD v1.0.0 - Unified Platform for City Management
 */

import { NavItem } from '../../types/navigation';

// Level 4: City Magistrate/Admin & Level 3: City Operator View
export const COMMAND_CENTER_MODULE: NavItem[] = [
  {
    key: 'dashboard',
    label: 'City Overview',
    icon: 'dashboard',
    route: '/dashboard',
    enabled: true,
  },
  {
    key: 'emergency-response',
    label: 'Emergency Response',
    icon: 'warning', // or 'emergency'
    enabled: true,
    items: [
      {
        key: 'active-incidents',
        label: 'Active Incidents',
        icon: 'notifications_active',
        route: 'emergency/incidents/active',
        enabled: true,
      },
      {
        key: 'dispatch-queue',
        label: 'Dispatch Queue',
        icon: 'local_shipping', // or 'ambulance'
        route: 'emergency/dispatch',
        enabled: true,
      },
      {
        key: 'resource-map',
        label: 'Live Resource Map',
        icon: 'map',
        route: 'emergency/map',
        enabled: true,
      },
    ],
  },
  {
    key: 'department-ops',
    label: 'Department Ops',
    icon: 'business',
    enabled: true,
    items: [
      {
        key: 'police-dept',
        label: 'Police & Security',
        icon: 'local_police',
        route: 'ops/police',
        enabled: true,
      },
      {
        key: 'health-dept',
        label: 'Health & Medical',
        icon: 'local_hospital',
        route: 'ops/health',
        enabled: true,
      },
      {
        key: 'fire-dept',
        label: 'Fire & Safety',
        icon: 'local_fire_department',
        route: 'ops/fire',
        enabled: true,
      },
      {
        key: 'public-works',
        label: 'Public Works',
        icon: 'engineering',
        route: 'ops/public-works',
        enabled: true,
      },
    ],
  },
  {
    key: 'grievance-redressal',
    label: 'Grievance Redressal',
    icon: 'support_agent',
    enabled: true,
    items: [
      {
        key: 'citizen-reports',
        label: 'Citizen Reports',
        icon: 'report_problem',
        route: 'grievance/reports',
        enabled: true,
      },
      {
        key: 'ticket-status',
        label: 'Ticket Status',
        icon: 'assignment',
        route: 'grievance/tickets',
        enabled: true,
      },
    ],
  },
];

// Level 1: Citizen Services (Management View for Admins)
export const CITY_SERVICES_MODULE: NavItem[] = [
  {
    key: 'services-overview',
    label: 'Services Overview',
    icon: 'category',
    route: '/services/overview',
    enabled: true,
  },
  {
    key: 'civic-services',
    label: 'Civic Services',
    icon: 'location_city',
    enabled: true,
    items: [
      {
        key: 'birth-death',
        label: 'Birth & Death Reg',
        icon: 'child_friendly',
        route: 'services/registry',
        enabled: true,
      },
      {
        key: 'utilities',
        label: 'Utilities & Billing',
        icon: 'water_drop',
        route: 'services/utilities',
        enabled: true,
      },
      {
        key: 'property-tax',
        label: 'Property Tax',
        icon: 'receipt_long',
        route: 'services/tax',
        enabled: true,
      },
    ],
  },
];

// Analytics & Insights for Decision Makers
export const ANALYTICS_MODULE: NavItem[] = [
  {
    key: 'analytics-overview',
    label: 'Insights Dashboard',
    icon: 'insights',
    route: '/analytics/overview',
    enabled: true,
  },
  {
    key: 'crime-analysis',
    label: 'Crime Analysis',
    icon: 'policy',
    enabled: true,
    items: [
      {
        key: 'hotspots',
        label: 'Crime Hotspots',
        icon: 'whatshot',
        route: 'analytics/crime/hotspots',
        enabled: true,
      },
      {
        key: 'trends',
        label: 'Crime Trends',
        icon: 'trending_up',
        route: 'analytics/crime/trends',
        enabled: true,
      },
    ],
  },
  {
    key: 'health-metrics',
    label: 'Health Metrics',
    icon: 'monitor_heart',
    enabled: true,
    items: [
      {
        key: 'disease-outbreaks',
        label: 'Disease Outbreaks',
        icon: 'coronavirus',
        route: 'analytics/health/outbreaks',
        enabled: true,
      },
      {
        key: 'hospital-capacity',
        label: 'Hospital Capacity',
        icon: 'local_hotel',
        route: 'analytics/health/capacity',
        enabled: true,
      },
    ],
  },
];

// Administration & System Config
export const ADMIN_MODULE: NavItem[] = [
  {
    key: 'admin-overview',
    label: 'System Status',
    icon: 'dns',
    route: '/admin/status',
    enabled: true,
  },
  {
    key: 'user-management',
    label: 'User Management',
    icon: 'manage_accounts',
    enabled: true,
    items: [
      {
        key: 'staff-directory',
        label: 'Staff Directory',
        icon: 'badge',
        route: 'admin/users/staff',
        enabled: true,
      },
      {
        key: 'roles-permissions',
        label: 'Roles & Permissions',
        icon: 'security',
        route: 'admin/users/roles',
        enabled: true,
      },
    ],
  },
  {
    key: 'resource-catalog',
    label: 'Resource Catalog',
    icon: 'inventory_2',
    enabled: true,
    items: [
      {
        key: 'manage-stations',
        label: 'Manage Stations',
        icon: 'ev_station',
        route: 'admin/resources/stations',
        enabled: true,
      },
      {
        key: 'manage-hospitals',
        label: 'Manage Hospitals',
        icon: 'local_hospital',
        route: 'admin/resources/hospitals',
        enabled: true,
      },
    ],
  },
  {
    key: 'settings',
    label: 'System Settings',
    icon: 'settings_suggest',
    enabled: true,
    items: [
      {
        key: 'routing-rules',
        label: 'Routing Rules',
        icon: 'alt_route',
        route: 'admin/settings/routing',
        enabled: true,
      },
      {
        key: 'tenant-config',
        label: 'Tenant Config',
        icon: 'domain',
        route: 'admin/settings/tenant',
        enabled: true,
      },
    ],
  },
];

// Combine for backward compatibility or default view if needed
export const NAV_SIDEBAR_ITEMS: NavItem[] = [
  ...COMMAND_CENTER_MODULE,
  ...CITY_SERVICES_MODULE,
  ...ANALYTICS_MODULE,
  ...ADMIN_MODULE
];

/**
 * Filter navigation items by permissions
 * This is a placeholder - implement your own RBAC logic here
 */
export const filterSidebarItemsByPermissions = (items: NavItem[]): NavItem[] => {
  // TODO: Implement permission-based filtering
  // For now, return all enabled items
  return items.filter(item => item.enabled);
};
