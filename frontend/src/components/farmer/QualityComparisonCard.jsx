/**
 * Module 4 Component 5: Quality Comparison Card
 * Side-by-side harvest comparison (Harvest A vs Harvest B).
 */
export default function QualityComparisonCard({ comparison }) {
  if (!comparison) return null;

  const { harvest_a, harvest_b, comparison_metrics } = comparison;
  const isImproved = comparison_metrics.trend === 'improved';
  const isWorsened = comparison_metrics.trend === 'worsened';

  const badgeBg = isImproved ? '#EDF6EC' : isWorsened ? '#FBEAE5' : '#FFF3D6';
  const badgeColor = isImproved ? 'var(--good)' : isWorsened ? 'var(--bad)' : 'var(--warn)';

  return (
    <div className="yield-result" style={{ marginTop: 14 }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <span style={{ background: badgeBg, color: badgeColor, padding: '6px 14px', borderRadius: 999, fontWeight: 800, fontSize: 14 }}>
          {comparison_metrics.trend_label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: 'var(--paper-dim)', borderRadius: 14, marginBottom: 12 }}>
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--line)', paddingRight: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>Harvest 1 ({harvest_a.passport_id})</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--soil-dark)', marginTop: 2 }}>{harvest_a.grade}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Score: <strong>{harvest_a.quality_score}/100</strong></div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>Moisture: {harvest_a.moisture_status}</div>
        </div>

        <div style={{ textAlign: 'center', paddingLeft: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>Harvest 2 ({harvest_b.passport_id})</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--soil-dark)', marginTop: 2 }}>{harvest_b.grade}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Score: <strong>{harvest_b.quality_score}/100</strong></div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>Moisture: {harvest_b.moisture_status}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4, textAlign: 'center' }}>
        💡 {comparison_metrics.recommendation}
      </p>
    </div>
  );
}
