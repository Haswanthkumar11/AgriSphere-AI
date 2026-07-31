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
    district: '', village: '', state: 'Andhra Pradesh', role: 'farmer',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
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
            <p>Create your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet label={t('fullName')}>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Ramesh Kumar" required />
          </FieldSet>

          <FieldSet label={t('phone')}>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required />
          </FieldSet>

          <FieldSet label={t('district')}>
            <input type="text" value={form.district} onChange={set('district')} placeholder="Tirupati" required />
          </FieldSet>

          <FieldSet label={t('village')}>
            <input type="text" value={form.village} onChange={set('village')} placeholder="Renigunta" />
          </FieldSet>

          <FieldSet label={t('role')}>
            <select value={form.role} onChange={set('role')}>
              <option value="farmer">{t('roleFarmer')}</option>
              <option value="equipment_owner">{t('roleEquipOwner')}</option>
              <option value="both">{t('roleBoth')}</option>
            </select>
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
