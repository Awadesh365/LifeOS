import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/theme';
import { api } from '@/services/api';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
export interface BrandColors {
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextValue {
  colors: ThemeColors;
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  brandColors: BrandColors;
  setPreference: (preference: ThemePreference) => void;
  setBrandColors: (colors: Partial<BrandColors>) => void;
  resetBrandColors: () => void;
}

const STORAGE_KEY = 'lifeos-theme';
const BRAND_STORAGE_KEY = 'lifeos-brand-colors';
export const DEFAULT_BRAND_COLORS: BrandColors = {
  primaryColor: '#E55555',
  secondaryColor: '#1E2530',
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

const contrastText = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16);
  const luminance = (0.299 * ((value >> 16) & 255)) + (0.587 * ((value >> 8) & 255)) + (0.114 * (value & 255));
  return luminance > 165 ? '#111827' : '#FFFFFF';
};

const applyBrandColors = (colors: ThemeColors, brand: BrandColors): ThemeColors => ({
  ...colors,
  primary: brand.primaryColor,
  primarySoft: `${brand.primaryColor}22`,
  primaryContrast: contrastText(brand.primaryColor),
  secondary: brand.secondaryColor,
  secondarySoft: `${brand.secondaryColor}22`,
  secondaryContrast: contrastText(brand.secondaryColor),
  tabBar: brand.secondaryColor,
});

export function LifeOSThemeProvider({ children, syncEnabled = true }: PropsWithChildren<{ syncEnabled?: boolean }>) {
  const systemTheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [brandColors, setBrandColorsState] = useState<BrandColors>(DEFAULT_BRAND_COLORS);
  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    if (!syncEnabled) return;
    let active = true;
    void (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const storedBrand = await AsyncStorage.getItem(BRAND_STORAGE_KEY);
      const localPreference: ThemePreference =
        stored === 'system' || stored === 'light' || stored === 'dark' ? stored : 'system';
      let localBrand = DEFAULT_BRAND_COLORS;
      try {
        const parsed = JSON.parse(storedBrand ?? '{}') as Partial<BrandColors>;
        if (/^#[0-9a-f]{6}$/i.test(parsed.primaryColor ?? '') && /^#[0-9a-f]{6}$/i.test(parsed.secondaryColor ?? '')) {
          localBrand = parsed as BrandColors;
        }
      } catch {
        // Keep defaults when a local preference is malformed.
      }
      try {
        const remote = await api.appearancePreference();
        const hydratedPreference = remote.theme ?? localPreference;
        const hydratedBrand = { primaryColor: remote.primaryColor, secondaryColor: remote.secondaryColor };
        if (!active) return;
        setPreferenceState(hydratedPreference);
        setBrandColorsState(hydratedBrand);
        await AsyncStorage.setItem(STORAGE_KEY, hydratedPreference);
        await AsyncStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(hydratedBrand));
      } catch {
        if (!active) return;
        setPreferenceState(localPreference);
        setBrandColorsState(localBrand);
      }
    })();
    return () => { active = false; };
  }, [syncEnabled]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
    if (syncEnabled) void api.saveAppearancePreference({ theme: next }).catch(() => undefined);
  }, [syncEnabled]);

  const setBrandColors = useCallback((next: Partial<BrandColors>) => {
    setBrandColorsState((current) => {
      const updated = { ...current, ...next };
      void AsyncStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(updated));
      if (syncEnabled) void api.saveAppearancePreference(updated).catch(() => undefined);
      return updated;
    });
  }, [syncEnabled]);

  const resetBrandColors = useCallback(() => setBrandColors(DEFAULT_BRAND_COLORS), [setBrandColors]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: applyBrandColors(resolvedTheme === 'dark' ? darkColors : lightColors, brandColors),
      preference,
      resolvedTheme,
      brandColors,
      setPreference,
      setBrandColors,
      resetBrandColors,
    }),
    [preference, resolvedTheme, brandColors, resetBrandColors, setBrandColors, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useLifeOSTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useLifeOSTheme must be used within LifeOSThemeProvider');
  return value;
}
