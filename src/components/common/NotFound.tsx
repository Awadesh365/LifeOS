import React from "react";
import { Box, Button, Container, Typography, Paper } from "@mui/material";
import {
  SentimentVeryDissatisfied,
  Home,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  title?: string;
  message?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "120px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>
          <SentimentVeryDissatisfied
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {message}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
