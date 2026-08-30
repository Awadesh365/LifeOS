export const lightColors = {
  background: '#F4F7F9',
  surface: '#FFFFFF',
  surfaceMuted: '#EDF2F5',
  ink: '#0B1220',
  inkMuted: '#657180',
  border: '#DDE5EA',
  primary: '#0F766E',
  primarySoft: '#D8F3EE',
  primaryContrast: '#FFFFFF',
  secondary: '#1E2530',
  secondarySoft: '#E8EBEF',
  secondaryContrast: '#FFFFFF',
  accent: '#D97706',
  accentSoft: '#FEF0D4',
  success: '#16815D',
  danger: '#C2413A',
  dangerSoft: '#FCE8E6',
  white: '#FFFFFF',
  tabBar: '#0B1220',
} as const;

export type ThemeColors = { [Key in keyof typeof lightColors]: string };

export const darkColors: ThemeColors = {
  background: '#0C111B',
  surface: '#141B27',
  surfaceMuted: '#1A2432',
  ink: '#F4F7FB',
  inkMuted: '#A9B5C5',
  border: '#2C394B',
  primary: '#5ED6C9',
  primarySoft: '#183A39',
  primaryContrast: '#0B1220',
  secondary: '#34465E',
  secondarySoft: '#222E3D',
  secondaryContrast: '#FFFFFF',
  accent: '#F0A84E',
  accentSoft: '#3B2B18',
  success: '#58C891',
  danger: '#F07171',
  dangerSoft: '#3D2023',
  white: '#FFFFFF',
  tabBar: '#080D15',
};

// Kept as the default palette for code that does not render UI.
export const colors = lightColors;

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
