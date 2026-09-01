import type { MoneyAccount, MoneyOverview, MoneyTransaction } from './types';

const API_BASE = import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:5000/api';
let csrfToken = '';

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/auth/session`, { credentials: 'include' });
  const session = await response.json().catch(() => ({}));
  if (!response.ok || !session.authenticated) throw new Error('Sign in to use Money.');
  csrfToken = session.csrfToken;
  return csrfToken;
}

async function request<T>(path: string, options: RequestInit = {}) {
  const method = options.method ?? 'GET';
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) headers.set('x-csrf-token', await getCsrfToken());
  const response = await fetch(`${API_BASE}/money${path}`, { ...options, method, headers, credentials: 'include' });
  if (response.status === 401) csrfToken = '';
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Money request failed');
  return payload as T;
}

export const moneyApi = {
  overview: (month?: number, year?: number) => request<MoneyOverview>(`/overview${month && year ? `?month=${month}&year=${year}` : ''}`),
  accounts: () => request<MoneyAccount[]>('/accounts'),
  createAccount: (input: Record<string, unknown>) => request<MoneyAccount>('/accounts', { method: 'POST', body: JSON.stringify(input) }),
  transactions: (search = '', type = '') => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (type) query.set('type', type);
    const suffix = query.size ? `?${query}` : '';
    return request<MoneyTransaction[]>(`/transactions${suffix}`);
  },
  createTransaction: (input: Record<string, unknown>) => request<MoneyTransaction>('/transactions', { method: 'POST', body: JSON.stringify(input) }),
};
