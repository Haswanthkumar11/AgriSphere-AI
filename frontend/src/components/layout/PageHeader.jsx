import { useNavigate } from 'react-router-dom';

/**
 * PageHeader — back button + title + subtitle.
 * Replaces the .back-row pattern that was copy-pasted across 5 screens.
 */
export default function PageHeader({ title, subtitle, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className="back-row">
      <button
        className="back-btn"
        onClick={handleBack}
        aria-label="Go back"
      >
        ←
      </button>
      <div>
        <div className="screen-title">{title}</div>
        {subtitle && <div className="screen-sub">{subtitle}</div>}
      </div>
    </div>
  );
}
