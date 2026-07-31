import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export default function ServerError500() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <h1 style={{ fontSize: 24, color: 'var(--bad)', marginBottom: 8 }}>500 — Server Error</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
          Something went wrong on our backend servers. Please try again.
        </p>
        <button className="btn-primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Back to Safety
        </button>
      </div>
    </div>
  );
}
