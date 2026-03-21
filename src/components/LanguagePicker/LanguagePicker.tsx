/**
 * Language Picker — Premium redesign
 * Supports all 22 scheduled languages of India + English
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Menu,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import {
  INDIAN_LANGUAGES,
  LanguageOption,
  changeLanguage,
  getCurrentLanguage,
} from "../../i18n";

// Design tokens
const C = {
  fg: "#111827",
  muted: "#667085",
  muted2: "#98A2B3",
  border: "rgba(216,224,234,0.88)",
  surfaceAlt: "#F4F6F9",
  navy: "#1E2530",
  navyFg: "#F9FAFB",
  primary: "#E55555",
  green: "#027900",
};

interface LanguagePickerProps {
  variant?: "icon" | "button" | "full";
  showNativeName?: boolean;
}

const MOST_USED = ["en", "hi", "bn", "te", "mr", "ta"];

const GROUPS: Record<string, string[]> = {
  "North India":     ["UP", "Punjab", "J&K", "Bihar", "North"],
  "South India":     ["Tamil", "Kerala", "Karnataka", "Andhra", "Telangana"],
  "East India":      ["Bengal", "Odisha", "Jharkhand"],
  "West India":      ["Gujarat", "Maharashtra", "Goa"],
  "Northeast India": ["Assam", "Manipur", "Sikkim", "Tripura"],
};

const LanguagePicker: React.FC<LanguagePickerProps> = ({
  variant = "button",
  showNativeName = true,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const currentLang = getCurrentLanguage();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => { setAnchorEl(null); setSearchTerm(""); };

  const handleSelect = async (lang: LanguageOption) => {
    await changeLanguage(lang.code);
    handleClose();
  };

  const filtered = useMemo(() => {
    if (!searchTerm) return INDIAN_LANGUAGES;
    const t = searchTerm.toLowerCase();
    return INDIAN_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(t) ||
        l.nativeName.toLowerCase().includes(t) ||
        l.code.toLowerCase().includes(t) ||
        l.region?.toLowerCase().includes(t)
    );
  }, [searchTerm]);

  const mostUsedList = useMemo(
    () => filtered.filter((l) => MOST_USED.includes(l.code)),
    [filtered]
  );

  const grouped = useMemo(() => {
    const result: { label: string; items: LanguageOption[] }[] = [];

    Object.entries(GROUPS).forEach(([label, keywords]) => {
      const items = filtered.filter(
        (l) =>
          !MOST_USED.includes(l.code) &&
          l.region &&
          keywords.some((kw) => l.region!.includes(kw))
      );
      if (items.length) result.push({ label, items });
    });

    const categorised = result.flatMap((g) => g.items);
    const other = filtered.filter(
      (l) => !MOST_USED.includes(l.code) && !categorised.includes(l)
    );
    if (other.length) result.push({ label: "Other", items: other });

    return result;
  }, [filtered]);

  // ---- Trigger button ----------------------------------------
  const renderTrigger = () => {
    if (variant === "icon") {
      return (
        <Button
          onClick={handleOpen}
          sx={{
            minWidth: 36, width: 36, height: 36,
            borderRadius: "9999px",
            border: "1px solid rgba(216,224,234,0.9)",
            background: "linear-gradient(180deg,rgba(255,255,255,0.9) 0%,rgba(248,250,252,0.85) 100%)",
            color: C.muted,
            "&:hover": { borderColor: "rgba(30,37,48,0.22)", color: C.fg },
          }}
        >
          <LanguageIcon sx={{ fontSize: 17 }} />
        </Button>
      );
    }

    return (
      <Button
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14, color: C.muted2, ml: -0.25 }} />}
        sx={{
          textTransform: "none",
          color: C.fg,
          fontSize: "0.8125rem",
          fontWeight: 600,
          fontFamily: '"Plus Jakarta Sans","DM Sans",sans-serif',
          letterSpacing: "-0.01em",
          px: 1.5,
          height: 36,
          borderRadius: "9999px",
          border: "1px solid rgba(216,224,234,0.9)",
          background: "linear-gradient(180deg,rgba(255,255,255,0.9) 0%,rgba(248,250,252,0.85) 100%)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 1px 3px rgba(16,24,40,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          gap: 0.75,
          transition: "all 0.18s ease",
          "&:hover": {
            background: "linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(244,246,249,0.95) 100%)",
            borderColor: "rgba(30,37,48,0.22)",
            boxShadow: "0 2px 6px rgba(16,24,40,0.1), inset 0 1px 0 rgba(255,255,255,1)",
          },
          "& .MuiButton-endIcon": { marginLeft: 0 },
        }}
      >
        <LanguageIcon sx={{ fontSize: 15, color: C.muted }} />
        {showNativeName ? currentLang.nativeName : currentLang.code.toUpperCase()}
      </Button>
    );
  };

  // ---- Single language row -----------------------------------
  const LangRow = ({ lang }: { lang: LanguageOption }) => {
    const active = currentLang.code === lang.code;
    return (
      <Box
        onClick={() => handleSelect(lang)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
          mx: 1,
          borderRadius: "10px",
          cursor: "pointer",
          backgroundColor: active ? C.navy : "transparent",
          transition: "background-color 0.14s ease",
          "&:hover": {
            backgroundColor: active ? C.navy : "rgba(30,37,48,0.05)",
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: active ? 700 : 600,
              color: active ? C.navyFg : C.fg,
              fontFamily: '"Plus Jakarta Sans",sans-serif',
              lineHeight: 1.25,
            }}
          >
            {lang.nativeName}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.6875rem",
              color: active ? "rgba(249,250,251,0.65)" : C.muted2,
              fontWeight: 500,
              lineHeight: 1.2,
              mt: 0.2,
            }}
          >
            {lang.name}{lang.region ? ` · ${lang.region}` : ""}
          </Typography>
        </Box>

        {active && (
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: "rgba(249,250,251,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ml: 1,
            }}
          >
            <CheckIcon sx={{ fontSize: 13, color: C.navyFg }} />
          </Box>
        )}
      </Box>
    );
  };

  // ---- Section label ----------------------------------------
  const SectionLabel = ({ text }: { text: string }) => (
    <Typography
      sx={{
        px: 2.5,
        pt: 1.5,
        pb: 0.5,
        fontSize: "0.6875rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: C.muted2,
        fontFamily: '"Plus Jakarta Sans",sans-serif',
        display: "block",
      }}
    >
      {text}
    </Typography>
  );

  return (
    <>
      {renderTrigger()}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
        PaperProps={{
          sx: {
            width: 340,
            maxHeight: 520,
            borderRadius: "18px",
            boxShadow:
              "0 24px 64px -16px rgba(16,24,40,0.22), 0 0 0 1px rgba(216,224,234,0.55)",
            border: "1px solid rgba(216,224,234,0.65)",
            background: "rgba(255,255,255,0.99)",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        marginThreshold={8}
        slotProps={{ paper: { elevation: 0 } }}
      >
        {/* ---- Header ---------------------------------------- */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1.5,
            borderBottom: `1px solid ${C.border}`,
            background:
              "linear-gradient(180deg,rgba(248,250,252,0.9) 0%,rgba(255,255,255,0) 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: C.fg,
                  letterSpacing: "-0.02em",
                  fontFamily: '"Plus Jakarta Sans",sans-serif',
                  lineHeight: 1.2,
                }}
              >
                Select Language
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: C.muted, mt: 0.2 }}>
                {INDIAN_LANGUAGES.length} languages available
              </Typography>
            </Box>
            {/* Current language badge */}
            <Box
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: "9999px",
                bgcolor: "rgba(30,37,48,0.07)",
                border: "1px solid rgba(30,37,48,0.1)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: C.navy,
                  fontFamily: '"Plus Jakarta Sans",sans-serif',
                }}
              >
                {currentLang.nativeName}
              </Typography>
            </Box>
          </Box>

          {/* Search */}
          <TextField
            size="small"
            fullWidth
            autoComplete="off"
            placeholder="Search language or region…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: C.muted2 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "rgba(241,245,249,0.8)",
                fontSize: "0.875rem",
                fontFamily: '"Plus Jakarta Sans",sans-serif',
                "& fieldset": { borderColor: "rgba(216,224,234,0.9)" },
                "&:hover fieldset": { borderColor: "rgba(30,37,48,0.2)" },
                "&.Mui-focused fieldset": {
                  borderColor: "#E55555",
                  borderWidth: 1,
                  boxShadow: "0 0 0 3px rgba(229,85,85,0.1)",
                },
              },
              "& .MuiInputBase-input": {
                py: "8px",
                color: C.fg,
                "&::placeholder": { color: C.muted2, opacity: 1 },
              },
            }}
          />
        </Box>

        {/* ---- Scrollable list -------------------------------- */}
        <Box sx={{ overflowY: "auto", flex: 1, py: 1 }}>

          {filtered.length === 0 && (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.875rem", color: C.muted }}>
                No languages match "{searchTerm}"
              </Typography>
            </Box>
          )}

          {/* Most used — quick chips */}
          {mostUsedList.length > 0 && (
            <Box sx={{ px: 1.5, pt: 0.5, pb: 1 }}>
              <SectionLabel text="Most Used" />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, px: 1, pt: 0.5 }}>
                {mostUsedList.map((lang) => {
                  const active = currentLang.code === lang.code;
                  return (
                    <Box
                      key={lang.code}
                      onClick={() => handleSelect(lang)}
                      sx={{
                        px: 1.5,
                        py: 0.6,
                        borderRadius: "9999px",
                        border: "1px solid",
                        borderColor: active ? C.navy : "rgba(216,224,234,0.9)",
                        bgcolor: active ? C.navy : "rgba(255,255,255,0.8)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: active ? C.navy : "rgba(30,37,48,0.25)",
                          bgcolor: active ? C.navy : "rgba(30,37,48,0.04)",
                        },
                      }}
                    >
                      {active && <CheckIcon sx={{ fontSize: 11, color: C.navyFg }} />}
                      <Typography
                        sx={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: active ? C.navyFg : C.fg,
                          fontFamily: '"Plus Jakarta Sans",sans-serif',
                          lineHeight: 1,
                        }}
                      >
                        {lang.nativeName}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Divider between chips and full list */}
          {mostUsedList.length > 0 && grouped.length > 0 && (
            <Box sx={{ mx: 2, my: 0.5, borderTop: `1px solid ${C.border}` }} />
          )}

          {/* Grouped rows */}
          {grouped.map(({ label, items }) => (
            <Box key={label}>
              <SectionLabel text={label} />
              <Box sx={{ pb: 0.5 }}>
                {items.map((lang) => (
                  <LangRow key={lang.code} lang={lang} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ---- Footer ---------------------------------------- */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "rgba(248,250,252,0.7)",
          }}
        >
          <Typography sx={{ fontSize: "0.6875rem", color: C.muted2, fontWeight: 500 }}>
            CityOS · Bharat Language Suite
          </Typography>
          <Box
            sx={{
              px: 1,
              py: 0.3,
              borderRadius: "6px",
              bgcolor: "rgba(2,121,0,0.08)",
              border: "1px solid rgba(2,121,0,0.15)",
            }}
          >
            <Typography sx={{ fontSize: "0.625rem", fontWeight: 700, color: "#027900", letterSpacing: "0.04em" }}>
              RTL SUPPORT
            </Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default LanguagePicker;
