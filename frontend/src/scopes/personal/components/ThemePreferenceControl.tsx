import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Box, Typography } from '@mui/material';
import { useThemeMode, type ThemePreference } from '../../../theme/ThemeModeProvider';

const options: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'system',
    label: 'System',
    description: 'Match this device automatically.',
    icon: <BrightnessAutoIcon />,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Use the bright LifeOS palette.',
    icon: <LightModeOutlinedIcon />,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Use the low-light LifeOS palette.',
    icon: <DarkModeOutlinedIcon />,
  },
];

export default function ThemePreferenceControl() {
  const { preference, setPreference } = useThemeMode();

  return (
    <Box
      role="radiogroup"
      aria-label="Theme preference"
      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}
    >
      {options.map((option) => {
        const selected = preference === option.value;
        return (
          <Box
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            key={option.value}
            onClick={() => setPreference(option.value)}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              minHeight: 112,
              p: 2,
              border: 1,
              borderColor: selected ? 'secondary.main' : 'divider',
              borderRadius: 2,
              bgcolor: selected ? 'action.selected' : 'background.paper',
              color: selected ? 'secondary.main' : 'text.secondary',
              cursor: 'pointer',
              textAlign: 'left',
              font: 'inherit',
              transition: 'border-color 160ms ease, background-color 160ms ease',
              '&:hover': { borderColor: 'secondary.main', bgcolor: 'action.hover' },
              '&:focus-visible': { outline: '3px solid rgba(229, 85, 85, 0.22)', outlineOffset: 2 },
            }}
          >
            <Box sx={{ display: 'grid', placeItems: 'center', mt: 0.25 }}>{option.icon}</Box>
            <Box>
              <Typography color="text.primary" fontWeight={800}>{option.label}</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, lineHeight: 1.55 }}>
                {option.description}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
