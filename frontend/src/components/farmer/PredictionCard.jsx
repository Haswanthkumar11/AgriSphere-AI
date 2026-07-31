/** Farmer UI Component: Prediction Card */
export default function PredictionCard({ title, metricValue, metricUnit, confidence, explanation }) {
  return (
    <div className="yield-result">
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--wheat-deep)', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 4 }}>
        {title}
      </div>
      <div className="yield-headline">{metricValue}</div>
      <div className="yield-unit">{metricUnit}</div>
      {confidence && (
        <p style={{ fontSize: 11, color: 'var(--ink-soft)', textAlign: 'center', marginTop: 4 }}>
          Confidence: {confidence}%
        </p>
      )}
      {explanation && (
        <p style={{ fontSize: 13, color: 'var(--ink)', marginTop: 12, lineHeight: 1.4 }}>
          {explanation}
        </p>
      )}
    </div>
  );
}
