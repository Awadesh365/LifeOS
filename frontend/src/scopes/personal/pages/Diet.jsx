import { useCallback, useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Diet() {
  const [logs, setLogs] = useState([]);
  const [supplements, setSupplements] = useState([]);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const [form, setForm] = useState({
    mealType: "breakfast",
    items: "",
    protein: 0,
    calories: 0,
    notes: "",
  });

  const [suppForm, setSuppForm] = useState({
    name: "",
    quantity: 0,
    unit: "g",
    dailyUsage: 0,
    notes: "",
  });

  const loadData = useCallback(async () => {
    try {
      const [logsRes, suppRes] = await Promise.all([
        fetch(`${API}/diet/logs?date=${date}`).then((r) => r.json()),
        fetch(`${API}/diet/supplements`).then((r) => r.json()),
      ]);
      setLogs(logsRes);
      setSupplements(suppRes);
    } catch (e) {
      console.error(e);
    }
  }, [date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addLog = async () => {
    await fetch(`${API}/diet/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, ...form }),
    });
    setForm({ mealType: "breakfast", items: "", protein: 0, calories: 0, notes: "" });
    loadData();
  };

  const deleteLog = async (id) => {
    await fetch(`${API}/diet/logs/${id}`, { method: "DELETE" });
    loadData();
  };

  const addSupplement = async () => {
    await fetch(`${API}/diet/supplements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(suppForm),
    });
    setSuppForm({ name: "", quantity: 0, unit: "g", dailyUsage: 0, notes: "" });
    loadData();
  };

  const consumeSupplement = async (id, amount) => {
    await fetch(`${API}/diet/supplements/${id}/consume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    loadData();
  };

  const totalProtein = logs.reduce((s, l) => s + (l.protein || 0), 0);
  const totalCalories = logs.reduce((s, l) => s + (l.calories || 0), 0);

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <>
      <Header title="Diet & Nutrition" subtitle="Log meals, protein, calories, and supplement stock" />
      <div className="page-container">
      <div className="page-toolbar">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="diet-summary">
        <div className="summary-card">
          <h3>Protein</h3>
          <div className="amount">{totalProtein}g</div>
        </div>
        <div className="summary-card">
          <h3>Calories</h3>
          <div className="amount">{totalCalories}</div>
        </div>
        <div className="summary-card">
          <h3>Meals</h3>
          <div className="amount">{logs.length}</div>
        </div>
      </div>

      <div className="form-section">
        <h3>Add Meal</h3>
        <div className="form-row">
          <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
            {mealTypes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Items (comma separated)"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={form.protein || ""}
            onChange={(e) => setForm({ ...form, protein: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Calories"
            value={form.calories || ""}
            onChange={(e) => setForm({ ...form, calories: parseFloat(e.target.value) || 0 })}
          />
          <button className="btn-primary" onClick={addLog}>Add</button>
        </div>
      </div>

      <div className="meal-list">
        {logs.map((l) => (
          <div key={l.id} className="meal-item">
            <span className="meal-type">{l.mealType}</span>
            <span className="meal-items">{l.items}</span>
            <span className="meal-protein">{l.protein}g</span>
            <span className="meal-calories">{l.calories}</span>
            <button className="btn-delete" onClick={() => deleteLog(l.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Supplements</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Name"
            value={suppForm.name}
            onChange={(e) => setSuppForm({ ...suppForm, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={suppForm.quantity || ""}
            onChange={(e) => setSuppForm({ ...suppForm, quantity: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Daily Use"
            value={suppForm.dailyUsage || ""}
            onChange={(e) => setSuppForm({ ...suppForm, dailyUsage: parseFloat(e.target.value) || 0 })}
          />
          <button className="btn-primary" onClick={addSupplement}>Add</button>
        </div>
      </div>

      <div className="supplements-list">
        {supplements.map((s) => (
          <div key={s.id} className="supplement-item">
            <span className="supp-name">{s.name}</span>
            <span className="supp-quantity">{s.quantity}{s.unit}</span>
            <span className="supp-days">{s.remainingDays?.toFixed(0)} days left</span>
            <button
              className="btn-small"
              onClick={() => consumeSupplement(s.id, s.dailyUsage)}
            >
              Consume
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
