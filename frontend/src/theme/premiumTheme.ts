import { createTheme, ThemeOptions } from "@mui/material/styles";

// Design system colour palette (matches CSS custom properties)
export const palette = {
  primary: "#E55555",       // Crimson Red  hsl(0 88% 46%)
  primaryDark: "#C13838",   // hsl(0 80% 38%)
  navy: "#1E2530",          // Brand secondary hsl(215 31% 13%)
  navyElevated: "#252E3C",  // hsl(215 28% 18%)

  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F6F9",
  surfaceElevated: "#EDF0F5",

  foreground: "#111827",
  muted: "#667085",
  muted2: "#98A2B3",
  border: "#D8E0EA",

  blue: "#156BBA",
  green: "#027900",
  yellow: "#C17400",
  purple: "#7215BA",
  teal: "#239CE8",
  red: "#E55555",
};

export const darkPalette: typeof palette = {
  primary: "#F06A6A",
  primaryDark: "#E55555",
  navy: "#E8EDF5",
  navyElevated: "#D8E0EA",
  background: "#0C111B",
  surface: "#141B27",
  surfaceAlt: "#1A2331",
  surfaceElevated: "#222D3D",
  foreground: "#F4F7FB",
  muted: "#A9B5C5",
  muted2: "#768397",
  border: "#2C394B",
  blue: "#69B7FF",
  green: "#58C891",
  yellow: "#F0B45B",
  purple: "#B996FF",
  teal: "#62C6F5",
  red: "#F06A6A",
};

export const gradients = {
  primary: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`,
  navy: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.navyElevated} 100%)`,
  surface: "linear-gradient(180deg, #ffffff 0%, #f4f6f9 100%)",
  card: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)",
};

declare module "@mui/material/styles" {
  interface Theme {
    gradients: typeof gradients;
    palette_ext: typeof palette;
  }
  interface ThemeOptions {
    gradients?: typeof gradients;
    palette_ext?: typeof palette;
  }
}

const createThemeOptions = (mode: "light" | "dark"): ThemeOptions => {
  const activePalette = mode === "dark" ? darkPalette : palette;
  const activeGradients = {
    primary: `linear-gradient(135deg, ${activePalette.primary} 0%, ${activePalette.primaryDark} 100%)`,
    navy: `linear-gradient(135deg, ${activePalette.navy} 0%, ${activePalette.navyElevated} 100%)`,
    surface: `linear-gradient(180deg, ${activePalette.surface} 0%, ${activePalette.surfaceAlt} 100%)`,
    card: `linear-gradient(180deg, ${activePalette.surface} 0%, ${activePalette.surfaceAlt} 100%)`,
  };

  return {
  palette: {
    mode,
    primary: {
      main: activePalette.primary,
      dark: activePalette.primaryDark,
      contrastText: "#ffffff",
    },
    secondary: {
      main: activePalette.navy,
      dark: activePalette.navyElevated,
      contrastText: mode === "dark" ? "#111827" : "#ffffff",
    },
    background: {
      default: activePalette.background,
      paper: activePalette.surface,
    },
    text: {
      primary: activePalette.foreground,
      secondary: activePalette.muted,
      disabled: activePalette.muted2,
    },
    divider: activePalette.border,
    error:   { main: activePalette.red },
    success: { main: activePalette.green },
    warning: { main: activePalette.yellow },
    info:    { main: activePalette.blue },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
    h1: { fontWeight: 750, fontSize: "2.5rem",  letterSpacing: "-0.05em" },
    h2: { fontWeight: 750, fontSize: "2rem",    letterSpacing: "-0.04em" },
    h3: { fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.035em" },
    h4: { fontWeight: 700, fontSize: "1.5rem",  letterSpacing: "-0.03em" },
    h5: { fontWeight: 700, fontSize: "1.125rem",letterSpacing: "-0.02em" },
    h6: { fontWeight: 700, fontSize: "1rem",    letterSpacing: "-0.015em" },
    subtitle1: { fontWeight: 600, fontSize: "0.9375rem" },
    subtitle2: { fontWeight: 600, fontSize: "0.875rem" },
    body1:     { fontSize: "0.9375rem", lineHeight: 1.6 },
    body2:     { fontSize: "0.875rem",  lineHeight: 1.6 },
    caption:   { fontSize: "0.75rem",   fontWeight: 500 },
    button:    { textTransform: "none", fontWeight: 600, letterSpacing: "-0.01em" },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(16,24,40,0.05)",
    "0 4px 8px -2px rgba(16,24,40,0.08), 0 2px 4px -2px rgba(16,24,40,0.04)",
    "0 8px 16px -4px rgba(16,24,40,0.08), 0 4px 8px -4px rgba(16,24,40,0.04)",
    "0 12px 24px -6px rgba(16,24,40,0.1), 0 6px 12px -6px rgba(16,24,40,0.05)",
    "0 16px 32px -8px rgba(16,24,40,0.1), 0 8px 16px -8px rgba(16,24,40,0.05)",
    "0 20px 40px -10px rgba(16,24,40,0.12), 0 10px 20px -10px rgba(16,24,40,0.06)",
    "0 24px 48px -12px rgba(16,24,40,0.14)",
    "0 28px 56px -14px rgba(16,24,40,0.14)",
    "0 32px 64px -16px rgba(16,24,40,0.16)",
    "0 36px 72px -18px rgba(16,24,40,0.18)",
    "0 40px 80px -20px rgba(16,24,40,0.18)",
    "0 44px 88px -22px rgba(16,24,40,0.2)",
    "0 48px 96px -24px rgba(16,24,40,0.2)",
    "0 52px 104px -26px rgba(16,24,40,0.22)",
    "0 56px 112px -28px rgba(16,24,40,0.22)",
    "0 60px 120px -30px rgba(16,24,40,0.24)",
    "0 64px 128px -32px rgba(16,24,40,0.24)",
    "0 68px 136px -34px rgba(16,24,40,0.24)",
    "0 72px 144px -36px rgba(16,24,40,0.26)",
    "0 76px 152px -38px rgba(16,24,40,0.26)",
    "0 80px 160px -40px rgba(16,24,40,0.28)",
    "0 84px 168px -42px rgba(16,24,40,0.28)",
    "0 88px 176px -44px rgba(16,24,40,0.3)",
    "0 92px 184px -46px rgba(16,24,40,0.3)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: activePalette.background,
        },
        body: {
          fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
          backgroundColor: activePalette.background,
          color: activePalette.foreground,
        },
        "::selection": {
          backgroundColor: "rgba(229, 85, 85, 0.18)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          minHeight: 42,
          padding: "9px 18px",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "-0.01em",
          transition: "all 0.18s ease",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            filter: "brightness(0.97)",
          },
          "&:focus-visible": {
            outline: `3px solid rgba(229, 85, 85, 0.2)`,
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: "0 8px 18px -12px rgba(193, 56, 56, 0.8)",
          "&:hover": { transform: "translateY(-1px)" },
        },
        outlined: {
          borderColor: activePalette.border,
          backgroundColor: activePalette.surface,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${activePalette.border}`,
          boxShadow: "0 14px 32px -28px rgba(16,24,40,0.32)",
          borderRadius: "16px",
          overflow: "hidden",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 22,
          "&:last-child": { paddingBottom: 22 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: "16px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 10,
          backgroundColor: activePalette.surface,
          transition: "box-shadow 0.18s ease, background-color 0.18s ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B7C2D0",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(229, 85, 85, 0.1)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
        },
        notchedOutline: {
          borderColor: activePalette.border,
        },
        input: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: activePalette.muted,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid currentColor",
          alignItems: "center",
        },
        standardError: {
          color: "#9F2D2D",
          backgroundColor: "#FFF4F3",
          borderColor: "#F6CECB",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&:focus-visible": {
            outline: `3px solid rgba(229, 85, 85, 0.2)`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 2, borderRadius: 999 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          padding: "10px 16px",
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: activePalette.muted,
          backgroundColor: activePalette.surfaceAlt,
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        },
        root: {
          borderColor: "#E8EDF3",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.72rem",
          letterSpacing: "0.01em",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: activePalette.navy,
          color: mode === "dark" ? "#111827" : "#ffffff",
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: "8px",
          padding: "6px 10px",
        },
        arrow: {
          color: activePalette.navy,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          height: 6,
          backgroundColor: activePalette.border,
        },
        bar: {
          borderRadius: "9999px",
        },
      },
    },
  },
  gradients: activeGradients,
  palette_ext: activePalette,
  };
};

export const createPremiumTheme = (mode: "light" | "dark") =>
  createTheme(createThemeOptions(mode));

export const premiumTheme = createPremiumTheme("light");
