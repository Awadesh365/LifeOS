/**
 * Navigation Configuration
 * Defines the navigation structure for the CityOS application
 */

import { NavItem } from '../../types/navigation';

export const NAV_SIDEBAR_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    enabled: true,
  },
  {
    key: 'station-management',
    label: 'Station Management',
    icon: 'ev_station',
    enabled: true,
    items: [
      {
        key: 'stations',
        label: 'Stations',
        icon: 'list',
        enabled: true,
        items: [
          {
            key: 'all-stations',
            label: 'All Stations',
            icon: 'view_list',
            route: 'station-management/stations/all',
            enabled: true,
          },
          {
            key: 'add-station',
            label: 'Add Station',
            icon: 'add_circle',
            route: 'station-management/stations/add',
            enabled: true,
          },
        ],
      },
    ],
  },
  {
    key: 'user-management',
    label: 'User Management',
    icon: 'group',
    enabled: true,
    items: [
      {
        key: 'users',
        label: 'Users',
        icon: 'people',
        enabled: true,
        items: [
          {
            key: 'all-users',
            label: 'All Users',
            icon: 'view_list',
            route: 'user-management/users/all',
            enabled: true,
          },
          {
            key: 'add-user',
            label: 'Add User',
            icon: 'person_add',
            route: 'user-management/users/add',
            enabled: true,
          },
          {
            key: 'roles',
            label: 'Roles & Permissions',
            icon: 'admin_panel_settings',
            route: 'user-management/users/roles',
            enabled: true,
          },
        ],
      },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: 'analytics',
    enabled: true,
    items: [
      {
        key: 'reports',
        label: 'Reports',
        icon: 'assessment',
        enabled: true,
        items: [
          {
            key: 'usage-reports',
            label: 'Usage Reports',
            icon: 'bar_chart',
            route: 'analytics/reports/usage',
            enabled: true,
          },
          {
            key: 'revenue-reports',
            label: 'Revenue Reports',
            icon: 'attach_money',
            route: 'analytics/reports/revenue',
            enabled: true,
          },
        ],
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'settings',
    enabled: true,
    items: [
      {
        key: 'account-settings',
        label: 'Account Settings',
        icon: 'account_circle',
        enabled: true,
        items: [
          {
            key: 'profile',
            label: 'Profile',
            icon: 'person',
            route: 'settings/account/profile',
            enabled: true,
          },
          {
            key: 'security',
            label: 'Security',
            icon: 'security',
            route: 'settings/account/security',
            enabled: true,
          },
        ],
      },
    ],
  },
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
