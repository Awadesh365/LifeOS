import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  People,
  Warning,
  CheckCircle,
  TrendingUp,
  LocalHospital,
  LocalPolice,
  School,
  FireTruck,
  WaterDrop,
  ElectricBolt,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

// ---- Design tokens (mirrors CSS variables) ------------------
const C = {
  fg: "#111827",
  muted: "#667085",
  muted2: "#98A2B3",
  border: "rgba(216,224,234,0.88)",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F6F9",
  navy: "#1E2530",
  primary: "#E55555",
  blue: "#156BBA",
  green: "#027900",
  yellow: "#C17400",
  purple: "#7215BA",
  teal: "#239CE8",
  red: "#E55555",
};

const cardSx = {
  border: `1px solid ${C.border}`,
  borderRadius: "16px",
  boxShadow: "0 4px 20px -8px rgba(16,24,40,0.07)",
  background: `linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)`,
  backgroundImage: "none",
  transition: "box-shadow 0.18s ease",
  "&:hover": {
    boxShadow: "0 8px 28px -8px rgba(16,24,40,0.11)",
  },
};

// ---- Stat card data -----------------------------------------
const stats = [
  {
    label: "Total Residents",
    value: "1.24M",
    delta: "+3.2%",
    deltaUp: true,
    sublabel: "vs last month",
    icon: <People sx={{ fontSize: 22 }} />,
    tone: { bg: "rgba(30,37,48,0.08)", fg: C.navy },
  },
  {
    label: "Active Incidents",
    value: "24",
    delta: "-8",
    deltaUp: false,
    sublabel: "since yesterday",
    icon: <Warning sx={{ fontSize: 22 }} />,
    tone: { bg: "rgba(229,85,85,0.1)", fg: C.red },
  },
  {
    label: "Resolved Today",
    value: "156",
    delta: "+12",
    deltaUp: true,
    sublabel: "above daily avg",
    icon: <CheckCircle sx={{ fontSize: 22 }} />,
    tone: { bg: "rgba(2,121,0,0.09)", fg: C.green },
  },
  {
    label: "Safety Index",
    value: "92%",
    delta: "+1.4%",
    deltaUp: true,
    sublabel: "city-wide score",
    icon: <TrendingUp sx={{ fontSize: 22 }} />,
    tone: { bg: "rgba(21,107,186,0.1)", fg: C.blue },
  },
];

// ---- Department performance data ---------------------------
const departments = [
  { name: "Hospitals",       count: 42,  color: C.red,    icon: <LocalHospital sx={{ fontSize: 18 }} />,  badge: "Critical" },
  { name: "Police Stations", count: 67,  color: C.blue,   icon: <LocalPolice   sx={{ fontSize: 18 }} />,  badge: "Normal" },
  { name: "Schools",         count: 81,  color: C.yellow,  icon: <School        sx={{ fontSize: 18 }} />,  badge: "Normal" },
  { name: "Fire Stations",   count: 28,  color: C.teal,   icon: <FireTruck     sx={{ fontSize: 18 }} />,  badge: "Low" },
  { name: "Water Supply",    count: 55,  color: C.purple,  icon: <WaterDrop     sx={{ fontSize: 18 }} />,  badge: "Normal" },
  { name: "Power Grid",      count: 73,  color: C.green,  icon: <ElectricBolt  sx={{ fontSize: 18 }} />,  badge: "Normal" },
];

// ---- Live alerts data ---------------------------------------
const alerts = [
  { text: "Water pipeline repair scheduled in Sector 4", time: "Just now",   severity: C.yellow },
  { text: "New safety guidelines issued for all schools",  time: "1 hr ago",  severity: C.blue },
  { text: "Traffic diversion active on NH-48",             time: "2 hrs ago", severity: C.red },
  { text: "Vaccination drive launching tomorrow at 9 AM",  time: "3 hrs ago", severity: C.green },
  { text: "Power outage resolved in Ward 12",              time: "4 hrs ago", severity: C.teal },
];

// ---- Quick-stat mini cards ----------------------------------
const quickStats = [
  { label: "Complaints Filed",   value: "1,842", color: C.navy },
  { label: "Pending Approvals",  value: "318",   color: C.yellow },
  { label: "Schemes Active",     value: "47",    color: C.blue },
  { label: "Budget Utilised",    value: "68%",   color: C.green },
];

// ---- Helper: badge colour mapping ---------------------------
const badgeColors: Record<string, { bg: string; color: string }> = {
  Critical: { bg: "rgba(229,85,85,0.1)",   color: C.red },
  Normal:   { bg: "rgba(2,121,0,0.09)",     color: C.green },
  Low:      { bg: "rgba(21,107,186,0.1)",   color: C.blue },
};

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        fontFamily: '"Plus Jakarta Sans","DM Sans",system-ui,sans-serif',
      }}
    >
      {/* ---- Page header --------------------------------------- */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "clamp(1.35rem, 1rem + 1vw, 1.75rem)",
            color: C.fg,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            fontFamily: '"Plus Jakarta Sans",sans-serif',
          }}
        >
          City Overview
        </Typography>
        <Typography sx={{ color: C.muted, fontSize: "0.875rem", mt: 0.5, fontWeight: 400 }}>
          Real-time metrics and active summaries across all departments.
        </Typography>
      </Box>

      {/* ---- Stat cards --------------------------------------- */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s, i) => (
          <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={i}>
            <Card sx={cardSx}>
              <CardContent sx={{ p: "20px !important" }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: C.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 0.75,
                        fontFamily: '"Plus Jakarta Sans",sans-serif',
                      }}
                    >
                      {s.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "clamp(1.4rem, 1rem + 0.8vw, 1.8rem)",
                        fontWeight: 700,
                        color: C.fg,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.1,
                        fontFamily: '"Plus Jakarta Sans",sans-serif',
                      }}
                    >
                      {s.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: s.tone.bg,
                      color: s.tone.fg,
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
                  {s.deltaUp
                    ? <ArrowUpward sx={{ fontSize: 13, color: C.green }} />
                    : <ArrowDownward sx={{ fontSize: 13, color: C.red }} />}
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: s.deltaUp ? C.green : C.red,
                    }}
                  >
                    {s.delta}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: C.muted2 }}>
                    {s.sublabel}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---- Quick mini-stats bar ------------------------------ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickStats.map((q, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Box
              sx={{
                p: "14px 18px",
                borderRadius: "12px",
                border: `1px solid ${C.border}`,
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: "0.8125rem", color: C.muted, fontWeight: 500, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
                {q.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: q.color,
                  letterSpacing: "-0.02em",
                  fontFamily: '"Plus Jakarta Sans",sans-serif',
                }}
              >
                {q.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ---- Main content row --------------------------------- */}
      <Grid container spacing={2.5}>
        {/* Departmental Performance */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent sx={{ p: "20px !important" }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: C.fg,
                      letterSpacing: "-0.02em",
                      fontFamily: '"Plus Jakarta Sans",sans-serif',
                    }}
                  >
                    Departmental Load
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: C.muted, mt: 0.25 }}>
                    Current operational capacity utilisation
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    border: `1px solid ${C.border}`,
                    bgcolor: C.surfaceAlt,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: C.green, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: C.muted }}>
                    Live
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2.5}>
                {departments.map((dep, i) => {
                  const bc = badgeColors[dep.badge] || badgeColors["Normal"];
                  return (
                    <Box key={i}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: `${dep.color}18`,
                              color: dep.color,
                              flexShrink: 0,
                            }}
                          >
                            {dep.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: C.fg,
                              fontFamily: '"Plus Jakarta Sans",sans-serif',
                            }}
                          >
                            {dep.name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: "6px",
                              bgcolor: bc.bg,
                              color: bc.color,
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                            }}
                          >
                            {dep.badge}
                          </Box>
                          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, color: C.fg, minWidth: 36, textAlign: "right" }}>
                            {dep.count}%
                          </Typography>
                        </Stack>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={dep.count}
                        sx={{
                          height: 6,
                          borderRadius: "9999px",
                          bgcolor: `${dep.color}15`,
                          "& .MuiLinearProgress-bar": {
                            bgcolor: dep.color,
                            borderRadius: "9999px",
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column — Live Alerts */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent sx={{ p: "20px !important" }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: C.fg,
                      letterSpacing: "-0.02em",
                      fontFamily: '"Plus Jakarta Sans",sans-serif',
                    }}
                  >
                    Live Alerts
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: C.muted, mt: 0.25 }}>
                    Active city-wide notifications
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.4,
                    borderRadius: "9999px",
                    bgcolor: "rgba(229,85,85,0.1)",
                    border: "1px solid rgba(229,85,85,0.2)",
                    color: C.red,
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                  }}
                >
                  {alerts.length} Active
                </Box>
              </Stack>

              <Stack
                divider={<Divider sx={{ borderColor: `${C.border}` }} />}
                spacing={0}
              >
                {alerts.map((alert, i) => (
                  <Box
                    key={i}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: alert.severity,
                        mt: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          color: C.fg,
                          lineHeight: 1.45,
                          fontFamily: '"Plus Jakarta Sans",sans-serif',
                        }}
                      >
                        {alert.text}
                      </Typography>
                      <Typography sx={{ fontSize: "0.6875rem", color: C.muted2, mt: 0.25 }}>
                        {alert.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              {/* Footer link */}
              <Box
                sx={{
                  mt: 2,
                  pt: 1.5,
                  borderTop: `1px solid ${C.border}`,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: C.navy,
                    cursor: "pointer",
                    "&:hover": { color: C.primary },
                    transition: "color 0.15s ease",
                    fontFamily: '"Plus Jakarta Sans",sans-serif',
                    letterSpacing: "-0.01em",
                  }}
                >
                  View all alerts →
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
