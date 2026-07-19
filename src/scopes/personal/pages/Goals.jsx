import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Header from '../components/Header';

export default function Goals() {
  const [goalsData, setGoalsData] = useState([]);
  const [dreams, setDreams] = useState([]);
  const [tab, setTab] = useState('goals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const [goals, dreamsData] = await Promise.all([api.getGoals(), api.getDreams()]);
        if (!isActive) return;
        setGoalsData(Array.isArray(goals) ? goals : []);
        setDreams(Array.isArray(dreamsData) ? dreamsData : []);
      } catch (err) {
        if (isActive) setError(err.message || 'Unable to load goals from backend.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadData();

    return () => {
      isActive = false;
    };
  }, []);

  const toggleMilestone = async (goalId, milestone) => {
    const previousGoals = goalsData;
    const nextDone = !milestone.done;

    setGoalsData(goalsData.map((goal) => {
      if (goal.id !== goalId) return goal;
      return {
        ...goal,
        milestones: (goal.milestones || []).map((item) =>
          item.id === milestone.id ? { ...item, done: nextDone } : item
        ),
      };
    }));

    try {
      setError('');
      const updated = await api.updateMilestone(milestone.id, nextDone);
      setGoalsData((goals) => goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        return {
          ...goal,
          milestones: (goal.milestones || []).map((item) =>
            item.id === milestone.id ? updated : item
          ),
        };
      }));
    } catch (err) {
      setGoalsData(previousGoals);
      setError(err.message || 'Unable to update milestone.');
    }
  };

  const getProgress = (goal) => {
    const milestones = goal.milestones || [];
    const done = milestones.filter((m) => m.done).length;
    return milestones.length > 0
      ? Math.round((done / milestones.length) * 100)
      : 0;
  };

  const overallProgress = goalsData.length > 0
    ? Math.round(goalsData.reduce((acc, g) => acc + getProgress(g), 0) / goalsData.length)
    : 0;

  return (
    <>
      <Header
        title="Goals & Dreams"
        subtitle={loading ? 'Loading from backend...' : `${overallProgress}% overall progress · Build the life you wrote about`}
      />
      <div className="page-content">
        {error && <div className="inline-alert">{error}</div>}

        <div className="tabs">
          <button
            className={`tab ${tab === 'goals' ? 'active' : ''}`}
            onClick={() => setTab('goals')}
          >
            🎯 Goals
          </button>
          <button
            className={`tab ${tab === 'dreams' ? 'active' : ''}`}
            onClick={() => setTab('dreams')}
          >
            🌟 Dreams
          </button>
        </div>

        {tab === 'goals' && (
          <>
            {/* Overall Stats */}
            <div className="stats-grid">
              <div className="stat-card accent">
                <div className="stat-label">Overall Progress</div>
                <div className="stat-value">{overallProgress}%</div>
              </div>
              <div className="stat-card success">
                <div className="stat-label">Goals Started</div>
                <div className="stat-value">{goalsData.filter((g) => getProgress(g) > 0).length}/{goalsData.length}</div>
              </div>
              <div className="stat-card fire">
                <div className="stat-label">Current Salary</div>
                <div className="stat-value">₹30K</div>
                <div className="stat-sub">Target: ₹1 Lakh+</div>
              </div>
            </div>

            {/* Goals Grid */}
            <div className="goals-grid">
              {goalsData.map((goal) => {
                const progress = getProgress(goal);
                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-header">
                      <span className="goal-icon">{goal.icon}</span>
                      <div>
                        <div className="goal-title">{goal.title}</div>
                        <div className="goal-category">{goal.category}</div>
                      </div>
                    </div>
                    <div className="goal-progress-bar">
                      <div
                        className="goal-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="goal-percentage">{progress}%</div>
                    <ul className="goal-milestones">
                      {(goal.milestones || []).map((m) => (
                        <li
                          key={m.id}
                          className={`goal-milestone ${m.done ? 'done' : ''}`}
                          onClick={() => toggleMilestone(goal.id, m)}
                        >
                          <span className="milestone-check">
                            {m.done ? '✓' : ''}
                          </span>
                          {m.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'dreams' && (
          <>
            <div className="section-header">
              <h3>Priority: NOW ⚡</h3>
              <p>Focus here first — everything else follows</p>
            </div>
            <div className="dreams-grid" style={{ marginBottom: 28 }}>
              {dreams.filter((d) => d.priority === 'now').map((dream) => (
                <div key={dream.id} className="dream-card">
                  <div className="dream-icon">{dream.icon}</div>
                  <div className="dream-text">{dream.text}</div>
                  <div className={`dream-priority ${dream.priority}`}>⚡ Priority Now</div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <h3>Mid-Term Goals 📅</h3>
              <p>Once foundation is solid</p>
            </div>
            <div className="dreams-grid" style={{ marginBottom: 28 }}>
              {dreams.filter((d) => d.priority === 'mid').map((dream) => (
                <div key={dream.id} className="dream-card">
                  <div className="dream-icon">{dream.icon}</div>
                  <div className="dream-text">{dream.text}</div>
                  <div className={`dream-priority ${dream.priority}`}>📅 Mid-term</div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <h3>Long-Term Vision 🔭</h3>
              <p>The ultimate destination</p>
            </div>
            <div className="dreams-grid">
              {dreams.filter((d) => d.priority === 'long').map((dream) => (
                <div key={dream.id} className="dream-card">
                  <div className="dream-icon">{dream.icon}</div>
                  <div className="dream-text">{dream.text}</div>
                  <div className={`dream-priority ${dream.priority}`}>🔭 Long-term</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
