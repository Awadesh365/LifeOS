import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  GridLegacy as Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Alert,
  Skeleton,
  Paper,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchLearning,
  createLearningSection,
  createLearningItem,
  updateLearningItem,
  updateLearningItemStatus,
  deleteLearningItem,
  deleteLearningSection,
  reorderLearningItems,
} from '../../../redux/slices/personalSlice';
import type { LearningItem } from '../types';

interface LearningProps {
  isMobile?: boolean;
}

const STATUS_CYCLE = ['not_started', 'in_progress', 'completed'] as const;
type LearningStatus = (typeof STATUS_CYCLE)[number];

const STATUS_CONFIG: Record<
  LearningStatus,
  { label: string; icon: string; action: string; color: 'default' | 'info' | 'success' }
> = {
  not_started: { label: 'Remaining', icon: '○', action: 'Start', color: 'default' },
  in_progress: { label: 'Active', icon: '◐', action: 'Mark done', color: 'info' },
  completed: { label: 'Done', icon: '●', action: 'Reopen', color: 'success' },
};

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'not_started', label: 'Remaining' },
  { key: 'in_progress', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

interface SectionWithItems {
  id: string;
  title: string;
  orderIndex: number;
  items: LearningItem[];
}

interface FlatItem extends LearningItem {
  sectionId: string;
  sectionTitle: string;
  sectionIndex: number;
  globalIdx: number;
}

function getPercent(done: number, total: number): number {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function itemMatchesQuery(item: LearningItem, sectionTitle: string, query: string): boolean {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return [item.topic, item.info, item.date, item.source, sectionTitle].some((value) =>
    String(value || '').toLowerCase().includes(normalized)
  );
}

function normalizeLearningData(data: unknown): SectionWithItems[] {
  return (Array.isArray(data) ? data : []) as SectionWithItems[];
}

function flattenOrder(sections: SectionWithItems[]) {
  return sections.flatMap((section) =>
    section.items.map((item: LearningItem, index: number) => ({
      id: item.id,
      sectionId: section.id,
      orderIndex: index,
    }))
  );
}

interface EmptyForm {
  topic: string;
  date: string;
  info: string;
  source: string;
  status: string;
}

const EMPTY_ITEM: EmptyForm = {
  topic: '',
  date: '',
  info: '',
  source: '',
  status: 'not_started',
};

export default function Learning({ isMobile = false }: LearningProps) {
  const dispatch = useAppDispatch();
  const {
    data: learningData,
    loading,
    error: loadError,
  } = useAppSelector((state) => state.personal.learning);

  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<{
    sectionId: string;
    itemId: string;
  } | null>(null);
  const [addingToSection, setAddingToSection] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<EmptyForm>({ ...EMPTY_ITEM });
  const [newSectionName, setNewSectionName] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);
  const [formData, setFormData] = useState<EmptyForm>({ ...EMPTY_ITEM });
  const [draggedItem, setDraggedItem] = useState<{
    sectionId: string;
    itemId: string;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{
    sectionId: string;
    itemId: string;
  } | null>(null);
  const [pendingOrder, setPendingOrder] = useState<SectionWithItems[] | null>(null);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [actionError, setActionError] = useState('');

  const displayData = useMemo<SectionWithItems[]>(
    () => pendingOrder || normalizeLearningData(learningData),
    [pendingOrder, learningData]
  );

  const flatItems = useMemo<FlatItem[]>(() => {
    let globalIdx = 1;
    return displayData.flatMap((section: SectionWithItems, sectionIndex: number) =>
      section.items.map((item: LearningItem) => ({
        ...item,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionIndex,
        globalIdx: globalIdx++,
      }))
    );
  }, [displayData]);

  const totals = useMemo(() => {
    const completed = flatItems.filter((item) => item.status === 'completed').length;
    const inProgress = flatItems.filter((item) => item.status === 'in_progress').length;
    const remaining = flatItems.filter((item) => item.status === 'not_started').length;
    return {
      total: flatItems.length,
      completed,
      inProgress,
      remaining,
      percent: getPercent(completed, flatItems.length),
    };
  }, [flatItems]);

  const focusItem =
    flatItems.find((item) => item.status === 'in_progress') ||
    flatItems.find((item) => item.status === 'not_started') ||
    flatItems[0];

  const visibleSections = useMemo(() => {
    return displayData
      .map((section: SectionWithItems) => {
        const items = section.items.filter((item: LearningItem) => {
          const statusMatch = filter === 'all' || item.status === filter;
          return statusMatch && itemMatchesQuery(item, section.title, search);
        });
        return { ...section, items };
      })
      .filter(
        (section) =>
          section.items.length > 0 || (!search.trim() && filter === 'all')
      );
  }, [displayData, filter, search]);

  const itemNumberLookup = useMemo(() => {
    return flatItems.reduce(
      (lookup: Record<string, number>, item) => {
        lookup[item.id] = item.globalIdx;
        return lookup;
      },
      {} as Record<string, number>
    );
  }, [flatItems]);

  useEffect(() => {
    dispatch(fetchLearning());
  }, [dispatch]);

  const cycleStatus = useCallback(
    async (sectionId: string, itemId: string) => {
      const currentItem = displayData
        .find((section) => section.id === sectionId)
        ?.items.find((item) => item.id === itemId);
      if (!currentItem) return;

      const idx = STATUS_CYCLE.indexOf(currentItem.status as LearningStatus);
      const nextStatus = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];

      try {
        await dispatch(
          updateLearningItemStatus({ id: itemId, status: nextStatus })
        ).unwrap();
      } catch (err: any) {
        setActionError(err.message || 'Unable to update learning item status.');
      }
    },
    [displayData, dispatch]
  );

  const handleDeleteItem = useCallback(
    async (sectionId: string, itemId: string) => {
      if (!window.confirm('Delete this item?')) return;
      try {
        await dispatch(deleteLearningItem({ sectionId, itemId })).unwrap();
      } catch (err: any) {
        setActionError(err.message || 'Unable to delete learning item.');
      }
    },
    [dispatch]
  );

  const handleDeleteSection = useCallback(
    async (sectionId: string) => {
      if (!window.confirm('Delete entire section?')) return;
      try {
        await dispatch(deleteLearningSection(sectionId)).unwrap();
      } catch (err: any) {
        setActionError(err.message || 'Unable to delete learning section.');
      }
    },
    [dispatch]
  );

  const startEdit = useCallback((sectionId: string, item: LearningItem) => {
    setEditingItem({ sectionId, itemId: item.id });
    setFormData({
      topic: item.topic,
      date: item.date,
      info: item.info,
      source: item.source,
      status: item.status,
    });
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingItem || !formData.topic.trim()) return;
    try {
      await dispatch(
        updateLearningItem({
          id: editingItem.itemId,
          data: {
            topic: formData.topic.trim(),
            date: formData.date || '',
            info: formData.info || '',
            source: formData.source || '',
            status: formData.status || 'not_started',
          },
        })
      ).unwrap();
      setEditingItem(null);
    } catch (err: any) {
      setActionError(err.message || 'Unable to save learning item.');
    }
  }, [editingItem, formData, dispatch]);

  const startAdd = useCallback((sectionId: string) => {
    setAddingToSection(sectionId);
    setNewItem({ ...EMPTY_ITEM });
  }, []);

  const saveAdd = useCallback(async () => {
    if (!addingToSection || !newItem.topic.trim()) return;
    try {
      await dispatch(
        createLearningItem({
          sectionId: addingToSection,
          topic: newItem.topic.trim(),
          date: newItem.date || '',
          info: newItem.info || '',
          source: newItem.source || '',
        })
      ).unwrap();
      setAddingToSection(null);
      setNewItem({ ...EMPTY_ITEM });
    } catch (err: any) {
      setActionError(err.message || 'Unable to add learning item.');
    }
  }, [addingToSection, newItem, dispatch]);

  const addSection = useCallback(async () => {
    const title = newSectionName.trim();
    if (!title) return;
    try {
      await dispatch(createLearningSection(title)).unwrap();
      setNewSectionName('');
      setShowNewSection(false);
    } catch (err: any) {
      setActionError(err.message || 'Unable to add learning section.');
    }
  }, [newSectionName, dispatch]);

  const handleDragStart = useCallback(
    (event: React.DragEvent, sectionId: string, itemId: string) => {
      setDraggedItem({ sectionId, itemId });
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent, sectionId: string, itemId: string) => {
      event.preventDefault();
      setDragOverItem({ sectionId, itemId });
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent, sectionId: string, itemId: string) => {
      event.preventDefault();
      if (!draggedItem) return;

      let movedItem: LearningItem | null = null;
      let newData = displayData.map((section) => {
        if (section.id !== draggedItem!.sectionId) return section;
        movedItem =
          section.items.find((item) => item.id === draggedItem!.itemId) || null;
        return {
          ...section,
          items: section.items.filter(
            (item) => item.id !== draggedItem!.itemId
          ),
        };
      });

      if (!movedItem) return;

      newData = newData.map((section) => {
        if (section.id !== sectionId) return section;
        const items = [...section.items];
        const targetIndex = items.findIndex((item) => item.id === itemId);
        items.splice(
          targetIndex >= 0 ? targetIndex : items.length,
          0,
          movedItem!
        );
        return { ...section, items };
      });

      setPendingOrder(normalizeLearningData(newData));
      setHasUnsavedOrder(true);
      setDraggedItem(null);
      setDragOverItem(null);
    },
    [draggedItem, displayData]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  const saveOrder = useCallback(async () => {
    if (!pendingOrder) return;
    try {
      await dispatch(reorderLearningItems(flattenOrder(pendingOrder))).unwrap();
      setPendingOrder(null);
      setHasUnsavedOrder(false);
      setActionError('');
    } catch (err: any) {
      setActionError(err.message || 'Unable to save learning order.');
    }
  }, [pendingOrder, dispatch]);

  const resetOrder = useCallback(() => {
    setPendingOrder(null);
    setHasUnsavedOrder(false);
  }, []);

  const renderItemForm = (
    mode: string,
    item: EmptyForm,
    setItem: React.Dispatch<React.SetStateAction<EmptyForm>>,
    onSave: () => void,
    onCancel: () => void
  ) => (
    <Paper
      sx={{ p: 2, mb: 1, border: '1px solid', borderColor: 'primary.main' }}
    >
      <Typography variant="subtitle2" gutterBottom>
        {mode}
      </Typography>
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="Topic"
            value={item.topic}
            onChange={(e) => setItem({ ...item, topic: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            size="small"
            fullWidth
            label="Date"
            value={item.date}
            onChange={(e) => setItem({ ...item, date: e.target.value })}
            placeholder="22 July"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={item.status}
              label="Status"
              onChange={(e) =>
                setItem({ ...item, status: e.target.value as string })
              }
            >
              {STATUS_CYCLE.map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Notes"
            value={item.info}
            onChange={(e) => setItem({ ...item, info: e.target.value })}
            placeholder="Scope or target"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Source"
            value={item.source}
            onChange={(e) => setItem({ ...item, source: e.target.value })}
            placeholder="https://..."
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small" onClick={onSave}>
          Save
        </Button>
        <Button variant="outlined" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <>
        <Header
          title="2.1 AI-Driven Development"
          subtitle="Keep learning and mastering your craft"
        />
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          </Grid>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 1 }} />
          ))}
        </Box>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Header
          title="2.1 AI-Driven Development"
          subtitle="Keep learning and mastering your craft"
        />
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {loadError}
          </Alert>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              Backend data unavailable
            </Typography>
            <Button
              variant="contained"
              onClick={() => dispatch(fetchLearning())}
            >
              Retry
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header
        title="2.1 AI-Driven Development"
        subtitle="Keep learning and mastering your craft"
      />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {actionError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setActionError('')}
          >
            {actionError}
          </Alert>
        )}

        {hasUnsavedOrder && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'warning.light',
            }}
          >
            <Typography variant="body2">Unsaved order changes</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={resetOrder}>
                Reset
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={saveOrder}
              >
                Save order
              </Button>
            </Box>
          </Paper>
        )}

        {/* Overview */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textTransform="uppercase"
                    >
                      Roadmap
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {totals.percent}% complete
                    </Typography>
                  </Box>
                  <Chip
                    label={`${totals.completed}/${totals.total}`}
                    size="small"
                    color="success"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totals.percent}
                  sx={{ height: 8, borderRadius: 4, my: 1.5 }}
                  color={totals.percent >= 100 ? 'success' : 'primary'}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {totals.remaining} remaining
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {totals.inProgress} active
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {totals.completed} done
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  textTransform="uppercase"
                >
                  Focus next
                </Typography>
                {focusItem ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {focusItem.topic}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.5 }}
                    >
                      {focusItem.sectionTitle}
                      {focusItem.date ? ` · ${focusItem.date}` : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {focusItem.source && focusItem.source !== '#' && (
                        <Button
                          variant="outlined"
                          size="small"
                          href={focusItem.source}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open source
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          cycleStatus(focusItem.sectionId, focusItem.id)
                        }
                      >
                        {STATUS_CONFIG[focusItem.status as LearningStatus]
                          ?.action || 'Start'}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    No learning items yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Find topic, source, date, or section"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: isMobile ? '100%' : 300 }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map((item) => {
              const count =
                item.key === 'all'
                  ? totals.total
                  : flatItems.filter((course) => course.status === item.key)
                      .length;
              return (
                <Chip
                  key={item.key}
                  label={`${item.label} (${count})`}
                  onClick={() => setFilter(item.key)}
                  color={filter === item.key ? 'primary' : 'default'}
                  variant={filter === item.key ? 'filled' : 'outlined'}
                />
              );
            })}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowNewSection(true)}
            size="small"
          >
            Add section
          </Button>
        </Box>

        {/* New Section Form */}
        {showNewSection && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              size="small"
              placeholder="Section name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSection()}
              autoFocus
              sx={{ flex: '1 1 200px' }}
            />
            <Button
              variant="contained"
              onClick={addSection}
              size="small"
            >
              Save section
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowNewSection(false)}
              size="small"
            >
              Cancel
            </Button>
          </Paper>
        )}

        {/* Sections */}
        {visibleSections.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              No matching items
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try another search or filter.
            </Typography>
          </Box>
        )}

        {visibleSections.map((section, sectionIndex) => {
          const totalInSection = section.items.length;
          const originalSection = displayData.find(
            (item) => item.id === section.id
          );
          const originalItems = originalSection?.items || [];
          const doneInSection = originalItems.filter(
            (item) => item.status === 'completed'
          ).length;
          const sectionPercent = getPercent(
            doneInSection,
            originalItems.length
          );

          return (
            <Paper key={section.id} sx={{ mb: 3, overflow: 'hidden' }}>
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                  <Chip
                    label={sectionIndex + 1}
                    size="small"
                    color="primary"
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {section.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doneInSection}/{originalItems.length} done ·{' '}
                      {totalInSection} shown
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      minWidth: 80,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {sectionPercent}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={sectionPercent}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        flex: 1,
                        minWidth: 40,
                      }}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => startAdd(section.id)}
                  >
                    Add item
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Add Item Form */}
              {addingToSection === section.id &&
                renderItemForm(
                  'Add item',
                  newItem,
                  setNewItem,
                  saveAdd,
                  () => setAddingToSection(null)
                )}

              {/* Items */}
              <Box sx={{ px: 2, pb: 2 }}>
                {section.items.map((item) => {
                  const status =
                    STATUS_CONFIG[item.status as LearningStatus] ||
                    STATUS_CONFIG.not_started;
                  const isEditing =
                    editingItem?.sectionId === section.id &&
                    editingItem?.itemId === item.id;
                  const isDropTarget =
                    dragOverItem?.itemId === item.id;
                  const isDragging =
                    draggedItem?.itemId === item.id;

                  if (isEditing) {
                    return (
                      <Box key={item.id}>
                        {renderItemForm(
                          'Edit item',
                          formData,
                          setFormData,
                          saveEdit,
                          () => setEditingItem(null)
                        )}
                      </Box>
                    );
                  }

                  return (
                    <Paper
                      key={item.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(
                          event as unknown as React.DragEvent,
                          section.id,
                          item.id
                        )
                      }
                      onDragOver={(event) =>
                        handleDragOver(
                          event as unknown as React.DragEvent,
                          section.id,
                          item.id
                        )
                      }
                      onDrop={(event) =>
                        handleDrop(
                          event as unknown as React.DragEvent,
                          section.id,
                          item.id
                        )
                      }
                      onDragEnd={handleDragEnd}
                      elevation={isDragging ? 3 : 0}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'grab',
                        border: '1px solid',
                        borderColor: isDropTarget
                          ? 'primary.main'
                          : 'divider',
                        bgcolor: isDragging
                          ? 'action.hover'
                          : 'background.paper',
                        opacity: isDragging ? 0.7 : 1,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <DragIndicatorIcon
                        sx={{ color: 'text.disabled', fontSize: 18 }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 24, fontWeight: 600 }}
                      >
                        {itemNumberLookup[item.id]}.
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => cycleStatus(section.id, item.id)}
                        sx={{
                          minWidth: 32,
                          fontSize: '1.1rem',
                          textTransform: 'none',
                        }}
                        title={status.action}
                      >
                        {status.icon}
                      </Button>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            flexWrap: 'wrap',
                          }}
                        >
                          {item.date && (
                            <Chip
                              label={item.date}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            noWrap
                          >
                            {item.topic}
                          </Typography>
                        </Box>
                        {item.info && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            noWrap
                          >
                            {item.info}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={status.label}
                        size="small"
                        color={status.color}
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.7rem' }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        {item.source && item.source !== '#' && (
                          <Button
                            size="small"
                            variant="outlined"
                            href={item.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ minWidth: 0, px: 1, fontSize: '0.75rem' }}
                          >
                            Open
                          </Button>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => startEdit(section.id, item)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteItem(section.id, item.id)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </>
  );
}
