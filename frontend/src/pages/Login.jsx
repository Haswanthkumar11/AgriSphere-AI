import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import FieldSet from '@components/forms/FieldSet';
import Loader from '@components/ui/Loader';

export default function Login() {
  const { login, isLoading } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [phone, setPhone]   = useState('');
  const [password, setPass] = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Please provide phone number and password');
      return;
    }

    const result = await login(phone, password);
    if (result.success) {
      const role = (result.role || '').toLowerCase();
      if (role === 'admin') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else if (role === 'officer') {
        navigate(ROUTES.OFFICER_DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } else {
      const msg = result.error || '';
      if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('connect')) {
        setError('Unable to connect to server. Please try again.');
      } else {
        setError(msg || 'Invalid phone or password');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-logo">
          <div className="mark">🌾</div>
          <div>
            <h1>AgriSphere AI</h1>
            <p>Unified Portal Login (Farmer • Officer • Admin)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-group">
          <FieldSet label={t('phone')}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 8310557227, 9121679411, 7989612530"
              autoComplete="tel"
              required
            />
          </FieldSet>

          <FieldSet label={t('password')}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </FieldSet>

          {error && (
            <div className="error-alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="btn-primary btn-lg" disabled={isLoading} style={{ marginTop: 4 }}>
            {isLoading ? <><Loader variant="spinner" /> Signing in…</> : `🔐 ${t('loginBtn')}`}
          </button>
        </form>

        <div className="divider-label">or</div>

        <button className="btn-secondary" onClick={() => navigate(ROUTES.REGISTER)}>
          {t('noAccount')} {t('registerHere')}
        </button>
      </div>
    </div>
  );
}
