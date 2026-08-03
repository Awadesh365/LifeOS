import { useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function FuturePlans() {
  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    planType: "home",
    title: "",
    targetDate: "",
    budget: 0,
    notes: "",
  });

  const loadPlans = async () => {
    try {
      const res = await fetch(`${API}/future-plans`).then((r) => r.json());
      setPlans(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const addPlan = async () => {
    await fetch(`${API}/future-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ planType: "home", title: "", targetDate: "", budget: 0, notes: "" });
    loadPlans();
  };

  const updatePlan = async (id, updates) => {
    await fetch(`${API}/future-plans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    loadPlans();
  };

  const deletePlan = async (id) => {
    await fetch(`${API}/future-plans/${id}`, { method: "DELETE" });
    loadPlans();
  };

  const types = ["home", "real_estate", "marriage", "company", "other"];
  const statuses = ["planned", "in_progress", "completed"];

  const grouped = plans.reduce((acc, p) => {
    if (!acc[p.planType]) acc[p.planType] = [];
    acc[p.planType].push(p);
    return acc;
  }, {});

  return (
    <>
      <Header title="Future Plans" subtitle="Organize major life plans by type, budget, and status" />
      <div className="page-container">
      <div className="form-section">
        <h3>Add Plan</h3>
        <div className="form-row">
          <select value={form.planType} onChange={(e) => setForm({ ...form, planType: e.target.value })}>
            {types.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="date"
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Budget"
            value={form.budget || ""}
            onChange={(e) => setForm({ ...form, budget: parseFloat(e.target.value) || 0 })}
          />
          <button className="btn-primary" onClick={addPlan}>Add</button>
        </div>
      </div>

      {Object.entries(grouped).map(([type, list]) => (
        <div key={type} className="plan-group">
          <h3>{type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)}</h3>
          {list.map((p) => (
            <div key={p.id} className={`plan-item ${p.status}`}>
              <div className="plan-header">
                <span className="plan-title">{p.title}</span>
                <span className={`status-badge ${p.status}`}>{p.status.replace("_", " ")}</span>
              </div>
              <div className="plan-details">
                {p.targetDate && <span>Target: {p.targetDate}</span>}
                {p.budget > 0 && <span>Budget: ₹{p.budget.toLocaleString()}</span>}
              </div>
              <div className="plan-actions">
                <select
                  value={p.status}
                  onChange={(e) => updatePlan(p.id, { status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
                <button className="btn-delete" onClick={() => deletePlan(p.id)}>×</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}
