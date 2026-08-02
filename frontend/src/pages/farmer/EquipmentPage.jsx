import { useState, useEffect } from 'react';
import PageHeader from '@components/layout/PageHeader';
import Skeleton from '@components/ui/Skeleton';
import BookingRequestModal from '@components/farmer/BookingRequestModal';
import BookingSuccessCard from '@components/farmer/BookingSuccessCard';
import { listEquipment, createEquipment } from '@api/resourceApi';

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [bookingTarget, setBookingTarget] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Equipment Form
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('tractor');
  const [newPrice, setNewPrice] = useState(650);
  const [newVillage, setNewVillage] = useState('Amaravati');
  const [newOperator, setNewOperator] = useState(false);

  const fetchEquipment = () => {
    setLoading(true);
    listEquipment({ category: selectedCategory, sort_by: sortBy })
      .then((res) => {
        const data = res?.data || res;
        setEquipmentList(Array.isArray(data) ? data : []);
      })
      .catch(() => setEquipmentList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory, sortBy]);

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      await createEquipment({
        name: newName,
        category: newCat,
        price_per_day: parseFloat(newPrice),
        village: newVillage,
        operator_available: newOperator,
        is_verified: true,
      });
      setShowAddModal(false);
      setNewName('');
      fetchEquipment();
    } catch (err) {
      alert('Failed to list equipment.');
    }
  };

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader title="🚜 Equipment Marketplace" subtitle="Rent tractors, harvesters & tools directly from verified owners" />

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 10px' }}>
        <button onClick={() => setShowAddModal(true)} className="btn-farmer btn-farmer-primary" style={{ fontSize: 13 }}>
          ➕ List My Equipment
        </button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}>
          <option value="newest">Sort: Newest</option>
          <option value="lowest_price">Sort: Price Low → High</option>
          <option value="highest_price">Sort: Price High → Low</option>
        </select>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 12 }}>
        {[
          { key: '', label: 'All Equipment' },
          { key: 'tractor', label: '🚜 Tractor' },
          { key: 'harvester', label: '🌾 Harvester' },
          { key: 'trailer', label: '🚛 Trailer' },
          { key: 'irrigation', label: '🚿 Irrigation' },
          { key: 'seeder', label: '🌱 Seeder' },
          { key: 'rotavator', label: '🚜 Rotavator' },
          { key: 'sprayer', label: '🧴 Sprayer' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              whiteSpace: 'nowrap', border: '1px solid var(--line)', cursor: 'pointer',
              background: selectedCategory === cat.key ? 'var(--soil-dark)' : '#fff',
              color: selectedCategory === cat.key ? '#fff' : 'var(--ink)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Success Card if Booking Request Sent */}
      {successBooking && <BookingSuccessCard booking={successBooking} onClose={() => setSuccessBooking(null)} />}

      {/* Loading Skeletons */}
      {loading && <Skeleton height={140} count={3} style={{ borderRadius: 16, marginBottom: 12 }} />}

      {/* Equipment Marketplace Grid */}
      {!loading && (
        <div style={{ display: 'grid', gap: 14 }}>
          {equipmentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fff', borderRadius: 18, border: '1.5px dashed var(--line)' }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>🚜</div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 4 }}>No Equipment Listed Yet</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 auto 16px', maxWidth: 360 }}>
                There are currently no active equipment listings for this category in the database. Be the first farmer to list your tractor or tool!
              </p>
              <button onClick={() => setShowAddModal(true)} className="btn-farmer btn-farmer-primary" style={{ width: 'auto', padding: '8px 18px', fontSize: 13 }}>
                ➕ List Your Equipment
              </button>
            </div>
          ) : (
            equipmentList.map((item) => (
              <div key={item.id} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 18, padding: 16, boxShadow: 'var(--shadow)' }}>
                {item.image_url && !item.image_url.includes('placeholder') && !item.image_url.includes('sample') && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
                  />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', margin: 0 }}>{item.name}</h3>
                      {item.is_verified && <span style={{ fontSize: 11, background: '#EDF6EC', color: 'var(--good)', padding: '2px 6px', borderRadius: 6, fontWeight: 800 }}>Verified Owner ✔️</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                      📍 {item.village}, {item.district} • Owner: <strong>{item.owner_name}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--soil)' }}>₹{item.price_per_day}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>per day</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, fontSize: 12, margin: '10px 0', color: 'var(--ink)' }}>
                  <span>Operator: <strong>{item.operator_available ? '👨‍🌾 Available' : 'No'}</strong></span>
                  <span>Available: <strong style={{ color: item.is_available ? 'var(--good)' : 'var(--bad)' }}>{item.is_available ? 'Yes' : 'No'}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button
                    disabled={!item.is_available}
                    onClick={() => setBookingTarget(item)}
                    className="btn-farmer btn-farmer-primary"
                    style={{ flex: 2, fontSize: 13 }}
                  >
                    📅 Request Booking
                  </button>
                  <a href={item.call_link} className="btn-farmer btn-farmer-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: 12 }}>
                    📞 Call
                  </a>
                  <a href={item.whatsapp_link} target="_blank" rel="noreferrer" className="btn-farmer btn-farmer-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: 12, color: '#128C7E', borderColor: '#128C7E' }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingTarget && (
        <BookingRequestModal
          equipment={bookingTarget}
          onClose={() => setBookingTarget(null)}
          onSuccess={(bkg) => {
            setBookingTarget(null);
            setSuccessBooking(bkg);
          }}
        />
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 400, width: '100%', padding: 20, boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>➕ List My Equipment</h3>
            <form onSubmit={handleAddEquipment}>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Equipment Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="form-input" placeholder="e.g. Mahindra 575 Tractor" required />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Category</label>
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="form-select">
                  <option value="tractor">🚜 Tractor</option>
                  <option value="harvester">🌾 Harvester</option>
                  <option value="trailer">🚛 Trailer</option>
                  <option value="irrigation">🚿 Irrigation Pump</option>
                  <option value="rotavator">🚜 Rotavator</option>
                  <option value="sprayer">🧴 Sprayer</option>
                </select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Rental Price per Day (₹)</label>
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="form-input" required />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Village / Location</label>
                <input type="text" value={newVillage} onChange={(e) => setNewVillage(e.target.value)} className="form-input" required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={newOperator} onChange={(e) => setNewOperator(e.target.checked)} />
                  Operator Available with Equipment
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-farmer btn-farmer-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-farmer btn-farmer-primary" style={{ flex: 1 }}>Submit Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
