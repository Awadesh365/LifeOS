const API_BASE = import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:5000/api';

function withQuery(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Habits
  getHabits: (date) => request(withQuery('/habits', { date })),
  toggleHabit: (id, date) =>
    request(`/habits/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
  createHabit: (habit) =>
    request('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    }),
  getHabitHistory: (date) => request(`/habits/history/${date}`),

  // Jobs
  getJobs: () => request('/jobs'),
  createJob: (job) =>
    request('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    }),
  updateJob: (id, data) =>
    request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateJobStatus: (id, status) =>
    request(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteJob: (id) =>
    request(`/jobs/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request('/goals'),
  updateGoal: (goalId, data) =>
    request(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleMilestone: (goalId, index) =>
    request(`/goals/${goalId}/milestone/${index}`, { method: 'PUT' }),
  updateMilestone: (id, done) =>
    request(`/goals/milestone/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
    }),

  // Dreams
  getDreams: () => request('/dreams'),

  // Learning
  getLearning: () => request('/learning'),
  getArticles: () => request('/articles'),
  getContent: () => request('/content'),
  getStrongStack: () => request('/content/strong-stack'),
  getQuote: () => request('/content/quote'),
  createLearningSection: (title) =>
    request('/learning/section', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
  updateLearningSection: (id, data) =>
    request(`/learning/section/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteLearningSection: (id) =>
    request(`/learning/section/${id}`, { method: 'DELETE' }),
  createLearningItem: (item) =>
    request('/learning/item', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  updateLearningItem: (id, data) =>
    request(`/learning/item/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateLearningItemStatus: (id, status) =>
    request(`/learning/item/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteLearningItem: (id) =>
    request(`/learning/item/${id}`, { method: 'DELETE' }),
  reorderLearningItems: (order) =>
    request('/learning/reorder', {
      method: 'PUT',
      body: JSON.stringify({ order }),
    }),

  // Routines
  getRoutines: (type) => request(withQuery('/routines', { type })),
  updateRoutine: (type, items) =>
    request(`/routines/${type}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
};
