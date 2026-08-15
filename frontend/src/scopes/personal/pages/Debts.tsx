import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchDebts,
  addDebt,
  payDebt,
  deleteDebt,
} from '../../../redux/slices/personalSlice';
import type { Debt } from '../types';
import Header from '../components/Header';

interface DebtsProps {
  isMobile?: boolean;
}

export default function Debts(_props: DebtsProps) {
  const dispatch = useAppDispatch();
  const { items: debts, loading, error } = useAppSelector((s) => s.personal.debts);

  const [form, setForm] = useState({
    personName: '',
    totalAmount: 0,
    targetMonth: '',
    notes: '',
  });

  const [payAmounts, setPayAmounts] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchDebts());
  }, [dispatch]);

  const handleAddDebt = () => {
    if (!form.personName || form.totalAmount <= 0) return;
    dispatch(addDebt(form));
    setForm({ personName: '', totalAmount: 0, targetMonth: '', notes: '' });
  };

  const handlePayDebt = async (id: string) => {
    const amount = payAmounts[id] || 0;
    if (amount <= 0) return;
    await dispatch(payDebt({ id, amount }));
    dispatch(fetchDebts());
    setPayAmounts({ ...payAmounts, [id]: 0 });
  };

  const handleDeleteDebt = (id: string) => {
    dispatch(deleteDebt(id));
  };

  const totalDebt = debts.reduce((s: number, d: Debt) => s + d.totalAmount, 0);
  const totalPaid = debts.reduce((s: number, d: Debt) => s + d.paidAmount, 0);
  const totalRemaining = debts.reduce((s: number, d: Debt) => s + d.remainingAmount, 0);
  const progress = totalDebt > 0 ? ((totalPaid / totalDebt) * 100).toFixed(0) : '0';

  return (
    <>
      <Header title="Debt Tracker" subtitle="See what is owed, what is paid, and the next payment action" />
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Debt</Typography>
                <Typography variant="h5" sx={{ color: 'error.main' }}>
                  {totalDebt.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Paid</Typography>
                <Typography variant="h5" sx={{ color: 'success.main' }}>
                  {totalPaid.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Remaining</Typography>
                <Typography variant="h5" sx={{ color: 'warning.main' }}>
                  {totalRemaining.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Progress</Typography>
                <Typography variant="h5">{progress}%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={Number(progress)}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add Debt</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Person Name"
                value={form.personName}
                onChange={(e) => setForm({ ...form, personName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Amount"
                value={form.totalAmount || ''}
                onChange={(e) => setForm({ ...form, totalAmount: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Target Month"
                value={form.targetMonth}
                onChange={(e) => setForm({ ...form, targetMonth: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" fullWidth onClick={handleAddDebt}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <LinearProgress sx={{ my: 4 }} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {debts.map((d: Debt) => (
              <Card key={d.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>{d.personName}</Typography>
                    <Chip
                      label={d.status}
                      color={d.status === 'active' ? 'warning' : 'success'}
                      size="small"
                    />
                  </Box>
                  <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Total: {d.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Paid: {d.paidAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        Remaining: {d.remainingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </Typography>
                    </Grid>
                    {d.targetMonth && (
                      <Grid item>
                        <Typography variant="body2" color="text.secondary">
                          Target: {d.targetMonth}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  <LinearProgress
                    variant="determinate"
                    value={d.totalAmount > 0 ? (d.paidAmount / d.totalAmount) * 100 : 0}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  {d.status === 'active' && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        size="small"
                        type="number"
                        placeholder="Pay amount"
                        value={payAmounts[d.id] || ''}
                        onChange={(e) =>
                          setPayAmounts({ ...payAmounts, [d.id]: parseFloat(e.target.value) || 0 })
                        }
                        sx={{ width: 140 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayDebt(d.id)}
                      >
                        Pay
                      </Button>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteDebt(d.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
