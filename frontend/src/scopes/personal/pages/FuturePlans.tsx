import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchFuturePlans,
  addFuturePlan,
  updateFuturePlan,
  deleteFuturePlan,
} from '../../../redux/slices/personalSlice';
import type { FuturePlan } from '../types';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';

interface FuturePlansProps {
  isMobile?: boolean;
}

const PLAN_TYPES = ['home', 'real_estate', 'marriage', 'company', 'other'];
const STATUSES = ['planned', 'in_progress', 'completed'];

const STATUS_COLOR: Record<string, 'default' | 'primary' | 'success'> = {
  planned: 'default',
  in_progress: 'primary',
  completed: 'success',
};

export default function FuturePlans(_props: FuturePlansProps) {
  const dispatch = useAppDispatch();
  const { items: plans, error } = useAppSelector((s) => s.personal.futurePlans);

  const [form, setForm] = useState({
    planType: 'home',
    title: '',
    targetDate: '',
    budget: 0,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchFuturePlans());
  }, [dispatch]);

  const handleAddPlan = () => {
    if (!form.title) return;
    dispatch(addFuturePlan(form as any));
    setForm({ planType: 'home', title: '', targetDate: '', budget: 0, notes: '' });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    dispatch(updateFuturePlan({ id, updates: { status } as any }));
  };

  const handleDeletePlan = (id: string) => {
    dispatch(deleteFuturePlan(id));
  };

  const grouped = plans.reduce<Record<string, FuturePlan[]>>((acc, p) => {
    if (!acc[p.planType]) acc[p.planType] = [];
    acc[p.planType].push(p);
    return acc;
  }, {});

  return (
    <>
      <Header title="Future Plans" subtitle="Organize major life plans by type, budget, and status" />
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6">Create a future plan</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
            Turn a major life intention into a dated, budgeted plan you can review.
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={form.planType}
                  onChange={(e) => setForm({ ...form, planType: e.target.value })}
                >
                  {PLAN_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Target Date"
                InputLabelProps={{ shrink: true }}
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Budget"
                value={form.budget || ''}
                onChange={(e) =>
                  setForm({ ...form, budget: parseFloat(e.target.value) || 0 })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" fullWidth onClick={handleAddPlan}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {Object.entries(grouped).map(([type, list]) => (
          <Box key={type} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
            </Typography>
            <Grid container spacing={2}>
              {list.map((p: FuturePlan) => (
                <Grid item xs={12} sm={6} key={p.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography fontWeight={700}>{p.title}</Typography>
                        <Chip
                          label={p.status.replace('_', ' ')}
                          color={STATUS_COLOR[p.status] || 'default'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        {p.targetDate && (
                          <Typography variant="body2" color="text.secondary">
                            Target: {p.targetDate}
                          </Typography>
                        )}
                        {p.budget > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Budget: {p.budget.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                          <Select
                            value={p.status}
                            onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                          >
                            {STATUSES.map((s) => (
                              <MenuItem key={s} value={s}>
                                {s.replace('_', ' ')}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePlan(p.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        {plans.length === 0 && (
          <EmptyState
            title="Your future plan is still a blank canvas"
            description="Start with one meaningful commitment—a home, company, relationship milestone, or another long-range plan."
          />
        )}
      </Box>
    </>
  );
}
