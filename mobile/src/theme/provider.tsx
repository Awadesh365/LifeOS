import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/theme';
import { api } from '@/services/api';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

interface ThemeContextValue {
  colors: ThemeColors;
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = 'lifeos-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function LifeOSThemeProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    let active = true;
    void (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const localPreference: ThemePreference =
        stored === 'system' || stored === 'light' || stored === 'dark' ? stored : 'system';
      try {
        const remote = await api.themePreference();
        const hydratedPreference = remote.theme ?? localPreference;
        if (!active) return;
        setPreferenceState(hydratedPreference);
        Appearance.setColorScheme(hydratedPreference === 'system' ? 'unspecified' : hydratedPreference);
        await AsyncStorage.setItem(STORAGE_KEY, hydratedPreference);
        if (remote.theme === null) await api.saveThemePreference(hydratedPreference);
      } catch {
        if (!active) return;
        setPreferenceState(localPreference);
        Appearance.setColorScheme(localPreference === 'system' ? 'unspecified' : localPreference);
      }
    })();
    return () => { active = false; };
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    Appearance.setColorScheme(next === 'system' ? 'unspecified' : next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
    void api.saveThemePreference(next).catch(() => undefined);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: resolvedTheme === 'dark' ? darkColors : lightColors,
      preference,
      resolvedTheme,
      setPreference,
    }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useLifeOSTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useLifeOSTheme must be used within LifeOSThemeProvider');
  return value;
}
