import { createTheme, ThemeOptions } from "@mui/material/styles";

// Premium gradient definitions
export const gradients = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  accent: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  success: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  info: "linear-gradient(135deg, #5E72E4 0%, #825EE4 100%)",
  warning: "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
};

// Glassmorphism styles
export const glassmorphism = {
  light: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  dark: {
    background: "rgba(15, 15, 30, 0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.2)",
  },
};

declare module "@mui/material/styles" {
  interface Theme {
    gradients: typeof gradients;
    glassmorphism: typeof glassmorphism;
  }
  interface ThemeOptions {
    gradients?: typeof gradients;
    glassmorphism?: typeof glassmorphism;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#667eea",
      light: "#8b9cff",
      dark: "#4c5fd9",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f093fb",
      light: "#ffc4ff",
      dark: "#c764c8",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
  },
  gradients,
  glassmorphism,
};

export const premiumTheme = createTheme(themeOptions);
