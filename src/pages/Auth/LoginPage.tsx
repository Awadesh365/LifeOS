import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  alpha,
  IconButton,
  InputAdornment,
  Grid,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShieldIcon from "@mui/icons-material/Shield";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const portal = location.state?.portal || "official";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials. Identity could not be verified."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        bgcolor: "#020617", // Deep Obsidian
      }}
    >
      {/* Background World: The Terminal HUD */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/terminal-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "grayscale(30%) brightness(0.7)",
          zIndex: 0,
          animation: "float 15s ease-in-out infinite",
        }}
      />

      {/* Grid Layout */}
      <Grid container sx={{ height: "100%", position: "relative", zIndex: 1 }}>
        {/* Left Side: Empty or Decorative on Desktop */}
        {!isMobile && (
          <Grid
            size={{ md: 6, lg: 7 }}
            sx={{
              height: "100%",
              p: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box>
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "14px",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)",
                  }}
                >
                  <Typography
                    sx={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem" }}
                  >
                    C
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  CityOS
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ mt: "auto", maxWidth: 600 }}>
              <Chip
                icon={
                  <RadioButtonCheckedIcon
                    className="animate-pulse"
                    sx={{
                      color: "#0ea5e9 !important",
                      fontSize: "14px !important",
                    }}
                  />
                }
                label="SECURE SYSTEM ACTIVE"
                sx={{
                  bgcolor: alpha("#0ea5e9", 0.1),
                  color: "#0ea5e9",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  border: `1px solid ${alpha("#0ea5e9", 0.3)}`,
                  mb: 2,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  color: "#fff",
                  fontSize: "3.5rem",
                  lineHeight: 1.1,
                  mb: 2,
                  textShadow: "0 0 40px rgba(0,0,0,0.5)",
                }}
              >
                The Future of <br />
                <Box component="span" sx={{ color: "#38bdf8" }}>
                  Urban Authority.
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: alpha("#fff", 0.6), fontWeight: 400, mb: 4 }}
              >
                Unified administration, citizen services, and real-time security
                nodes. Log in to access the central nervous system of your city.
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Right Side: The Premium Glass login Card */}
        <Grid
          size={{ xs: 12, md: 6, lg: 5 }}
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            p: { xs: 3, md: 8 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 480,
              background: "rgba(15, 23, 42, 0.7)", // Deep Glass
              backdropFilter: "blur(24px)",
              borderRadius: "40px",
              border: `1px solid ${alpha("#fff", 0.1)}`,
              p: { xs: 4, md: 6 },
              boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                animation: "gradientShift 4s infinite",
              },
            }}
          >
            <Box sx={{ mb: 4 }}>
              <IconButton
                onClick={() => navigate("/")}
                sx={{
                  bgcolor: alpha("#fff", 0.05),
                  color: "#fff",
                  "&:hover": { bgcolor: alpha("#fff", 0.1) },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  color: "#fff",
                  mb: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                Authorization
              </Typography>
              <Typography variant="body1" sx={{ color: alpha("#fff", 0.5) }}>
                Identify yourself to the{" "}
                {portal === "official" ? "Official" : "Citizen"} node.
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 4,
                  borderRadius: "16px",
                  bgcolor: alpha("#f43f5e", 0.1),
                  color: "#fb7185",
                  border: `1px solid ${alpha("#f43f5e", 0.2)}`,
                  "& .MuiAlert-icon": { color: "#fb7185" },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha("#fff", 0.4),
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    OFFICER IDENTITY / EMAIL
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="name@cityos.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        color: "#fff",
                        fontSize: "1.1rem",
                        p: 1.5,
                        borderRadius: "14px",
                        bgcolor: alpha("#fff", 0.03),
                        border: `1px solid ${alpha("#fff", 0.1)}`,
                        transition: "all 0.3s ease",
                        "&:focus-within": {
                          bgcolor: alpha("#fff", 0.06),
                          borderColor: "#0ea5e9",
                          boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)",
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha("#fff", 0.4),
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                      }}
                    >
                      ACCESS PASSWORD
                    </Typography>
                    <Button
                      size="small"
                      sx={{
                        color: "#0ea5e9",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        textTransform: "none",
                      }}
                    >
                      Recover Key
                    </Button>
                  </Stack>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        color: "#fff",
                        fontSize: "1.1rem",
                        p: 1.5,
                        borderRadius: "14px",
                        bgcolor: alpha("#fff", 0.03),
                        border: `1px solid ${alpha("#fff", 0.1)}`,
                        transition: "all 0.3s ease",
                        "&:focus-within": {
                          bgcolor: alpha("#fff", 0.06),
                          borderColor: "#0ea5e9",
                          boxShadow: "0 0 20px rgba(14, 165, 233, 0.2)",
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: alpha("#fff", 0.3) }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 2.5,
                    borderRadius: "18px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    color: "#fff",
                    boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 25px 50px rgba(14, 165, 233, 0.4)",
                    },
                    "&:disabled": {
                      background: alpha("#fff", 0.05),
                      color: alpha("#fff", 0.2),
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Initiate Secure Session"
                  )}
                </Button>
              </Stack>
            </form>

            <Box
              sx={{
                mt: 6,
                pt: 4,
                borderTop: `1px solid ${alpha("#fff", 0.05)}`,
              }}
            >
              <Stack direction="row" spacing={3} justifyContent="center">
                <Stack alignItems="center" spacing={1}>
                  <IconButton
                    sx={{
                      bgcolor: alpha("#fff", 0.03),
                      color: alpha("#fff", 0.3),
                    }}
                  >
                    <FingerprintIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha("#fff", 0.3) }}
                  >
                    Biometrics
                  </Typography>
                </Stack>
                <Stack alignItems="center" spacing={1}>
                  <IconButton
                    sx={{
                      bgcolor: alpha("#fff", 0.03),
                      color: alpha("#fff", 0.3),
                    }}
                  >
                    <ShieldIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha("#fff", 0.3) }}
                  >
                    Ironclad
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
