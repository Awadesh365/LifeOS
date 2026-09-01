import type { ComponentProps } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface LifeModule {
  slug: string;
  title: string;
  description: string;
  endpoint: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  primaryKeys: string[];
  secondaryKeys: string[];
}

export const modules: LifeModule[] = [
  { slug: 'learning', title: 'Learning', description: 'Skills and study paths', endpoint: '/learning', icon: 'school-outline', primaryKeys: ['title', 'topic'], secondaryKeys: ['status', 'date'] },
  { slug: 'jobs', title: 'Job search', description: 'Applications and next moves', endpoint: '/jobs', icon: 'briefcase-search-outline', primaryKeys: ['role', 'company'], secondaryKeys: ['company', 'status', 'date'] },
  { slug: 'projects', title: 'Projects', description: 'Active work and next actions', endpoint: '/projects', icon: 'folder-outline', primaryKeys: ['name'], secondaryKeys: ['status', 'nextAction', 'targetDate'] },
  { slug: 'articles', title: 'Articles', description: 'Your reading library', endpoint: '/articles', icon: 'book-open-page-variant-outline', primaryKeys: ['title'], secondaryKeys: ['category', 'summary'] },
  { slug: 'networking', title: 'Relationships', description: 'People who matter', endpoint: '/contacts', icon: 'account-group-outline', primaryKeys: ['name'], secondaryKeys: ['type', 'priority', 'nextFollowUpDate'] },
  { slug: 'career', title: 'Career', description: 'Roles and work health', endpoint: '/career', icon: 'chart-timeline-variant', primaryKeys: ['roleTitle', 'companyName'], secondaryKeys: ['companyName', 'stayLeavePlan', 'targetExitDate'] },
  { slug: 'future-plans', title: 'Future plans', description: 'Plans beyond today', endpoint: '/future-plans', icon: 'telescope', primaryKeys: ['title'], secondaryKeys: ['planType', 'status', 'targetDate'] },
  { slug: 'diet', title: 'Nutrition', description: 'Meals and nourishment', endpoint: '/diet/logs', icon: 'food-apple-outline', primaryKeys: ['items', 'mealType'], secondaryKeys: ['mealType', 'protein', 'calories', 'date'] },
  { slug: 'training', title: 'Training', description: 'Exercises and progression', endpoint: '/training/exercises', icon: 'dumbbell', primaryKeys: ['name'], secondaryKeys: ['muscleGroup', 'equipment'] },
];

export function findModule(slug: string | string[] | undefined) {
  const normalized = Array.isArray(slug) ? slug[0] : slug;
  return modules.find((item) => item.slug === normalized);
}
