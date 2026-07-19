import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { LifeOSScopeBar } from "./LifeOSScopeBar";
import { LIFEOS_SCOPES, type LifeOSScopeId } from "./scopeNavigation";

interface LifeOSScopePlaceholderProps {
  scopeId: LifeOSScopeId;
}

export const LifeOSScopePlaceholder = ({ scopeId }: LifeOSScopePlaceholderProps) => {
  const scope = LIFEOS_SCOPES.find((item) => item.id === scopeId)!;
  const Icon = scope.Icon;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fb" }}>
      <LifeOSScopeBar activeScope={scope.id} />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            border: "1px solid rgba(216,224,234,0.96)",
            borderRadius: "8px",
            bgcolor: "#fff",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Stack spacing={2.25}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                bgcolor: "#111827",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: 25 }} />
            </Box>
            <Box>
              <Typography
                component="h1"
                sx={{
                  color: "#111827",
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: 0,
                }}
              >
                {scope.label}
              </Typography>
              <Typography sx={{ mt: 1, color: "#475467", fontSize: "1rem", lineHeight: 1.7, maxWidth: 780 }}>
                {scope.description}
              </Typography>
            </Box>
            <Typography sx={{ color: "#667085", lineHeight: 1.7, maxWidth: 820 }}>
              This scope is part of the LifeOS foundation. It is intentionally
              visible in navigation now, while its full workflows will be built
              after the Personal and City layers are stable inside one repo.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                component={RouterLink}
                to="/personal"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "#111827",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#1f2937" },
                }}
              >
                Open Personal
              </Button>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  borderColor: "rgba(17,24,39,0.22)",
                  color: "#111827",
                  textTransform: "none",
                  fontWeight: 800,
                }}
              >
                View All Scopes
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

