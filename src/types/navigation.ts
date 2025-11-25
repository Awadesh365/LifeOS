/**
 * Navigation Types
 * Type definitions for navigation items used in Navbar and Sidebar
 */

export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  route?: string;
  enabled: boolean;
  items?: NavItem[];
}

export interface NavigationConfig {
  items: NavItem[];
}
