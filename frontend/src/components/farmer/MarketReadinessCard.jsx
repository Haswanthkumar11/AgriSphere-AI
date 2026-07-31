/**
 * Module 4 Hero Component 3: Market Readiness Card (💰 Selling Advice)
 * "✓ Sell Now at Mandi" vs. "✓ Store for 2–3 Weeks" Decision Advisor with price band & source badge.
 */
export default function MarketReadinessCard({ recommendationLabel = '✓ Sell Now at Mandi', minPrice = 2150, maxPrice = 2380, priceSource = "Based on Today's Mandi Market Data", readinessScore = 92.0 }) {
  const isSell = recommendationLabel.includes('Sell Now');

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1B2F20 0%, #2C4A34 100%)',
      color: 'var(--paper)', borderRadius: 18, padding: 18,
      marginTop: 14, boxShadow: 'var(--shadow)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--wheat)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
        💰 Selling Advice & Price Band
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
        {recommendationLabel}
      </h3>

      <div className="price-highlight" style={{ background: 'rgba(217, 164, 65, 0.15)', border: '1px solid var(--wheat)', marginTop: 0, padding: 14 }}>
        <div className="lbl" style={{ color: 'var(--wheat)' }}>Expected Mandi Price Band</div>
        <div className="amt" style={{ color: '#fff', fontSize: 28 }}>₹{minPrice} – ₹{maxPrice}</div>
        <div className="unit" style={{ color: 'rgba(255,255,255,0.8)' }}>per quintal</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 11, opacity: 0.85 }}>
        <span>🏷️ {priceSource}</span>
        <span>Readiness Score: <strong>{readinessScore}%</strong></span>
      </div>
    </div>
  );
}
