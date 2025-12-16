import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  TOP_NAV_ITEMS,
  getSidebarItems,
} from "../lib/constants/top_navigation_complete";
import {
  selectFeatureTree,
  setFeatureTree,
} from "../redux/slices/featureTreeSlice";

export const OfficialLayout: React.FC = () => {
  // State for Sidebar Open/Close
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? true : JSON.parse(stored);
  });

  // State for Active Top Module (Default: District Admin)
  const [activeNav, setActiveNav] = useState("district-admin");

  const location = useLocation();
  const dispatch = useDispatch();
  const featureTree = useSelector(selectFeatureTree);

  // MOCK: Load Permissions
  useEffect(() => {
    if (!featureTree) {
      dispatch(
        setFeatureTree({
          EMERGENCY_MODULE: { IS_ACTIVE: true },
          OPS_MODULE: { IS_ACTIVE: true },
          ADMIN_MODULE: { IS_ACTIVE: true },
        })
      );
    }
  }, [dispatch, featureTree]);

  // Persist Sidebar State
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // Sync Active Nav with URL
  useEffect(() => {
    const path = location.pathname;
    let key = "district-admin"; // Default

    if (path.includes("/state")) key = "state-admin";
    else if (path.includes("/services")) key = "citizen-services";
    else if (path.includes("/schemes")) key = "dev-schemes";
    else if (path.includes("/emergency")) key = "emergency";
    else if (path.includes("/revenue")) key = "revenue";
    else if (path.includes("/health")) key = "health";
    else if (path.includes("/education")) key = "education";
    else if (path.includes("/police")) key = "police";
    else if (path.includes("/environment")) key = "environment";
    else if (path.includes("/analytics")) key = "analytics";
    else if (path.includes("/admin")) key = "system-admin";

    setActiveNav(key);
  }, [location.pathname]);

  // Get Sidebar Items based on Active Top Module
  const sidebarItems = useMemo(() => {
    return getSidebarItems(activeNav);
  }, [activeNav]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        bgcolor: "#f1f5f9",
      }}
    >
      <Navbar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        items={TOP_NAV_ITEMS}
        isSidebarOpen={isOpen}
      />

      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} items={sidebarItems} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px", // Matches Navbar height
          p: 3,
          ml: 0,
          paddingLeft: isOpen ? "272px" : "72px",
          minWidth: 0,
          height: "calc(100vh - 64px)",
          transition: "padding-left 0.2s ease",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
