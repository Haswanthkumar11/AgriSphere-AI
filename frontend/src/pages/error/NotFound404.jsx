import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export default function NotFound404() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
        <h1 style={{ fontSize: 24, color: 'var(--soil-dark)', marginBottom: 8 }}>404 — Page Not Found</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
          The farm path you requested does not exist.
        </p>
        <button className="btn-primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
