import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Button, Typography } from '@mui/material';
import { useThemeMode } from '../../../theme/ThemeModeProvider';

const primaryPresets = ['#E55555', '#7C3AED', '#156BBA', '#0F766E', '#C17400'];
const secondaryPresets = ['#1E2530', '#243B53', '#312E81', '#134E4A', '#4A2C2A'];

function ColorChoice({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: string;
  presets: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Box>
      <Typography fontWeight={800}>{label}</Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.25 }}>
        {label === 'Primary color' ? 'Buttons, links, progress, and key actions.' : 'Sidebar selection, navigation, and table headers.'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25, mt: 1.75 }}>
        {presets.map((color) => (
          <Box
            component="button"
            type="button"
            aria-label={`Set ${label.toLowerCase()} to ${color}`}
            aria-pressed={value.toUpperCase() === color}
            key={color}
            onClick={() => onChange(color)}
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '3px solid',
              borderColor: value.toUpperCase() === color ? 'text.primary' : 'transparent',
              bgcolor: color,
              boxShadow: `0 0 0 1px ${color}`,
              cursor: 'pointer',
              '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 3 },
            }}
          />
        ))}
        <Box
          component="label"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { sm: 0.75 }, cursor: 'pointer' }}
        >
          <Box
            component="input"
            type="color"
            aria-label={`Custom ${label.toLowerCase()}`}
            value={value}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            sx={{ width: 44, height: 38, p: 0.25, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', cursor: 'pointer' }}
          />
          <Typography component="span" variant="body2" fontWeight={700}>{value.toUpperCase()}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function BrandColorControl() {
  const { brandColors, setBrandColors, resetBrandColors } = useThemeMode();

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <ColorChoice
        label="Primary color"
        value={brandColors.primaryColor}
        presets={primaryPresets}
        onChange={(primaryColor) => setBrandColors({ primaryColor })}
      />
      <ColorChoice
        label="Secondary color"
        value={brandColors.secondaryColor}
        presets={secondaryPresets}
        onChange={(secondaryColor) => setBrandColors({ secondaryColor })}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained">Primary button</Button>
        <Box sx={{ px: 2, py: 1.25, borderRadius: 1.5, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 800, fontSize: 13 }}>
          Sidebar &amp; table header
        </Box>
        <Button color="inherit" startIcon={<RestartAltIcon />} onClick={resetBrandColors}>Reset colors</Button>
      </Box>
    </Box>
  );
}
