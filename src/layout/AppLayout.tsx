import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/layout/Navbar/Navbar";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  NAV_SIDEBAR_ITEMS,
  filterSidebarItemsByPermissions,
} from "../lib/constants/navigation";

const AppLayout: React.FC = () => {
  const navData = NAV_SIDEBAR_ITEMS;
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? true : JSON.parse(stored);
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const location = useLocation();

  const isDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  // Filter navigation by permissions
  const filteredSidebarNavbarItems = filterSidebarItemsByPermissions(navData);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Navbar items={filteredSidebarNavbarItems} />
      {!isDashboard && (
        <Sidebar
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          items={filteredSidebarNavbarItems}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "104px", // Space for floating navbar (88px) + margin
          ml: !isDashboard ? (isOpen ? "16px" : "16px") : "32px", // Reduced gap from sidebar
          mr: "24px",
          mb: "24px",
          p: 0,
          minWidth: 0,
          minHeight: "calc(100vh - 136px)",
          transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
