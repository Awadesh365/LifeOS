import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { authApi, setCsrfToken, type AuthUser } from './authApi';

interface AuthContextValue {
  user: AuthUser | null;
  authenticated: boolean;
  registrationOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const clearSession = useCallback(() => {
    setCsrfToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    void authApi.session()
      .then((session) => {
        if (!active) return;
        setRegistrationOpen(session.registrationOpen);
        setCsrfToken(session.csrfToken ?? null);
        setUser(session.authenticated && session.user ? session.user : null);
      })
      .catch(clearSession)
      .finally(() => { if (active) setLoading(false); });
    const onUnauthorized = () => clearSession();
    window.addEventListener('lifeos:unauthorized', onUnauthorized);
    return () => {
      active = false;
      window.removeEventListener('lifeos:unauthorized', onUnauthorized);
    };
  }, [clearSession]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login(email, password);
    setUser(session.user ?? null);
    setRegistrationOpen(false);
  }, []);

  const register = useCallback(async (displayName: string, email: string, password: string) => {
    const session = await authApi.register(displayName, email, password);
    setUser(session.user ?? null);
    setRegistrationOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    clearSession();
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    authenticated: Boolean(user),
    registrationOpen,
    login,
    register,
    logout,
  }), [user, registrationOpen, login, register, logout]);

  if (loading) return <div className="auth-loading" role="status">Securing your workspace…</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
