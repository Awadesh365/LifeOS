import { useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Funds() {
  const [funds, setFunds] = useState([]);
  const [summary, setSummary] = useState({ total: 0, target: 100000, progress: 0 });

  const [form, setForm] = useState({
    bankName: "",
    amount: 0,
    targetAmount: 100000,
    type: "fd",
    notes: "",
  });

  const [depositForm, setDepositForm] = useState({});

  const loadFunds = async () => {
    try {
      const [fundsRes, sumRes] = await Promise.all([
        fetch(`${API}/funds`).then((r) => r.json()),
        fetch(`${API}/funds/summary`).then((r) => r.json()),
      ]);
      setFunds(fundsRes);
      setSummary(sumRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  const addFund = async () => {
    await fetch(`${API}/funds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ bankName: "", amount: 0, targetAmount: 100000, type: "fd", notes: "" });
    loadFunds();
  };

  const deposit = async (id) => {
    const amount = depositForm[id] || 0;
    if (amount <= 0) return;
    await fetch(`${API}/funds/${id}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    setDepositForm({ ...depositForm, [id]: 0 });
    loadFunds();
  };

  return (
    <>
      <Header title="Emergency Fund" subtitle="Build and monitor your safety buffer across accounts" />
      <div className="page-container">
      <div className="fund-overview">
        <div className="fund-progress-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#EDF0F5" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E55555"
              strokeWidth="8"
              strokeDasharray={`${summary.progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="progress-text">
            <span className="progress-percent">{summary.progress.toFixed(0)}%</span>
          </div>
        </div>
        <div className="fund-stats">
          <div className="stat">
            <label>Current</label>
            <span>₹{summary.total.toLocaleString()}</span>
          </div>
          <div className="stat">
            <label>Target</label>
            <span>₹{summary.target.toLocaleString()}</span>
          </div>
          <div className="stat">
            <label>Remaining</label>
            <span>₹{(summary.target - summary.total).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Add Fund</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Bank Name"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount || ""}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Target"
            value={form.targetAmount || ""}
            onChange={(e) => setForm({ ...form, targetAmount: parseFloat(e.target.value) || 100000 })}
          />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="fd">Fixed Deposit</option>
            <option value="rd">Recurring Deposit</option>
            <option value="savings">Savings</option>
          </select>
          <button className="btn-primary" onClick={addFund}>Add</button>
        </div>
      </div>

      <div className="funds-list">
        {funds.map((f) => (
          <div key={f.id} className="fund-item">
            <div className="fund-header">
              <span className="fund-name">{f.bankName}</span>
              <span className="fund-type">{f.type.toUpperCase()}</span>
            </div>
            <div className="fund-amount">₹{f.amount.toLocaleString()}</div>
            <div className="fund-progress">
              <div
                className="progress-fill"
                style={{ width: `${f.targetAmount > 0 ? (f.amount / f.targetAmount) * 100 : 0}%` }}
              />
            </div>
            <div className="fund-actions">
              <input
                type="number"
                placeholder="Deposit"
                value={depositForm[f.id] || ""}
                onChange={(e) => setDepositForm({ ...depositForm, [f.id]: parseFloat(e.target.value) || 0 })}
              />
              <button className="btn-primary" onClick={() => deposit(f.id)}>Deposit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
