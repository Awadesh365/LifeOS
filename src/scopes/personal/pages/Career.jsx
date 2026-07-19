import { useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Career() {
  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    companyName: "",
    roleTitle: "",
    payAmount: 0,
    companyHealthScore: 3,
    managerBehaviorScore: 3,
    workEnvironmentNotes: "",
    stayLeavePlan: "unsure",
    notes: "",
  });

  const loadEntries = async () => {
    try {
      const res = await fetch(`${API}/career`).then((r) => r.json());
      setEntries(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const addEntry = async () => {
    await fetch(`${API}/career`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, startDate: new Date().toISOString().slice(0, 10) }),
    });
    setForm({
      companyName: "", roleTitle: "", payAmount: 0,
      companyHealthScore: 3, managerBehaviorScore: 3,
      workEnvironmentNotes: "", stayLeavePlan: "unsure", notes: "",
    });
    loadEntries();
  };

  const updateEntry = async (id, updates) => {
    await fetch(`${API}/career/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    loadEntries();
  };

  const deleteEntry = async (id) => {
    await fetch(`${API}/career/${id}`, { method: "DELETE" });
    loadEntries();
  };

  return (
    <>
      <Header title="Career Development" subtitle="Evaluate role quality, pay, manager signal, and exit plan" />
      <div className="page-container">
      <div className="form-section">
        <h3>Add Career Entry</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Company"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={form.roleTitle}
            onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
          />
          <input
            type="number"
            placeholder="Pay"
            value={form.payAmount || ""}
            onChange={(e) => setForm({ ...form, payAmount: parseFloat(e.target.value) || 0 })}
          />
          <button className="btn-primary" onClick={addEntry}>Add</button>
        </div>
      </div>

      <div className="career-list">
        {entries.map((e) => (
          <div key={e.id} className="career-item">
            <div className="career-header">
              <span className="career-company">{e.companyName}</span>
              <span className="career-role">{e.roleTitle}</span>
              <span className="career-pay">₹{e.payAmount?.toLocaleString()}</span>
            </div>
            <div className="career-scores">
              <div className="score-item">
                <label>Company Health</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={e.companyHealthScore}
                  onChange={(ev) => updateEntry(e.id, { companyHealthScore: parseInt(ev.target.value) })}
                />
                <span>{e.companyHealthScore}/5</span>
              </div>
              <div className="score-item">
                <label>Manager Behavior</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={e.managerBehaviorScore}
                  onChange={(ev) => updateEntry(e.id, { managerBehaviorScore: parseInt(ev.target.value) })}
                />
                <span>{e.managerBehaviorScore}/5</span>
              </div>
            </div>
            <div className="career-plan">
              <select
                value={e.stayLeavePlan}
                onChange={(ev) => updateEntry(e.id, { stayLeavePlan: ev.target.value })}
              >
                <option value="stay">Stay</option>
                <option value="leave">Leave</option>
                <option value="unsure">Unsure</option>
              </select>
              <button className="btn-delete" onClick={() => deleteEntry(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
