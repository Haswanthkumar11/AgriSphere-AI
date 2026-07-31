import { useNavigate } from 'react-router-dom';

/**
 * ModuleCard — the clickable feature tiles on the dashboard.
 * variant: m1 | m2 | m3 | m4 | m5 | m6 (controls icon background colour)
 */
export default function ModuleCard({ icon, title, subtitle, route, variant = 'm1' }) {
  const navigate = useNavigate();

  return (
    <button
      className={`module-card ${variant}`}
      onClick={() => navigate(route)}
      aria-label={title}
    >
      <div className="mc-icon" aria-hidden="true">{icon}</div>
      <div className="mc-title">{title}</div>
      <div className="mc-sub">{subtitle}</div>
    </button>
  );
}
