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
    <div className="auth-page" style={{ padding: '24px 16px 60px' }}>
      <div className="auth-card" style={{ maxWidth: 480 }}>
        {/* Brand Header */}
        <div className="auth-logo">
          <div className="mark">🌾</div>
          <div>
            <h1>AgriSphere AI</h1>
            <p>Create your farmer account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 16 }}>
            <FieldSet label={t('fullName')}>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Ramesh Kumar" required />
            </FieldSet>

            <FieldSet label={t('phone')}>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required />
            </FieldSet>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldSet label={t('password')}>
                <input type="password" value={form.password} onChange={set('password')} placeholder="••••••" required />
              </FieldSet>

              <FieldSet label={t('confirmPassword')}>
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••" required />
              </FieldSet>
            </div>

            <div className="divider-label" style={{ margin: '4px 0' }}>Farm Details (Optional)</div>

            <FieldSet label="Region">
              <input type="text" value={form.region} onChange={set('region')} placeholder="Tirupati, Andhra Pradesh" />
            </FieldSet>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldSet label="Primary Crop">
                <input type="text" value={form.crop_type} onChange={set('crop_type')} placeholder="Tomato" />
              </FieldSet>

              <FieldSet label="Land (Acres)">
                <input type="number" value={form.land_size_acres} onChange={set('land_size_acres')} placeholder="1.0" min="0.1" step="0.1" />
              </FieldSet>
            </div>
          </div>

          {error && (
            <div className="error-alert" style={{ marginTop: 16 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="btn-primary btn-lg" disabled={loading} style={{ marginTop: 20 }}>
            {loading ? '⏳ Creating account…' : '🌱 Create Account'}
          </button>
        </form>

        <div className="divider-label">already have an account?</div>

        <button className="btn-secondary" onClick={() => navigate(ROUTES.LOGIN)}>
          {t('haveAccount')} {t('loginHere')}
        </button>
      </div>
    </div>
  );
}
