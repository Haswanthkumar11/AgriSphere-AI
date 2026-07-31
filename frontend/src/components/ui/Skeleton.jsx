/**
 * Skeleton Loader component for smooth loading UX across features.
 * variant: 'card' | 'dashboard' | 'weather' | 'equipment' | 'text'
 */
export default function Skeleton({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  const pulseStyle = {
    background: 'linear-gradient(90deg, #f1e9d8 25%, #e1d6bc 50%, #f1e9d8 75%)',
    backgroundSize: '200% 100%',
    animation: 'pulse 1.5s infinite ease-in-out',
    borderRadius: 12,
  };

  if (variant === 'dashboard') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ ...pulseStyle, height: 128, borderRadius: 18 }} />
        ))}
      </div>
    );
  }

  if (variant === 'weather') {
    return (
      <div>
        <div style={{ ...pulseStyle, height: 160, borderRadius: 18, marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 10, overflowX: 'hidden', marginBottom: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ ...pulseStyle, width: 82, height: 90, flex: 'none', borderRadius: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'equipment') {
    return (
      <div>
        {items.map((_, i) => (
          <div key={i} style={{ ...pulseStyle, height: 88, borderRadius: 16, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return <div style={{ ...pulseStyle, height: 18, width: '100%', marginBottom: 8 }} />;
  }

  return (
    <div>
      {items.map((_, i) => (
        <div key={i} style={{ ...pulseStyle, height: 120, borderRadius: 18, marginBottom: 12 }} />
      ))}
    </div>
  );
}
