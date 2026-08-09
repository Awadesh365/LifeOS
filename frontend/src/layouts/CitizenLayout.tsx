import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import LocationCityIcon from "@mui/icons-material/LocationCity";

const CitizenNavbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        color: "#0f172a",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <LocationCityIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              LifeOS
            </Typography>
            <Typography
              variant="caption"
              sx={{
                bgcolor: "#f1f5f9",
                px: 1,
                py: 0.5,
                borderRadius: 99,
                fontWeight: 600,
                color: "#64748b",
              }}
            >
              Citizen Portal
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit">My Applications</Button>
            <Button color="inherit">Services</Button>
            <Button variant="contained" disableElevation>
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const CitizenLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <CitizenNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default CitizenLayout;
