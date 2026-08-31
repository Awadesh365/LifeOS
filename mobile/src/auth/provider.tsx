import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { api, setApiCsrfToken, type AuthUser } from '@/services/api';

interface AuthContextValue {
  authenticated: boolean;
  loading: boolean;
  registrationOpen: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;
    void api.authSession()
      .then((session) => {
        if (!active) return;
        setRegistrationOpen(session.registrationOpen);
        setApiCsrfToken(session.csrfToken ?? null);
        setUser(session.authenticated && session.user ? session.user : null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await api.login(email, password);
    setApiCsrfToken(session.csrfToken ?? null);
    setUser(session.user ?? null);
    setRegistrationOpen(false);
  }, []);

  const register = useCallback(async (displayName: string, email: string, password: string) => {
    const session = await api.register(displayName, email, password);
    setApiCsrfToken(session.csrfToken ?? null);
    setUser(session.user ?? null);
    setRegistrationOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setApiCsrfToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    authenticated: Boolean(user),
    loading,
    registrationOpen,
    user,
    login,
    register,
    logout,
  }), [loading, registrationOpen, user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
