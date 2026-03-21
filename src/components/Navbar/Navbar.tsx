import {
  AppBar,
  Avatar,
  Box,
  Badge,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Popover,
  Typography,
  styled,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Button,
  Fade,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { NavItem } from "../../types/navigation";
import { LanguagePicker } from "../LanguagePicker";

// Design token colours
const C = {
  navBg: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
  border: "rgba(216,224,234,0.84)",
  shadow: "0 1px 0 rgba(216,224,234,0.6), 0 8px 24px -20px rgba(16,24,40,0.12)",
  fg: "#111827",
  muted: "#667085",
  muted2: "#98A2B3",
  hoverBg: "rgba(30,37,48,0.04)",
  activeBg: "rgba(30,37,48,0.06)",
  navy: "#1E2530",
  primary: "#E55555",
  inputBg: "rgba(241,245,249,0.8)",
  inputBorder: "rgba(216,224,234,0.9)",
  inputFocusBorder: "#E55555",
};

interface StyledAppBarProps { isSidebarOpen: boolean; }

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isSidebarOpen",
})<StyledAppBarProps>(({ isSidebarOpen }) => ({
  position: "fixed",
  top: 0,
  left: isSidebarOpen ? 264 : 72,
  width: isSidebarOpen ? "calc(100% - 264px)" : "calc(100% - 72px)",
  height: 64,
  background: C.navBg,
  borderBottom: `1px solid ${C.border}`,
  boxShadow: C.shadow,
  zIndex: 1100,
  color: C.fg,
  display: "flex",
  justifyContent: "center",
  transition: "left 0.22s cubic-bezier(0.4,0,0.2,1), width 0.22s cubic-bezier(0.4,0,0.2,1)",
}));

const ModuleSwitcher = styled(Button)(() => ({
  textTransform: "none",
  color: C.fg,
  padding: "6px 10px",
  borderRadius: "10px",
  border: `1px solid ${C.inputBorder}`,
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(4px)",
  gap: 0,
  transition: "all 0.18s ease",
  "&:hover": {
    backgroundColor: C.hoverBg,
    borderColor: "rgba(30,37,48,0.2)",
  },
  "& .MuiButton-startIcon": { marginRight: 10 },
  "& .MuiButton-endIcon": { marginLeft: 4 },
}));

const ModuleIconBox = styled(Box)(() => ({
  width: 30,
  height: 30,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: C.navy,
  color: "#fff",
  flexShrink: 0,
}));

const SearchBox = styled(Box)(() => ({
  position: "relative",
  borderRadius: "10px",
  backgroundColor: C.inputBg,
  border: `1px solid ${C.inputBorder}`,
  width: "100%",
  maxWidth: 360,
  transition: "all 0.18s ease",
  "&:hover": { backgroundColor: "rgba(241,245,249,1)" },
  "&:focus-within": {
    backgroundColor: "#ffffff",
    borderColor: C.inputFocusBorder,
    boxShadow: `0 0 0 3px rgba(229,85,85,0.1)`,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: C.fg,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: "calc(1em + 28px)",
    fontSize: "0.875rem",
    fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif',
    "&::placeholder": { color: C.muted, opacity: 1 },
  },
}));

const ActionBtn = styled(IconButton)(() => ({
  color: C.muted,
  borderRadius: "9999px",
  padding: "8px",
  width: 36,
  height: 36,
  border: `1px solid rgba(216,224,234,0.9)`,
  background:
    "linear-gradient(180deg,rgba(255,255,255,0.9) 0%,rgba(248,250,252,0.85) 100%)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 1px 3px rgba(16,24,40,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
  transition: "all 0.18s ease",
  "&:hover": {
    background:
      "linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(244,246,249,0.95) 100%)",
    borderColor: "rgba(30,37,48,0.22)",
    boxShadow: "0 2px 6px rgba(16,24,40,0.1), inset 0 1px 0 rgba(255,255,255,1)",
    color: C.fg,
  },
}));

export type ModuleType =
  | "district-admin" | "state-admin" | "citizen-services" | "dev-schemes"
  | "emergency" | "revenue" | "health" | "education" | "police"
  | "environment" | "analytics" | "system-admin";

interface TopNavItemProp {
  key: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  color?: string;
  enabled: boolean;
  items?: NavItem[];
}

interface NavbarProps {
  items: TopNavItemProp[];
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isSidebarOpen: boolean;
}

const SimpleNavbar: React.FC<NavbarProps> = ({ items, activeNav, setActiveNav, isSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [moduleMenuAnchor, setModuleMenuAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: authUser, logout } = useAuth();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const user = {
    name: authUser?.name || "Guest",
    role: authUser?.designation || "Visitor",
    initials: authUser?.name
      ? authUser.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "G",
  };

  const handleUserClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleModuleClick = (e: React.MouseEvent<HTMLElement>) => setModuleMenuAnchor(e.currentTarget);
  const handleClose = () => { setAnchorEl(null); setModuleMenuAnchor(null); };

  const handleModuleSelect = (moduleKey: string) => {
    setActiveNav(moduleKey);
    handleClose();
    const selected = items.find((m) => m.key === moduleKey);
    if (selected?.items?.[0]?.route) {
      const route = selected.items[0].route;
      navigate(route.startsWith("/") ? route : `/${route}`);
    }
  };

  const activeModuleData = items.find((m) => m.key === activeNav) || items[0];

  return (
    <StyledAppBar isSidebarOpen={isSidebarOpen}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          height: "100%",
          width: "100%",
        }}
      >
        {/* LEFT — Module switcher + breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ModuleSwitcher
            onClick={handleModuleClick}
            startIcon={
              <ModuleIconBox sx={{ background: activeModuleData?.color || C.navy }}>
                <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 17 }}>
                  {activeModuleData?.icon || "dashboard"}
                </Box>
              </ModuleIconBox>
            }
            endIcon={<KeyboardArrowDownIcon sx={{ color: C.muted2, fontSize: 16 }} />}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  lineHeight: 1.15,
                  color: C.fg,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  letterSpacing: "-0.01em",
                }}
              >
                {t(activeModuleData?.labelKey || "modules.districtAdmin.title")}
              </Typography>
              <Typography
                sx={{ color: C.muted, fontSize: "0.6875rem", fontWeight: 500, lineHeight: 1 }}
              >
                {user.role}
              </Typography>
            </Box>
          </ModuleSwitcher>

          {/* Module switcher dropdown */}
          <Menu
            anchorEl={moduleMenuAnchor}
            open={Boolean(moduleMenuAnchor)}
            onClose={handleClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1,
                width: 268,
                borderRadius: "14px",
                boxShadow: "0 16px 48px -12px rgba(16,24,40,0.18), 0 0 0 1px rgba(216,224,234,0.6)",
                border: "1px solid rgba(216,224,234,0.7)",
                p: 1,
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(12px)",
              },
            }}
          >
            <Typography
              sx={{
                px: 1.5,
                pt: 0.5,
                pb: 1,
                fontSize: "0.6875rem",
                color: C.muted,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
              }}
            >
              {t("navbar.switchContext")}
            </Typography>
            {items.filter((m) => m.enabled).map((m) => (
              <MenuItem
                key={m.key}
                onClick={() => handleModuleSelect(m.key)}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  py: 1,
                  px: 1.5,
                  backgroundColor: activeNav === m.key ? "rgba(30,37,48,0.06)" : "transparent",
                  "&:hover": { backgroundColor: "rgba(30,37,48,0.04)" },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 34, color: activeNav === m.key ? m.color || C.navy : C.muted }}
                >
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                    {m.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={t(m.labelKey)}
                  secondary={t(m.descriptionKey)}
                  primaryTypographyProps={{
                    fontWeight: activeNav === m.key ? 700 : 500,
                    fontSize: "0.8125rem",
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    letterSpacing: "-0.01em",
                    color: C.fg,
                  }}
                  secondaryTypographyProps={{ fontSize: "0.6875rem", color: C.muted }}
                />
                {activeNav === m.key && (
                  <CheckIcon fontSize="small" sx={{ color: m.color || C.navy, fontSize: 16 }} />
                )}
              </MenuItem>
            ))}
          </Menu>

          <Box sx={{ width: "1px", height: 22, bgcolor: C.border }} />

          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 14, color: C.muted2 }} />}
            aria-label="breadcrumb"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
              return last ? (
                <Typography
                  key={to}
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: C.muted,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {label}
                </Typography>
              ) : (
                <MuiLink
                  component={Link}
                  to={to}
                  key={to}
                  underline="hover"
                  sx={{ fontSize: "0.8125rem", color: C.muted2, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {label}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        </Box>

        {/* RIGHT — search, actions, profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <SearchBox>
            <Box
              sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                color: C.muted,
              }}
            >
              <SearchIcon sx={{ fontSize: 18 }} />
            </Box>
            <StyledInputBase placeholder="Search..." />
            <Box
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                border: `1px solid ${C.inputBorder}`,
                borderRadius: "6px",
                px: 0.75,
                py: 0.25,
                bgcolor: "rgba(255,255,255,0.8)",
              }}
            >
              <Typography sx={{ color: C.muted2, fontSize: 10, fontWeight: 700, lineHeight: 1.4 }}>
                ⌘K
              </Typography>
            </Box>
          </SearchBox>

          <ActionBtn size="small">
            <Badge
              badgeContent={4}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#E55555",
                  color: "#fff",
                  fontSize: 9,
                  height: 15,
                  minWidth: 15,
                  fontWeight: 700,
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: 19 }} />
            </Badge>
          </ActionBtn>

          <LanguagePicker variant="button" />

          {/* Avatar / profile trigger — pill button */}
          <Box
            onClick={handleUserClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              pl: 0.5,
              pr: 1.25,
              py: 0.4,
              ml: 0.25,
              height: 36,
              borderRadius: "9999px",
              border: "1px solid rgba(216,224,234,0.9)",
              background:
                "linear-gradient(180deg,rgba(255,255,255,0.9) 0%,rgba(248,250,252,0.85) 100%)",
              backdropFilter: "blur(6px)",
              boxShadow:
                "0 1px 3px rgba(16,24,40,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
              transition: "all 0.18s ease",
              "&:hover": {
                background:
                  "linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(244,246,249,0.95) 100%)",
                borderColor: "rgba(30,37,48,0.22)",
                boxShadow:
                  "0 2px 6px rgba(16,24,40,0.1), inset 0 1px 0 rgba(255,255,255,1)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 26,
                height: 26,
                background: "linear-gradient(135deg, #1E2530 0%, #2D3748 100%)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              {user.initials}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: C.fg,
                  lineHeight: 1,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: 13, color: C.muted2, ml: -0.25 }} />
          </Box>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 210,
                borderRadius: "12px",
                boxShadow: "0 16px 48px -12px rgba(16,24,40,0.18), 0 0 0 1px rgba(216,224,234,0.6)",
                border: "1px solid rgba(216,224,234,0.7)",
                overflow: "hidden",
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(12px)",
              },
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: `1px solid ${C.border}` }}>
              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: C.fg, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: "0.6875rem", color: C.muted }}>
                {user.role}
              </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
              <MenuItem onClick={handleClose} sx={{ borderRadius: "8px", fontSize: "0.875rem", color: C.fg, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ borderRadius: "8px", fontSize: "0.875rem", color: C.fg, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Settings
              </MenuItem>
              <Divider sx={{ my: 0.75, borderColor: C.border }} />
              <MenuItem
                onClick={() => { handleClose(); logout(); }}
                sx={{ borderRadius: "8px", fontSize: "0.875rem", color: "#E55555", fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Logout
              </MenuItem>
            </Box>
          </Popover>
        </Box>
      </Box>
    </StyledAppBar>
  );
};

export default SimpleNavbar;
