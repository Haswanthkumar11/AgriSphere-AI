/**
 * Disease Knowledge Card Component (Grounded ICAR / KVK Data Card)
 */
export default function DiseaseKnowledgeCard({ disease, onClose }) {
  if (!disease) return null;

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--line)', borderRadius: 18,
      padding: 20, boxShadow: 'var(--shadow-lg)', marginTop: 14, position: 'relative',
    }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 14, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink-soft)' }}
          aria-label="Close card"
        >
          ✕
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 32 }}>{disease.image_icon || '🍃'}</span>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--soil-dark)' }}>{disease.disease_name}</h3>
          <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontStyle: 'italic' }}>{disease.scientific_name || disease.crop_type}</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 12 }}>{disease.description}</p>

      {/* Symptoms */}
      {disease.symptoms?.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Symptoms</div>
          {disease.symptoms.map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 2 }}>• {s}</div>
          ))}
        </div>
      )}

      {/* Chemical & Organic */}
      <div style={{ background: 'var(--paper-dim)', borderRadius: 12, padding: 12, marginBottom: 10, fontSize: 12 }}>
        <div style={{ marginBottom: 6 }}>
          <strong style={{ color: 'var(--soil-dark)' }}>🧪 Chemical Treatment:</strong> {disease.chemical_treatment}
        </div>
        <div>
          <strong style={{ color: 'var(--good)' }}>🌿 Organic Treatment:</strong> {disease.organic_treatment}
        </div>
      </div>

      {/* Government Advisory */}
      {disease.government_advisory && (
        <div style={{ fontSize: 11.5, color: 'var(--soil-dark)', fontWeight: 600, background: '#E6F0E3', padding: '8px 12px', borderRadius: 10 }}>
          🏛️ {disease.government_advisory}
        </div>
      )}
    </div>
  );
}
