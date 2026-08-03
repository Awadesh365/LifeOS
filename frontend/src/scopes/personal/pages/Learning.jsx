import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import Header from '../components/Header';

const STATUS_CYCLE = ['not_started', 'in_progress', 'completed'];
const STATUS_CONFIG = {
  not_started: { label: 'Remaining', icon: '○', action: 'Start' },
  in_progress: { label: 'Active', icon: '◐', action: 'Mark done' },
  completed: { label: 'Done', icon: '●', action: 'Reopen' },
};
const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'not_started', label: 'Remaining' },
  { key: 'in_progress', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

const EMPTY_ITEM = { id: '', topic: '', date: '', info: '', source: '', status: 'not_started' };

function getPercent(done, total) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function itemMatchesQuery(item, sectionTitle, query) {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return [item.topic, item.info, item.date, item.source, sectionTitle]
    .some((value) => String(value || '').toLowerCase().includes(normalized));
}

function normalizeLearningData(data) {
  return (Array.isArray(data) ? data : []).map((section) => ({
    ...section,
    items: Array.isArray(section.items) ? section.items : [],
  }));
}

function updateSections(sections, updater) {
  return normalizeLearningData(typeof updater === 'function' ? updater(sections) : updater);
}

function flattenOrder(sections) {
  return sections.flatMap((section) =>
    section.items.map((item, index) => ({
      id: item.id,
      sectionId: section.id,
      orderIndex: index,
    }))
  );
}

export default function Learning() {
  const [learningData, setLearningData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [addingToSection, setAddingToSection] = useState(null);
  const [newItem, setNewItem] = useState({ ...EMPTY_ITEM });
  const [newSectionName, setNewSectionName] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_ITEM });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);

  const displayData = pendingOrder || learningData;

  const loadLearning = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    setActionError('');
    try {
      const data = await api.getLearning();
      setLearningData(normalizeLearningData(data));
      setPendingOrder(null);
      setHasUnsavedOrder(false);
    } catch (error) {
      setLoadError(error.message || 'Unable to load learning roadmap.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLearning();
  }, [loadLearning]);

  const flatItems = useMemo(() => {
    let globalIdx = 1;
    return displayData.flatMap((section, sectionIndex) =>
      section.items.map((item) => ({
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

  const focusItem = flatItems.find((item) => item.status === 'in_progress')
    || flatItems.find((item) => item.status === 'not_started')
    || flatItems[0];

  const visibleSections = useMemo(() => {
    return displayData
      .map((section) => {
        const items = section.items.filter((item) => {
          const statusMatch = filter === 'all' || item.status === filter;
          return statusMatch && itemMatchesQuery(item, section.title, search);
        });
        return { ...section, items };
      })
      .filter((section) => section.items.length > 0 || (!search.trim() && filter === 'all'));
  }, [displayData, filter, search]);

  const itemNumberLookup = useMemo(() => {
    return flatItems.reduce((lookup, item) => {
      lookup[item.id] = item.globalIdx;
      return lookup;
    }, {});
  }, [flatItems]);

  const applyDisplayData = (updater, orderChanged = false) => {
    setActionError('');
    if (pendingOrder) {
      setPendingOrder((current) => updateSections(current, updater));
    } else {
      setLearningData((current) => updateSections(current, updater));
    }
    if (orderChanged) setHasUnsavedOrder(true);
  };

  const cycleStatus = async (sectionId, itemId) => {
    const currentItem = displayData
      .find((section) => section.id === sectionId)
      ?.items.find((item) => item.id === itemId);

    if (!currentItem) return;

    const idx = STATUS_CYCLE.indexOf(currentItem.status);
    const nextStatus = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];

    try {
      const updated = await api.updateLearningItemStatus(itemId, nextStatus);
      applyDisplayData((sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            items: section.items.map((item) => (item.id === itemId ? updated : item)),
          };
        })
      );
    } catch (error) {
      setActionError(error.message || 'Unable to update learning item status.');
    }
  };

  const deleteItem = async (sectionId, itemId) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.deleteLearningItem(itemId);
      applyDisplayData((sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;
          return { ...section, items: section.items.filter((item) => item.id !== itemId) };
        }),
        Boolean(pendingOrder)
      );
    } catch (error) {
      setActionError(error.message || 'Unable to delete learning item.');
    }
  };

  const deleteSection = async (sectionId) => {
    if (!confirm('Delete entire section?')) return;
    try {
      await api.deleteLearningSection(sectionId);
      applyDisplayData(
        (sections) => sections.filter((section) => section.id !== sectionId),
        Boolean(pendingOrder)
      );
    } catch (error) {
      setActionError(error.message || 'Unable to delete learning section.');
    }
  };

  const startEdit = (sectionId, item) => {
    setEditingItem({ sectionId, itemId: item.id });
    setFormData({ ...item });
  };

  const saveEdit = async () => {
    if (!editingItem || !formData.topic.trim()) return;
    const payload = {
      topic: formData.topic.trim(),
      date: formData.date || '',
      info: formData.info || '',
      source: formData.source || '',
      status: formData.status || 'not_started',
    };

    try {
      const updated = await api.updateLearningItem(editingItem.itemId, payload);
      applyDisplayData((sections) =>
        sections.map((section) => {
          if (section.id !== editingItem.sectionId) return section;
          return {
            ...section,
            items: section.items.map((item) => (item.id === editingItem.itemId ? updated : item)),
          };
        })
      );
      setEditingItem(null);
    } catch (error) {
      setActionError(error.message || 'Unable to save learning item.');
    }
  };

  const startAdd = (sectionId) => {
    setAddingToSection(sectionId);
    setNewItem({ ...EMPTY_ITEM, id: `item_${Date.now()}` });
  };

  const saveAdd = async () => {
    if (!addingToSection || !newItem.topic.trim()) return;
    const payload = {
      sectionId: addingToSection,
      topic: newItem.topic.trim(),
      date: newItem.date || '',
      info: newItem.info || '',
      source: newItem.source || '',
    };

    try {
      const created = await api.createLearningItem(payload);
      applyDisplayData((sections) =>
        sections.map((section) => {
          if (section.id !== addingToSection) return section;
          return { ...section, items: [...section.items, created] };
        })
      );
      setAddingToSection(null);
      setNewItem({ ...EMPTY_ITEM });
    } catch (error) {
      setActionError(error.message || 'Unable to add learning item.');
    }
  };

  const addSection = async () => {
    const title = newSectionName.trim();
    if (!title) return;
    try {
      const created = await api.createLearningSection(title);
      applyDisplayData(
        (sections) => [...sections, { ...created, items: [] }],
        Boolean(pendingOrder)
      );
      setNewSectionName('');
      setShowNewSection(false);
    } catch (error) {
      setActionError(error.message || 'Unable to add learning section.');
    }
  };

  const handleDragStart = (event, sectionId, itemId) => {
    setDraggedItem({ sectionId, itemId });
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event, sectionId, itemId) => {
    event.preventDefault();
    setDragOverItem({ sectionId, itemId });
  };

  const handleDrop = (event, sectionId, itemId) => {
    event.preventDefault();
    if (!draggedItem) return;

    let movedItem = null;
    let newData = displayData.map((section) => {
      if (section.id !== draggedItem.sectionId) return section;
      movedItem = section.items.find((item) => item.id === draggedItem.itemId);
      return { ...section, items: section.items.filter((item) => item.id !== draggedItem.itemId) };
    });

    if (!movedItem) return;

    newData = newData.map((section) => {
      if (section.id !== sectionId) return section;
      const items = [...section.items];
      const targetIndex = items.findIndex((item) => item.id === itemId);
      items.splice(targetIndex >= 0 ? targetIndex : items.length, 0, movedItem);
      return { ...section, items };
    });

    setPendingOrder(normalizeLearningData(newData));
    setHasUnsavedOrder(true);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const saveOrder = async () => {
    if (!pendingOrder) return;
    try {
      await api.reorderLearningItems(flattenOrder(pendingOrder));
      setLearningData(normalizeLearningData(pendingOrder));
      setPendingOrder(null);
      setHasUnsavedOrder(false);
      setActionError('');
    } catch (error) {
      setActionError(error.message || 'Unable to save learning order.');
    }
  };

  const resetOrder = () => {
    setPendingOrder(null);
    setHasUnsavedOrder(false);
  };

  const renderItemForm = (mode, item, setItem, onSave, onCancel) => (
    <div className="learning-editor">
      <div className="learning-editor-title">{mode}</div>
      <div className="learning-editor-grid">
        <label className="learning-field wide">
          Topic
          <input value={item.topic} onChange={(event) => setItem({ ...item, topic: event.target.value })} placeholder="Topic" />
        </label>
        <label className="learning-field">
          Date
          <input value={item.date} onChange={(event) => setItem({ ...item, date: event.target.value })} placeholder="22 July" />
        </label>
        <label className="learning-field">
          Status
          <select value={item.status} onChange={(event) => setItem({ ...item, status: event.target.value })}>
            {STATUS_CYCLE.map((status) => (
              <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>
            ))}
          </select>
        </label>
        <label className="learning-field wide">
          Notes
          <input value={item.info} onChange={(event) => setItem({ ...item, info: event.target.value })} placeholder="Scope or target" />
        </label>
        <label className="learning-field wide">
          Source
          <input value={item.source} onChange={(event) => setItem({ ...item, source: event.target.value })} placeholder="https://..." />
        </label>
      </div>
      <div className="learning-editor-actions">
        <button className="learning-btn primary" onClick={onSave} type="button">Save</button>
        <button className="learning-btn secondary" onClick={onCancel} type="button">Cancel</button>
      </div>
    </div>
  );

  return (
    <>
      <Header title="2.1 AI-Driven Development" subtitle="Keep learning and mastering your craft" />
      <div className="page-content learning-page">
        {actionError && (
          <div className="learning-savebar">
            <span>{actionError}</span>
            <button className="learning-btn secondary" onClick={() => setActionError('')} type="button">Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="learning-empty">
            <h3>Loading learning roadmap</h3>
            <p>Fetching current data from the backend.</p>
          </div>
        ) : loadError ? (
          <div className="learning-empty">
            <h3>Backend data unavailable</h3>
            <p>{loadError}</p>
            <button className="learning-btn primary" onClick={loadLearning} type="button">Retry</button>
          </div>
        ) : (
          <>
        {hasUnsavedOrder && (
          <div className="learning-savebar">
            <span>Unsaved order changes</span>
            <div className="learning-savebar-actions">
              <button className="learning-btn secondary" onClick={resetOrder} type="button">Reset</button>
              <button className="learning-btn primary" onClick={saveOrder} type="button">Save order</button>
            </div>
          </div>
        )}

        <section className="learning-overview">
          <div className="learning-progress-panel">
            <div className="learning-panel-top">
              <div>
                <span className="learning-eyebrow">Roadmap</span>
                <h3>{totals.percent}% complete</h3>
              </div>
              <strong>{totals.completed}/{totals.total}</strong>
            </div>
            <div className="learning-progress-track">
              <div className="learning-progress-fill" style={{ width: `${totals.percent}%` }} />
            </div>
            <div className="learning-stat-strip">
              <span>{totals.remaining} remaining</span>
              <span>{totals.inProgress} active</span>
              <span>{totals.completed} done</span>
            </div>
          </div>

          <div className="learning-focus-panel">
            <span className="learning-eyebrow">Focus next</span>
            {focusItem ? (
              <>
                <h3>{focusItem.topic}</h3>
                <p>{focusItem.sectionTitle}{focusItem.date ? ` · ${focusItem.date}` : ''}</p>
                <div className="learning-focus-actions">
                  {focusItem.source && focusItem.source !== '#' && (
                    <a className="learning-btn secondary" href={focusItem.source} target="_blank" rel="noopener noreferrer">Open source</a>
                  )}
                  <button className="learning-btn primary" onClick={() => cycleStatus(focusItem.sectionId, focusItem.id)} type="button">
                    {STATUS_CONFIG[focusItem.status].action}
                  </button>
                </div>
              </>
            ) : (
              <h3>No learning items yet</h3>
            )}
          </div>
        </section>

        <div className="learning-controls">
          <label className="learning-search">
            <span>Search</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find topic, source, date, or section" />
          </label>
          <div className="learning-filter-tabs">
            {STATUS_FILTERS.map((item) => {
              const count = item.key === 'all' ? totals.total : flatItems.filter((course) => course.status === item.key).length;
              return (
                <button
                  key={item.key}
                  className={`learning-filter ${filter === item.key ? 'active' : ''}`}
                  onClick={() => setFilter(item.key)}
                  type="button"
                >
                  {item.label}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
          <button className="learning-btn primary" onClick={() => setShowNewSection(true)} type="button">Add section</button>
        </div>

        {showNewSection && (
          <div className="learning-section-form">
            <input
              value={newSectionName}
              onChange={(event) => setNewSectionName(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addSection()}
              placeholder="Section name"
              autoFocus
            />
            <button className="learning-btn primary" onClick={addSection} type="button">Save section</button>
            <button className="learning-btn secondary" onClick={() => setShowNewSection(false)} type="button">Cancel</button>
          </div>
        )}

        <div className="learning-section-stack">
          {visibleSections.length === 0 && (
            <div className="learning-empty">
              <h3>No matching items</h3>
              <p>Try another search or filter.</p>
            </div>
          )}

          {visibleSections.map((section, sectionIndex) => {
            const totalInSection = section.items.length;
            const originalSection = displayData.find((item) => item.id === section.id);
            const originalItems = originalSection?.items || [];
            const doneInSection = originalItems.filter((item) => item.status === 'completed').length;
            const sectionPercent = getPercent(doneInSection, originalItems.length);

            return (
              <section className="learning-roadmap-section" key={section.id}>
                <div className="learning-section-header">
                  <div className="learning-section-main">
                    <span className="learning-section-index">{sectionIndex + 1}</span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{doneInSection}/{originalItems.length} done · {totalInSection} shown</p>
                    </div>
                  </div>
                  <div className="learning-section-actions">
                    <div className="learning-section-progress">
                      <span>{sectionPercent}%</span>
                      <div className="learning-progress-track small">
                        <div className="learning-progress-fill" style={{ width: `${sectionPercent}%` }} />
                      </div>
                    </div>
                    <button className="learning-btn secondary" onClick={() => startAdd(section.id)} type="button">Add item</button>
                    <button className="learning-btn danger" onClick={() => deleteSection(section.id)} type="button">Delete</button>
                  </div>
                </div>

                {addingToSection === section.id && renderItemForm(
                  'Add item',
                  newItem,
                  setNewItem,
                  saveAdd,
                  () => setAddingToSection(null)
                )}

                <div className="learning-roadmap-list">
                  {section.items.map((item) => {
                    const status = STATUS_CONFIG[item.status];
                    const isEditing = editingItem?.sectionId === section.id && editingItem?.itemId === item.id;
                    const isDropTarget = dragOverItem?.itemId === item.id;
                    const isDragging = draggedItem?.itemId === item.id;

                    if (isEditing) {
                      return (
                        <div className="learning-row-editor" key={item.id}>
                          {renderItemForm(
                            'Edit item',
                            formData,
                            setFormData,
                            saveEdit,
                            () => setEditingItem(null)
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, section.id, item.id)}
                        onDragOver={(event) => handleDragOver(event, section.id, item.id)}
                        onDrop={(event) => handleDrop(event, section.id, item.id)}
                        onDragEnd={handleDragEnd}
                        className={`learning-roadmap-row ${item.status} ${isDropTarget ? 'drop-target' : ''} ${isDragging ? 'dragging' : ''}`}
                      >
                        <span className="learning-drag-handle">::</span>
                        <span className="learning-item-number">{itemNumberLookup[item.id]}.</span>
                        <button
                          className={`learning-status-toggle ${item.status}`}
                          onClick={() => cycleStatus(section.id, item.id)}
                          type="button"
                          title={status.action}
                        >
                          {status.icon}
                        </button>
                        <div className="learning-item-body">
                          <div className="learning-item-line">
                            {item.date && <span className="learning-date-chip">{item.date}</span>}
                            <h4>{item.topic}</h4>
                          </div>
                          {item.info && <p>{item.info}</p>}
                        </div>
                        <span className={`learning-status-pill ${item.status}`}>{status.label}</span>
                        <div className="learning-row-actions">
                          {item.source && item.source !== '#' && (
                            <a className="learning-btn secondary compact" href={item.source} target="_blank" rel="noopener noreferrer">Open</a>
                          )}
                          <button className="learning-btn secondary compact" onClick={() => startEdit(section.id, item)} type="button">Edit</button>
                          <button className="learning-btn danger compact" onClick={() => deleteItem(section.id, item.id)} type="button">Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
          </>
        )}
      </div>
    </>
  );
}
