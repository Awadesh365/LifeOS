import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Header from '../components/Header';
import { useAppDispatch } from '../../../hooks/redux';
import { toggleHabit as toggleHabitThunk } from '../../../redux/slices/personalSlice';
import { api } from '../api/client';
import type { HabitWithDone } from '../types';

interface HabitsProps {
  isMobile?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  open: 'Open',
  done: 'Done',
  routine: 'Routine',
  health: 'Health',
  learning: 'Learning',
  career: 'Career',
  discipline: 'Discipline',
};

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayLabel(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en', { weekday: 'short' });
}

function getDateKey(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatLocalDate(d);
}

function getToday(): string {
  return formatLocalDate(new Date());
}

function rowsToLog(rows: HabitWithDone[]): Record<string, boolean> {
  return rows.reduce<Record<string, boolean>>((log, habit) => {
    log[habit.id] = Boolean(habit.done);
    return log;
  }, {});
}

function getHeatColor(level: string): string {
  switch (level) {
    case 'high':
      return 'success.main';
    case 'mid':
      return 'warning.main';
    case 'low':
      return 'error.light';
    default:
      return 'grey.200';
  }
}

export default function Habits({ isMobile: isMobileProp }: HabitsProps) {
  const theme = useTheme();
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = isMobileProp ?? isMobileQuery;
  const dispatch = useAppDispatch();

  const [habitLog, setHabitLog] = useState<Record<string, Record<string, boolean>>>({});
  const [habits, setHabits] = useState<HabitWithDone[]>([]);
  const [filter, setFilter] = useState('all');
  const [syncMode, setSyncMode] = useState<'loading' | 'server' | 'saving' | 'error'>('loading');
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const today = getToday();

  useEffect(() => {
    let isActive = true;

    async function loadHabits() {
      const weekKeys = Array.from({ length: 7 }, (_, i) => getDateKey(i - 6));
      setSyncMode('loading');
      setError('');

      try {
        const weekRows = await Promise.all(weekKeys.map((date) => api.getHabits(date)));
        if (!isActive) return;

        const todayRows = weekRows[weekRows.length - 1] || [];
        setHabits(todayRows);
        setHabitLog(
          weekKeys.reduce<Record<string, Record<string, boolean>>>((log, date, index) => {
            log[date] = rowsToLog(weekRows[index] || []);
            return log;
          }, {})
        );
        setSyncMode('server');
      } catch (err: any) {
        console.error('Failed to load habits from server:', err);
        if (!isActive) return;
        setHabits([]);
        setHabitLog({});
        setSyncMode('error');
        setError(err.message || 'Unable to load habits from backend.');
      }
    }

    loadHabits();

    return () => {
      isActive = false;
    };
  }, []);

  const todayHabits = useMemo(() => rowsToLog(habits), [habits]);

  const toggleHabit = (habitId: string) => {
    const previousHabits = habits;
    const nextHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    setHabits(nextHabits);
    setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(nextHabits) }));

    if (syncMode !== 'server') {
      setError('Backend is unavailable. Habit changes were not saved.');
      return;
    }

    setBusyIds((ids) => [...ids, habitId]);
    setSyncMode('saving');

    dispatch(toggleHabitThunk({ id: habitId, date: today }))
      .unwrap()
      .then(() => {
        setError('');
        setSyncMode('server');
      })
      .catch((err: string) => {
        console.error('Failed to toggle habit on server:', err);
        setHabits(previousHabits);
        setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(previousHabits) }));
        setSyncMode('error');
        setError(err || 'Unable to save habit change.');
      })
      .finally(() => {
        setBusyIds((ids) => ids.filter((id) => id !== habitId));
      });
  };

  const setAllHabits = (done: boolean) => {
    const idsToChange = habits
      .filter((habit) => Boolean(habit.done) !== done)
      .map((habit) => habit.id);
    if (idsToChange.length === 0) return;

    const previousHabits = habits;
    const nextHabits = habits.map((habit) => ({ ...habit, done }));

    setHabits(nextHabits);
    setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(nextHabits) }));

    if (syncMode !== 'server') {
      setError('Backend is unavailable. Habit changes were not saved.');
      return;
    }

    setBusyIds((ids) => [...new Set([...ids, ...idsToChange])]);
    setSyncMode('saving');

    Promise.all(
      idsToChange.map((habitId) =>
        dispatch(toggleHabitThunk({ id: habitId, date: today })).unwrap()
      )
    )
      .then(() => {
        setError('');
        setSyncMode('server');
      })
      .catch((err: string) => {
        console.error('Failed to bulk update habits on server:', err);
        setHabits(previousHabits);
        setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(previousHabits) }));
        setSyncMode('error');
        setError(err || 'Unable to save habit changes.');
      })
      .finally(() => {
        setBusyIds((ids) => ids.filter((id) => !idsToChange.includes(id)));
      });
  };

  const habitsCompleted = Object.values(todayHabits).filter(Boolean).length;
  const habitsTotal = habits.length;
  const habitsRemaining = Math.max(habitsTotal - habitsCompleted, 0);
  const habitPercent = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;
  const isSaving = syncMode === 'saving';
  const syncLabel =
    syncMode === 'server'
      ? 'Synced'
      : syncMode === 'saving'
        ? 'Saving'
        : syncMode === 'loading'
          ? 'Loading'
          : 'Backend error';

  const getStreak = (habitId: string): number => {
    let s = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    for (let i = 0; i < 365; i++) {
      const key = formatLocalDate(d);
      if (habitLog[key]?.[habitId]) {
        s++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    if (todayHabits[habitId]) s++;
    return s;
  };

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6;
    const key = getDateKey(offset);
    const dayHabits = key === today ? todayHabits : habitLog[key] || {};
    const done = Object.values(dayHabits).filter(Boolean).length;
    const ratio = habitsTotal > 0 ? done / habitsTotal : 0;
    let level: 'empty' | 'low' | 'mid' | 'high' = 'empty';
    if (ratio > 0.7) level = 'high';
    else if (ratio > 0.3) level = 'mid';
    else if (ratio > 0) level = 'low';
    return {
      label: getDayLabel(offset),
      done,
      level,
      isToday: offset === 0,
    };
  });

  const filters = [
    { key: 'all', count: habitsTotal },
    { key: 'open', count: habitsRemaining },
    { key: 'done', count: habitsCompleted },
    ...Array.from(new Set(habits.map((habit) => habit.category))).map((category) => ({
      key: category,
      count: habits.filter((habit) => habit.category === category).length,
    })),
  ];

  const visibleHabits = habits
    .filter((habit) => {
      if (filter === 'open') return !habit.done;
      if (filter === 'done') return habit.done;
      if (filter === 'all') return true;
      return habit.category === filter;
    })
    .sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <>
      <Header
        title="Daily Tracker"
        subtitle={`${habitsCompleted}/${habitsTotal} done today \u00B7 ${habitsRemaining} remaining`}
      />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Today
              </Typography>
              <Typography variant="h6">
                {habitsRemaining === 0 ? 'All clear' : `${habitsRemaining} left`}
              </Typography>
            </Box>
            <Typography variant="h4" color="primary">
              {habitPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={habitPercent}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {habitsCompleted} complete
            </Typography>
            <Chip
              label={syncLabel}
              size="small"
              color={
                syncMode === 'server'
                  ? 'success'
                  : syncMode === 'saving'
                    ? 'warning'
                    : syncMode === 'loading'
                      ? 'info'
                      : 'error'
              }
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => setAllHabits(true)}
              disabled={isSaving || habitsRemaining === 0}
            >
              {'\u2713'} Mark all done
            </Button>
            <Button
              variant="outlined"
              onClick={() => setAllHabits(false)}
              disabled={isSaving || habitsCompleted === 0}
            >
              Reset today
            </Button>
          </Box>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">This Week</Typography>
              <Chip label="7-Day View" color="info" size="small" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
              {weekData.map((day, i) => (
                <Paper
                  key={i}
                  sx={{
                    flex: 1,
                    minWidth: 60,
                    p: 1.5,
                    textAlign: 'center',
                    bgcolor: getHeatColor(day.level),
                    border: day.isToday ? '2px solid' : '1px solid',
                    borderColor: day.isToday ? 'primary.main' : 'divider',
                  }}
                >
                  <Typography variant="caption" fontWeight={day.isToday ? 700 : 400}>
                    {day.label}
                  </Typography>
                  <Typography variant="body2">
                    {day.done}/{habitsTotal}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Today&apos;s Habits
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {visibleHabits.length} shown{' \u00B7 '}pending tasks stay first in the flow
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {filters.map((item) => (
            <Chip
              key={item.key}
              label={`${CATEGORY_LABELS[item.key] || item.key} (${item.count})`}
              onClick={() => setFilter(item.key)}
              color={filter === item.key ? 'primary' : 'default'}
              variant={filter === item.key ? 'filled' : 'outlined'}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {visibleHabits.map((habit) => {
            const isDone = todayHabits[habit.id] || false;
            const streak = getStreak(habit.id);
            return (
              <Button
                key={habit.id}
                variant={isDone ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => toggleHabit(habit.id)}
                disabled={isSaving || busyIds.includes(habit.id)}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  gap: 1,
                  py: 1.5,
                  opacity: isDone ? 0.7 : 1,
                }}
              >
                <Chip
                  label={isDone ? '\u2713' : ''}
                  size="small"
                  color={isDone ? 'success' : 'default'}
                  sx={{ minWidth: 32 }}
                />
                <Typography component="span">{habit.icon}</Typography>
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography
                    component="span"
                    display="block"
                    sx={{ textDecoration: isDone ? 'line-through' : 'none' }}
                  >
                    {habit.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="span">
                    {CATEGORY_LABELS[habit.category] || habit.category}
                  </Typography>
                </Box>
                {streak > 0 && <Chip label={`${streak}d`} size="small" color="warning" />}
              </Button>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
