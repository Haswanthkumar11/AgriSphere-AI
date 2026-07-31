/**
 * Module 4 Hero Component 1: Quality Score Card (🌾 Grain Quality Check)
 * Displays Grade A/B/C badge, Quality score (0-100), Defensible Moisture Range & Status, Broken grain %, Foreign matter %.
 */
export default function QualityScoreCard({ grade = 'Grade A', qualityScore = 92.5, moistureStatus = 'Low', moistureRange = '10–12%', brokenGrainPct = 1.2, foreignMatterPct = 0.5, sizeUniformity = 94.0 }) {
  const isGradeA = grade.includes('Grade A');
  const isGradeB = grade.includes('Grade B');

  const badgeBg = isGradeA ? '#EDF6EC' : isGradeB ? '#FFF3D6' : '#FBEAE5';
  const badgeColor = isGradeA ? 'var(--good)' : isGradeB ? 'var(--warn)' : 'var(--bad)';

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--line)', borderRadius: 18,
      padding: 18, boxShadow: 'var(--shadow)', marginTop: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--wheat-deep)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          🌾 Grain Quality Score
        </div>
        <span style={{ background: badgeBg, color: badgeColor, padding: '4px 10px', borderRadius: 999, fontWeight: 800, fontSize: 12 }}>
          {grade}
        </span>
      </div>

      <div style={{ textAlign: 'center', margin: '10px 0 16px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, color: 'var(--soil-dark)', lineHeight: 1 }}>
          {qualityScore}<span style={{ fontSize: 20, color: 'var(--ink-soft)' }}>/100</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>AGMARK Standard Visual Quality Index</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', background: 'var(--paper-dim)', padding: 12, borderRadius: 14 }}>
        <div className="metric-row" style={{ border: 'none', padding: '4px 0' }}>
          <span className="label">Moisture Status:</span>
          <span className="value">{moistureStatus} ({moistureRange})</span>
        </div>
        <div className="metric-row" style={{ border: 'none', padding: '4px 0' }}>
          <span className="label">Broken Grains:</span>
          <span className="value">{brokenGrainPct}%</span>
        </div>
        <div className="metric-row" style={{ border: 'none', padding: '4px 0' }}>
          <span className="label">Foreign Matter:</span>
          <span className="value">{foreignMatterPct}%</span>
        </div>
        <div className="metric-row" style={{ border: 'none', padding: '4px 0' }}>
          <span className="label">Uniformity:</span>
          <span className="value">{sizeUniformity}%</span>
        </div>
      </div>
    </div>
  );
}
