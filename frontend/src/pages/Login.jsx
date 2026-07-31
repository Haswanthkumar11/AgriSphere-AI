import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const result = await login(phone, password);
    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      // Demo mode: if API unavailable, mock login to allow testing UI
      if (result.error?.includes('Network') || result.error?.includes('network')) {
        // Create a demo session
        const { setStoredToken, setStoredUser } = await import('@utils/storage');
        setStoredToken('demo-jwt-token');
        setStoredUser({ id: 'usr_demo', name: 'Ramesh Kumar', role: 'farmer', phone: '+919876543210' });
        window.location.href = ROUTES.DASHBOARD;
      } else {
        setError(result.error || t('error'));
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="mark">🌾</div>
          <div>
            <h1>AgriSphere AI</h1>
            <p>{t('farmerLogin')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet label={t('phone')}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              required
            />
          </FieldSet>

          <FieldSet label={t('password')}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </FieldSet>

          {error && (
            <p style={{ color: 'var(--bad)', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? <Loader variant="spinner" /> : t('loginBtn')}
          </button>
        </form>

        <button
          className="btn-secondary"
          onClick={() => navigate(ROUTES.REGISTER)}
        >
          {t('noAccount')} {t('registerHere')}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link
            to={ROUTES.ADMIN_LOGIN}
            style={{ fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'underline' }}
          >
            {t('adminLoginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
