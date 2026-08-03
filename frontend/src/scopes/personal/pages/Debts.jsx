import { useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Debts() {
  const [debts, setDebts] = useState([]);

  const [form, setForm] = useState({
    personName: "",
    totalAmount: 0,
    targetMonth: "",
    notes: "",
  });

  const [payForm, setPayForm] = useState({});

  const loadDebts = async () => {
    try {
      const res = await fetch(`${API}/debts`).then((r) => r.json());
      setDebts(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  const addDebt = async () => {
    await fetch(`${API}/debts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ personName: "", totalAmount: 0, targetMonth: "", notes: "" });
    loadDebts();
  };

  const payDebt = async (id) => {
    const amount = payForm[id] || 0;
    if (amount <= 0) return;
    await fetch(`${API}/debts/${id}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    setPayForm({ ...payForm, [id]: 0 });
    loadDebts();
  };

  const deleteDebt = async (id) => {
    await fetch(`${API}/debts/${id}`, { method: "DELETE" });
    loadDebts();
  };

  const totalDebt = debts.reduce((s, d) => s + d.totalAmount, 0);
  const totalPaid = debts.reduce((s, d) => s + d.paidAmount, 0);
  const totalRemaining = debts.reduce((s, d) => s + d.remainingAmount, 0);

  return (
    <>
      <Header title="Debt Tracker" subtitle="See what is owed, what is paid, and the next payment action" />
      <div className="page-container">
      <div className="debt-summary">
        <div className="summary-card">
          <h3>Total Debt</h3>
          <div className="amount">₹{totalDebt.toLocaleString()}</div>
        </div>
        <div className="summary-card paid">
          <h3>Paid</h3>
          <div className="amount">₹{totalPaid.toLocaleString()}</div>
        </div>
        <div className="summary-card remaining">
          <h3>Remaining</h3>
          <div className="amount">₹{totalRemaining.toLocaleString()}</div>
        </div>
        <div className="summary-card progress">
          <h3>Progress</h3>
          <div className="amount">{totalDebt > 0 ? ((totalPaid / totalDebt) * 100).toFixed(0) : 0}%</div>
        </div>
      </div>

      <div className="form-section">
        <h3>Add Debt</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Person Name"
            value={form.personName}
            onChange={(e) => setForm({ ...form, personName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.totalAmount || ""}
            onChange={(e) => setForm({ ...form, totalAmount: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Target Month"
            value={form.targetMonth}
            onChange={(e) => setForm({ ...form, targetMonth: e.target.value })}
          />
          <button className="btn-primary" onClick={addDebt}>Add</button>
        </div>
      </div>

      <div className="debts-list">
        {debts.map((d) => (
          <div key={d.id} className={`debt-item ${d.status}`}>
            <div className="debt-header">
              <span className="debt-name">{d.personName}</span>
              <span className={`debt-status ${d.status}`}>{d.status}</span>
            </div>
            <div className="debt-details">
              <div>Total: ₹{d.totalAmount.toLocaleString()}</div>
              <div>Paid: ₹{d.paidAmount.toLocaleString()}</div>
              <div>Remaining: ₹{d.remainingAmount.toLocaleString()}</div>
              {d.targetMonth && <div>Target: {d.targetMonth}</div>}
            </div>
            <div className="debt-progress">
              <div
                className="progress-fill"
                style={{ width: `${d.totalAmount > 0 ? (d.paidAmount / d.totalAmount) * 100 : 0}%` }}
              />
            </div>
            {d.status === "active" && (
              <div className="debt-actions">
                <input
                  type="number"
                  placeholder="Pay amount"
                  value={payForm[d.id] || ""}
                  onChange={(e) => setPayForm({ ...payForm, [d.id]: parseFloat(e.target.value) || 0 })}
                />
                <button className="btn-primary" onClick={() => payDebt(d.id)}>Pay</button>
                <button className="btn-delete" onClick={() => deleteDebt(d.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
