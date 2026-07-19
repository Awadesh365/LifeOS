import { useCallback, useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Health() {
  const [weekData, setWeekData] = useState([]);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const [form, setForm] = useState({
    gymMinutes: 0,
    walkMinutes: 0,
    meditationMinutes: 0,
    sleepHours: 0,
    sleepQuality: 3,
    waterLiters: 0,
    dietScore: 3,
    socializationMinutes: 0,
    mentalPeaceScore: 5,
    moodScore: 5,
    notes: "",
  });

  const loadData = useCallback(async () => {
    try {
      const [healthRes, weekRes] = await Promise.all([
        fetch(`${API}/health?date=${date}`).then((r) => r.json()),
        fetch(`${API}/health/weekly`).then((r) => r.json()),
      ]);
      if (healthRes) {
        setForm({
          gymMinutes: healthRes.gymMinutes || 0,
          walkMinutes: healthRes.walkMinutes || 0,
          meditationMinutes: healthRes.meditationMinutes || 0,
          sleepHours: healthRes.sleepHours || 0,
          sleepQuality: healthRes.sleepQuality || 3,
          waterLiters: healthRes.waterLiters || 0,
          dietScore: healthRes.dietScore || 3,
          socializationMinutes: healthRes.socializationMinutes || 0,
          mentalPeaceScore: healthRes.mentalPeaceScore || 5,
          moodScore: healthRes.moodScore || 5,
          notes: healthRes.notes || "",
        });
      }
      setWeekData(weekRes);
    } catch (e) {
      console.error(e);
    }
  }, [date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const save = async () => {
    await fetch(`${API}/health`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, ...form }),
    });
    loadData();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const avgWeek = (field) => {
    if (!weekData.length) return 0;
    const sum = weekData.reduce((s, d) => s + (d[field] || 0), 0);
    return (sum / weekData.length).toFixed(1);
  };

  return (
    <>
      <Header title="Health Dashboard" subtitle="Track recovery, training, mood, and energy in one place" />
      <div className="page-container">
      <div className="page-toolbar">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="health-grid">
        <div className="health-card">
          <h3>Sleep</h3>
          <div className="metric-value">{form.sleepHours}h</div>
          <label>Quality (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={form.sleepQuality}
            onChange={(e) => handleChange("sleepQuality", parseInt(e.target.value))}
          />
          <span className="week-avg">Week avg: {avgWeek("sleepHours")}h</span>
        </div>

        <div className="health-card">
          <h3>Gym</h3>
          <div className="metric-value">{form.gymMinutes} min</div>
          <input
            type="number"
            value={form.gymMinutes}
            onChange={(e) => handleChange("gymMinutes", parseInt(e.target.value) || 0)}
            placeholder="Minutes"
          />
          <span className="week-avg">Week avg: {avgWeek("gymMinutes")} min</span>
        </div>

        <div className="health-card">
          <h3>Walking</h3>
          <div className="metric-value">{form.walkMinutes} min</div>
          <input
            type="number"
            value={form.walkMinutes}
            onChange={(e) => handleChange("walkMinutes", parseInt(e.target.value) || 0)}
            placeholder="Minutes"
          />
        </div>

        <div className="health-card">
          <h3>Meditation</h3>
          <div className="metric-value">{form.meditationMinutes} min</div>
          <input
            type="number"
            value={form.meditationMinutes}
            onChange={(e) => handleChange("meditationMinutes", parseInt(e.target.value) || 0)}
            placeholder="Minutes"
          />
        </div>

        <div className="health-card">
          <h3>Water</h3>
          <div className="metric-value">{form.waterLiters}L</div>
          <input
            type="number"
            step="0.1"
            value={form.waterLiters}
            onChange={(e) => handleChange("waterLiters", parseFloat(e.target.value) || 0)}
            placeholder="Liters"
          />
        </div>

        <div className="health-card">
          <h3>Diet Score</h3>
          <div className="metric-value">{form.dietScore}/5</div>
          <input
            type="range"
            min="1"
            max="5"
            value={form.dietScore}
            onChange={(e) => handleChange("dietScore", parseInt(e.target.value))}
          />
        </div>

        <div className="health-card">
          <h3>Mood</h3>
          <div className="metric-value">{form.moodScore}/10</div>
          <input
            type="range"
            min="1"
            max="10"
            value={form.moodScore}
            onChange={(e) => handleChange("moodScore", parseInt(e.target.value))}
          />
        </div>

        <div className="health-card">
          <h3>Mental Peace</h3>
          <div className="metric-value">{form.mentalPeaceScore}/10</div>
          <input
            type="range"
            min="1"
            max="10"
            value={form.mentalPeaceScore}
            onChange={(e) => handleChange("mentalPeaceScore", parseInt(e.target.value))}
          />
        </div>

        <div className="health-card">
          <h3>Socialization</h3>
          <div className="metric-value">{form.socializationMinutes} min</div>
          <input
            type="number"
            value={form.socializationMinutes}
            onChange={(e) => handleChange("socializationMinutes", parseInt(e.target.value) || 0)}
            placeholder="Minutes"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="How are you feeling today?"
          rows={3}
        />
      </div>

      <button className="btn-primary" onClick={save}>
        Save Health Data
      </button>

      <div className="week-chart">
        <h3>This Week</h3>
        <div className="chart-bars">
          {weekData.map((d) => (
            <div key={d.date} className="chart-bar">
              <div
                className="bar-fill"
                style={{ height: `${(d.moodScore || 0) * 10}%` }}
              />
              <span>{d.date?.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
