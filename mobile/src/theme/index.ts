export const colors = {
  background: '#F4F7F9',
  surface: '#FFFFFF',
  surfaceMuted: '#EDF2F5',
  ink: '#0B1220',
  inkMuted: '#657180',
  border: '#DDE5EA',
  primary: '#0F766E',
  primarySoft: '#D8F3EE',
  accent: '#D97706',
  accentSoft: '#FEF0D4',
  success: '#16815D',
  danger: '#C2413A',
  dangerSoft: '#FCE8E6',
  white: '#FFFFFF',
  tabBar: '#0B1220',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#07131F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;
