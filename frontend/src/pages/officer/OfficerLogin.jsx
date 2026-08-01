import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import { loginOfficer } from '@api/authApi';
import FieldSet from '@components/forms/FieldSet';
import Loader from '@components/ui/Loader';

export default function OfficerLogin() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [empId, setEmpId] = useState('');
  const [password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!empId || !password) {
      setError('Please provide Employee ID / Phone and password');
      return;
    }
    setLoading(true);
    try {
      const res = await loginOfficer(empId, password);
      const data = res?.data || res;
      if (data?.access_token) {
        localStorage.setItem('agrisphere_token', data.access_token);
        localStorage.setItem('agrisphere_user', JSON.stringify(data.user));
        navigate(ROUTES.OFFICER_DASHBOARD);
      } else {
        setError('Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid Officer Employee ID or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ borderTop: '4px solid var(--good)' }}>
        <div className="auth-logo">
          <div className="mark" style={{ background: '#166534', color: '#fff' }}>🌾</div>
          <div>
            <h1>AgriSphere AI</h1>
            <p>Extension Officer Login (Government Personnel)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet label="Employee ID or Registered Phone">
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              placeholder="e.g. KVK-AP-2026-042 or Phone"
              required
            />
          </FieldSet>

          <FieldSet label="Password">
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
              ⚠️ {error}
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ background: '#166534' }} disabled={loading}>
            {loading ? <Loader variant="spinner" /> : '🔐 Officer Sign In'}
          </button>
        </form>

        <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 14, textAlign: 'center' }}>
          ℹ️ Extension Officer accounts are provisioned exclusively by District Administrators.
        </div>

        <button className="btn-secondary" onClick={() => navigate(ROUTES.LOGIN)} style={{ marginTop: 12 }}>
          ← Farmer Login
        </button>
      </div>
    </div>
  );
}
