/**
 * Hero Feature 3: Farmer Action Summary Card
 * Transforms technical prediction into clear, actionable recommended next steps.
 */
export default function ActionSummaryCard({ actionSteps = [], sprayWindow, recoveryDays = 7 }) {
  const steps = actionSteps.length ? actionSteps : [
    '1. Spray recommended fungicide within 48 hours.',
    '2. Switch to drip irrigation; avoid leaf wetness.',
    '3. Rescan in 5–7 days to track recovery progression.',
  ];

  return (
    <div style={{
      background: 'var(--wheat)', borderRadius: 18, padding: 18,
      marginTop: 14, boxShadow: 'var(--shadow)', border: '1px solid var(--wheat-deep)',
    }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: '#5c4310', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        📋 Recommended Next Steps
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--soil-dark)', lineHeight: 1.4 }}>
            {step}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(92, 67, 16, 0.2)', fontSize: 11.5, color: '#5c4310' }}>
        <span><strong>Optimal Spray Window:</strong> {sprayWindow || 'Early morning (6am - 8:30am)'}</span>
        <span><strong>Recovery:</strong> ~{recoveryDays} days</span>
      </div>
    </div>
  );
}
