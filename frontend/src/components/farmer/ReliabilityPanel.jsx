/**
 * Hero Feature 1: AI Confidence & Reliability Panel
 * Displays model name (YOLOv8), inference speed (ms), confidence %, Gemini advisory badge, and AI disclaimer.
 */
export default function ReliabilityPanel({ modelName = 'YOLOv8n-cls + OpenCV', inferenceTimeMs = 142, confidencePct = 92, isGemini = true, isGrounded = true }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--line)', borderRadius: 16,
      padding: '14px 16px', marginTop: 14, boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--wheat-deep)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          🛡️ AI Transparency & Reliability
        </div>
        <span style={{ fontSize: 10, background: '#E6F0E3', color: 'var(--good)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
          {isGrounded ? 'ICAR/KVK Grounded' : 'AI Model Output'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 12 }}>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Vision Model:</span>{' '}
          <strong style={{ color: 'var(--soil-dark)' }}>{modelName}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Inference Time:</span>{' '}
          <strong style={{ color: 'var(--soil-dark)' }}>{inferenceTimeMs} ms</strong>
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Advisory Engine:</span>{' '}
          <strong style={{ color: 'var(--soil-dark)' }}>{isGemini ? 'Gemini 1.5 Flash' : 'Local Extension Rules'}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>Confidence:</span>{' '}
          <strong style={{ color: 'var(--good)' }}>{confidencePct}%</strong>
        </div>
      </div>

      <p style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 10, borderTop: '1px dashed var(--line)', paddingTop: 6, fontStyle: 'italic' }}>
        ℹ️ AI-assisted diagnosis based on computer vision. Consult local Krishi Vigyan Kendra (KVK) officer for critical decisions.
      </p>
    </div>
  );
}
