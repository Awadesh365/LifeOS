import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  TOP_NAV_ITEMS,
  getSidebarItems,
} from "../lib/constants/top_navigation_complete";

const AppLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? true : JSON.parse(stored);
  });

  const [activeNav, setActiveNav] = useState("district-admin");
  const location = useLocation();

  // Auto-switch module based on route if user navigates directly
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/services")) {
      setActiveNav("citizen-services");
    } else if (path.startsWith("/state")) {
      setActiveNav("state-admin");
    } else if (path.startsWith("/admin")) {
      setActiveNav("system-admin");
    } else if (path.startsWith("/schemes")) {
      setActiveNav("dev-schemes");
    } else if (path.startsWith("/emergency")) {
      setActiveNav("emergency");
    } else if (path.startsWith("/revenue")) {
      setActiveNav("revenue");
    } else if (path.startsWith("/health")) {
      setActiveNav("health");
    } else if (path.startsWith("/education")) {
      setActiveNav("education");
    } else if (path.startsWith("/police")) {
      setActiveNav("police");
    } else if (path.startsWith("/environment")) {
      setActiveNav("environment");
    } else if (path.startsWith("/analytics")) {
      setActiveNav("analytics");
    } else {
      setActiveNav("district-admin");
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // Get sidebar items for active module
  const sidebarItems = useMemo(() => {
    return getSidebarItems(activeNav);
  }, [activeNav]);

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
        items={TOP_NAV_ITEMS}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isSidebarOpen={isOpen}
      />

      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} items={sidebarItems} />

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
