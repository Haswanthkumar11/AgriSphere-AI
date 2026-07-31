import { useState, useEffect } from 'react';
import PageHeader from '@components/layout/PageHeader';
import OwnerBookingCard from '@components/farmer/OwnerBookingCard';
import BookingConfirmationModal from '@components/farmer/BookingConfirmationModal';
import Skeleton from '@components/ui/Skeleton';
import { getFarmerBookings, getOwnerRequests, getOwnerDashboard } from '@api/resourceApi';

export default function BookingsPage() {
  const [tab, setTab] = useState('my-bookings'); // 'my-bookings' vs 'owner-requests'
  const [farmerBookings, setFarmerBookings] = useState([]);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [ownerMetrics, setOwnerMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchBookingsData = () => {
    setLoading(true);
    Promise.all([
      getFarmerBookings(),
      getOwnerRequests(),
      getOwnerDashboard(),
    ])
      .then(([resFarmer, resOwner, resDash]) => {
        setFarmerBookings(resFarmer.data || []);
        setOwnerRequests(resOwner.data || []);
        setOwnerMetrics(resDash.data?.operational_metrics || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookingsData();
  }, []);

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader title="📋 Booking Dashboard" subtitle="Manage rental requests, operational metrics & confirmations" />

      {/* Mode Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, margin: '14px 0' }}>
        <button
          onClick={() => setTab('my-bookings')}
          className={`btn-farmer ${tab === 'my-bookings' ? 'btn-farmer-primary' : 'btn-farmer-outline'}`}
          style={{ flex: 1, fontSize: 13 }}
        >
          👨‍🌾 My Rental Requests ({farmerBookings.length})
        </button>
        <button
          onClick={() => setTab('owner-requests')}
          className={`btn-farmer ${tab === 'owner-requests' ? 'btn-farmer-primary' : 'btn-farmer-outline'}`}
          style={{ flex: 1, fontSize: 13 }}
        >
          🚜 Owner Requests ({ownerRequests.length})
        </button>
      </div>

      {/* Owner Operational Metrics Cards (No Fake Income) */}
      {tab === 'owner-requests' && ownerMetrics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--soil)' }}>{ownerMetrics.total_listings}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Listings</div>
          </div>
          <div style={{ background: '#FFF3D6', border: '1px solid var(--warn)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warn)' }}>{ownerMetrics.pending_requests}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Pending</div>
          </div>
          <div style={{ background: '#EDF6EC', border: '1px solid var(--good)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--good)' }}>{ownerMetrics.accepted_bookings}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Accepted</div>
          </div>
          <div style={{ background: '#EAEFFF', border: '1px solid #2B4A8E', padding: 10, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#2B4A8E' }}>{ownerMetrics.completed_rentals}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Completed</div>
          </div>
        </div>
      )}

      {loading && <Skeleton height={120} count={3} style={{ borderRadius: 16, marginBottom: 10 }} />}

      {/* TAB 1: My Rental Requests (Farmer View) */}
      {tab === 'my-bookings' && !loading && (
        <>
          {farmerBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--ink-soft)' }}>No rental requests submitted yet.</div>
          ) : (
            farmerBookings.map((bkg) => (
              <div key={bkg.id} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase' }}>
                    {bkg.booking_code} • {bkg.equipment_name}
                  </span>
                  <span style={{ background: '#EDF6EC', color: 'var(--good)', padding: '3px 8px', borderRadius: 999, fontWeight: 800, fontSize: 11 }}>
                    {bkg.status}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: 'var(--ink)' }}>
                  Dates: <strong>{new Date(bkg.from_date).toLocaleDateString()} → {new Date(bkg.to_date).toLocaleDateString()}</strong> ({bkg.total_days} days)
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  Owner: <strong>{bkg.owner_name}</strong> ({bkg.owner_phone})
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => setSelectedDoc(bkg)} className="btn-farmer btn-farmer-outline" style={{ padding: '6px 12px', fontSize: 12 }}>
                    📄 View Rental Confirmation
                  </button>
                  <a href={bkg.call_owner_link} className="btn-farmer btn-farmer-outline" style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}>
                    📞 Call Owner
                  </a>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* TAB 2: Owner Booking Requests */}
      {tab === 'owner-requests' && !loading && (
        <>
          {ownerRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--ink-soft)' }}>No incoming booking requests yet.</div>
          ) : (
            ownerRequests.map((bkg) => (
              <OwnerBookingCard key={bkg.id} booking={bkg} onUpdate={fetchBookingsData} />
            ))
          )}
        </>
      )}

      {/* Rental Confirmation Document Modal */}
      {selectedDoc && <BookingConfirmationModal booking={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </div>
  );
}
