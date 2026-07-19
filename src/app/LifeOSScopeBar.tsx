import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import {
  getLifeOSScopeFromPath,
  LIFEOS_SCOPES,
  type LifeOSScopeId,
} from "./scopeNavigation";

interface LifeOSScopeBarProps {
  activeScope?: LifeOSScopeId;
  compact?: boolean;
}

const statusLabel = {
  complete: "Live",
  foundation: "Foundation",
  planned: "Planned",
} as const;

export const LifeOSScopeBar = ({
  activeScope,
  compact = false,
}: LifeOSScopeBarProps) => {
  const location = useLocation();
  const currentScope = activeScope ?? getLifeOSScopeFromPath(location.pathname);

  return (
    <Box
      sx={{
        borderBottom: "1px solid rgba(216,224,234,0.9)",
        bgcolor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <Box
        sx={{
          px: { xs: 1.5, md: 2.5 },
          py: compact ? 0.75 : 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minHeight: compact ? 44 : 52,
          overflowX: "auto",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              bgcolor: "#111827",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            L
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              sx={{
                color: "#111827",
                fontSize: "0.875rem",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: 0,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              LifeOS
            </Typography>
            <Typography
              sx={{
                color: "#667085",
                fontSize: "0.6875rem",
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: 0,
              }}
            >
              Scope Switcher
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center">
          {LIFEOS_SCOPES.map((scope) => {
            const isActive = currentScope === scope.id;
            const Icon = scope.Icon;

            return (
              <Button
                key={scope.id}
                component={NavLink}
                to={scope.route}
                size="small"
                startIcon={<Icon sx={{ fontSize: 17 }} />}
                sx={{
                  flexShrink: 0,
                  minHeight: 34,
                  px: 1.15,
                  borderRadius: "8px",
                  border: `1px solid ${
                    isActive ? "rgba(17,24,39,0.35)" : "rgba(216,224,234,0.9)"
                  }`,
                  bgcolor: isActive ? "#111827" : "rgba(255,255,255,0.84)",
                  color: isActive ? "#fff" : "#344054",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  letterSpacing: 0,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  "&:hover": {
                    bgcolor: isActive ? "#111827" : "rgba(244,246,249,0.95)",
                    borderColor: isActive ? "rgba(17,24,39,0.35)" : "rgba(17,24,39,0.22)",
                  },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0, sm: 0.75 },
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  {scope.label}
                </Box>
              </Button>
            );
          })}
        </Stack>

        {!compact && currentScope && (
          <Chip
            size="small"
            label={statusLabel[LIFEOS_SCOPES.find((scope) => scope.id === currentScope)?.status ?? "planned"]}
            sx={{
              ml: "auto",
              display: { xs: "none", md: "inline-flex" },
              borderRadius: "8px",
              bgcolor: "rgba(21,107,186,0.08)",
              color: "#155fa0",
              fontWeight: 700,
              border: "1px solid rgba(21,107,186,0.16)",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

