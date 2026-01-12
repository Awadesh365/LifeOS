/**
 * Language Picker Component
 * Supports all 22 scheduled languages of India + English
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  ListItemText,
  ListItemIcon,
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

interface LanguagePickerProps {
  variant?: "icon" | "button" | "full";
  showNativeName?: boolean;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({
  variant = "button",
  showNativeName = true,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const currentLang = getCurrentLanguage();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const handleLanguageSelect = async (lang: LanguageOption) => {
    await changeLanguage(lang.code);
    handleClose();
  };

  // Filter languages by search
  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return INDIAN_LANGUAGES;
    const term = searchTerm.toLowerCase();
    return INDIAN_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(term) ||
        lang.nativeName.toLowerCase().includes(term) ||
        lang.code.toLowerCase().includes(term) ||
        lang.region?.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Group languages by region
  const groupedLanguages = useMemo(() => {
    const groups: { [key: string]: LanguageOption[] } = {
      "Most Used": [],
      "North India": [],
      "South India": [],
      "East India": [],
      "West India": [],
      "Northeast India": [],
      Other: [],
    };

    // Most used languages first
    const mostUsed = ["en", "hi", "bn", "te", "mr", "ta"];

    filteredLanguages.forEach((lang) => {
      if (mostUsed.includes(lang.code)) {
        groups["Most Used"].push(lang);
      }

      if (lang.region) {
        if (
          lang.region.includes("North") ||
          lang.region.includes("UP") ||
          lang.region.includes("Punjab") ||
          lang.region.includes("J&K") ||
          lang.region.includes("Bihar")
        ) {
          if (!mostUsed.includes(lang.code)) groups["North India"].push(lang);
        } else if (
          lang.region.includes("Tamil") ||
          lang.region.includes("Kerala") ||
          lang.region.includes("Karnataka") ||
          lang.region.includes("Andhra") ||
          lang.region.includes("Telangana")
        ) {
          if (!mostUsed.includes(lang.code)) groups["South India"].push(lang);
        } else if (
          lang.region.includes("Bengal") ||
          lang.region.includes("Odisha") ||
          lang.region.includes("Jharkhand")
        ) {
          if (!mostUsed.includes(lang.code)) groups["East India"].push(lang);
        } else if (
          lang.region.includes("Gujarat") ||
          lang.region.includes("Maharashtra") ||
          lang.region.includes("Goa")
        ) {
          if (!mostUsed.includes(lang.code)) groups["West India"].push(lang);
        } else if (
          lang.region.includes("Assam") ||
          lang.region.includes("Manipur") ||
          lang.region.includes("Sikkim") ||
          lang.region.includes("Tripura")
        ) {
          if (!mostUsed.includes(lang.code))
            groups["Northeast India"].push(lang);
        } else {
          if (!mostUsed.includes(lang.code)) groups["Other"].push(lang);
        }
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }, [filteredLanguages]);

  // Render trigger button based on variant
  const renderTrigger = () => {
    switch (variant) {
      case "icon":
        return (
          <Button
            onClick={handleOpen}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: 2,
              color: "#64748b",
              "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
            }}
          >
            <LanguageIcon fontSize="small" />
          </Button>
        );
      case "full":
        return (
          <Button
            onClick={handleOpen}
            endIcon={<KeyboardArrowDownIcon />}
            startIcon={<LanguageIcon />}
            sx={{
              textTransform: "none",
              color: "#0f172a",
              bgcolor: "#f1f5f9",
              px: 2,
              borderRadius: 2,
              "&:hover": { bgcolor: "#e2e8f0" },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentLang.nativeName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontSize: "0.7rem" }}
              >
                {currentLang.name}
              </Typography>
            </Box>
          </Button>
        );
      default:
        return (
          <Button
            onClick={handleOpen}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              color: "#64748b",
              fontSize: "0.8rem",
              px: 1.5,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
            }}
          >
            <LanguageIcon sx={{ fontSize: 16, mr: 0.5 }} />
            {showNativeName
              ? currentLang.nativeName
              : currentLang.code.toUpperCase()}
          </Button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 480,
            borderRadius: 3,
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            border: "1px solid #e2e8f0",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Search */}
        <Box sx={{ p: 1.5, pb: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={t("common.selectLanguage")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
              },
            }}
          />
        </Box>

        {/* Language count */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {INDIAN_LANGUAGES.length} {t("common.language")}s available
          </Typography>
        </Box>

        <Divider />

        {/* Language groups */}
        <Box sx={{ maxHeight: 360, overflow: "auto" }}>
          {Object.entries(groupedLanguages).map(([group, languages]) => (
            <Box key={group}>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: "block",
                  color: "#94a3b8",
                  fontWeight: 600,
                  bgcolor: "#f8fafc",
                }}
              >
                {group}
              </Typography>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor:
                      currentLang.code === lang.code
                        ? "#f1f5f9"
                        : "transparent",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              currentLang.code === lang.code ? 600 : 500,
                          }}
                        >
                          {lang.nativeName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          ({lang.name})
                        </Typography>
                      </Box>
                    }
                    secondary={
                      lang.region && (
                        <Typography
                          variant="caption"
                          sx={{ color: "#94a3b8", fontSize: "0.7rem" }}
                        >
                          {lang.region}
                        </Typography>
                      )
                    }
                  />
                  {currentLang.code === lang.code && (
                    <ListItemIcon sx={{ minWidth: "auto" }}>
                      <CheckIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Divider />
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Powered by CityOS
          </Typography>
          <Chip
            label="RTL Support"
            size="small"
            sx={{ fontSize: "0.65rem", height: 20 }}
          />
        </Box>
      </Menu>
    </>
  );
};

export default LanguagePicker;
