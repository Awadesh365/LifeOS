import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
  styled,
  Avatar,
  Badge,
  Fade,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useAuth } from "../../hooks/useAuth";

interface StyledAppBarProps {
  isSidebarOpen: boolean;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isSidebarOpen",
})<StyledAppBarProps>(({ theme, isSidebarOpen }) => ({
  position: "fixed",
  top: 0,
  left: isSidebarOpen ? 272 : 72,
  width: isSidebarOpen ? "calc(100% - 272px)" : "calc(100% - 72px)",
  height: 64,
  background: "#ffffff",
  borderBottom: "1px solid #e2e8f0",
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
  color: "#0f172a",
  display: "flex",
  justifyContent: "center",
  transition: theme.transitions.create(["width", "left"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const CitySwitcher = styled(Button)(() => ({
  textTransform: "none",
  color: "#0f172a",
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid transparent",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },
  "& .MuiButton-startIcon": {
    marginRight: 12,
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: 8,
  backgroundColor: "#f1f5f9",
  border: "1px solid transparent",
  marginRight: theme.spacing(2),
  width: "100%",
  maxWidth: 400,
  transition: "all 0.2s ease",
  "&:hover": { backgroundColor: "#e2e8f0" },
  "&:focus-within": {
    backgroundColor: "#ffffff",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#0f172a",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    width: "100%",
    fontSize: "0.875rem",
  },
}));

interface OfficialNavbarProps {
  isSidebarOpen: boolean;
}

const MOCK_CITIES = [
  { id: "varanasi", name: "Varanasi Nagar Nigam" },
  { id: "lucknow", name: "Lucknow Nagar Nigam" },
  { id: "kanpur", name: "Kanpur Nagar Nigam" },
  { id: "prayagraj", name: "Prayagraj Nagar Nigam" },
];

const OfficialNavbar: React.FC<OfficialNavbarProps> = ({ isSidebarOpen }) => {
  const [cityAnchor, setCityAnchor] = useState<null | HTMLElement>(null);
  const [currentCity, setCurrentCity] = useState(MOCK_CITIES[0]);
  const { user } = useAuth(); // Assuming this hook exists and works

  const handleCityClick = (event: React.MouseEvent<HTMLElement>) => {
    setCityAnchor(event.currentTarget);
  };

  const handleCityClose = () => {
    setCityAnchor(null);
  };

  const handleCitySelect = (city: (typeof MOCK_CITIES)[0]) => {
    setCurrentCity(city);
    handleCityClose();
    // In real app, dispatch(setCurrentTenant(city.id)) here
    console.log(`Switched to city: ${city.name} (${city.id})`);
  };

  return (
    <StyledAppBar isSidebarOpen={isSidebarOpen}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        {/* LEFT: City Switcher (The "Zila Prashan" Dropdown) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <CitySwitcher
            onClick={handleCityClick}
            startIcon={<LocationCityIcon sx={{ color: "#3b82f6" }} />}
            endIcon={<KeyboardArrowDownIcon sx={{ color: "#94a3b8" }} />}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, lineHeight: 1.1 }}
              >
                {currentCity.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Zila Prashasan Mode
              </Typography>
            </Box>
          </CitySwitcher>

          <Menu
            anchorEl={cityAnchor}
            open={Boolean(cityAnchor)}
            onClose={handleCityClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1,
                width: 260,
                borderRadius: 2,
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{ px: 2, py: 1, color: "#94a3b8" }}
            >
              Select Jurisdiction
            </Typography>
            {MOCK_CITIES.map((city) => (
              <MenuItem
                key={city.id}
                selected={city.id === currentCity.id}
                onClick={() => handleCitySelect(city)}
                sx={{ fontSize: "0.9rem", py: 1 }}
              >
                {city.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* RIGHT: Search & Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SearchBox>
            <Box
              sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                display: "flex",
              }}
            >
              <SearchIcon fontSize="small" />
            </Box>
            <StyledInputBase placeholder="Search citizens, files, departments..." />
          </SearchBox>

          <IconButton size="small">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon fontSize="small" sx={{ color: "#64748b" }} />
            </Badge>
          </IconButton>

          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#0f172a",
              fontSize: "0.875rem",
            }}
          >
            {user?.name?.[0] || "A"}
          </Avatar>
        </Box>
      </Box>
    </StyledAppBar>
  );
};

export default OfficialNavbar;
