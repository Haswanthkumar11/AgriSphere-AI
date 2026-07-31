/**
 * Printable / Downloadable Rental Confirmation Modal
 */
export default function BookingConfirmationModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', border: '2px solid var(--soil)', borderRadius: 20,
        maxWidth: 480, width: '100%', padding: 20, boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--line)', paddingBottom: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase' }}>
              OFFICIAL RENTAL CONFIRMATION
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--soil-dark)' }}>
              CODE: {booking.booking_code}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✖</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 12, marginBottom: 14 }}>
          <div><span style={{ color: 'var(--ink-soft)' }}>Equipment:</span> <strong>{booking.equipment_name}</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Status:</span> <strong>{booking.status}</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Farmer Name:</span> <strong>{booking.requester_name}</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Owner Name:</span> <strong>{booking.owner_name}</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Dates:</span> <strong>{new Date(booking.from_date).toLocaleDateString()} → {new Date(booking.to_date).toLocaleDateString()}</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Est. Total:</span> <strong>₹{booking.total_estimated_cost} ({booking.total_days} days)</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Operator Req:</span> <strong>{booking.operator_required ? 'Yes' : 'No'}</strong></div>
          <div><span style={{ color: 'var(--ink-soft)' }}>Location:</span> <strong>{booking.village}</strong></div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px dashed var(--line)', paddingTop: 10 }}>
          <button
            onClick={() => window.print()}
            style={{
              background: 'var(--paper-dim)', border: '1px solid var(--line)',
              color: 'var(--soil-dark)', padding: '6px 14px', borderRadius: 8,
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}
          >
            📄 Print / Download Rental Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}
