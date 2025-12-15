import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  styled,
  Tooltip,
  Collapse,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { NavItem } from "../../types/navigation";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 272;
const collapsedWidth = 72;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    background: "#0f172a", // Slate 900
    borderRight: "1px solid rgba(255,255,255,0.05)",
    color: "#e2e8f0",
  },
  zIndex: theme.zIndex.drawer + 1, // Ensure it sits above the Navbar (AppBar)
}));

const HeaderBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "space-between" : "center", // Center when collapsed
  padding: theme.spacing(3, 2),
  minHeight: 64,
}));

interface SidebarProps {
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  items: NavItem[];
}

const SimpleSidebar: React.FC<SidebarProps> = ({
  setIsOpen,
  isOpen,
  items,
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = item.route
      ? location.pathname.startsWith(`/${item.route}`)
      : false;
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedItems.includes(item.key);

    if (!isOpen && depth > 0) return null;

    const handleClick = () => {
      if (hasChildren) {
        handleToggleExpand(item.key);
      }
    };

    return (
      <React.Fragment key={item.key}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip title={!isOpen ? item.label : ""} placement="right" arrow>
            <ListItemButton
              component={item.route ? Link : "div"}
              to={
                item.route && item.route.startsWith("/")
                  ? item.route
                  : `/${item.route}`
              }
              onClick={handleClick}
              sx={{
                minHeight: 48,
                justifyContent: isOpen ? "initial" : "center",
                px: 2.5,
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                borderLeft: isActive
                  ? "4px solid #3b82f6"
                  : "4px solid transparent",
                backgroundColor: isActive
                  ? "rgba(59, 130, 246, 0.1)"
                  : "transparent",
                color: isActive ? "#60a5fa" : "#94a3b8",
                "&:hover": {
                  backgroundColor: isActive
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(255,255,255,0.03)",
                  color: isActive ? "#60a5fa" : "#f1f5f9",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: isActive ? "#60a5fa" : "#64748b",
                }}
              >
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ fontSize: 24 }}
                >
                  {item.icon}
                </Box>
              </ListItemIcon>
              {isOpen && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                  {hasChildren &&
                    (isExpanded ? (
                      <ExpandLess sx={{ fontSize: 18, opacity: 0.5 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18, opacity: 0.5 }} />
                    ))}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {hasChildren && isOpen && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {item.items?.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const { user: authUser } = useAuth();
  const user = {
    name: authUser?.name || "Guest",
    role: authUser?.role
      ? authUser.role.replace("_", " ").toUpperCase()
      : "Visitor",
    initials: authUser?.name
      ? authUser.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
      : "G",
  };

  return (
    <StyledDrawer variant="permanent" open={isOpen}>
      <HeaderBox open={isOpen}>
        {isOpen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                C
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#f8fafc" }}
            >
              CityOS
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            color: "#f8fafc", // White for visibility
            minWidth: 40,
            height: 40,
            borderRadius: 1.5,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </HeaderBox>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 2 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List component="nav" disablePadding>
          {items.map((item) => renderNavItem(item))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#334155",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            {user.initials}
          </Avatar>
          {isOpen && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#f1f5f9", fontWeight: 600 }}
              >
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                {user.role}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default SimpleSidebar;
