import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Alert,
  Skeleton,
  Paper,
  Checkbox,
} from '@mui/material';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchGoals, fetchDreams, toggleMilestone } from '../../../redux/slices/personalSlice';
import type { GoalWithMilestones, Milestone, Dream } from '../types';

interface GoalsProps {
  isMobile?: boolean;
}

function getProgress(goal: GoalWithMilestones): number {
  const milestones = goal.milestones || [];
  const done = milestones.filter((m: Milestone) => m.done).length;
  return milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0;
}

const statusColor = (priority: string): 'error' | 'warning' | 'info' | 'default' => {
  switch (priority) {
    case 'now': return 'error';
    case 'mid': return 'warning';
    case 'long': return 'info';
    default: return 'default';
  }
};

const priorityLabel = (priority: string) => {
  switch (priority) {
    case 'now': return '⚡ Priority Now';
    case 'mid': return '📅 Mid-term';
    case 'long': return '🔭 Long-term';
    default: return priority;
  }
};

export default function Goals({ isMobile = false }: GoalsProps) {
  const dispatch = useAppDispatch();
  const { items: goalsData, loading, error } = useAppSelector((state) => state.personal.goals);
  const { items: dreams } = useAppSelector((state) => state.personal.dreams);
  const [tab, setTab] = useState<string>('goals');

  const goals = useMemo(() => (Array.isArray(goalsData) ? goalsData : []), [goalsData]);
  const dreamsList = useMemo(() => (Array.isArray(dreams) ? dreams : []), [dreams]);

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchDreams());
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleToggleMilestone = (goalId: string, milestone: Milestone) => {
    dispatch(toggleMilestone({ goalId, milestoneId: milestone.id, done: !milestone.done }));
  };

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc: number, g: GoalWithMilestones) => acc + getProgress(g), 0) / goals.length)
    : 0;

  const startedCount = goals.filter((g: GoalWithMilestones) => getProgress(g) > 0).length;

  const nowDreams = dreamsList.filter((d: Dream) => d.priority === 'now');
  const midDreams = dreamsList.filter((d: Dream) => d.priority === 'mid');
  const longDreams = dreamsList.filter((d: Dream) => d.priority === 'long');

  if (loading) {
    return (
      <>
        <Header title="Goals & Dreams" subtitle="Loading from backend..." />
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Skeleton variant="rounded" height={100} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rounded" height={200} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header
        title="Goals & Dreams"
        subtitle={`${overallProgress}% overall progress · Build the life you wrote about`}
      />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant={isMobile ? 'fullWidth' : 'standard'}
        >
          <Tab label="🎯 Goals" value="goals" />
          <Tab label="🌟 Dreams" value="dreams" />
        </Tabs>

        {tab === 'goals' && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Overall Progress</Typography>
                    <Typography variant="h4" fontWeight={700}>{overallProgress}%</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={overallProgress}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': { bgcolor: '#fff' },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Goals Started</Typography>
                    <Typography variant="h4" fontWeight={700}>{startedCount}/{goals.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Current Salary</Typography>
                    <Typography variant="h4" fontWeight={700}>₹30K</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Target: ₹1 Lakh+</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {goals.map((goal: GoalWithMilestones) => {
                const progress = getProgress(goal);
                return (
                  <Grid item xs={12} sm={6} md={4} key={goal.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Typography variant="h5">{goal.icon}</Typography>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>{goal.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{goal.category}</Typography>
                          </Box>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                          color={progress >= 100 ? 'success' : 'primary'}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'right' }}>
                          {progress}%
                        </Typography>

                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                          {(goal.milestones || []).map((m: Milestone) => (
                            <Box
                              component="li"
                              key={m.id}
                              onClick={() => handleToggleMilestone(goal.id, m)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                py: 0.5,
                                cursor: 'pointer',
                                color: m.done ? 'text.secondary' : 'text.primary',
                                textDecoration: m.done ? 'line-through' : 'none',
                                borderRadius: 1,
                                px: 1,
                                '&:hover': { bgcolor: 'action.hover' },
                              }}
                            >
                              <Checkbox
                                checked={m.done}
                                size="small"
                                sx={{ p: 0, mr: 0.5 }}
                                readOnly
                              />
                              <Typography variant="body2">{m.label}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        {tab === 'dreams' && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Priority: NOW ⚡</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Focus here first — everything else follows</Typography>
              <Grid container spacing={2}>
                {nowDreams.map((dream: Dream) => (
                  <Grid item xs={12} sm={6} md={4} key={dream.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>{dream.icon}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{dream.text}</Typography>
                      <Chip label={priorityLabel(dream.priority)} color={statusColor(dream.priority)} size="small" />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Mid-Term Goals 📅</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Once foundation is solid</Typography>
              <Grid container spacing={2}>
                {midDreams.map((dream: Dream) => (
                  <Grid item xs={12} sm={6} md={4} key={dream.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>{dream.icon}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{dream.text}</Typography>
                      <Chip label={priorityLabel(dream.priority)} color={statusColor(dream.priority)} size="small" />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>Long-Term Vision 🔭</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>The ultimate destination</Typography>
              <Grid container spacing={2}>
                {longDreams.map((dream: Dream) => (
                  <Grid item xs={12} sm={6} md={4} key={dream.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>{dream.icon}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{dream.text}</Typography>
                      <Chip label={priorityLabel(dream.priority)} color={statusColor(dream.priority)} size="small" />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
