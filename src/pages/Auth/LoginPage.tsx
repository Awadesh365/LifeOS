import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
      <Container maxWidth="sm">
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

        <Card
          sx={{
            p: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#fff", mb: 3, textAlign: "center" }}
          >
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "#fff" },
                label: { color: "#94a3b8" },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 4,
                input: { color: "#fff" },
                label: { color: "#94a3b8" },
              }}
            />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#3b82f6",
                height: 48,
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Card>

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
