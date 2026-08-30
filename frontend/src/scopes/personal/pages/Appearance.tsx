import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import { Box, Paper, Typography } from '@mui/material';
import Header from '../components/Header';
import ThemePreferenceControl from '../components/ThemePreferenceControl';

export default function Appearance() {
  return (
    <>
      <Header title="Appearance" subtitle="Choose how LifeOS looks across your workspace" />
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 980 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={800}>Theme</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, mb: 3 }}>
            Your choice updates the sidebar, buttons, table headers, cards, and page surfaces.
          </Typography>
          <ThemePreferenceControl />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, color: 'text.secondary' }}>
            <CloudDoneOutlinedIcon sx={{ fontSize: 19 }} />
            <Typography variant="caption">
              Saved to your LifeOS profile and shared with the mobile app.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
