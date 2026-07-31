import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import FieldSet from '@components/forms/FieldSet';
import Loader from '@components/ui/Loader';

export default function AdminLogin() {
  const { loginAsAdmin, isLoading } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [phone, setPhone]   = useState('');
  const [password, setPass] = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await loginAsAdmin(phone, password);
    if (result.success) {
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      setError(result.error || t('error'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ borderTop: '4px solid var(--soil)' }}>
        <div className="auth-logo">
          <div className="mark" style={{ background: 'var(--soil-dark)' }}>🛡️</div>
          <div>
            <h1>AgriSphere AI</h1>
            <p>{t('adminLogin')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet label={t('phone')}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </FieldSet>

          <FieldSet label={t('password')}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FieldSet>

          {error && (
            <p style={{ color: 'var(--bad)', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ background: 'var(--soil-dark)' }} disabled={isLoading}>
            {isLoading ? <Loader variant="spinner" /> : t('loginBtn')}
          </button>
        </form>

        <button className="btn-secondary" onClick={() => navigate(ROUTES.LOGIN)}>
          ← Farmer Login
        </button>
      </div>
    </div>
  );
}
