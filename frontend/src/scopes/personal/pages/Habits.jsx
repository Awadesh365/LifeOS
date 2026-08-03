import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import Header from '../components/Header';

const CATEGORY_LABELS = {
  all: 'All',
  open: 'Open',
  done: 'Done',
  routine: 'Routine',
  health: 'Health',
  learning: 'Learning',
  career: 'Career',
  discipline: 'Discipline',
};

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en', { weekday: 'short' });
}

function getDateKey(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatLocalDate(d);
}

function getToday() {
  return formatLocalDate(new Date());
}

function rowsToLog(rows) {
  return rows.reduce((log, habit) => {
    log[habit.id] = Boolean(habit.done);
    return log;
  }, {});
}

export default function Habits() {
  const [habitLog, setHabitLog] = useState({});
  const [habits, setHabits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [syncMode, setSyncMode] = useState('loading');
  const [busyIds, setBusyIds] = useState([]);
  const [error, setError] = useState('');
  const today = getToday();

  useEffect(() => {
    let isActive = true;

    async function loadHabits() {
      const weekKeys = Array.from({ length: 7 }, (_, i) => getDateKey(i - 6));
      setSyncMode('loading');
      setError('');

      try {
        const weekRows = await Promise.all(weekKeys.map((date) => api.getHabits(date)));
        if (!isActive) return;

        const todayRows = weekRows[weekRows.length - 1] || [];
        setHabits(todayRows);
        setHabitLog(weekKeys.reduce((log, date, index) => {
          log[date] = rowsToLog(weekRows[index] || []);
          return log;
        }, {}));
        setSyncMode('server');
      } catch (err) {
        console.error('Failed to load habits from server:', err);
        if (!isActive) return;
        setHabits([]);
        setHabitLog({});
        setSyncMode('error');
        setError(err.message || 'Unable to load habits from backend.');
      }
    }

    loadHabits();

    return () => {
      isActive = false;
    };
  }, []);

  const todayHabits = useMemo(() => rowsToLog(habits), [habits]);

  const toggleHabit = (habitId) => {
    const previousHabits = habits;
    const nextHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    setHabits(nextHabits);
    setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(nextHabits) }));

    if (syncMode !== 'server') {
      setError('Backend is unavailable. Habit changes were not saved.');
      return;
    }

    setBusyIds((ids) => [...ids, habitId]);
    setSyncMode('saving');
    api.toggleHabit(habitId, today)
      .then(() => {
        setError('');
        setSyncMode('server');
      })
      .catch((err) => {
        console.error('Failed to toggle habit on server:', err);
        setHabits(previousHabits);
        setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(previousHabits) }));
        setSyncMode('error');
        setError(err.message || 'Unable to save habit change.');
      })
      .finally(() => {
        setBusyIds((ids) => ids.filter((id) => id !== habitId));
      });
  };

  const setAllHabits = (done) => {
    const idsToChange = habits.filter((habit) => Boolean(habit.done) !== done).map((habit) => habit.id);
    if (idsToChange.length === 0) return;

    const previousHabits = habits;
    const nextHabits = habits.map((habit) => ({ ...habit, done }));

    setHabits(nextHabits);
    setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(nextHabits) }));

    if (syncMode !== 'server') {
      setError('Backend is unavailable. Habit changes were not saved.');
      return;
    }

    setBusyIds((ids) => [...new Set([...ids, ...idsToChange])]);
    setSyncMode('saving');
    Promise.all(idsToChange.map((habitId) => api.toggleHabit(habitId, today)))
      .then(() => {
        setError('');
        setSyncMode('server');
      })
      .catch((err) => {
        console.error('Failed to bulk update habits on server:', err);
        setHabits(previousHabits);
        setHabitLog((previousLog) => ({ ...previousLog, [today]: rowsToLog(previousHabits) }));
        setSyncMode('error');
        setError(err.message || 'Unable to save habit changes.');
      })
      .finally(() => {
        setBusyIds((ids) => ids.filter((id) => !idsToChange.includes(id)));
      });
  };

  const habitsCompleted = Object.values(todayHabits).filter(Boolean).length;
  const habitsTotal = habits.length;
  const habitsRemaining = Math.max(habitsTotal - habitsCompleted, 0);
  const habitPercent = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;
  const isSaving = syncMode === 'saving';
  const syncLabel = syncMode === 'server'
    ? 'Synced'
    : syncMode === 'saving'
      ? 'Saving'
      : syncMode === 'loading'
        ? 'Loading'
        : 'Backend error';

  const getStreak = (habitId) => {
    let s = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1); // start from yesterday
    for (let i = 0; i < 365; i++) {
      const key = formatLocalDate(d);
      if (habitLog[key]?.[habitId]) {
        s++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    // Add today if done
    if (todayHabits[habitId]) s++;
    return s;
  };

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6; // -6 to 0 (today)
    const key = getDateKey(offset);
    const dayHabits = key === today ? todayHabits : habitLog[key] || {};
    const done = Object.values(dayHabits).filter(Boolean).length;
    const ratio = habitsTotal > 0 ? done / habitsTotal : 0;
    let level = 'empty';
    if (ratio > 0.7) level = 'high';
    else if (ratio > 0.3) level = 'mid';
    else if (ratio > 0) level = 'low';
    return {
      label: getDayLabel(offset),
      done,
      level,
      isToday: offset === 0,
    };
  });

  const filters = [
    { key: 'all', count: habitsTotal },
    { key: 'open', count: habitsRemaining },
    { key: 'done', count: habitsCompleted },
    ...Array.from(new Set(habits.map((habit) => habit.category))).map((category) => ({
      key: category,
      count: habits.filter((habit) => habit.category === category).length,
    })),
  ];

  const visibleHabits = habits
    .filter((habit) => {
      if (filter === 'open') return !habit.done;
      if (filter === 'done') return habit.done;
      if (filter === 'all') return true;
      return habit.category === filter;
    })
    .sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <>
      <Header
        title="Daily Tracker"
        subtitle={`${habitsCompleted}/${habitsTotal} done today · ${habitsRemaining} remaining`}
      />
      <div className="page-content">
        {error && <div className="inline-alert">{error}</div>}

        <div className="today-task-panel">
          <div className="task-progress-card">
            <div>
              <div className="task-panel-label">Today</div>
              <div className="task-panel-title">{habitsRemaining === 0 ? 'All clear' : `${habitsRemaining} left`}</div>
            </div>
            <div className="task-progress-value">{habitPercent}%</div>
            <div className="task-progress-bar">
              <div className="task-progress-fill" style={{ width: `${habitPercent}%` }} />
            </div>
            <div className="task-progress-meta">
              <span>{habitsCompleted} complete</span>
              <span className={`sync-pill ${syncMode}`}>{syncLabel}</span>
            </div>
          </div>
          <div className="task-actions">
            <button className="btn btn-primary" onClick={() => setAllHabits(true)} disabled={isSaving || habitsRemaining === 0}>
              ✓ Mark all done
            </button>
            <button className="btn btn-ghost" onClick={() => setAllHabits(false)} disabled={isSaving || habitsCompleted === 0}>
              Reset today
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">📅 This Week</div>
            <span className="card-badge badge-info">7-Day View</span>
          </div>
          <div className="week-heatmap">
            {weekData.map((day, i) => (
              <div
                key={i}
                className={`heat-day ${day.level} ${day.isToday ? 'today' : ''}`}
              >
                <span className="day-label">{day.label}</span>
                {day.done}/{habitsTotal}
              </div>
            ))}
          </div>
        </div>

        <div className="section-header">
          <h3>Today's Habits</h3>
          <p>{visibleHabits.length} shown · pending tasks stay first in the flow</p>
        </div>
        <div className="task-toolbar">
          <div className="tabs task-filters" role="tablist" aria-label="Habit filters">
            {filters.map((item) => (
              <button
                key={item.key}
                className={`tab ${filter === item.key ? 'active' : ''}`}
                onClick={() => setFilter(item.key)}
                type="button"
              >
                {CATEGORY_LABELS[item.key] || item.key}
                <span className="filter-count">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="habits-grid">
          {visibleHabits.map((habit) => {
            const isDone = todayHabits[habit.id] || false;
            const streak = getStreak(habit.id);
            return (
              <button
                type="button"
                key={habit.id}
                className={`habit-item ${isDone ? 'done' : ''}`}
                onClick={() => toggleHabit(habit.id)}
                disabled={isSaving || busyIds.includes(habit.id)}
              >
                <div className="habit-checkbox">
                  {isDone ? '✓' : ''}
                </div>
                <span className="habit-icon">{habit.icon}</span>
                <span className="habit-info">
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-category">{CATEGORY_LABELS[habit.category] || habit.category}</span>
                </span>
                {streak > 0 && (
                  <span className="habit-streak">{streak}d</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
