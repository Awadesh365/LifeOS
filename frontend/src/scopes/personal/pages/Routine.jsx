import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import Header from '../components/Header';

function parseTimeToMinutes(value) {
  if (!value) return null;
  const match = String(value).match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return (parseInt(match[1], 10) * 60) + parseInt(match[2], 10);
}

function parseTimeRange(value) {
  if (!value) return [];
  return [...String(value).matchAll(/(\d{1,2}):(\d{2})/g)].map((match) =>
    (parseInt(match[1], 10) * 60) + parseInt(match[2], 10)
  );
}

function getSlotRange(item, nextItem) {
  const times = parseTimeRange(item.time);
  const start = times[0];
  if (start === undefined) return null;

  let end = times[1];
  if (end === undefined && nextItem) {
    end = parseTimeToMinutes(nextItem.time);
  }
  if (end === undefined || end === null) {
    end = 24 * 60;
  }
  if (end <= start) {
    end += 24 * 60;
  }

  return { start, end };
}

function getCurrentSlot(routine) {
  if (!routine || !routine.length) return -1;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < routine.length; i++) {
    const range = getSlotRange(routine[i], routine[i + 1]);
    if (!range) continue;
    const comparableNow = range.end > 24 * 60 && currentMinutes < range.start
      ? currentMinutes + (24 * 60)
      : currentMinutes;

    if (comparableNow >= range.start && comparableNow < range.end) {
      return i;
    }
  }
  return -1;
}

function getNextSlot(routine, currentSlot) {
  if (!routine || !routine.length) return null;
  if (currentSlot >= 0) {
    return routine[(currentSlot + 1) % routine.length];
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const next = routine
    .map((item) => ({ item, start: parseTimeToMinutes(item.time) }))
    .filter((entry) => entry.start !== null && entry.start >= currentMinutes)
    .sort((a, b) => a.start - b.start)[0];

  return next?.item || routine[0];
}

function normalizeLoadedRoutines(data) {
  const loaded = {
    weekday: [],
    weekend: [],
  };

  if (!Array.isArray(data)) return loaded;

  const flatRows = data.filter((item) => item?.type && !item.items);
  if (flatRows.length > 0) {
    loaded.weekday = flatRows.filter((item) => item.type === 'weekday');
    loaded.weekend = flatRows.filter((item) => item.type === 'weekend');
  }

  data.forEach((group) => {
    if (group?.type === 'weekday' && Array.isArray(group.items)) loaded.weekday = group.items;
    if (group?.type === 'weekend' && Array.isArray(group.items)) loaded.weekend = group.items;
  });

  return loaded;
}

export default function Routine() {
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const [tab, setTab] = useState(isWeekend ? 'weekend' : 'weekday');
  const [routines, setRoutines] = useState({ weekday: [], weekend: [] });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchRoutines = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getRoutines();
      setRoutines(normalizeLoadedRoutines(data));
    } catch (err) {
      console.error('Failed to load routines', err);
      setError(err.message || 'Unable to load routines from backend.');
      setRoutines({ weekday: [], weekend: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const currentRoutine = routines[tab] || [];
  const currentSlot = !editMode && tab === (isWeekend ? 'weekend' : 'weekday')
    ? getCurrentSlot(currentRoutine)
    : -1;
  const currentItem = currentSlot >= 0 ? currentRoutine[currentSlot] : null;
  const nextItem = getNextSlot(currentRoutine, currentSlot);
  const dayProgress = currentRoutine.length > 0 && currentSlot >= 0
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
      const saved = await api.updateRoutine(tab, cleanedItems);
      const nextItems = Array.isArray(saved?.items) ? saved.items : cleanedItems;
      setRoutines(prev => ({ ...prev, [tab]: nextItems }));
      setEditMode(false);
    } catch (err) {
      console.error('Failed to save routine', err);
      setError('Failed to save routine. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    setEditedItems((items) => items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleAddItem = () => {
    setEditedItems([...editedItems, { time: '', task: '', icon: '⏱️', duration: '', note: '' }]);
  };

  const handleRemoveItem = (index) => {
    setEditedItems((items) => items.filter((_, i) => i !== index));
  };

  const handleMoveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= editedItems.length) return;
    const updated = [...editedItems];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);
    setEditedItems(updated);
  };

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <>
      <Header
        title="My Routine"
        subtitle={isWeekend ? 'Weekend · AI Competitive Advantage Day' : 'Weekday · Strong Stack Day'}
      />
      <div className="page-content">
        <div className="routine-overview">
          <div className="routine-summary-card">
            <span className="task-panel-label">Now</span>
            <div className="routine-summary-title">
              {currentItem ? (
                <>
                  <span>{currentItem.icon}</span>
                  {currentItem.task}
                </>
              ) : (
                'No active slot'
              )}
            </div>
            <span className="routine-summary-meta">{currentItem?.time || 'Outside saved schedule'}</span>
          </div>
          <div className="routine-summary-card">
            <span className="task-panel-label">Next</span>
            <div className="routine-summary-title">
              {nextItem ? (
                <>
                  <span>{nextItem.icon}</span>
                  {nextItem.task}
                </>
              ) : (
                'Add the first item'
              )}
            </div>
            <span className="routine-summary-meta">{nextItem?.time || 'No time set'}</span>
          </div>
          <div className="routine-summary-card">
            <div className="routine-summary-row">
              <span className="task-panel-label">Day position</span>
              <strong>{dayProgress}%</strong>
            </div>
            <div className="task-progress-bar">
              <div className="task-progress-fill" style={{ width: `${dayProgress}%` }} />
            </div>
            <span className="routine-summary-meta">{currentRoutine.length} routine items</span>
          </div>
        </div>

        {error && <div className="inline-alert">{error}</div>}

        <div className="tabs">
          <button
            className={`tab ${tab === 'weekday' ? 'active' : ''}`}
            onClick={() => {
              if (editMode && tab !== 'weekday') {
                if (window.confirm("Switching tabs will discard unsaved changes. Continue?")) {
                  setTab('weekday');
                  setEditMode(false);
                }
              } else {
                setTab('weekday');
              }
            }}
          >
            Weekdays
          </button>
          <button
            className={`tab ${tab === 'weekend' ? 'active' : ''}`}
            onClick={() => {
              if (editMode && tab !== 'weekend') {
                if (window.confirm("Switching tabs will discard unsaved changes. Continue?")) {
                  setTab('weekend');
                  setEditMode(false);
                }
              } else {
                setTab('weekend');
              }
            }}
          >
            Weekends
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              {tab === 'weekday' ? '💼 Strong Stack Days' : '🔥 AI Competitive Advantage Days'}
            </div>
            <div className="routine-card-actions">
              {currentSlot >= 0 && (
                <span className="card-badge badge-success">Live Now</span>
              )}
              {editMode && (
                <span className="card-badge badge-warning">Unsaved</span>
              )}
              {!editMode ? (
                <button className="btn btn-ghost btn-small" onClick={handleEditClick}>
                  Edit Routine
                </button>
              ) : (
                <>
                  <button className="btn btn-ghost btn-small" onClick={handleCancelEdit} disabled={saving}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-small" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={`routine-timeline ${editMode ? 'editing' : ''}`}>
            {!editMode ? (
              currentRoutine.map((item, i) => (
                <div
                  key={item.id || `${item.time}-${item.task}-${i}`}
                  className={`routine-item ${i === currentSlot ? 'current' : ''}`}
                >
                  <div className="routine-time">{item.time}</div>
                  <div className="routine-task">
                    <span>{item.icon}</span>
                    {item.task}
                  </div>
                  <div className="routine-meta">
                    {item.duration && (
                      <span className="routine-duration">{item.duration}</span>
                    )}
                    {item.note && (
                      <span className="routine-note">{item.note}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="routine-editor">
                {editedItems.map((item, i) => (
                  <div key={item.id || i} className="routine-editor-item">
                    <div className="routine-editor-index">{i + 1}</div>
                    <div className="routine-editor-grid">
                      <label>
                        Time
                        <input
                          type="text"
                          value={item.time || ''}
                          onChange={e => handleItemChange(i, 'time', e.target.value)}
                          placeholder="8:00 - 9:00"
                        />
                      </label>
                      <label className="routine-icon-field">
                        Icon
                        <input
                          type="text"
                          value={item.icon || ''}
                          onChange={e => handleItemChange(i, 'icon', e.target.value)}
                          placeholder="⏱️"
                        />
                      </label>
                      <label className="routine-task-field">
                        Task
                        <input
                          type="text"
                          value={item.task || ''}
                          onChange={e => handleItemChange(i, 'task', e.target.value)}
                          placeholder="Focused work"
                        />
                      </label>
                      <label>
                        Duration
                        <input
                          type="text"
                          value={item.duration || ''}
                          onChange={e => handleItemChange(i, 'duration', e.target.value)}
                          placeholder="1 hr"
                        />
                      </label>
                      <label className="routine-note-field">
                        Note
                        <input
                          type="text"
                          value={item.note || ''}
                          onChange={e => handleItemChange(i, 'note', e.target.value)}
                          placeholder="Optional"
                        />
                      </label>
                    </div>
                    <div className="routine-editor-actions">
                      <button className="icon-action-btn" onClick={() => handleMoveItem(i, -1)} disabled={i === 0} title="Move up" type="button">
                        ↑
                      </button>
                      <button className="icon-action-btn" onClick={() => handleMoveItem(i, 1)} disabled={i === editedItems.length - 1} title="Move down" type="button">
                        ↓
                      </button>
                      <button className="icon-action-btn danger" onClick={() => handleRemoveItem(i)} title="Remove" type="button">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-primary routine-add-btn"
                  onClick={handleAddItem}
                  type="button"
                >
                  + Add Routine Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
