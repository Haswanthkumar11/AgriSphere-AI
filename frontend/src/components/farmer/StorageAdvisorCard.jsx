/**
 * Module 4 Hero Component 2: Storage Advisor Card (📦 Storage Advice)
 * Smart Storage Risk Indicator (🟢 Safe / 🟡 Monitor / 🔴 High Risk), shelf life, humidity & temperature limits.
 */
export default function StorageAdvisorCard({ storageType = 'Hermetic Grain Bags (PICS)', shelfLifeDays = 180, riskLabel = '🟢 Safe', actionableGuidance, humidityLimit = 60, tempLimit = 25, pestPrecautions = [] }) {
  const isSafe = riskLabel.includes('Safe');
  const isMonitor = riskLabel.includes('Monitor');

  const cardBg = isSafe ? '#EDF6EC' : isMonitor ? '#FFF3D6' : '#FBEAE5';
  const cardBorder = isSafe ? '#BFE0BE' : isMonitor ? '#F0CFA6' : '#F0BCA9';

  return (
    <div style={{
      background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 18,
      padding: 18, boxShadow: 'var(--shadow)', marginTop: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--soil-dark)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          📦 Storage Risk Meter
        </div>
        <span style={{ fontSize: 13, fontWeight: 800 }}>{riskLabel}</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 12 }}>
        {actionableGuidance || 'Storage risk is low. Grains are dry and suitable for long-term storage.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: '#fff', padding: 12, borderRadius: 12, marginBottom: 10, fontSize: 12 }}>
        <div>Recommended Type: <strong>{storageType}</strong></div>
        <div>Max Shelf Life: <strong>{shelfLifeDays} days</strong></div>
        <div>Max Humidity: <strong>&lt;{humidityLimit}%</strong></div>
        <div>Max Temperature: <strong>&lt;{tempLimit}°C</strong></div>
      </div>

      {pestPrecautions.length > 0 && (
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>
          <strong>Pest Precautions:</strong>
          {pestPrecautions.map((p, i) => <div key={i}>• {p}</div>)}
        </div>
      )}
    </div>
  );
}
