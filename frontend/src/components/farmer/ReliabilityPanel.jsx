/**
 * Hero Feature 1: Hybrid AI Confidence & Reliability Architecture Panel
 * Displays 4-stage pipeline execution: OpenCV -> YOLO -> Gemini Vision -> ChromaDB RAG.
 */
export default function ReliabilityPanel({
  modelName = 'YOLOv8n-cls + OpenCV',
  inferenceTimeMs = 142,
  confidencePct = 92,
  isGemini = true,
  isGrounded = true,
}) {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--line)', borderRadius: 18,
      padding: '16px 18px', marginTop: 14, boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--wheat-deep)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          🛡️ Hybrid AI Architecture Execution Flow
        </div>
        <span style={{ fontSize: 10.5, background: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: 999, fontWeight: 800 }}>
          {isGrounded ? 'ICAR / KVK RAG Grounded' : 'AI Model Output'}
        </span>
      </div>

      {/* 4-Stage Execution Pipeline Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14, textStyle: 'center' }}>
        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '6px 4px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#166534' }}>1. OpenCV</div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-soft)' }}>Preprocess</div>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '6px 4px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#92400E' }}>2. YOLO</div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-soft)' }}>Localization</div>
        </div>
        <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: 10, padding: '6px 4px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#1E40AF' }}>3. Gemini</div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-soft)' }}>Reasoning</div>
        </div>
        <div style={{ background: '#EDE9FE', border: '1px solid #C4B5FD', borderRadius: 10, padding: '6px 4px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#5B21B6' }}>4. ChromaDB</div>
          <div style={{ fontSize: 9.5, color: 'var(--ink-soft)' }}>RAG Vector</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 12 }}>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Detection Engine:</span>{' '}
          <strong style={{ color: 'var(--soil-dark)' }}>YOLOv8 + OpenCV</strong>
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Inference Speed:</span>{' '}
          <strong style={{ color: 'var(--soil-dark)' }}>{inferenceTimeMs} ms</strong>
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Reasoning & RAG:</span>{' '}
          <strong style={{ color: 'var(--soil-dark)' }}>Gemini + ChromaDB</strong>
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Confidence Score:</span>{' '}
          <strong style={{ color: '#16A34A' }}>{confidencePct}%</strong>
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 12, borderTop: '1px dashed var(--line)', paddingTop: 8, fontStyle: 'italic', margin: 0 }}>
        ℹ️ <strong>Separation of Concerns:</strong> YOLO performs real-time visual localization, Gemini Vision performs agricultural reasoning, and ChromaDB grounds recommendations in official ICAR/KVK manuals.
      </p>
    </div>
  );
}
