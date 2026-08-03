import { useCallback, useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Wealth() {
  const [entries, setEntries] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, investments: 0, savings: 0 });

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "expense",
    amount: 0,
    category: "",
    notes: "",
  });

  const [invForm, setInvForm] = useState({
    name: "",
    type: "SIP",
    monthlyAmount: 0,
    investedAmount: 0,
    currentValue: 0,
    notes: "",
  });

  const loadData = useCallback(async () => {
    try {
      const [entriesRes, invRes, sumRes] = await Promise.all([
        fetch(`${API}/wealth/entries?month=${month}&year=${year}`).then((r) => r.json()),
        fetch(`${API}/wealth/investments`).then((r) => r.json()),
        fetch(`${API}/wealth/summary?month=${month}&year=${year}`).then((r) => r.json()),
      ]);
      setEntries(entriesRes);
      setInvestments(invRes);
      setSummary(sumRes);
    } catch (e) {
      console.error(e);
    }
  }, [month, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addEntry = async () => {
    await fetch(`${API}/wealth/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...form, amount: 0, category: "", notes: "" });
    loadData();
  };

  const deleteEntry = async (id) => {
    await fetch(`${API}/wealth/entries/${id}`, { method: "DELETE" });
    loadData();
  };

  const addInvestment = async () => {
    await fetch(`${API}/wealth/investments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invForm),
    });
    setInvForm({ name: "", type: "SIP", monthlyAmount: 0, investedAmount: 0, currentValue: 0, notes: "" });
    loadData();
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <>
      <Header title="Wealth Management" subtitle="Track cashflow, savings, and investments by month" />
      <div className="page-container">
      <div className="page-toolbar month-selector">
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {months.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      <div className="wealth-summary">
        <div className="summary-card income">
          <h3>Income</h3>
          <div className="amount">₹{summary.income.toLocaleString()}</div>
        </div>
        <div className="summary-card expense">
          <h3>Expenses</h3>
          <div className="amount">₹{summary.expenses.toLocaleString()}</div>
        </div>
        <div className="summary-card investment">
          <h3>Invested</h3>
          <div className="amount">₹{summary.investments.toLocaleString()}</div>
        </div>
        <div className="summary-card savings">
          <h3>Savings</h3>
          <div className="amount">₹{summary.savings.toLocaleString()}</div>
        </div>
      </div>

      <div className="form-section">
        <h3>Add Entry</h3>
        <div className="form-row">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount || ""}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button className="btn-primary" onClick={addEntry}>Add</button>
        </div>
      </div>

      <div className="entries-list">
        <h3>Entries ({entries.length})</h3>
        {entries.map((e) => (
          <div key={e.id} className={`entry-item ${e.type}`}>
            <span className="entry-type">{e.type}</span>
            <span className="entry-category">{e.category}</span>
            <span className="entry-amount">₹{e.amount.toLocaleString()}</span>
            <span className="entry-date">{e.date}</span>
            <button className="btn-delete" onClick={() => deleteEntry(e.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Investments</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Fund Name"
            value={invForm.name}
            onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
          />
          <select value={invForm.type} onChange={(e) => setInvForm({ ...invForm, type: e.target.value })}>
            <option value="SIP">SIP</option>
            <option value="stock">Stock</option>
            <option value="mutual_fund">Mutual Fund</option>
            <option value="gold">Gold</option>
            <option value="fd">FD</option>
            <option value="rd">RD</option>
          </select>
          <input
            type="number"
            placeholder="Monthly"
            value={invForm.monthlyAmount || ""}
            onChange={(e) => setInvForm({ ...invForm, monthlyAmount: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Invested"
            value={invForm.investedAmount || ""}
            onChange={(e) => setInvForm({ ...invForm, investedAmount: parseFloat(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="Current Value"
            value={invForm.currentValue || ""}
            onChange={(e) => setInvForm({ ...invForm, currentValue: parseFloat(e.target.value) || 0 })}
          />
          <button className="btn-primary" onClick={addInvestment}>Add</button>
        </div>
        <div className="investments-list">
          {investments.map((inv) => (
            <div key={inv.id} className="investment-item">
              <span className="inv-name">{inv.name}</span>
              <span className="inv-type">{inv.type}</span>
              <span className="inv-monthly">₹{inv.monthlyAmount}/mo</span>
              <span className="inv-value">₹{inv.currentValue.toLocaleString()}</span>
              <span className="inv-return">
                {inv.investedAmount > 0
                  ? ((inv.currentValue - inv.investedAmount) / inv.investedAmount * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
