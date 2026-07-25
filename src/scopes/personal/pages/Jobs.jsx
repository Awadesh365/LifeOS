import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Header from '../components/Header';

const STATUSES = ['applied', 'interview', 'offered', 'rejected'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: '', role: '', salary: '', status: 'applied' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadJobs() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getJobs();
        if (isActive) setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isActive) setError(err.message || 'Unable to load jobs from backend.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  const addJob = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) return;

    try {
      setError('');
      const created = await api.createJob({
        ...form,
        company: form.company.trim(),
        role: form.role.trim(),
        date: new Date().toISOString().split('T')[0],
      });
      setJobs([created, ...jobs]);
      setForm({ company: '', role: '', salary: '', status: 'applied' });
    } catch (err) {
      setError(err.message || 'Unable to add job application.');
    }
  };

  const updateStatus = async (id, status) => {
    const previousJobs = jobs;
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));

    try {
      setError('');
      const updated = await api.updateJobStatus(id, status);
      setJobs((items) => items.map((job) => (job.id === id ? updated : job)));
    } catch (err) {
      setJobs(previousJobs);
      setError(err.message || 'Unable to update job status.');
    }
  };

  const deleteJob = async (id) => {
    const previousJobs = jobs;
    setJobs(jobs.filter((j) => j.id !== id));

    try {
      setError('');
      await api.deleteJob(id);
    } catch (err) {
      setJobs(previousJobs);
      setError(err.message || 'Unable to delete job application.');
    }
  };

  const applied = jobs.filter((j) => j.status === 'applied').length;
  const interviews = jobs.filter((j) => j.status === 'interview').length;
  const offers = jobs.filter((j) => j.status === 'offered').length;

  return (
    <>
      <Header
        title="Job Tracker"
        subtitle={loading ? 'Loading applications...' : `${jobs.length} applied · ${interviews} interviews · ${offers} offers · Switch jobs, 2x your salary`}
      />
      <div className="page-content">
        {error && <div className="inline-alert">{error}</div>}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card info">
            <div className="stat-label">Total Applied</div>
            <div className="stat-value">{applied}</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Interviews</div>
            <div className="stat-value">{interviews}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Offers</div>
            <div className="stat-value">{offers}</div>
          </div>
          <div className="stat-card fire">
            <div className="stat-label">Target</div>
            <div className="stat-value">₹50K+</div>
            <div className="stat-sub">min. next salary</div>
          </div>
        </div>

        {/* Add Job Form */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">➕ Add Application</div>
          </div>
          <form className="job-form" onSubmit={addJob}>
            <input
              type="text"
              placeholder="Company name"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role (e.g., Frontend Dev)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <input
              type="text"
              placeholder="Salary (e.g., ₹60K)"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>

        {/* Job Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Applications</div>
            <span className="card-badge badge-info">{jobs.length} total</span>
          </div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p>No applications yet. Start applying to 5 jobs per day. Your future salary depends on it.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="job-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.date}</td>
                      <td style={{ fontWeight: 600 }}>{job.company}</td>
                      <td>{job.role}</td>
                      <td>{job.salary || '—'}</td>
                      <td>
                        <select
                          value={job.status}
                          onChange={(e) => updateStatus(job.id, e.target.value)}
                          className={`status-tag status-${job.status}`}
                          style={{
                            background: 'transparent',
                            cursor: 'pointer',
                            border: 'none',
                            fontFamily: '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif',
                          }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s} style={{ background: '#FFFFFF', color: '#111827' }}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => deleteJob(job.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
