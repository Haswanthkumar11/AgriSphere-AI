/**
 * Booking Request Sent Success Card
 * Displays: ✅ Booking Request Sent, Booking ID (BKG-2026-00041), Owner Name, Status Pending.
 * Explicit confirmation message: "The equipment owner has been notified."
 */
export default function BookingSuccessCard({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div style={{
      background: '#EDF6EC', border: '2px solid var(--good)', borderRadius: 18,
      padding: 18, boxShadow: 'var(--shadow)', marginTop: 14, textTransform: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--good)' }}>
          ✅ Booking Request Sent
        </span>
        <span style={{ background: '#fff', padding: '4px 10px', borderRadius: 8, fontWeight: 800, fontSize: 12, color: 'var(--soil-dark)' }}>
          {booking.booking_code}
        </span>
      </div>

      <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 12 }}>
        Your rental request for <strong>{booking.equipment_name}</strong> has been submitted to the equipment owner (<strong>{booking.owner_name}</strong>).
      </div>

      <div style={{ background: '#fff', padding: 12, borderRadius: 12, fontSize: 12, marginBottom: 12 }}>
        <div>Dates: <strong>{new Date(booking.from_date).toLocaleDateString()} → {new Date(booking.to_date).toLocaleDateString()}</strong></div>
        <div>Status: <strong style={{ color: 'var(--warn)' }}>Pending Owner Approval</strong></div>
        <div>Estimated Cost: <strong>₹{booking.total_estimated_cost} ({booking.total_days} days)</strong></div>
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--soil)', fontWeight: 700, marginBottom: 12 }}>
        🔔 The equipment owner has been notified. They can accept or reject your request directly from their dashboard.
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <a href={booking.call_owner_link} className="btn-farmer btn-farmer-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: 12 }}>
          📞 Call Owner
        </a>
        <a href={booking.whatsapp_owner_link} target="_blank" rel="noreferrer" className="btn-farmer btn-farmer-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: 12 }}>
          💬 WhatsApp Owner
        </a>
      </div>
    </div>
  );
}
