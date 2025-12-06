import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Navbar, { ModuleType } from "../components/layout/Navbar/Navbar";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  DISTRICT_ADMIN_MODULE,
  CITIZEN_SERVICES_MODULE,
  STATE_ADMIN_MODULE,
  SYSTEM_ADMIN_MODULE,
  filterSidebarItemsByPermissions,
} from "../lib/constants/navigation";

const AppLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? true : JSON.parse(stored);
  });

  const [currentModule, setCurrentModule] =
    useState<ModuleType>("district-admin");
  const location = useLocation();

  // Auto-switch module based on route if user navigates directly
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/services")) {
      setCurrentModule("citizen-services");
    } else if (path.startsWith("/state")) {
      setCurrentModule("state-admin");
    } else if (path.startsWith("/admin")) {
      setCurrentModule("system-admin");
    } else {
      setCurrentModule("district-admin");
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const getModuleItems = () => {
    switch (currentModule) {
      case "citizen-services":
        return CITIZEN_SERVICES_MODULE;
      case "state-admin":
        return STATE_ADMIN_MODULE;
      case "system-admin":
        return SYSTEM_ADMIN_MODULE;
      default:
        return DISTRICT_ADMIN_MODULE;
    }
  };

  // Filter navigation by permissions
  const activeNavItems = filterSidebarItemsByPermissions(getModuleItems());

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#f8fafc", // Slate 50
      }}
    >
      <Navbar
        items={activeNavItems}
        currentModule={currentModule}
        onModuleChange={setCurrentModule}
        isSidebarOpen={isOpen}
      />

      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} items={activeNavItems} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px", // Height of Navbar
          ml: 0,
          paddingLeft: isOpen ? "272px" : "72px",
          width: "100%",
          transition: "padding-left 0.2s ease",
          p: 3,
          minHeight: "calc(100vh - 64px)",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
