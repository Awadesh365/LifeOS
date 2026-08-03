import { useState, useEffect } from "react";
import { API } from "../api";
import Header from "../components/Header";

export default function Networking() {
  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "colleague",
    priority: "medium",
    circleQualityScore: 3,
    notes: "",
  });

  const loadContacts = async () => {
    try {
      const res = await fetch(`${API}/contacts`).then((r) => r.json());
      setContacts(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const addContact = async () => {
    await fetch(`${API}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lastContactDate: new Date().toISOString().slice(0, 10) }),
    });
    setForm({ name: "", type: "colleague", priority: "medium", circleQualityScore: 3, notes: "" });
    loadContacts();
  };

  const updateContact = async (id, updates) => {
    await fetch(`${API}/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    loadContacts();
  };

  const deleteContact = async (id) => {
    await fetch(`${API}/contacts/${id}`, { method: "DELETE" });
    loadContacts();
  };

  const types = ["colleague", "friend", "mentor", "family", "other"];
  const priorities = ["high", "medium", "low"];

  const grouped = contacts.reduce((acc, c) => {
    if (!acc[c.type]) acc[c.type] = [];
    acc[c.type].push(c);
    return acc;
  }, {});

  return (
    <>
      <Header title="Networking" subtitle="Maintain important relationships and follow-up rhythm" />
      <div className="page-container">
      <div className="form-section">
        <h3>Add Contact</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={addContact}>Add</button>
        </div>
      </div>

      {Object.entries(grouped).map(([type, list]) => (
        <div key={type} className="contact-group">
          <h3>{type.charAt(0).toUpperCase() + type.slice(1)}s ({list.length})</h3>
          {list.map((c) => (
            <div key={c.id} className="contact-item">
              <div className="contact-header">
                <span className="contact-name">{c.name}</span>
                <span className={`priority-badge ${c.priority}`}>{c.priority}</span>
                <span className="quality-score">Q: {c.circleQualityScore}/5</span>
              </div>
              <div className="contact-details">
                {c.lastContactDate && <span>Last: {c.lastContactDate}</span>}
                {c.nextFollowUpDate && <span>Follow-up: {c.nextFollowUpDate}</span>}
              </div>
              <div className="contact-actions">
                <button
                  className="btn-small"
                  onClick={() => updateContact(c.id, { lastContactDate: new Date().toISOString().slice(0, 10) })}
                >
                  Met Today
                </button>
                <button className="btn-delete" onClick={() => deleteContact(c.id)}>×</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}
