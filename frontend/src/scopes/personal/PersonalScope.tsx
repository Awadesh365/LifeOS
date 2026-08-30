import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Routine from "./pages/Routine";
import Learning from "./pages/Learning";
import Jobs from "./pages/Jobs";
import Goals from "./pages/Goals";
import Philosophy from "./pages/Philosophy";
import Articles from "./pages/Articles";
import Projects from "./pages/Projects";
import Health from "./pages/Health";
import Wealth from "./pages/Wealth";
import Debts from "./pages/Debts";
import Funds from "./pages/Funds";
import Networking from "./pages/Networking";
import Career from "./pages/Career";
import FuturePlans from "./pages/FuturePlans";
import NutritionPortal from "./nutrition/NutritionPortal";
import Training from "./pages/Training";
import Appearance from "./pages/Appearance";
import "./personal.css";
import { getPersonalNavItem } from "./navigation";
import { useThemeMode } from "../../theme/ThemeModeProvider";
import { contrastText, hexToRgba, shadeHex } from "../../theme/brandColors";

const usePersonalLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((currentValue: T) => T)) => {
    setStoredValue((currentValue) => {
      const valueToStore =
        value instanceof Function ? value(currentValue) : value;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      return valueToStore;
    });
  };

  return [storedValue, setValue] as const;
};

const PersonalScope = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersonalLocalStorage(
    "sidebar-collapsed",
    false,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentNavItem = getPersonalNavItem(location.pathname);
  const { resolvedTheme, brandColors } = useThemeMode();

  useEffect(() => {
    document.title = "LifeOS — Personal workspace";
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <Box>
      <Box
        className="lifeos-personal-scope"
        data-personal-theme={resolvedTheme}
        style={
          {
            "--lifeos-scopebar-height": "0px",
            "--accent": brandColors.primaryColor,
            "--accent-light": shadeHex(brandColors.primaryColor, resolvedTheme === 'dark' ? 0.18 : -0.16),
            "--accent-glow": hexToRgba(brandColors.primaryColor, 0.22),
            "--navy": brandColors.secondaryColor,
            "--navy-elevated": shadeHex(brandColors.secondaryColor, resolvedTheme === 'dark' ? 0.18 : -0.14),
            "--navy-soft": hexToRgba(brandColors.secondaryColor, 0.1),
            "--gradient-1": `linear-gradient(135deg, ${brandColors.primaryColor} 0%, ${shadeHex(brandColors.primaryColor, -0.16)} 100%)`,
            "--gradient-2": `linear-gradient(135deg, ${brandColors.secondaryColor} 0%, ${shadeHex(brandColors.secondaryColor, -0.14)} 100%)`,
            "--gradient-3": `linear-gradient(135deg, ${brandColors.primaryColor} 0%, ${shadeHex(brandColors.primaryColor, -0.16)} 100%)`,
            "--product-accent": brandColors.primaryColor,
            "--primary-contrast": contrastText(brandColors.primaryColor),
            "--secondary-contrast": contrastText(brandColors.secondaryColor),
          } as CSSProperties
        }
      >
        <Box
          className={`app-layout ${
            isSidebarCollapsed && !isMobile ? "sidebar-collapsed" : ""
          }`}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            basePath="/app"
          />
          <Box className="main-area">
            {isMobile && (
              <Box className="mobile-header-bar">
                <Button
                  onClick={() => setSidebarOpen(true)}
                  className="mobile-menu-btn"
                  type="button"
                  aria-label="Open Personal navigation"
                >
                  <MenuIcon sx={{ fontSize: 20 }} />
                </Button>
                <Box className="mobile-header-context">
                  <Typography className="mobile-header-section" variant="caption">
                    {currentNavItem?.section ?? "LifeOS"}
                  </Typography>
                  <Typography className="mobile-header-title" variant="body2">
                    {currentNavItem?.label ?? "Personal workspace"}
                  </Typography>
                </Box>
                <Box sx={{ width: 32 }} aria-hidden="true" />
              </Box>
            )}
            <Routes>
              <Route index element={<Dashboard isMobile={isMobile} />} />
              <Route path="habits" element={<Habits isMobile={isMobile} />} />
              <Route path="routine" element={<Routine isMobile={isMobile} />} />
              <Route path="learning" element={<Learning isMobile={isMobile} />} />
              <Route path="jobs" element={<Jobs isMobile={isMobile} />} />
              <Route path="goals" element={<Goals isMobile={isMobile} />} />
              <Route path="projects" element={<Projects isMobile={isMobile} />} />
              <Route
                path="philosophy"
                element={<Philosophy isMobile={isMobile} />}
              />
              <Route path="articles" element={<Articles isMobile={isMobile} />} />
              <Route path="health" element={<Health isMobile={isMobile} />} />
              <Route path="wealth" element={<Wealth isMobile={isMobile} />} />
              <Route path="debts" element={<Debts isMobile={isMobile} />} />
              <Route path="funds" element={<Funds isMobile={isMobile} />} />
              <Route
                path="networking"
                element={<Networking isMobile={isMobile} />}
              />
              <Route path="career" element={<Career isMobile={isMobile} />} />
              <Route
                path="future-plans"
                element={<FuturePlans isMobile={isMobile} />}
              />
              <Route path="diet/*" element={<NutritionPortal isMobile={isMobile} />} />
              <Route path="training" element={<Training isMobile={isMobile} />} />
              <Route path="settings/appearance" element={<Appearance />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalScope;
