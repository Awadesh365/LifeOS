import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import './auth.css';

export default function LoginPage() {
  const { authenticated, registrationOpen, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('Awadesh');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>(registrationOpen ? 'signup' : 'signin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authenticated) return <Navigate to="/app" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'signup' && !registrationOpen) {
      setError('Account creation is closed for this private workspace');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'signup') await register(displayName, email, password);
      else await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from?.startsWith('/app') ? from : '/app', { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not authenticate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand"><span>L</span><strong>LifeOS</strong></div>
        <p className="auth-eyebrow">Private personal workspace</p>
        <div className="auth-mode-switch" role="tablist" aria-label="Authentication method">
          <button aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); }} role="tab" type="button">Sign in</button>
          <button aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }} role="tab" type="button">Create account</button>
        </div>
        <h1 id="auth-title">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-intro">
          {mode === 'signup' && registrationOpen
            ? 'Create the owner account. Setup closes automatically after this account is secured.'
            : mode === 'signup'
              ? 'Account creation is closed because this private workspace already has an owner.'
              : 'Sign in to continue to your personal operating system.'}
        </p>
        <form onSubmit={submit}>
          {mode === 'signup' && (
            <label>Name<input autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required minLength={2} maxLength={80} /></label>
          )}
          <label>Email<input autoCapitalize="none" autoComplete="email" inputMode="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} /></label>
          <label>Password<input autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} maxLength={128} /></label>
          {mode === 'signup' && (
            <label>Confirm password<input autoComplete="new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={12} maxLength={128} /></label>
          )}
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button disabled={submitting || (mode === 'signup' && !registrationOpen)} type="submit">{submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="auth-security-note">Your session is held in a secure HttpOnly cookie and is never stored in browser JavaScript.</p>
      </section>
    </main>
  );
}
