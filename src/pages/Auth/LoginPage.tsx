import React from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  Avatar,
  Grid,
  Chip,
} from "@mui/material";
import { DUMMY_USERS } from "../../lib/constants/dummyUsers";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (userId: string) => {
    login(userId);
    navigate("/dashboard"); // Default redirect, can be smarter based on role
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)",
            }}
          >
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700 }}>
              C
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            CityOS Unified Platform
          </Typography>
          <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 400 }}>
            Secure Access Portal • State of Uttar Pradesh
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {DUMMY_USERS.map((user) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
              <Card
                onClick={() => handleLogin(user.id)}
                sx={{
                  p: 3,
                  height: "100%",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 4,
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    background: "rgba(255, 255, 255, 0.06)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    border: "4px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "#f8fafc", fontWeight: 600, mb: 0.5 }}
                >
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
                  {user.designation}
                </Typography>

                <Box sx={{ mt: "auto", width: "100%" }}>
                  <Chip
                    label={user.role.replace("_", " ").toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: "rgba(59, 130, 246, 0.1)",
                      color: "#60a5fa",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      mb: 2,
                    }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#e2e8f0",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#3b82f6",
                        bgcolor: "rgba(59, 130, 246, 0.1)",
                      },
                    }}
                  >
                    Login as {user.role === "citizen" ? "Citizen" : "Official"}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            textAlign: "center",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <SecurityIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">
            Protected by CityOS Zero-Trust Architecture. Unauthorized access is
            a punishable offense.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
