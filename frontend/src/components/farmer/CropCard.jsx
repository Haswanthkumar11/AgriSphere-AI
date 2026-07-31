/** Farmer UI Component: Crop Card */
export default function CropCard({ name, icon, acreage, healthStatus, onClick }) {
  const isHealthy = healthStatus === 'Healthy';
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid var(--line)', borderRadius: 16,
        padding: '14px 16px', marginBottom: 10, cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 28 }}>{icon || '🌾'}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--soil-dark)' }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{acreage} acres</div>
        </div>
      </div>
      <span className={`trend ${isHealthy ? 'up' : 'down'}`} style={{ fontSize: 11 }}>
        {healthStatus || 'Healthy'}
      </span>
    </div>
  );
}
