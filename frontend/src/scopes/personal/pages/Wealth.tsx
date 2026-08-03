import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchWealth,
  addWealthEntry,
  deleteWealthEntry,
  addInvestment,
} from '../../../redux/slices/personalSlice';
import type { WealthEntry, Investment } from '../types';

interface WealthProps {
  isMobile?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ENTRY_TYPES: WealthEntry['type'][] = ['income', 'expense', 'investment'];

const INV_TYPES: Investment['type'][] = ['SIP', 'stock', 'mutual_fund', 'gold', 'fd', 'rd'];

export default function Wealth({ isMobile = false }: WealthProps) {
  const dispatch = useAppDispatch();
  const { entries, investments, summary, loading, error } = useAppSelector((s) => s.personal.wealth);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [form, setForm] = useState<Omit<WealthEntry, 'id'>>({
    date: now.toISOString().slice(0, 10),
    type: 'expense',
    amount: 0,
    category: '',
    notes: '',
  });

  const [invForm, setInvForm] = useState<Omit<Investment, 'id'>>({
    name: '',
    type: 'SIP',
    monthlyAmount: 0,
    investedAmount: 0,
    currentValue: 0,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchWealth({ month, year }));
  }, [dispatch, month, year]);

  const handleAddEntry = () => {
    dispatch(addWealthEntry(form));
    setForm({ ...form, amount: 0, category: '', notes: '' });
  };

  const handleDeleteEntry = (id: string) => {
    dispatch(deleteWealthEntry(id));
  };

  const handleAddInvestment = () => {
    dispatch(addInvestment(invForm));
    setInvForm({ name: '', type: 'SIP', monthlyAmount: 0, investedAmount: 0, currentValue: 0, notes: '' });
  };

  const entryColor = (type: WealthEntry['type']) => {
    switch (type) {
      case 'income': return 'success';
      case 'expense': return 'error';
      case 'investment': return 'warning';
      default: return 'default';
    }
  };

  return (
    <>
      <Header title="Wealth Management" subtitle="Track cashflow, savings, and investments by month" />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            sx={{ minWidth: 100 }}
          >
            {MONTHS.map((m, i) => (
              <MenuItem key={i} value={i + 1}>{m}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            sx={{ minWidth: 90 }}
          >
            <MenuItem value={2026}>2026</MenuItem>
            <MenuItem value={2027}>2027</MenuItem>
          </TextField>
          {loading && <CircularProgress size={20} />}
        </Box>

        {summary && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Income', value: summary.income, color: 'success' as const },
              { label: 'Expenses', value: summary.expenses, color: 'error' as const },
              { label: 'Invested', value: summary.investments, color: 'warning' as const },
              { label: 'Savings', value: summary.savings, color: 'info' as const },
            ].map((item) => (
              <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" color={`${item.color}.main`}>
                      {'\u20B9'}{item.value.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Entry
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                select
                size="small"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as WealthEntry['type'] })}
                sx={{ minWidth: 130 }}
              >
                {ENTRY_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="number"
                size="small"
                placeholder="Amount"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 110 }}
              />
              <TextField
                size="small"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                sx={{ minWidth: 140 }}
              />
              <TextField
                type="date"
                size="small"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                sx={{ minWidth: 160 }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEntry}>
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Entries ({entries.length})
            </Typography>
            {entries.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right" sx={{ width: 48 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell>
                          <Chip
                            label={e.type}
                            size="small"
                            color={entryColor(e.type)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{e.category}</TableCell>
                        <TableCell align="right">
                          {'\u20B9'}{e.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{e.date}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleDeleteEntry(e.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No entries for this period.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Investments
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Fund Name"
                value={invForm.name}
                onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
                sx={{ minWidth: 150 }}
              />
              <TextField
                select
                size="small"
                value={invForm.type}
                onChange={(e) => setInvForm({ ...invForm, type: e.target.value as Investment['type'] })}
                sx={{ minWidth: 130 }}
              >
                {INV_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="number"
                size="small"
                placeholder="Monthly"
                value={invForm.monthlyAmount || ''}
                onChange={(e) => setInvForm({ ...invForm, monthlyAmount: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 100 }}
              />
              <TextField
                type="number"
                size="small"
                placeholder="Invested"
                value={invForm.investedAmount || ''}
                onChange={(e) => setInvForm({ ...invForm, investedAmount: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 100 }}
              />
              <TextField
                type="number"
                size="small"
                placeholder="Current Value"
                value={invForm.currentValue || ''}
                onChange={(e) => setInvForm({ ...invForm, currentValue: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 120 }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddInvestment}>
                Add
              </Button>
            </Box>

            {investments.length > 0 && (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Monthly</TableCell>
                      <TableCell align="right">Current Value</TableCell>
                      <TableCell align="right">Return</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {investments.map((inv) => {
                      const returnPct =
                        inv.investedAmount > 0
                          ? ((inv.currentValue - inv.investedAmount) / inv.investedAmount * 100).toFixed(1)
                          : '0';
                      return (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={inv.type.replace('_', ' ')}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {'\u20B9'}{inv.monthlyAmount}/mo
                          </TableCell>
                          <TableCell align="right">
                            {'\u20B9'}{inv.currentValue.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={parseFloat(returnPct) >= 0 ? 'success.main' : 'error.main'}
                            >
                              {returnPct}%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
