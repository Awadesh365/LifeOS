import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchLearning,
  fetchGoals,
  fetchDreams,
  fetchJobs,
  toggleHabit as toggleHabitThunk,
} from '../../../redux/slices/personalSlice';
import { api } from '../api/client';
import type { HabitWithDone, GoalWithMilestones } from '../types';

interface DashboardProps {
  isMobile?: boolean;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

export default function Dashboard({ isMobile: isMobileProp }: DashboardProps) {
  const theme = useTheme();
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = isMobileProp ?? isMobileQuery;
  const dispatch = useAppDispatch();

  const rawLearningData = useAppSelector((state) => state.personal.learning.data);
  const goalsData = useAppSelector((state) => state.personal.goals.items);
  const dreamsData = useAppSelector((state) => state.personal.dreams.items);
  const jobsData = useAppSelector((state) => state.personal.jobs.items);
  const loadingRedux = useAppSelector(
    (state) =>
      state.personal.learning.loading ||
      state.personal.goals.loading ||
      state.personal.dreams.loading ||
      state.personal.jobs.loading
  );

  const [habitRows, setHabitRows] = useState<HabitWithDone[]>([]);
  const [habitLog, setHabitLog] = useState<Record<string, Record<string, boolean>>>({});
  const [strongStack, setStrongStack] = useState<{
    frontend: string[];
    backend: string[];
    cloud: string[];
  }>({ frontend: [], backend: [], cloud: [] });
  const [loading, setLoading] = useState(true);
  const [savingHabitId, setSavingHabitId] = useState<string | null>(null);
  const [habitSyncMode, setHabitSyncMode] = useState<'server' | 'error' | 'loading'>('server');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const weekKeys = Array.from({ length: 7 }, (_, i) => getDateKey(i - 6));
      setError('');

      dispatch(fetchLearning());
      dispatch(fetchGoals());
      dispatch(fetchDreams());
      dispatch(fetchJobs());

      const habitResults = await Promise.allSettled(
        weekKeys.map((date) => api.getHabits(date))
      );

      const allFulfilled = habitResults.every((r) => r.status === 'fulfilled');
      if (allFulfilled) {
        const habitWeekRows = (habitResults as PromiseFulfilledResult<HabitWithDone[]>[]).map(
          (r) => r.value
        );
        const todayRows = habitWeekRows[habitWeekRows.length - 1] || [];
        setHabitRows(todayRows);
        setHabitLog(
          weekKeys.reduce<Record<string, Record<string, boolean>>>((log, date, index) => {
            log[date] = rowsToLog(habitWeekRows[index] || []);
            return log;
          }, {})
        );
        setHabitSyncMode('server');
      } else {
        console.error(
          'Habit API load failed:',
          habitResults.find((r) => r.status === 'rejected')
        );
        setHabitRows([]);
        setHabitLog({});
        setHabitSyncMode('error');
        setError('Dashboard habits are unavailable because the backend request failed.');
      }

      try {
        const stackItems = await api.getStrongStack();
        const grouped: { frontend: string[]; backend: string[]; cloud: string[] } = {
          frontend: [],
          backend: [],
          cloud: [],
        };
        (Array.isArray(stackItems) ? stackItems : []).forEach((item: any) => {
          const cat = item.category?.toLowerCase() || '';
          if (cat === 'frontend' && grouped.frontend) grouped.frontend.push(...item.items);
          else if (cat === 'backend' && grouped.backend) grouped.backend.push(...item.items);
          else if (cat === 'cloud' && grouped.cloud) grouped.cloud.push(...item.items);
        });
        setStrongStack(grouped);
      } catch {
        setStrongStack({ frontend: [], backend: [], cloud: [] });
      }

      setLoading(false);
    }
    load();
  }, [dispatch]);

  const today = getToday();
  const habitsCompleted = habitRows.filter((habit) => habit.done).length;
  const habitsTotal = habitRows.length;
  const habitsRemaining = Math.max(habitsTotal - habitsCompleted, 0);
  const habitPercent = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;
  const orderedHabitRows = [...habitRows].sort((a, b) => Number(a.done) - Number(b.done));

  const learningSections = Array.isArray(rawLearningData) ? rawLearningData : [];
  const allItems = learningSections.flatMap((s: any) => s.items || []);
  const completedLearning = allItems.filter((i: any) => i.status === 'completed').length;
  const inProgressLearning = allItems.filter((i: any) => i.status === 'in_progress').length;
  const totalLearning = allItems.length;

  let streak = 0;
  const streakDate = new Date();
  for (let i = 0; i < 365; i++) {
    const key = formatLocalDate(streakDate);
    const dayHabits = habitLog[key] || {};
    const done = Object.values(dayHabits).filter(Boolean).length;
    if (done >= Math.ceil(habitsTotal * 0.5)) {
      streak++;
      streakDate.setDate(streakDate.getDate() - 1);
    } else if (i === 0) {
      streakDate.setDate(streakDate.getDate() - 1);
    } else {
      break;
    }
  }

  const goalsWithProgress = goalsData.map((g: GoalWithMilestones) => {
    const milestones = g.milestones || [];
    const doneMilestones = milestones.filter((m) => m.done).length;
    const progress =
      milestones.length > 0 ? Math.round((doneMilestones / milestones.length) * 100) : 0;
    return { ...g, progress };
  });

  const overallGoalProgress =
    goalsWithProgress.length > 0
      ? Math.round(
          goalsWithProgress.reduce((acc, g) => acc + g.progress, 0) / goalsWithProgress.length
        )
      : 0;

  const toggleHabit = (habitId: string) => {
    const previousRows = habitRows;
    const nextRows = habitRows.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    setHabitRows(nextRows);
    setHabitLog((current) => ({ ...current, [today]: rowsToLog(nextRows) }));

    if (habitSyncMode !== 'server') {
      setError('Backend is unavailable. Habit changes were not saved.');
      return;
    }

    setSavingHabitId(habitId);

    dispatch(toggleHabitThunk({ id: habitId, date: today }))
      .unwrap()
      .catch((err: string) => {
        console.error('Failed to update habit from dashboard:', err);
        setHabitRows(previousRows);
        setHabitLog((current) => ({ ...current, [today]: rowsToLog(previousRows) }));
        setHabitSyncMode('error');
        setError(err || 'Unable to save dashboard habit change.');
      })
      .finally(() => setSavingHabitId(null));
  };

  if (loading || loadingRedux) {
    return (
      <>
        <Header title="Dashboard" subtitle="Loading..." />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8,
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1">Loading your data...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Your life at a glance · No excuses, only execution" />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 4, lg: 2.4 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'left',
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '3px solid',
                borderTopColor: 'primary.main',
              }}
            >
              <Typography variant="body2">Today&apos;s Habits</Typography>
              <Typography variant="h5">
                {habitsCompleted}/{habitsTotal}
              </Typography>
              <Typography variant="caption">{habitsRemaining} remaining</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 4, lg: 2.4 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'left',
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '3px solid',
                borderTopColor: 'warning.main',
              }}
            >
              <Typography variant="body2">Current Streak</Typography>
              <Typography variant="h5">{streak}</Typography>
              <Typography variant="caption">
                {streak === 0
                  ? 'Start tracking today!'
                  : `${streak} day${streak > 1 ? 's' : ''} strong`}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 4, lg: 2.4 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'left',
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '3px solid',
                borderTopColor: 'success.main',
              }}
            >
              <Typography variant="body2">Skills Completed</Typography>
              <Typography variant="h5">
                {completedLearning}/{totalLearning}
              </Typography>
              <Typography variant="caption">{inProgressLearning} in progress</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 4, lg: 2.4 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'left',
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '3px solid',
                borderTopColor: 'info.main',
              }}
            >
              <Typography variant="body2">Jobs Applied</Typography>
              <Typography variant="h5">{jobsData.length}</Typography>
              <Typography variant="caption">
                {jobsData.filter((j: any) => j.status === 'interview').length} interviews
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 2.4 }}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'left',
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '3px solid',
                borderTopColor: 'secondary.main',
              }}
            >
              <Typography variant="body2">Goal Progress</Typography>
              <Typography variant="h5">{overallGoalProgress}%</Typography>
              <Typography variant="caption">
                {goalsWithProgress.filter((g) => g.progress > 0).length} goals started
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Today&apos;s Task List</Typography>
              <Button component={Link} to="/habits" size="small" variant="outlined">
                Open tracker
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Daily progress
                </Typography>
                <Typography variant="subtitle1">{habitPercent}% complete</Typography>
              </Box>
              <Chip label={`${habitsCompleted}/${habitsTotal}`} color="info" size="small" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={habitPercent}
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {orderedHabitRows.slice(0, 6).map((habit) => (
                <Button
                  key={habit.id}
                  variant={habit.done ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => toggleHabit(habit.id)}
                  disabled={savingHabitId === habit.id}
                  sx={{
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    gap: 1,
                    opacity: habit.done ? 0.7 : 1,
                    minHeight: 48,
                    borderColor: habit.done ? 'success.light' : 'divider',
                    bgcolor: habit.done ? 'rgba(2, 121, 0, 0.05)' : 'background.paper',
                    color: habit.done ? 'success.dark' : 'text.primary',
                    '&:hover': {
                      borderColor: habit.done ? 'success.main' : 'text.disabled',
                      bgcolor: habit.done ? 'rgba(2, 121, 0, 0.08)' : '#F8FAFC',
                    },
                  }}
                >
                  <Chip
                    label={habit.done ? '\u2713' : ''}
                    size="small"
                    color={habit.done ? 'success' : 'default'}
                    sx={{ minWidth: 32 }}
                  />
                  <Typography component="span">{habit.icon}</Typography>
                  <Typography
                    component="span"
                    sx={{ textDecoration: habit.done ? 'line-through' : 'none' }}
                  >
                    {habit.name}
                  </Typography>
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">My Strong Stack</Typography>
              <Chip label="Foundation" color="info" size="small" />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(
                [
                  { label: 'Frontend', items: strongStack.frontend, color: '#7215BA' },
                  { label: 'Backend', items: strongStack.backend, color: '#239CE8' },
                  { label: 'Cloud', items: strongStack.cloud, color: '#027900' },
                ] as const
              ).map((group) =>
                group.items.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    sx={{
                      bgcolor: `${group.color}15`,
                      color: group.color,
                      border: `1px solid ${group.color}30`,
                      fontWeight: 600,
                    }}
                  />
                ))
              )}
              {!strongStack.frontend.length && !strongStack.backend.length && !strongStack.cloud.length && (
                <Typography variant="body2" color="text.secondary">
                  Your saved technology stack will appear here.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h6" sx={{ mb: 1 }}>
          The Vision
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          What you&apos;re building this life for
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {dreamsData
            .filter((dd: any) => dd.priority === 'now')
            .map((dream: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dream.id}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {dream.icon}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {dream.text}
                    </Typography>
                    <Chip label="Priority Now" color="warning" size="small" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Top Goals Progress
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Track milestones, not just dreams
        </Typography>
        <Grid container spacing={2}>
          {goalsWithProgress.slice(0, 4).map((goal) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={(goal as any).goalId || goal.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5">{goal.icon}</Typography>
                    <Box>
                      <Typography variant="subtitle2">{goal.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {goal.category}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {goal.progress}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
