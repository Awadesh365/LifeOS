import { createTheme, ThemeOptions } from "@mui/material/styles";

// Design system colour palette (matches CSS custom properties)
export const palette = {
  primary: "#E55555",       // Crimson Red  hsl(0 88% 46%)
  primaryDark: "#C13838",   // hsl(0 80% 38%)
  navy: "#1E2530",          // Brand secondary hsl(215 31% 13%)
  navyElevated: "#252E3C",  // hsl(215 28% 18%)

  background: "#FCFCFD",
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

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: palette.primary,
      dark: palette.primaryDark,
      contrastText: "#ffffff",
    },
    secondary: {
      main: palette.navy,
      dark: palette.navyElevated,
      contrastText: "#ffffff",
    },
    background: {
      default: palette.background,
      paper: palette.surface,
    },
    text: {
      primary: palette.foreground,
      secondary: palette.muted,
      disabled: palette.muted2,
    },
    divider: palette.border,
    error:   { main: palette.red },
    success: { main: palette.green },
    warning: { main: palette.yellow },
    info:    { main: palette.blue },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem",  letterSpacing: "-0.05em" },
    h2: { fontWeight: 700, fontSize: "2rem",    letterSpacing: "-0.04em" },
    h3: { fontWeight: 600, fontSize: "1.75rem", letterSpacing: "-0.03em" },
    h4: { fontWeight: 600, fontSize: "1.5rem",  letterSpacing: "-0.03em" },
    h5: { fontWeight: 600, fontSize: "1.125rem",letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, fontSize: "1rem",    letterSpacing: "-0.01em" },
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
        body: {
          fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 18px",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "-0.01em",
          transition: "all 0.18s ease",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            filter: "brightness(0.95)",
          },
        },
        contained: {
          "&:hover": { transform: "none" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${palette.border}`,
          boxShadow: "0 4px 20px -8px rgba(16,24,40,0.08)",
          borderRadius: "16px",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 8px 28px -8px rgba(16,24,40,0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: "12px",
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
          backgroundColor: palette.navy,
          fontSize: "0.75rem",
          fontWeight: 500,
          borderRadius: "8px",
          padding: "6px 10px",
        },
        arrow: {
          color: palette.navy,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          height: 6,
          backgroundColor: palette.border,
        },
        bar: {
          borderRadius: "9999px",
        },
      },
    },
  },
  gradients,
  palette_ext: palette,
};

export const premiumTheme = createTheme(themeOptions);
