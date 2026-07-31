/**
 * Owner Booking Card with Accept, Reject, Complete, Call, WhatsApp buttons.
 */
import { acceptBooking, rejectBooking, completeBooking } from '@api/resourceApi';

export default function OwnerBookingCard({ booking, onUpdate }) {
  const isPending = booking.status === 'PENDING';
  const isAccepted = booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS';
  const isCompleted = booking.status === 'COMPLETED';

  const handleAccept = async () => {
    await acceptBooking(booking.id);
    onUpdate();
  };

  const handleReject = async () => {
    await rejectBooking(booking.id);
    onUpdate();
  };

  const handleComplete = async () => {
    await completeBooking(booking.id);
    onUpdate();
  };

  const statusBg = isPending ? '#FFF3D6' : isAccepted ? '#EDF6EC' : isCompleted ? '#EAEFFF' : '#FBEAE5';
  const statusColor = isPending ? 'var(--warn)' : isAccepted ? 'var(--good)' : isCompleted ? '#2B4A8E' : 'var(--bad)';

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16,
      padding: 16, marginBottom: 12, boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase' }}>
          {booking.booking_code} • {booking.equipment_name}
        </span>
        <span style={{ background: statusBg, color: statusColor, padding: '3px 8px', borderRadius: 999, fontWeight: 800, fontSize: 11 }}>
          {booking.status}
        </span>
      </div>

      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--soil-dark)' }}>
        Farmer: {booking.requester_name} ({booking.requester_phone})
      </div>

      <div style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '6px 0 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
        <div>Dates: <strong>{new Date(booking.from_date).toLocaleDateString()} → {new Date(booking.to_date).toLocaleDateString()}</strong></div>
        <div>Farm Size: <strong>{booking.land_size_acres} Acres</strong></div>
        <div>Purpose: <strong>{booking.purpose}</strong></div>
        <div>Operator: <strong>{booking.operator_required ? 'Yes Required' : 'No'}</strong></div>
      </div>

      {booking.special_requirements !== 'None' && (
        <div style={{ fontSize: 11.5, background: 'var(--paper-dim)', padding: 8, borderRadius: 8, marginBottom: 10 }}>
          <strong>Special Reqs:</strong> {booking.special_requirements}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {isPending && (
          <>
            <button onClick={handleAccept} className="btn-farmer btn-farmer-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
              ✓ Accept
            </button>
            <button onClick={handleReject} className="btn-farmer btn-farmer-outline" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--bad)', borderColor: 'var(--bad)' }}>
              ✖ Reject
            </button>
          </>
        )}

        {isAccepted && (
          <button onClick={handleComplete} className="btn-farmer btn-farmer-primary" style={{ padding: '6px 12px', fontSize: 12, background: '#2B4A8E' }}>
            🎉 Mark Completed
          </button>
        )}

        <a href={booking.call_owner_link} className="btn-farmer btn-farmer-outline" style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}>
          📞 Call
        </a>
        <a href={booking.whatsapp_owner_link} target="_blank" rel="noreferrer" className="btn-farmer btn-farmer-outline" style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none', color: '#128C7E', borderColor: '#128C7E' }}>
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}
