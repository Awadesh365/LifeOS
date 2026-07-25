import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Navigate, Route, Routes } from "react-router-dom";
import { LifeOSScopeBar } from "../../app/LifeOSScopeBar";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Habits from "./pages/Habits.jsx";
import Routine from "./pages/Routine.jsx";
import Learning from "./pages/Learning.jsx";
import Jobs from "./pages/Jobs.jsx";
import Goals from "./pages/Goals.jsx";
import Philosophy from "./pages/Philosophy.jsx";
import Articles from "./pages/Articles.jsx";
import Projects from "./pages/Projects.jsx";
import Health from "./pages/Health.jsx";
import Wealth from "./pages/Wealth.jsx";
import Debts from "./pages/Debts.jsx";
import Funds from "./pages/Funds.jsx";
import Networking from "./pages/Networking.jsx";
import Career from "./pages/Career.jsx";
import FuturePlans from "./pages/FuturePlans.jsx";
import Diet from "./pages/Diet.jsx";
import "./personal.css";

const PERSONAL_SCOPE_BAR_HEIGHT = 52;

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isMobile;
};

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
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div>
      <LifeOSScopeBar activeScope="personal" />
      <div
        className="lifeos-personal-scope"
        data-personal-theme="light"
        style={
          {
            "--lifeos-scopebar-height": `${PERSONAL_SCOPE_BAR_HEIGHT}px`,
          } as CSSProperties
        }
      >
        <div
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
            basePath="/personal"
          />
          <div className="main-area">
            {isMobile && (
              <div className="mobile-header-bar">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mobile-menu-btn"
                  type="button"
                  aria-label="Open Personal navigation"
                >
                  <MenuIcon sx={{ fontSize: 20 }} />
                </button>
                <span className="mobile-header-title">LifeOS Personal</span>
                <span style={{ width: 32 }} aria-hidden="true" />
              </div>
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
              <Route path="diet" element={<Diet isMobile={isMobile} />} />
              <Route path="*" element={<Navigate to="/personal" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalScope;
