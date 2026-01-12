import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
  fullScreen = true,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? "100vh" : "400px",
        gap: 2,
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: "primary.main",
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

interface SkeletonLoaderProps {
  count?: number;
  height?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  height = 60,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            height,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            "@keyframes shimmer": {
              "0%": { backgroundPosition: "200% 0" },
              "100%": { backgroundPosition: "-200% 0" },
            },
          }}
        />
      ))}
    </Box>
  );
};

interface ButtonLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  loading,
  children,
}) => {
  if (loading) {
    return <CircularProgress size={20} color="inherit" />;
  }
  return <>{children}</>;
};
