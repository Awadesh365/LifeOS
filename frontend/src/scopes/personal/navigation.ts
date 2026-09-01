export interface PersonalNavItem {
  path: string;
  icon: string;
  label: string;
}

export interface PersonalNavGroup {
  section: string;
  items: PersonalNavItem[];
}

/**
 * The single source of truth for workspace navigation. Keep the sections based
 * on how a person looks for a task, rather than on the underlying data model.
 */
export const PERSONAL_NAV_GROUPS: PersonalNavGroup[] = [
  {
    section: "Overview",
    items: [{ path: "/", icon: "space_dashboard", label: "Dashboard" }],
  },
  {
    section: "Daily",
    items: [
      { path: "/habits", icon: "task_alt", label: "Daily Tracker" },
      { path: "/routine", icon: "schedule", label: "My Routine" },
    ],
  },
  {
    section: "Health & Nutrition",
    items: [
      { path: "/health", icon: "favorite", label: "Health" },
      { path: "/diet", icon: "restaurant", label: "Diet & Nutrition" },
      { path: "/training", icon: "exercise", label: "Gym & Training" },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        path: "/maintenance",
        icon: "home_repair_service",
        label: "Maintenance",
      },
    ],
  },
  {
    section: "Plans & Growth",
    items: [
      { path: "/goals", icon: "flag", label: "Goals & Dreams" },
      { path: "/future-plans", icon: "auto_awesome", label: "Future Plans" },
      { path: "/projects", icon: "rocket_launch", label: "All Projects" },
      { path: "/learning", icon: "menu_book", label: "Learning Paths" },
    ],
  },
  {
    section: "Career & People",
    items: [
      { path: "/career", icon: "trending_up", label: "Career Development" },
      { path: "/jobs", icon: "work", label: "Job Tracker" },
      { path: "/networking", icon: "handshake", label: "Networking" },
    ],
  },
  {
    section: "Finance",
    items: [
      {
        path: "/money",
        icon: "account_balance_wallet",
        label: "Money",
      },
    ],
  },
  {
    section: "Ideas & Direction",
    items: [
      { path: "/articles", icon: "history_edu", label: "The Manifesto" },
      { path: "/philosophy", icon: "psychology", label: "Core Philosophy" },
    ],
  },
  {
    section: "Settings",
    items: [
      { path: "/settings/appearance", icon: "palette", label: "Appearance" },
    ],
  },
];

export const PERSONAL_NAV_ITEMS = PERSONAL_NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, section: group.section })),
);

export function getPersonalNavItem(pathname: string) {
  const workspacePath = pathname.replace(/^\/app/, "") || "/";

  return PERSONAL_NAV_ITEMS.find((item) =>
    item.path === "/"
      ? workspacePath === "/"
      : workspacePath === item.path ||
        workspacePath.startsWith(`${item.path}/`),
  );
}
