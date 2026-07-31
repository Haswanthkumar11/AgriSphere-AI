/**
 * Hero Feature 2: Scan Comparison Card
 * Displays side-by-side comparison between Session A and Session B with progress trend.
 */
export default function ScanComparisonCard({ comparison }) {
  if (!comparison) return null;

  const { session_a, session_b, comparison_metrics } = comparison;
  const isImproved = comparison_metrics.trend === 'improved';
  const isWorsened = comparison_metrics.trend === 'worsened';

  const badgeBg = isImproved ? '#E6F3E5' : isWorsened ? '#FBEAE5' : '#FFF3D6';
  const badgeColor = isImproved ? 'var(--good)' : isWorsened ? 'var(--bad)' : 'var(--warn)';

  return (
    <div className="yield-result" style={{ marginTop: 14 }}>
      {/* Trend Banner */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <span style={{ background: badgeBg, color: badgeColor, padding: '6px 14px', borderRadius: 999, fontWeight: 800, fontSize: 14 }}>
          {comparison_metrics.trend_label}
        </span>
      </div>

      {/* Side-by-side grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: 'var(--paper-dim)', borderRadius: 14, marginBottom: 12 }}>
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--line)', paddingRight: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>Scan 1 (Older)</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--soil-dark)', marginTop: 2 }}>{session_a.disease_name}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Affected: <strong>{session_a.affected_area_pct}%</strong></div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 2 }}>{new Date(session_a.date).toLocaleDateString()}</div>
        </div>

        <div style={{ textAlign: 'center', paddingLeft: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>Scan 2 (Newer)</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--soil-dark)', marginTop: 2 }}>{session_b.disease_name}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Affected: <strong>{session_b.affected_area_pct}%</strong></div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 2 }}>{new Date(session_b.date).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Recommendation */}
      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4, textAlign: 'center' }}>
        💡 {comparison_metrics.recommendation}
      </p>
    </div>
  );
}
