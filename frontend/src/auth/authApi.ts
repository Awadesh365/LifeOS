const API_BASE = import.meta.env.VITE_PERSONAL_API_URL || 'http://localhost:5000/api';
let csrfToken: string | null = null;

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface SessionResponse {
  authenticated: boolean;
  registrationOpen: boolean;
  user?: AuthUser;
  csrfToken?: string;
}

export function setCsrfToken(value: string | null) {
  csrfToken = value;
}

export async function secureFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  const response = await fetch(input, { ...init, credentials: 'include', headers });
  if (response.status === 401) window.dispatchEvent(new Event('lifeos:unauthorized'));
  return response;
}

async function authRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE}/auth${path}`, {
    ...init,
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init.headers },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || 'Authentication request failed');
  if (body?.csrfToken) setCsrfToken(body.csrfToken);
  return body;
}

export const authApi = {
  session: () => authRequest('/session') as Promise<SessionResponse>,
  login: (email: string, password: string) => authRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }) as Promise<SessionResponse>,
  register: (displayName: string, email: string, password: string) => authRequest('/register', {
    method: 'POST',
    body: JSON.stringify({ displayName, email, password }),
  }) as Promise<SessionResponse>,
  logout: async () => {
    const response = await secureFetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    if (!response.ok && response.status !== 401) throw new Error('Could not sign out');
    setCsrfToken(null);
  },
};
