import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Navbar, { ModuleType } from "../components/layout/Navbar/Navbar";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  COMMAND_CENTER_MODULE,
  CITY_SERVICES_MODULE,
  ANALYTICS_MODULE,
  ADMIN_MODULE,
  filterSidebarItemsByPermissions,
} from "../lib/constants/navigation";

const AppLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? true : JSON.parse(stored);
  });

  const [currentModule, setCurrentModule] = useState<ModuleType>('command-center');
  const location = useLocation();

  // Auto-switch module based on route if user navigates directly
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/services')) {
      setCurrentModule('city-services');
    } else if (path.startsWith('/analytics')) {
      setCurrentModule('analytics');
    } else if (path.startsWith('/admin')) {
      setCurrentModule('admin');
    } else {
      setCurrentModule('command-center');
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const getModuleItems = () => {
    switch (currentModule) {
      case 'city-services':
        return CITY_SERVICES_MODULE;
      case 'analytics':
        return ANALYTICS_MODULE;
      case 'admin':
        return ADMIN_MODULE;
      default:
        return COMMAND_CENTER_MODULE;
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
      />
      
      <Sidebar
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        items={activeNavItems}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px", // Height of Navbar
          ml: 0, 
          paddingLeft: isOpen ? "260px" : "72px",
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
