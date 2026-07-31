/** Farmer UI Component: AI Recommendation Banner */
export default function AIRecommendation({ title, body, actionLabel, onAction }) {
  return (
    <div className="advisory" style={{ background: 'linear-gradient(135deg, var(--soil) 0%, #1d3324 100%)' }}>
      <div className="adv-icon">🤖</div>
      <div className="adv-txt" style={{ width: '100%' }}>
        <div className="t1">{title}</div>
        <div className="t2">{body}</div>
        {actionLabel && (
          <button
            onClick={onAction}
            style={{
              marginTop: 10, background: 'var(--wheat)', color: 'var(--soil-dark)',
              border: 'none', padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
