import React from "react";
import { Box, Card, Container, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: "official",
      title: "Government Official",
      description: "Administrative access for city and state officials",
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: "#3b82f6" }} />,
      role: "Official",
    },
    {
      id: "citizen",
      title: "Citizen Services",
      description: "Access public services and file grievances",
      icon: <PersonIcon sx={{ fontSize: 40, color: "#10b981" }} />,
      role: "Citizen",
    },
  ];

  const handlePortalSelect = (portalId: string) => {
    // In the future, we can pass the portalId to customize the login page
    navigate("/login", { state: { portal: portalId } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome to CityOS
          </Typography>
          <Typography variant="h5" sx={{ color: "#94a3b8", fontWeight: 400 }}>
            Select your access portal to continue
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {portals.map((portal) => (
            <Grid size={{ xs: 12, md: 4 }} key={portal.id}>
              <Card
                onClick={() => handlePortalSelect(portal.id)}
                sx={{
                  p: 4,
                  height: "100%",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255, 255, 255, 0.06)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  {portal.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{ color: "#f8fafc", fontWeight: 700, mb: 1 }}
                >
                  {portal.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#94a3b8", mb: 4, flexGrow: 1 }}
                >
                  {portal.description}
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    px: 3,
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  Login as {portal.role}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
