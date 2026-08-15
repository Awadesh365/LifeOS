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
  LinearProgress,
  Paper,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchFunds,
  addFund,
  depositFund,
} from '../../../redux/slices/personalSlice';
import type { EmergencyFund } from '../types';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';

interface FundsProps {
  isMobile?: boolean;
}

export default function Funds(_props: FundsProps) {
  const dispatch = useAppDispatch();
  const { items: funds, summary, loading, error } = useAppSelector((s) => s.personal.funds);

  const [form, setForm] = useState({
    bankName: '',
    amount: 0,
    targetAmount: 100000,
    type: 'fd' as string,
    notes: '',
  });

  const [depositAmounts, setDepositAmounts] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  const handleAddFund = () => {
    if (!form.bankName) return;
    dispatch(addFund(form));
    setForm({ bankName: '', amount: 0, targetAmount: 100000, type: 'fd', notes: '' });
  };

  const handleDeposit = async (id: string) => {
    const amount = depositAmounts[id] || 0;
    if (amount <= 0) return;
    await dispatch(depositFund({ id, amount }));
    dispatch(fetchFunds());
    setDepositAmounts({ ...depositAmounts, [id]: 0 });
  };

  const target = summary?.target ?? 100000;
  const total = summary?.total ?? 0;
  const progressPct = summary?.progress ?? 0;
  const progressDash = progressPct * 2.83;

  return (
    <>
      <Header title="Emergency Fund" subtitle="Build and monitor your safety buffer across accounts" />
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', width: 140, height: 140 }}>
              <svg viewBox="0 0 100 100" width="140" height="140">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#EDF0F5" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E55555"
                  strokeWidth="8"
                  strokeDasharray={`${progressDash} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {progressPct.toFixed(0)}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Current</Typography>
                <Typography variant="h6">
                  {total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Target</Typography>
                <Typography variant="h6">
                  {target.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Remaining</Typography>
                <Typography variant="h6">
                  {(target - total).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6">Add a reserve account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
            Combine fixed deposits, recurring deposits, and liquid savings into one safety-buffer view.
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Bank Name"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Amount"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Target"
                value={form.targetAmount || ''}
                onChange={(e) =>
                  setForm({ ...form, targetAmount: parseFloat(e.target.value) || 100000 })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <MenuItem value="fd">Fixed Deposit</MenuItem>
                  <MenuItem value="rd">Recurring Deposit</MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={handleAddFund}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <LinearProgress sx={{ my: 4 }} />
        ) : (
          <Grid container spacing={2}>
            {funds.map((f: EmergencyFund) => {
              const pct = f.targetAmount > 0 ? (f.amount / f.targetAmount) * 100 : 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={f.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography fontWeight={700}>{f.bankName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {f.type.toUpperCase()}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {f.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{ height: 6, borderRadius: 3, mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          size="small"
                          type="number"
                          placeholder="Deposit"
                          value={depositAmounts[f.id] || ''}
                          onChange={(e) =>
                            setDepositAmounts({
                              ...depositAmounts,
                              [f.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          sx={{ flex: 1 }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleDeposit(f.id)}
                        >
                          Deposit
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            {funds.length === 0 && (
              <Grid item xs={12}>
                <EmptyState
                  title="No emergency reserve yet"
                  description="Create your first reserve account to start measuring progress toward a reliable financial safety buffer."
                />
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </>
  );
}
