import React from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import PublicIcon from "@mui/icons-material/Public";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePortalSelect = (portalId: string) => {
    navigate("/login", { state: { portal: portalId } });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "#FCF9F6", // Creamy white base
        display: "flex",
        alignItems: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 0% 0%, ${alpha("#667eea", 0.08)} 0%, transparent 40%),
            radial-gradient(circle at 100% 0%, ${alpha("#f093fb", 0.08)} 0%, transparent 40%),
            radial-gradient(circle at 100% 100%, ${alpha("#4facfe", 0.08)} 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, ${alpha("#43e97b", 0.08)} 0%, transparent 40%)
          `,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Left Side: Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={4}>
              <Box>
                <Chip
                  icon={
                    <BoltIcon
                      sx={{ fontSize: "1rem !important", color: "#F05D5E" }}
                    />
                  }
                  label="LIVE CITY INFRASTRUCTURE"
                  sx={{
                    bgcolor: alpha("#F05D5E", 0.08),
                    color: "#F05D5E",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    borderRadius: "8px",
                    px: 1,
                    mb: 4,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "3rem", md: "4.5rem" },
                    lineHeight: 1.1,
                    color: "#1A1A1A",
                    letterSpacing: "-0.04em",
                    mb: 3,
                  }}
                >
                  One OS for every <br />
                  <Box
                    component="span"
                    sx={{
                      color: "#667eea",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    department, officer, and citizen.
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#666",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: "600px",
                    mb: 6,
                  }}
                >
                  CityOS connects administrative nodes to real-time city
                  intelligence. Track deployments, resource health, and
                  emergency response from a single mission control view.
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: alpha("#F05D5E", 0.08),
                        color: "#F05D5E",
                      }}
                    >
                      <PublicIcon />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Statewide coverage
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Monitor assets across districts with a unified digital
                        schema.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: alpha("#667eea", 0.08),
                        color: "#667eea",
                      }}
                    >
                      <ShieldIcon />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Secure access
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Role-based sign-in and audited permission management.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Right Side: Login Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: "24px",
                boxShadow: "0 20px 80px rgba(0,0,0,0.08)",
                border: "1px solid",
                borderColor: alpha("#000", 0.05),
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  mb: 2,
                  color: "#1A1A1A",
                }}
              >
                Select your organization
              </Typography>
              <Typography sx={{ color: "#666", mb: 6 }}>
                Choose the public agency or department you represent to continue
                to secure login.
              </Typography>

              <Stack spacing={3}>
                <Button
                  fullWidth
                  onClick={() => handlePortalSelect("official")}
                  sx={{
                    p: 2,
                    justifyContent: "flex-start",
                    textAlign: "left",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: alpha("#000", 0.1),
                    color: "#1A1A1A",
                    "&:hover": {
                      borderColor: "#667eea",
                      bgcolor: alpha("#667eea", 0.04),
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: alpha("#667eea", 0.1),
                        color: "#667eea",
                      }}
                    >
                      <AccountBalanceIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Government Official
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Administrative access for officers
                      </Typography>
                    </Box>
                    <ArrowForwardIcon
                      sx={{ fontSize: "1.2rem", color: alpha("#000", 0.3) }}
                    />
                  </Stack>
                </Button>

                <Button
                  fullWidth
                  onClick={() => handlePortalSelect("citizen")}
                  sx={{
                    p: 2,
                    justifyContent: "flex-start",
                    textAlign: "left",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: alpha("#000", 0.1),
                    color: "#1A1A1A",
                    "&:hover": {
                      borderColor: "#10b981",
                      bgcolor: alpha("#10b981", 0.04),
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: alpha("#10b981", 0.1),
                        color: "#10b981",
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Citizen Services
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        Public portal for city residents
                      </Typography>
                    </Box>
                    <ArrowForwardIcon
                      sx={{ fontSize: "1.2rem", color: alpha("#000", 0.3) }}
                    />
                  </Stack>
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => handlePortalSelect("official")}
                  sx={{
                    mt: 2,
                    py: 2,
                    borderRadius: "16px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#F05D5E",
                    "&:hover": {
                      bgcolor: "#d94e4f",
                    },
                  }}
                >
                  Continue to login
                </Button>
              </Stack>

              <Box
                sx={{
                  mt: 6,
                  pt: 4,
                  borderTop: "1px solid",
                  borderColor: alpha("#000", 0.05),
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#999", display: "block", mb: 1 }}
                >
                  Security note
                </Typography>
                <Typography variant="caption" sx={{ color: "#666" }}>
                  Sessions are protected with secure protocols and MFA
                  verification for sensitive modules.
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
