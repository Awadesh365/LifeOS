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
  fetchDiet,
  addDietLog,
  deleteDietLog,
  addSupplement,
  consumeSupplement,
} from '../../../redux/slices/personalSlice';
import type { DietLog, Supplement } from '../types';

interface DietProps {
  isMobile?: boolean;
}

const MEAL_TYPES: DietLog['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function Diet({ isMobile = false }: DietProps) {
  const dispatch = useAppDispatch();
  const { logs, supplements, loading, error } = useAppSelector((s) => s.personal.diet);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const [form, setForm] = useState<Omit<DietLog, 'id' | 'date'>>({
    mealType: 'breakfast',
    items: '',
    protein: 0,
    calories: 0,
    notes: '',
  });

  const [suppForm, setSuppForm] = useState<Omit<Supplement, 'id' | 'remainingDays'>>({
    name: '',
    quantity: 0,
    unit: 'g',
    dailyUsage: 0,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchDiet(date));
  }, [dispatch, date]);

  const totalProtein = logs.reduce((s, l) => s + (l.protein || 0), 0);
  const totalCalories = logs.reduce((s, l) => s + (l.calories || 0), 0);

  const handleAddLog = () => {
    dispatch(addDietLog({ date, ...form }));
    setForm({ mealType: 'breakfast', items: '', protein: 0, calories: 0, notes: '' });
  };

  const handleDeleteLog = (id: string) => {
    dispatch(deleteDietLog(id));
  };

  const handleAddSupplement = () => {
    dispatch(addSupplement(suppForm));
    setSuppForm({ name: '', quantity: 0, unit: 'g', dailyUsage: 0, notes: '' });
  };

  const handleConsume = (id: string, amount: number) => {
    dispatch(consumeSupplement({ id, amount }));
  };

  return (
    <>
      <Header title="Diet & Nutrition" subtitle="Log meals, protein, calories, and supplement stock" />
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
          {[
            { label: 'Protein', value: `${totalProtein}g` },
            { label: 'Calories', value: totalCalories },
            { label: 'Meals', value: logs.length },
          ].map((item) => (
            <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h4">{item.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Meal
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                select
                size="small"
                value={form.mealType}
                onChange={(e) => setForm({ ...form, mealType: e.target.value as DietLog['mealType'] })}
                sx={{ minWidth: 130 }}
              >
                {MEAL_TYPES.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                placeholder="Items (comma separated)"
                value={form.items}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
                sx={{ minWidth: 200 }}
              />
              <TextField
                type="number"
                size="small"
                placeholder="Protein (g)"
                value={form.protein || ''}
                onChange={(e) => setForm({ ...form, protein: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 110 }}
              />
              <TextField
                type="number"
                size="small"
                placeholder="Calories"
                value={form.calories || ''}
                onChange={(e) => setForm({ ...form, calories: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 100 }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLog}>
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {logs.length > 0 && (
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Protein</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right" sx={{ width: 48 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Chip label={l.mealType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{l.items}</TableCell>
                    <TableCell align="right">{l.protein}g</TableCell>
                    <TableCell align="right">{l.calories}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDeleteLog(l.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Supplements
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Name"
                value={suppForm.name}
                onChange={(e) => setSuppForm({ ...suppForm, name: e.target.value })}
                sx={{ minWidth: 140 }}
              />
              <TextField
                type="number"
                size="small"
                placeholder="Quantity"
                value={suppForm.quantity || ''}
                onChange={(e) => setSuppForm({ ...suppForm, quantity: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 100 }}
              />
              <TextField
                type="number"
                size="small"
                placeholder="Daily Use"
                value={suppForm.dailyUsage || ''}
                onChange={(e) => setSuppForm({ ...suppForm, dailyUsage: parseFloat(e.target.value) || 0 })}
                sx={{ minWidth: 100 }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddSupplement}>
                Add
              </Button>
            </Box>

            {supplements.length > 0 && (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Days Left</TableCell>
                      <TableCell align="right" sx={{ width: 100 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplements.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell align="right">
                          {s.quantity}{s.unit}
                        </TableCell>
                        <TableCell align="right">
                          {s.remainingDays?.toFixed(0)} days
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleConsume(s.id, s.dailyUsage)}
                          >
                            Consume
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
