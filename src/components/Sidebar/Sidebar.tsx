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
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { NavItem } from "../../types/navigation";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 264;
const collapsedWidth = 72;

// Colours from the CSS design tokens
const C = {
  bg: "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.95) 100%)",
  bgRadial: "radial-gradient(circle at top left, rgba(30,37,48,0.06), transparent 22%)",
  border: "rgba(216,224,234,0.86)",
  activeItem: "#1E2530",            // --brand-secondary
  activeItemFg: "#F9FAFB",          // --brand-secondary-foreground
  hoverBg: "rgba(30,37,48,0.05)",
  mutedText: "#667085",
  fgText: "#111827",
  subText: "#98A2B3",
  divider: "rgba(216,224,234,0.6)",
  avatarBg: "rgba(30,37,48,0.08)",
  avatarFg: "#1E2530",
};

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
    overflowX: "hidden",
    background: C.bg,
    backgroundImage: `${C.bgRadial}, ${C.bg}`,
    borderRight: `1px solid ${C.border}`,
    boxShadow: "inset -1px 0 0 rgba(16,24,40,0.015)",
    color: C.fgText,
    top: 0,
    height: "100vh",
  },
  zIndex: 1200,
}));

const HeaderBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "space-between" : "center",
  padding: "0 16px",
  minHeight: 64,
}));

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, items }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user: authUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const toExpand: string[] = [];
    const findExpanded = (item: NavItem) => {
      if (item.items) {
        const routeParts = item.route ? item.route.split("/").filter(Boolean) : [];
        if (routeParts.length > 0) {
          const prefix = "/" + routeParts[0];
          if (location.pathname.startsWith(prefix)) toExpand.push(item.key);
        }
      }
    };
    items.forEach(findExpanded);
    setExpandedItems((prev) => Array.from(new Set([...prev, ...toExpand])));
  }, [location.pathname, items]);

  const handleToggleExpand = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const getLabel = (item: NavItem) => {
    if ((item as any).labelKey) return t((item as any).labelKey);
    return item.label;
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = item.route ? location.pathname.startsWith(`/${item.route}`) : false;
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expandedItems.includes(item.key);

    if (!isOpen && depth > 0) return null;

    const handleClick = () => {
      if (hasChildren) handleToggleExpand(item.key);
    };

    const label = getLabel(item);

    return (
      <React.Fragment key={item.key}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip title={!isOpen ? label : ""} placement="right" arrow>
            <ListItemButton
              component={item.route ? Link : "div"}
              to={item.route ? `/${item.route}` : undefined}
              onClick={handleClick}
              sx={{
                minHeight: depth === 0 ? 44 : 40,
                justifyContent: isOpen ? "initial" : "center",
                px: isOpen ? 1.5 : 0,
                mx: 1,
                borderRadius: "8px",
                mb: 0.5,
                backgroundColor: isActive ? C.activeItem : "transparent",
                color: isActive ? C.activeItemFg : depth === 0 ? C.fgText : C.mutedText,
                fontWeight: isActive ? 600 : 500,
                "&:hover": {
                  backgroundColor: isActive ? C.activeItem : C.hoverBg,
                  color: isActive ? C.activeItemFg : C.fgText,
                },
                transition: "background-color 0.15s ease, color 0.15s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 1.5 : "auto",
                  justifyContent: "center",
                  color: isActive ? C.activeItemFg : depth === 0 ? "#64748b" : C.mutedText,
                }}
              >
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{ fontSize: depth === 0 ? 22 : 18 }}
                >
                  {item.icon}
                </Box>
              </ListItemIcon>
              {isOpen && (
                <>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: depth === 0 ? "0.875rem" : "0.8125rem",
                      fontWeight: isActive ? 600 : depth === 0 ? 500 : 400,
                      color: "inherit",
                      fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
                    }}
                    sx={{ opacity: 1, my: 0 }}
                  />
                  {hasChildren &&
                    (isExpanded ? (
                      <ExpandLess sx={{ fontSize: 16, opacity: 0.5 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 16, opacity: 0.5 }} />
                    ))}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {hasChildren && isOpen && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1.5, pb: 0.5 }}>
              {item.items?.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const user = {
    name: authUser?.name || "Guest",
    role: authUser?.role ? authUser.role.replace("_", " ") : "Visitor",
    initials: authUser?.name
      ? authUser.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "G",
  };

  return (
    <StyledDrawer variant="permanent" open={isOpen}>
      {/* Header */}
      <HeaderBox open={isOpen}>
        {isOpen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Brand mark */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #E55555 0%, #C13838 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(229,85,85,0.3)",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: 1,
                }}
              >
                C
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "#111827",
                  lineHeight: 1.1,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  letterSpacing: "-0.02em",
                }}
              >
                CityOS
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  color: "#667085",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                Smart City Platform
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          sx={{
            color: "#64748b",
            width: 36,
            height: 36,
            borderRadius: "8px",
            border: "1px solid rgba(216,224,234,0.8)",
            bgcolor: "rgba(255,255,255,0.7)",
            "&:hover": {
              bgcolor: "rgba(30,37,48,0.06)",
              color: "#111827",
            },
            transition: "all 0.15s ease",
          }}
        >
          {isOpen ? <MenuOpenIcon sx={{ fontSize: 18 }} /> : <MenuIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </HeaderBox>

      <Divider sx={{ borderColor: C.divider, mx: 1 }} />

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
        <List component="nav" disablePadding>
          {items.map((item) => renderNavItem(item))}
        </List>
      </Box>

      {/* Footer — user profile */}
      <Divider sx={{ borderColor: C.divider, mx: 1 }} />
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: isOpen ? 1 : 0,
            py: 1,
            borderRadius: "10px",
            justifyContent: isOpen ? "flex-start" : "center",
            "&:hover": { bgcolor: C.hoverBg },
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: C.avatarBg,
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: C.avatarFg,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              flexShrink: 0,
            }}
          >
            {user.initials}
          </Avatar>
          {isOpen && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#111827",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                {user.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  color: "#667085",
                  fontWeight: 500,
                  textTransform: "capitalize",
                  lineHeight: 1.2,
                }}
              >
                {user.role}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
