import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SelfImprovementOutlinedIcon from '@mui/icons-material/SelfImprovementOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchHealth, saveHealth } from '../../../redux/slices/personalSlice';
import type { HealthLog } from '../types';

interface HealthProps {
  isMobile?: boolean;
}

const iconTileSx = {
  display: 'grid',
  width: 38,
  height: 38,
  flex: '0 0 auto',
  placeItems: 'center',
  borderRadius: 2.25,
  bgcolor: '#FFF1F0',
  color: 'primary.main',
};

export default function Health({ isMobile = false }: HealthProps) {
  const dispatch = useAppDispatch();
  const { log, weekly, loading, error } = useAppSelector((s) => s.personal.health);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [form, setForm] = useState<Omit<HealthLog, 'id' | 'date'>>({
    gymMinutes: 0,
    walkMinutes: 0,
    meditationMinutes: 0,
    sleepHours: 0,
    sleepQuality: 3,
    waterLiters: 0,
    dietScore: 3,
    socializationMinutes: 0,
    mentalPeaceScore: 5,
    moodScore: 5,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchHealth(date));
  }, [dispatch, date]);

  useEffect(() => {
    if (!log) return;
    setForm({
      gymMinutes: log.gymMinutes || 0,
      walkMinutes: log.walkMinutes || 0,
      meditationMinutes: log.meditationMinutes || 0,
      sleepHours: log.sleepHours || 0,
      sleepQuality: log.sleepQuality || 3,
      waterLiters: log.waterLiters || 0,
      dietScore: log.dietScore || 3,
      socializationMinutes: log.socializationMinutes || 0,
      mentalPeaceScore: log.mentalPeaceScore || 5,
      moodScore: log.moodScore || 5,
      notes: log.notes || '',
    });
  }, [log]);

  const handleChange = (field: keyof typeof form, value: number | string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const avgWeek = (field: keyof HealthLog): string => {
    if (!weekly.length) return 'No weekly data';
    const sum = weekly.reduce((total, day) => total + ((day[field] as number) || 0), 0);
    return `${(sum / weekly.length).toFixed(1)} weekly avg`;
  };

  const scoreCard = (
    title: string,
    value: string,
    field: keyof typeof form,
    min: number,
    max: number,
    icon: ReactNode,
    step = 1,
    helper?: string,
  ) => (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={iconTileSx}>{icon}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary">{title}</Typography>
              <Typography variant="h5" sx={{ mt: 0.25 }}>{value}</Typography>
            </Box>
          </Box>
          <Slider
            aria-label={title}
            value={form[field] as number}
            onChange={(_, nextValue) => handleChange(field, nextValue as number)}
            min={min}
            max={max}
            step={step}
            valueLabelDisplay="auto"
          />
          {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
        </CardContent>
      </Card>
    </Grid>
  );

  const inputCard = (
    title: string,
    field: keyof typeof form,
    value: number,
    unit: string,
    icon: ReactNode,
    step = 1,
    helper?: string,
  ) => (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={iconTileSx}>{icon}</Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{title}</Typography>
              <Typography variant="h5" sx={{ mt: 0.25 }}>{value || 0} <Typography component="span" variant="body2" color="text.secondary">{unit}</Typography></Typography>
            </Box>
          </Box>
          <TextField
            type="number"
            size="small"
            fullWidth
            value={value || ''}
            onChange={(event) => handleChange(field, Number.parseFloat(event.target.value) || 0)}
            slotProps={{
              htmlInput: { step, min: 0, 'aria-label': title },
              input: { endAdornment: <InputAdornment position="end">{unit}</InputAdornment> },
            }}
          />
          {helper && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.25 }}>{helper}</Typography>}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <>
      <Header title="Health" subtitle="A calm daily check-in for recovery, movement, and mental wellbeing" />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Health data could not be loaded. Your current entries are still visible—check the connection and try again.
          </Alert>
        )}

        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #18212D 0%, #263346 100%)', color: 'white', border: 0 }}>
          <CardContent sx={{ display: 'flex', alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#F2A2A2', fontWeight: 800, letterSpacing: '0.12em' }}>Daily wellbeing check-in</Typography>
              <Typography variant="h4" sx={{ mt: 0.25, color: 'white' }}>How is your system running today?</Typography>
              <Typography variant="body2" sx={{ mt: 1, color: '#B9C4D2', maxWidth: 620 }}>Log the signals that matter. Trends become useful when the daily input stays simple and honest.</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <TextField
                type="date"
                size="small"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                slotProps={{ htmlInput: { 'aria-label': 'Health log date' } }}
                sx={{ minWidth: 170, '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
              />
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveOutlinedIcon />}
                onClick={() => dispatch(saveHealth({ date, ...form }))}
                disabled={loading}
              >
                Save check-in
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', mb: 1.75 }}>
          <Box>
            <Typography variant="h6">Recovery & mindset</Typography>
            <Typography variant="body2" color="text.secondary">Rate how restored, calm, and positive you feel.</Typography>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3.5 }}>
          {scoreCard('Sleep duration', `${form.sleepHours} hrs`, 'sleepHours', 0, 12, <BedtimeOutlinedIcon fontSize="small" />, 0.5, avgWeek('sleepHours'))}
          {scoreCard('Sleep quality', `${form.sleepQuality} / 5`, 'sleepQuality', 1, 5, <BedtimeOutlinedIcon fontSize="small" />)}
          {scoreCard('Mood', `${form.moodScore} / 10`, 'moodScore', 1, 10, <MoodOutlinedIcon fontSize="small" />)}
          {scoreCard('Mental peace', `${form.mentalPeaceScore} / 10`, 'mentalPeaceScore', 1, 10, <PsychologyOutlinedIcon fontSize="small" />)}
        </Grid>

        <Box sx={{ mb: 1.75 }}>
          <Typography variant="h6">Movement & daily inputs</Typography>
          <Typography variant="body2" color="text.secondary">Capture activity, hydration, nutrition, and connection.</Typography>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {inputCard('Strength training', 'gymMinutes', form.gymMinutes, 'min', <FitnessCenterOutlinedIcon fontSize="small" />, 1, avgWeek('gymMinutes'))}
          {inputCard('Walking', 'walkMinutes', form.walkMinutes, 'min', <DirectionsWalkOutlinedIcon fontSize="small" />)}
          {inputCard('Meditation', 'meditationMinutes', form.meditationMinutes, 'min', <SelfImprovementOutlinedIcon fontSize="small" />)}
          {inputCard('Water', 'waterLiters', form.waterLiters, 'L', <WaterDropOutlinedIcon fontSize="small" />, 0.1)}
          {scoreCard('Diet quality', `${form.dietScore} / 5`, 'dietScore', 1, 5, <RestaurantOutlinedIcon fontSize="small" />)}
          {inputCard('Social connection', 'socializationMinutes', form.socializationMinutes, 'min', <GroupsOutlinedIcon fontSize="small" />)}
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6">Daily note</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>Add context that numbers cannot capture—stress, soreness, energy, or a meaningful win.</Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              placeholder="What affected your wellbeing today?"
              value={form.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={() => dispatch(saveHealth({ date, ...form }))}>
                Save health check-in
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
