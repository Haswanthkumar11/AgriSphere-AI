import ConfidenceBar from '@components/ui/ConfidenceBar';

/**
 * ResultCard — disease or grain scan result.
 * variant: 'good' | 'bad' | 'warn'
 */
export default function ResultCard({ icon, title, subtitle, body, confidence, variant = 'good', children }) {
  return (
    <div className={`result-card ${variant}`} role="region" aria-label="Analysis result">
      <div className="result-head">
        <div className="ic" aria-hidden="true">{icon}</div>
        <div>
          <div className="t1">{title}</div>
          {subtitle && <div className="t2">{subtitle}</div>}
        </div>
      </div>
      {body && <div className="result-body">{body}</div>}
      {confidence !== undefined && <ConfidenceBar score={confidence} />}
      {children}
    </div>
  );
}
