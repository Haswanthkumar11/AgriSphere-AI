import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export default function Forbidden403() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
        <h1 style={{ fontSize: 24, color: 'var(--bad)', marginBottom: 8 }}>403 — Access Denied</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
          You do not have permission to view this page.
        </p>
        <button className="btn-primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
