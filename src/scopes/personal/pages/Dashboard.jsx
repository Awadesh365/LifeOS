import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Header from '../components/Header';

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

export default function Dashboard() {
  const [habitRows, setHabitRows] = useState([]);
  const [habitLog, setHabitLog] = useState({});
  const [learningData, setLearningData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [dreamsData, setDreamsData] = useState([]);
  const [strongStack, setStrongStack] = useState({ frontend: [], backend: [], cloud: [] });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingHabitId, setSavingHabitId] = useState(null);
  const [habitSyncMode, setHabitSyncMode] = useState('server');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const weekKeys = Array.from({ length: 7 }, (_, i) => getDateKey(i - 6));
      setError('');
      const [habitResult, learningResult, goalsResult, dreamsResult, jobsResult, strongStackResult] = await Promise.allSettled([
        Promise.all(weekKeys.map((date) => api.getHabits(date))),
        api.getLearning(),
        api.getGoals(),
        api.getDreams(),
        api.getJobs(),
        api.getStrongStack(),
      ]);

      if (habitResult.status === 'fulfilled') {
        const habitWeekRows = habitResult.value;
        const todayRows = habitWeekRows[habitWeekRows.length - 1] || [];
        setHabitRows(todayRows);
        setHabitLog(weekKeys.reduce((log, date, index) => {
          log[date] = rowsToLog(habitWeekRows[index] || []);
          return log;
        }, {}));
        setHabitSyncMode('server');
      } else {
        console.error('Habit API load failed:', habitResult.reason);
        setHabitRows([]);
        setHabitLog({});
        setHabitSyncMode('error');
        setError('Dashboard habits are unavailable because the backend request failed.');
      }

      if (learningResult.status === 'fulfilled') setLearningData(learningResult.value);
      if (goalsResult.status === 'fulfilled') setGoalsData(goalsResult.value);
      if (dreamsResult.status === 'fulfilled') setDreamsData(dreamsResult.value);
      if (jobsResult.status === 'fulfilled') setJobs(jobsResult.value);
      if (strongStackResult.status === 'fulfilled') {
        setStrongStack({
          frontend: strongStackResult.value.frontend || [],
          backend: strongStackResult.value.backend || [],
          cloud: strongStackResult.value.cloud || [],
        });
      }

      setLoading(false);
    }
    load();
  }, []);

  const today = getToday();
  const habitsCompleted = habitRows.filter((habit) => habit.done).length;
  const habitsTotal = habitRows.length;
  const habitsRemaining = Math.max(habitsTotal - habitsCompleted, 0);
  const habitPercent = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;
  const orderedHabitRows = [...habitRows].sort((a, b) => Number(a.done) - Number(b.done));

  // Learning progress
  const allItems = learningData.flatMap((s) => s.items || []);
  const completedLearning = allItems.filter((i) => i.status === 'completed').length;
  const inProgressLearning = allItems.filter((i) => i.status === 'in_progress').length;
  const totalLearning = allItems.length;

  // Streak
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = formatLocalDate(d);
    const dayHabits = habitLog[key] || {};
    const done = Object.values(dayHabits).filter(Boolean).length;
    if (done >= Math.ceil(habitsTotal * 0.5)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  // Goals progress
  const goalsWithProgress = goalsData.map((g) => {
    const milestones = g.milestones || [];
    const doneMilestones = milestones.filter((m) => m.done).length;
    const progress = milestones.length > 0 ? Math.round((doneMilestones / milestones.length) * 100) : 0;
    return { ...g, progress };
  });

  const overallGoalProgress = goalsWithProgress.length > 0
    ? Math.round(goalsWithProgress.reduce((acc, g) => acc + g.progress, 0) / goalsWithProgress.length)
    : 0;

  const toggleHabit = (habitId) => {
    const previousRows = habitRows;
    const nextRows = habitRows.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    setHabitRows(nextRows);
    setHabitLog((current) => ({ ...current, [today]: rowsToLog(nextRows) }));

    if (habitSyncMode !== 'server') {
      setError('Backend is unavailable. Habit changes were not saved.');
      return;
    }

    setSavingHabitId(habitId);

    api.toggleHabit(habitId, today)
      .catch((err) => {
        console.error('Failed to update habit from dashboard:', err);
        setHabitRows(previousRows);
        setHabitLog((current) => ({ ...current, [today]: rowsToLog(previousRows) }));
        setHabitSyncMode('error');
        setError(err.message || 'Unable to save dashboard habit change.');
      })
      .finally(() => setSavingHabitId(null));
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Loading..." />
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Loading your data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Your life at a glance · No excuses, only execution" />
      <div className="page-content">
        {error && <div className="inline-alert">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card accent">
            <div className="stat-label">Today's Habits</div>
            <div className="stat-value">{habitsCompleted}/{habitsTotal}</div>
            <div className="stat-sub">{habitsRemaining} remaining</div>
          </div>
          <div className="stat-card fire">
            <div className="stat-label">Current Streak</div>
            <div className="stat-value">🔥 {streak}</div>
            <div className="stat-sub">{streak === 0 ? 'Start tracking today!' : `${streak} day${streak > 1 ? 's' : ''} strong`}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Skills Completed</div>
            <div className="stat-value">{completedLearning}/{totalLearning}</div>
            <div className="stat-sub">{inProgressLearning} in progress</div>
          </div>
          <div className="stat-card info">
            <div className="stat-label">Jobs Applied</div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-sub">{jobs.filter((j) => j.status === 'interview').length} interviews</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Goal Progress</div>
            <div className="stat-value">{overallGoalProgress}%</div>
            <div className="stat-sub">{goalsWithProgress.filter((g) => g.progress > 0).length} goals started</div>
          </div>
        </div>

        <div className="dashboard-focus-grid">
          <div className="card dashboard-task-card">
            <div className="card-header">
            <div className="card-title">✅ Today's Task List</div>
            <Link className="learning-link" to="/personal/habits">Open tracker</Link>
            </div>
            <div className="dashboard-task-summary">
              <div>
                <div className="task-panel-label">Daily progress</div>
                <div className="task-panel-title">{habitPercent}% complete</div>
              </div>
              <span className="card-badge badge-info">{habitsCompleted}/{habitsTotal}</span>
            </div>
            <div className="task-progress-bar dashboard-task-progress">
              <div className="task-progress-fill" style={{ width: `${habitPercent}%` }} />
            </div>
            <div className="dashboard-task-list">
              {orderedHabitRows.slice(0, 6).map((habit) => (
                <button
                  type="button"
                  key={habit.id}
                  className={`dashboard-task-item ${habit.done ? 'done' : ''}`}
                  onClick={() => toggleHabit(habit.id)}
                  disabled={savingHabitId === habit.id}
                >
                  <span className="habit-checkbox">{habit.done ? '✓' : ''}</span>
                  <span className="habit-icon">{habit.icon}</span>
                  <span className="dashboard-task-name">{habit.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strong Stack */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">🖥️ My Strong Stack</div>
            <span className="card-badge badge-info">Foundation</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Frontend', items: strongStack.frontend, color: '#6c5ce7' },
              { label: 'Backend', items: strongStack.backend, color: '#00d2ff' },
              { label: 'Cloud', items: strongStack.cloud, color: '#00e676' },
            ].map((group) =>
              group.items.map((item) => (
                <span
                  key={item}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: `${group.color}15`,
                    color: group.color,
                    border: `1px solid ${group.color}30`,
                  }}
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Dreams Quick View */}
        <div className="section-header">
          <h3>🌟 The Vision</h3>
          <p>What you're building this life for</p>
        </div>
        <div className="dreams-grid" style={{ marginBottom: 28 }}>
          {dreamsData.filter((dd) => dd.priority === 'now').map((dream) => (
            <div key={dream.id} className="dream-card">
              <div className="dream-icon">{dream.icon}</div>
              <div className="dream-text">{dream.text}</div>
              <div className={`dream-priority ${dream.priority}`}>⚡ Priority Now</div>
            </div>
          ))}
        </div>

        {/* Top Goals Progress */}
        <div className="section-header">
          <h3>🎯 Top Goals Progress</h3>
          <p>Track milestones, not just dreams</p>
        </div>
        <div className="goals-grid">
          {goalsWithProgress.slice(0, 4).map((goal) => (
            <div key={goal.goalId || goal.id} className="goal-card">
              <div className="goal-header">
                <span className="goal-icon">{goal.icon}</span>
                <div>
                  <div className="goal-title">{goal.title}</div>
                  <div className="goal-category">{goal.category}</div>
                </div>
              </div>
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{ width: `${goal.progress}%` }} />
              </div>
              <div className="goal-percentage">{goal.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
