import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import { registerUser } from '@api/authApi';
import FieldSet from '@components/forms/FieldSet';

export default function Register() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', phone: '', password: '', confirmPassword: '',
    region: 'Tirupati, Andhra Pradesh', crop_type: 'Tomato', land_size_acres: 1.0,
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        phone: form.phone,
        password: form.password,
        region: form.region,
        crop_type: form.crop_type,
        land_size_acres: parseFloat(form.land_size_acres) || 1.0,
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '20px 20px 100px' }}>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="mark">🌾</div>
          <div>
            <h1>AgriSphere AI</h1>
            <p>Create your farmer account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet label={t('fullName')}>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Ramesh Kumar" required />
          </FieldSet>

          <FieldSet label={t('phone')}>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required />
          </FieldSet>

          <FieldSet label={t('password')}>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
          </FieldSet>

          <FieldSet label={t('confirmPassword')}>
            <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••••" required />
          </FieldSet>

          {error && (
            <p style={{ color: 'var(--bad)', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{error}</p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : t('registerBtn')}
          </button>
        </form>

        <button className="btn-secondary" onClick={() => navigate(ROUTES.LOGIN)}>
          {t('haveAccount')} {t('loginHere')}
        </button>
      </div>
    </div>
  );
}
