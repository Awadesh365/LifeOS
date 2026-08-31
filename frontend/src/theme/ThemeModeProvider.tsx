import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createPremiumTheme } from './premiumTheme';
import { DEFAULT_BRAND_COLORS } from './brandColors';
import { loadAppearancePreference, saveAppearancePreference } from './themePreferenceApi';

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = Exclude<ThemePreference, "system">;
export interface BrandColors {
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeModeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  brandColors: BrandColors;
  setPreference: (preference: ThemePreference) => void;
  setBrandColors: (colors: Partial<BrandColors>) => void;
  resetBrandColors: () => void;
}

const STORAGE_KEY = "lifeos-theme";
const BRAND_STORAGE_KEY = 'lifeos-brand-colors';
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const readPreference = (): ThemePreference => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
};

const readBrandColors = (): BrandColors => {
  try {
    const stored = JSON.parse(localStorage.getItem(BRAND_STORAGE_KEY) ?? '{}') as Partial<BrandColors>;
    return {
      primaryColor: /^#[0-9a-f]{6}$/i.test(stored.primaryColor ?? '') ? stored.primaryColor! : DEFAULT_BRAND_COLORS.primaryColor,
      secondaryColor: /^#[0-9a-f]{6}$/i.test(stored.secondaryColor ?? '') ? stored.secondaryColor! : DEFAULT_BRAND_COLORS.secondaryColor,
    };
  } catch {
    return { ...DEFAULT_BRAND_COLORS };
  }
};

export function ThemeModeProvider({ children, syncEnabled = true }: PropsWithChildren<{ syncEnabled?: boolean }>) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);
  const [brandColors, setBrandColorsState] = useState<BrandColors>(readBrandColors);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
  const resolvedTheme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!syncEnabled) return;
    let active = true;
    void loadAppearancePreference()
      .then((remotePreference) => {
        if (!active) return;
        localStorage.setItem(STORAGE_KEY, remotePreference.theme);
        localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(remotePreference));
        setPreferenceState(remotePreference.theme);
        setBrandColorsState({
          primaryColor: remotePreference.primaryColor,
          secondaryColor: remotePreference.secondaryColor,
        });
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [syncEnabled]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, next);
    setPreferenceState(next);
    if (syncEnabled) void saveAppearancePreference({ theme: next }).catch(() => undefined);
  }, [syncEnabled]);

  const setBrandColors = useCallback((next: Partial<BrandColors>) => {
    setBrandColorsState((current) => {
      const updated = { ...current, ...next };
      localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(updated));
      if (syncEnabled) void saveAppearancePreference(updated).catch(() => undefined);
      return updated;
    });
  }, [syncEnabled]);

  const resetBrandColors = useCallback(() => setBrandColors({ ...DEFAULT_BRAND_COLORS }), [setBrandColors]);

  const contextValue = useMemo(
    () => ({ preference, resolvedTheme, brandColors, setPreference, setBrandColors, resetBrandColors }),
    [preference, resolvedTheme, brandColors, resetBrandColors, setBrandColors, setPreference],
  );
  const theme = useMemo(() => createPremiumTheme(resolvedTheme, brandColors), [resolvedTheme, brandColors]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const value = useContext(ThemeModeContext);
  if (!value) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return value;
}
