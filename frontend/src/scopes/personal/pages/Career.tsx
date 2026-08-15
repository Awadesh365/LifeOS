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
  Slider,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchCareer,
  addCareerEntry,
  updateCareerEntry,
  deleteCareerEntry,
} from '../../../redux/slices/personalSlice';
import type { CareerEntry } from '../types';
import Header from '../components/Header';

interface CareerProps {
  isMobile?: boolean;
}

const PLAN_OPTIONS = ['stay', 'leave', 'unsure'];

export default function Career(_props: CareerProps) {
  const dispatch = useAppDispatch();
  const { items: entries, error } = useAppSelector((s) => s.personal.career);

  const [form, setForm] = useState({
    companyName: '',
    roleTitle: '',
    payAmount: 0,
    companyHealthScore: 3,
    managerBehaviorScore: 3,
    workEnvironmentNotes: '',
    stayLeavePlan: 'unsure' as string,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchCareer());
  }, [dispatch]);

  const handleAddEntry = () => {
    if (!form.companyName || !form.roleTitle) return;
    dispatch(addCareerEntry(form as any));
    setForm({
      companyName: '',
      roleTitle: '',
      payAmount: 0,
      companyHealthScore: 3,
      managerBehaviorScore: 3,
      workEnvironmentNotes: '',
      stayLeavePlan: 'unsure',
      notes: '',
    });
  };

  const handleUpdateEntry = (id: string, updates: Partial<CareerEntry>) => {
    dispatch(updateCareerEntry({ id, updates }));
  };

  const handleDeleteEntry = (id: string) => {
    dispatch(deleteCareerEntry(id));
  };

  return (
    <>
      <Header title="Career Development" subtitle="Evaluate role quality, pay, manager signal, and exit plan" />
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add Career Entry</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Company"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Role"
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Pay"
                value={form.payAmount || ''}
                onChange={(e) =>
                  setForm({ ...form, payAmount: parseFloat(e.target.value) || 0 })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" fullWidth onClick={handleAddEntry}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map((e: CareerEntry) => (
            <Card key={e.id}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography fontWeight={700}>{e.companyName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {e.roleTitle}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6">
                      {e.payAmount?.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" gutterBottom>
                      Company Health
                    </Typography>
                    <Slider
                      size="small"
                      value={e.companyHealthScore}
                      min={1}
                      max={5}
                      step={1}
                      marks
                      onChange={(_ev, val) =>
                        handleUpdateEntry(e.id, { companyHealthScore: val as number })
                      }
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {e.companyHealthScore}/5
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body2" gutterBottom>
                      Manager Behavior
                    </Typography>
                    <Slider
                      size="small"
                      value={e.managerBehaviorScore}
                      min={1}
                      max={5}
                      step={1}
                      marks
                      onChange={(_ev, val) =>
                        handleUpdateEntry(e.id, { managerBehaviorScore: val as number })
                      }
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {e.managerBehaviorScore}/5
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Plan</InputLabel>
                      <Select
                        label="Plan"
                        value={e.stayLeavePlan}
                        onChange={(ev) =>
                          handleUpdateEntry(e.id, { stayLeavePlan: ev.target.value })
                        }
                      >
                        {PLAN_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteEntry(e.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}
