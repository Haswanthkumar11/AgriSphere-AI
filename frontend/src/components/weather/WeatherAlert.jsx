/**
 * WeatherAlert — colored alert banner.
 * severity: low | medium | high | critical
 */
const SEVERITY_COLORS = {
  low:      { bg: '#E6F3E5', border: '#BFE0BE', icon: '🌤️' },
  medium:   { bg: '#FFF3D6', border: '#F0D78A', icon: '⚠️' },
  high:     { bg: '#FBEAE5', border: '#F0BCA9', icon: '🔴' },
  critical: { bg: '#F5D0CC', border: '#D9776A', icon: '🚨' },
};

export default function WeatherAlert({ title, description, suggestedAction, aiAdvice, severity = 'medium' }) {
  const style = SEVERITY_COLORS[severity] || SEVERITY_COLORS.medium;

  return (
    <div
      style={{
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        borderRadius: 16,
        padding: '14px 16px',
        marginBottom: 12,
      }}
      role="alert"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }} aria-hidden="true">{style.icon}</span>
        <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--soil-dark)' }}>{title}</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 6 }}>{description}</p>
      {suggestedAction && (
        <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 4 }}>
          <strong>Action:</strong> {suggestedAction}
        </p>
      )}
      {aiAdvice && (
        <p style={{ fontSize: 12, color: 'var(--soil-dark)', fontWeight: 600 }}>
          🤖 {aiAdvice}
        </p>
      )}
    </div>
  );
}
