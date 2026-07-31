/** Confidence percentage bar — fills left to right over 0.6s. */
export default function ConfidenceBar({ score }) {
  const pct = Math.min(Math.max(Number(score), 0), 100);
  return (
    <div>
      <div className="confidence-bar">
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
      <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{pct}% confidence</p>
    </div>
  );
}
