import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export default function Unauthorized401() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontSize: 24, color: 'var(--soil-dark)', marginBottom: 8 }}>401 — Unauthorized</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
          You must be logged in to access this feature.
        </p>
        <button className="btn-primary" onClick={() => navigate(ROUTES.LOGIN)}>
          Go to Login
        </button>
      </div>
    </div>
  );
}
