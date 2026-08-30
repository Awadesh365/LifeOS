import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import { Box, Paper, Typography } from '@mui/material';
import Header from '../components/Header';
import ThemePreferenceControl from '../components/ThemePreferenceControl';
import BrandColorControl from '../components/BrandColorControl';

export default function Appearance() {
  return (
    <>
      <Header title="Appearance" subtitle="Choose how LifeOS looks across your workspace" />
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 980 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={800}>Brand colors</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, mb: 3 }}>
            Choose the primary and secondary colors used throughout your LifeOS workspace.
          </Typography>
          <BrandColorControl />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, color: 'text.secondary' }}>
            <CloudDoneOutlinedIcon sx={{ fontSize: 19 }} />
            <Typography variant="caption">
              Saved to your LifeOS profile and shared with the mobile app.
            </Typography>
          </Box>
        </Paper>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
          <Typography variant="h6" fontWeight={800}>Color mode</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, mb: 3 }}>
            Use your chosen brand colors with the system, light, or dark interface.
          </Typography>
          <ThemePreferenceControl />
        </Paper>
      </Box>
    </>
  );
}
