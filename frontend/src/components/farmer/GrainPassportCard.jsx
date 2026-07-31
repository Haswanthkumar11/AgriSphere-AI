/**
 * Module 4 Hero Component 4: Official Grain Quality Passport Card
 * One-page printable / shareable passport document (Passport ID: GRN-2026-00012).
 */
export default function GrainPassportCard({ passportId = 'GRN-2026-00012', cropType = 'Paddy', grade = 'Grade A', qualityScore = 92.5, moistureRange = '10–12%', storageType = 'Hermetic Bags', priceBand = '₹2,150 – ₹2,380', date }) {
  return (
    <div style={{
      background: '#fff', border: '2px dashed var(--soil)', borderRadius: 20,
      padding: 20, marginTop: 16, boxShadow: 'var(--shadow-lg)', position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--line)', paddingBottom: 10, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase', letterSpacing: 1 }}>
            OFFICIAL GRAIN QUALITY PASSPORT
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--soil-dark)' }}>
            ID: {passportId}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ background: 'var(--soil)', color: '#fff', padding: '4px 10px', borderRadius: 8, fontWeight: 800, fontSize: 12 }}>
            {grade}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 12, marginBottom: 14 }}>
        <div><span style={{ color: 'var(--ink-soft)' }}>Crop:</span> <strong>{cropType}</strong></div>
        <div><span style={{ color: 'var(--ink-soft)' }}>Quality Index:</span> <strong>{qualityScore}/100</strong></div>
        <div><span style={{ color: 'var(--ink-soft)' }}>Moisture Range:</span> <strong>{moistureRange}</strong></div>
        <div><span style={{ color: 'var(--ink-soft)' }}>Storage:</span> <strong>{storageType}</strong></div>
        <div><span style={{ color: 'var(--ink-soft)' }}>Price Band:</span> <strong>{priceBand}/Q</strong></div>
        <div><span style={{ color: 'var(--ink-soft)' }}>Date:</span> <strong>{date ? new Date(date).toLocaleDateString() : 'Today'}</strong></div>
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px dashed var(--line)', paddingTop: 10 }}>
        <button
          onClick={() => window.print()}
          style={{
            background: 'var(--paper-dim)', border: '1px solid var(--line)',
            color: 'var(--soil-dark)', padding: '6px 14px', borderRadius: 8,
            fontWeight: 700, fontSize: 12, cursor: 'pointer',
          }}
        >
          📄 Print / Download Passport
        </button>
      </div>
    </div>
  );
}
