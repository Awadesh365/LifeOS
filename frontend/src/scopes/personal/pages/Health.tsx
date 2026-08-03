import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Slider,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchHealth, saveHealth } from '../../../redux/slices/personalSlice';
import type { HealthLog } from '../types';

interface HealthProps {
  isMobile?: boolean;
}

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
    if (log) {
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
    }
  }, [log]);

  const handleChange = (field: keyof typeof form, value: number | string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    dispatch(saveHealth({ date, ...form }));
  };

  const avgWeek = (field: keyof HealthLog): string => {
    if (!weekly.length) return '0';
    const sum = weekly.reduce((s, d) => s + ((d[field] as number) || 0), 0);
    return (sum / weekly.length).toFixed(1);
  };

  const metricCard = (
    title: string,
    value: string,
    field?: keyof typeof form,
    min?: number,
    max?: number,
    step?: number,
    weekAvgField?: keyof HealthLog,
    weekAvgLabel?: string,
  ) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {value}
          </Typography>
          {field && min !== undefined && max !== undefined && (
            <Slider
              value={form[field] as number}
              onChange={(_, v) => handleChange(field, v as number)}
              min={min}
              max={max}
              step={step ?? 1}
              valueLabelDisplay="auto"
              sx={{ mt: 1 }}
            />
          )}
          {weekAvgField && (
            <Typography variant="caption" color="text.secondary">
              {weekAvgLabel ?? 'Week avg'}: {avgWeek(weekAvgField)}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  const numberField = (
    title: string,
    value: number,
    field: keyof typeof form,
    placeholder: string,
    step?: number,
    weekAvgField?: keyof HealthLog,
    unit?: string,
  ) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {value}
            {unit && ` ${unit}`}
          </Typography>
          <TextField
            type="number"
            size="small"
            fullWidth
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
            inputProps={{ step: step ?? 1 }}
            sx={{ mt: 1 }}
          />
          {weekAvgField && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Week avg: {avgWeek(weekAvgField)} {unit ?? ''}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <>
      <Header title="Health Dashboard" subtitle="Track recovery, training, mood, and energy in one place" />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ minWidth: 160 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {loading && <CircularProgress size={20} />}
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {metricCard(
            'Sleep',
            `${form.sleepHours}h`,
            'sleepHours',
            0,
            12,
            0.5,
            'sleepHours',
            'Week avg',
          )}
          {metricCard('Sleep Quality', `${form.sleepQuality}/5`, 'sleepQuality', 1, 5)}
          {numberField('Gym', form.gymMinutes, 'gymMinutes', 'Minutes', 1, 'gymMinutes', 'min')}
          {numberField('Walking', form.walkMinutes, 'walkMinutes', 'Minutes', 1, undefined, 'min')}
          {numberField('Meditation', form.meditationMinutes, 'meditationMinutes', 'Minutes', 1, undefined, 'min')}
          {numberField('Water', form.waterLiters, 'waterLiters', 'Liters', 0.1, undefined, 'L')}
          {metricCard('Diet Score', `${form.dietScore}/5`, 'dietScore', 1, 5)}
          {metricCard('Mood', `${form.moodScore}/10`, 'moodScore', 1, 10)}
          {metricCard('Mental Peace', `${form.mentalPeaceScore}/10`, 'mentalPeaceScore', 1, 10)}
          {numberField(
            'Socialization',
            form.socializationMinutes,
            'socializationMinutes',
            'Minutes',
            1,
            undefined,
            'min',
          )}
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Notes
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="How are you feeling today?"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </CardContent>
        </Card>

        <Button variant="contained" onClick={handleSave} sx={{ mb: 3 }}>
          Save Health Data
        </Button>

        {weekly.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This Week
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 120 }}>
                {weekly.map((d) => (
                  <Box
                    key={d.date}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 32,
                        height: `${(d.moodScore || 0) * 10}%`,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        minHeight: 4,
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      {d.date?.slice(5)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
}
