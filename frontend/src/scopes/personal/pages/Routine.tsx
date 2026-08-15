import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Chip,
  LinearProgress,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchRoutines, updateRoutine } from '../../../redux/slices/personalSlice';
import type { RoutineItem } from '../types';
import Header from '../components/Header';

interface RoutineProps {
  isMobile?: boolean;
}

function parseTimeToMinutes(value: string | undefined | null): number | null {
  if (!value) return null;
  const match = String(value).match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function parseTimeRange(value: string | undefined | null): number[] {
  if (!value) return [];
  return [...String(value).matchAll(/(\d{1,2}):(\d{2})/g)].map((m) =>
    parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
  );
}

function getSlotRange(item: RoutineItem, nextItem?: RoutineItem): { start: number; end: number } | null {
  const times = parseTimeRange(item.time);
  const start = times[0];
  if (start === undefined) return null;

  let end = times[1];
  if (end === undefined && nextItem) {
    const nextStart = parseTimeToMinutes(nextItem.time);
    if (nextStart !== null) end = nextStart;
  }
  if (end === undefined || end === null) {
    end = 24 * 60;
  }
  if (end <= start) {
    end += 24 * 60;
  }
  return { start, end };
}

function getCurrentSlot(routine: RoutineItem[]): number {
  if (!routine.length) return -1;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < routine.length; i++) {
    const range = getSlotRange(routine[i], routine[i + 1]);
    if (!range) continue;
    const comparableNow =
      range.end > 24 * 60 && currentMinutes < range.start
        ? currentMinutes + 24 * 60
        : currentMinutes;
    if (comparableNow >= range.start && comparableNow < range.end) {
      return i;
    }
  }
  return -1;
}

function getNextSlot(routine: RoutineItem[], currentSlot: number): RoutineItem | null {
  if (!routine.length) return null;
  if (currentSlot >= 0) {
    return routine[(currentSlot + 1) % routine.length];
  }
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const next = routine
    .map((item) => ({ item, start: parseTimeToMinutes(item.time) }))
    .filter((entry) => entry.start !== null && entry.start >= currentMinutes)
    .sort((a, b) => (a.start ?? 0) - (b.start ?? 0))[0];
  return next?.item ?? routine[0];
}

function normalizeLoadedRoutines(data: any): { weekday: RoutineItem[]; weekend: RoutineItem[] } {
  const loaded: { weekday: RoutineItem[]; weekend: RoutineItem[] } = { weekday: [], weekend: [] };
  if (!Array.isArray(data)) return loaded;

  const flatRows = data.filter((item: any) => item?.type && !item.items);
  if (flatRows.length > 0) {
    loaded.weekday = flatRows.filter((item: any) => item.type === 'weekday');
    loaded.weekend = flatRows.filter((item: any) => item.type === 'weekend');
  }

  data.forEach((group: any) => {
    if (group?.type === 'weekday' && Array.isArray(group.items)) loaded.weekday = group.items;
    if (group?.type === 'weekend' && Array.isArray(group.items)) loaded.weekend = group.items;
  });

  return loaded;
}

export default function Routine(_props: RoutineProps) {
  const dispatch = useAppDispatch();
  const { data: routinesData, error: reduxError } = useAppSelector((s) => s.personal.routines);

  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const [tab, setTab] = useState<'weekday' | 'weekend'>(isWeekend ? 'weekend' : 'weekday');
  const [routines, setRoutines] = useState<{ weekday: RoutineItem[]; weekend: RoutineItem[] }>({ weekday: [], weekend: [] });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState<RoutineItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchRoutines());
  }, [dispatch]);

  useEffect(() => {
    if (routinesData) {
      setRoutines(normalizeLoadedRoutines(routinesData));
      setLoading(false);
    }
  }, [routinesData]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
      setLoading(false);
    }
  }, [reduxError]);

  const currentRoutine = routines[tab] || [];
  const currentSlot =
    !editMode && tab === (isWeekend ? 'weekend' : 'weekday')
      ? getCurrentSlot(currentRoutine)
      : -1;
  const currentItem = currentSlot >= 0 ? currentRoutine[currentSlot] : null;
  const nextItem = getNextSlot(currentRoutine, currentSlot);
  const dayProgress =
    currentRoutine.length > 0 && currentSlot >= 0
      ? Math.round(((currentSlot + 1) / currentRoutine.length) * 100)
      : 0;

  const handleEditClick = () => {
    setEditedItems(currentRoutine.map((item) => ({ ...item })));
    setError('');
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setError('');
    setEditMode(false);
  };

  const handleSave = async () => {
    const cleanedItems = editedItems
      .map((item) => ({
        ...item,
        time: item.time?.trim() || '',
        task: item.task?.trim() || '',
        icon: item.icon?.trim() || '•',
        duration: item.duration?.trim() || '',
        note: item.note?.trim() || '',
      }))
      .filter((item) => item.time && item.task);

    if (cleanedItems.length === 0) {
      setError('Add at least one item with a time and task.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const result = await dispatch(updateRoutine({ type: tab, items: cleanedItems as any }));
      const saved = result.payload as any;
      const nextItems = Array.isArray(saved?.items) ? saved.items : cleanedItems;
      setRoutines((prev) => ({ ...prev, [tab]: nextItems }));
      setEditMode(false);
    } catch {
      setError('Failed to save routine. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleItemChange = (index: number, field: keyof RoutineItem, value: string) => {
    setEditedItems((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    setEditedItems([
      ...editedItems,
      { time: '', task: '', icon: '⏱️', duration: '', note: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems((items) => items.filter((_, i) => i !== index));
  };

  const handleMoveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= editedItems.length) return;
    const updated = [...editedItems];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);
    setEditedItems(updated);
  };

  if (loading)
    return (
      <Box sx={{ p: 3 }}>
        <Header title="My Routine" subtitle="" />
        <LinearProgress sx={{ mt: 4 }} />
      </Box>
    );

  return (
    <>
      <Header
        title="My Routine"
        subtitle={isWeekend ? 'Weekend · AI Competitive Advantage Day' : 'Weekday · Strong Stack Day'}
      />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>Now</Typography>
                <Typography variant="h6">
                  {currentItem ? (
                    <>
                      <span>{currentItem.icon}</span> {currentItem.task}
                    </>
                  ) : (
                    'No active slot'
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentItem?.time || 'Outside saved schedule'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>Next</Typography>
                <Typography variant="h6">
                  {nextItem ? (
                    <>
                      <span>{nextItem.icon}</span> {nextItem.task}
                    </>
                  ) : (
                    'Add the first item'
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {nextItem?.time || 'No time set'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Day position</Typography>
                  <Typography fontWeight={700}>{dayProgress}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dayProgress}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {currentRoutine.length} routine items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Tabs
          value={tab}
          onChange={(_, v) => {
            if (editMode && tab !== v) {
              if (window.confirm('Switching tabs will discard unsaved changes. Continue?')) {
                setTab(v);
                setEditMode(false);
              }
            } else {
              setTab(v);
            }
          }}
          sx={{ mb: 2 }}
        >
          <Tab label="Weekdays" value="weekday" />
          <Tab label="Weekends" value="weekend" />
        </Tabs>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {tab === 'weekday' ? 'Strong Stack Days' : 'AI Competitive Advantage Days'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {currentSlot >= 0 && <Chip label="Live Now" color="success" size="small" />}
                {editMode && <Chip label="Unsaved" color="warning" size="small" />}
                {!editMode ? (
                  <Button size="small" onClick={handleEditClick}>
                    Edit Routine
                  </Button>
                ) : (
                  <>
                    <Button size="small" onClick={handleCancelEdit} disabled={saving}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {!editMode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {currentRoutine.map((item, i) => (
                  <Paper
                    key={item.id || `${item.time}-${item.task}-${i}`}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderLeft: i === currentSlot ? '3px solid' : '3px solid transparent',
                      borderColor: i === currentSlot ? 'primary.main' : 'transparent',
                      bgcolor: i === currentSlot ? 'action.hover' : 'transparent',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 80, fontFamily: 'monospace' }}
                    >
                      {item.time}
                    </Typography>
                    <Typography sx={{ flex: 1 }}>
                      <span>{item.icon}</span> {item.task}
                    </Typography>
                    {item.duration && (
                      <Chip label={item.duration} size="small" variant="outlined" />
                    )}
                    {item.note && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {item.note}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {editedItems.map((item, i) => (
                  <Paper key={item.id || i} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Chip label={i + 1} size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Item {i + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
                      <TextField
                        size="small"
                        label="Time"
                        placeholder="8:00 - 9:00"
                        value={item.time || ''}
                        onChange={(e) => handleItemChange(i, 'time', e.target.value)}
                        sx={{ minWidth: 140 }}
                      />
                      <TextField
                        size="small"
                        label="Icon"
                        placeholder="⏱️"
                        value={item.icon || ''}
                        onChange={(e) => handleItemChange(i, 'icon', e.target.value)}
                        sx={{ width: 80 }}
                      />
                      <TextField
                        size="small"
                        label="Task"
                        placeholder="Focused work"
                        value={item.task || ''}
                        onChange={(e) => handleItemChange(i, 'task', e.target.value)}
                        sx={{ flex: 1, minWidth: 180 }}
                      />
                      <TextField
                        size="small"
                        label="Duration"
                        placeholder="1 hr"
                        value={item.duration || ''}
                        onChange={(e) => handleItemChange(i, 'duration', e.target.value)}
                        sx={{ width: 100 }}
                      />
                      <TextField
                        size="small"
                        label="Note"
                        placeholder="Optional"
                        value={item.note || ''}
                        onChange={(e) => handleItemChange(i, 'note', e.target.value)}
                        sx={{ flex: 1, minWidth: 120 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        disabled={i === 0}
                        onClick={() => handleMoveItem(i, -1)}
                        title="Move up"
                      >
                        <ArrowUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={i === editedItems.length - 1}
                        onClick={() => handleMoveItem(i, 1)}
                        title="Move down"
                      >
                        <ArrowDownIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveItem(i)}
                        title="Remove"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  onClick={handleAddItem}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add Routine Item
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
