import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { LifeOSScopeBar } from "../../app/LifeOSScopeBar";
import { LIFEOS_SCOPES } from "../../app/scopeNavigation";

const statusColor = {
  complete: {
    label: "Live",
    bg: "rgba(2,121,0,0.08)",
    color: "#027900",
    border: "rgba(2,121,0,0.16)",
  },
  foundation: {
    label: "Foundation",
    bg: "rgba(21,107,186,0.08)",
    color: "#156BBA",
    border: "rgba(21,107,186,0.16)",
  },
  planned: {
    label: "Planned",
    bg: "rgba(102,112,133,0.08)",
    color: "#667085",
    border: "rgba(102,112,133,0.18)",
  },
} as const;

const LifeOSHome = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <LifeOSScopeBar />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ maxWidth: 820 }}>
              <Typography
                component="h1"
                sx={{
                  color: "#111827",
                  fontSize: { xs: "2rem", md: "2.85rem" },
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: 0,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                LifeOS
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.08rem" },
                  maxWidth: 760,
                  lineHeight: 1.65,
                }}
              >
                One operating system for the path from self-management to society,
                city, state, country, and world-level systems.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                component={RouterLink}
                to="/personal"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 2,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Open Personal
              </Button>
              <Button
                component={RouterLink}
                to="/city"
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  borderColor: "primary.main",
                  color: "primary.main",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 2,
                }}
              >
                Open City
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={2}>
            {LIFEOS_SCOPES.map((scope) => {
              const Icon = scope.Icon;
              const tone = statusColor[scope.status];

              return (
                <Grid size={{ xs: 12, md: 6, xl: 4 }} key={scope.id}>
                  <Box
                    component={RouterLink}
                    to={scope.route}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      minHeight: 226,
                      height: "100%",
                      p: 2.25,
                      borderRadius: "8px",
                      border: "1px solid rgba(216,224,234,0.96)",
                      bgcolor: "background.paper",
                      color: "inherit",
                      textDecoration: "none",
                      boxShadow: "0 8px 24px -18px rgba(16,24,40,0.12)",
                      transition: "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                      "&:hover": {
                        borderColor: "rgba(229,85,85,0.45)",
                        boxShadow: "0 16px 36px -24px rgba(16,24,40,0.16)",
                        transform: "translateY(-2px)",
                        textDecoration: "none",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "8px",
                          bgcolor: "secondary.main",
                          color: "secondary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon sx={{ fontSize: 22 }} />
                      </Box>
                      <Chip
                        size="small"
                        label={tone.label}
                        sx={{
                          borderRadius: "8px",
                          bgcolor: tone.bg,
                          color: tone.color,
                          border: `1px solid ${tone.border}`,
                          fontWeight: 800,
                        }}
                      />
                    </Stack>

                    <Box>
                      <Typography
                        component="h2"
                        sx={{
                          color: "#111827",
                          fontWeight: 900,
                          fontSize: "1.25rem",
                          lineHeight: 1.2,
                          letterSpacing: 0,
                        }}
                      >
                        {scope.label}
                      </Typography>
                      <Typography sx={{ mt: 0.75, color: "#667085", lineHeight: 1.65 }}>
                        {scope.description}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mt: "auto" }}
                    >
                      <Typography sx={{ color: "#98a2b3", fontSize: "0.8125rem", fontWeight: 700 }}>
                        {scope.source}
                      </Typography>
                      <ArrowForwardIcon sx={{ color: "primary.main", fontSize: 18 }} />
                    </Stack>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default LifeOSHome;

