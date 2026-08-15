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
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchContacts,
  addContact,
  updateContact,
  deleteContact,
} from '../../../redux/slices/personalSlice';
import type { Contact } from '../types';
import Header from '../components/Header';

interface NetworkingProps {
  isMobile?: boolean;
}

const TYPES = ['colleague', 'friend', 'mentor', 'family', 'other'];
const PRIORITIES = ['high', 'medium', 'low'];

const PRIORITY_COLOR: Record<string, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

export default function Networking(_props: NetworkingProps) {
  const dispatch = useAppDispatch();
  const { items: contacts, error } = useAppSelector((s) => s.personal.contacts);

  const [form, setForm] = useState({
    name: '',
    type: 'colleague',
    priority: 'medium',
    circleQualityScore: 3,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleAddContact = () => {
    if (!form.name) return;
    dispatch(addContact(form as any));
    setForm({ name: '', type: 'colleague', priority: 'medium', circleQualityScore: 3, notes: '' });
  };

  const handleMetToday = (id: string) => {
    dispatch(updateContact({ id, updates: { lastContactDate: new Date().toISOString().slice(0, 10) } as any }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteContact(id));
  };

  const grouped = contacts.reduce<Record<string, Contact[]>>((acc, c) => {
    if (!acc[c.type]) acc[c.type] = [];
    acc[c.type].push(c);
    return acc;
  }, {});

  return (
    <>
      <Header title="Networking" subtitle="Maintain important relationships and follow-up rhythm" />
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add Contact</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {PRIORITIES.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={handleAddContact}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {Object.entries(grouped).map(([type, list]) => (
          <Box key={type} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}s ({list.length})
            </Typography>
            <Grid container spacing={2}>
              {list.map((c: Contact) => (
                <Grid item xs={12} sm={6} key={c.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography fontWeight={700}>{c.name}</Typography>
                        <Chip
                          label={c.priority}
                          color={PRIORITY_COLOR[c.priority] || 'default'}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Q: {c.circleQualityScore}/5
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        {c.lastContactDate && (
                          <Typography variant="body2" color="text.secondary">
                            Last: {c.lastContactDate}
                          </Typography>
                        )}
                        {c.nextFollowUpDate && (
                          <Typography variant="body2" color="text.secondary">
                            Follow-up: {c.nextFollowUpDate}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleMetToday(c.id)}
                        >
                          Met Today
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(c.id)}
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
      </Box>
    </>
  );
}
