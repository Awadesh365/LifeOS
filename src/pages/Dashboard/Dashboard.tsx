import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  Stack,
  alpha,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  Warning,
  CheckCircle,
  People,
  LocalHospital,
  LocalPolice,
  School,
  FireTruck,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: "Total Residents",
      value: "1.2M",
      icon: <People />,
      color: "#3b82f6",
    },
    {
      label: "Active Incidents",
      value: "24",
      icon: <Warning />,
      color: "#ef4444",
    },
    {
      label: "Resolved Today",
      value: "156",
      icon: <CheckCircle />,
      color: "#10b981",
    },
    {
      label: "Safety Index",
      value: "92%",
      icon: <TrendingUp />,
      color: "#6366f1",
    },
  ];

  const resources = [
    { name: "Hospitals", count: 42, color: "#ef4444", icon: <LocalHospital /> },
    {
      name: "Police Stations",
      count: 28,
      color: "#3b82f6",
      icon: <LocalPolice />,
    },
    { name: "Schools", count: 124, color: "#f59e0b", icon: <School /> },
    { name: "Fire Stations", count: 15, color: "#f97316", icon: <FireTruck /> },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
        >
          City Overview Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Real-time metrics, safety index, and active emergency summaries across
          all departments.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
                border: "1px solid #f1f5f9",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: alpha(stat.color, 0.1),
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", fontWeight: 600 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#1e293b" }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              minHeight: 400,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Departmental Performance
            </Typography>
            <Stack spacing={4}>
              {resources.map((res, index) => (
                <Box key={index}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ color: res.color, display: "flex" }}>
                        {res.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {res.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {res.count}% Load
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={res.count}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(res.color, 0.1),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: res.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Live Alerts
            </Typography>
            <Stack spacing={2}>
              {[
                "Water pipeline repair in Sector 4",
                "New safety guidelines issued for schools",
                "Traffic diversion on Main Highway",
                "Vaccination drive starting tomorrow",
              ].map((alert, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#1e293b", fontWeight: 500 }}
                  >
                    {alert}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    {index + 1} hour ago
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
