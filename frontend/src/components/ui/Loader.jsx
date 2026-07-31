/**
 * Loader — scanline animation + spinner for AI-processing states.
 * variant: 'scan' (animated scanline over leaf icon) | 'spinner' (simple spinner)
 */
export default function Loader({ variant = 'spinner', message = '' }) {
  if (variant === 'scan') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🍃</div>
        <div
          style={{
            height: 3, borderRadius: 3,
            background: 'var(--wheat)',
            boxShadow: '0 0 12px 2px rgba(217,164,65,0.8)',
            animation: 'sweep 1.6s ease-in-out infinite',
            marginBottom: 12,
          }}
        />
        {message && <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '3px solid var(--line)',
        borderTopColor: 'var(--soil)',
        animation: 'spin 0.7s linear infinite',
      }} />
      {message && <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{message}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
