import { useState } from 'react';
import { submitBooking } from '@api/resourceApi';

export default function BookingRequestModal({ equipment, onClose, onSuccess }) {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('Harvesting');
  const [landSize, setLandSize] = useState(2.0);
  const [operatorRequired, setOperatorRequired] = useState(equipment.operator_available || false);
  const [specialReqs, setSpecialReqs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        equipment_id: equipment.id,
        from_date: fromDate,
        to_date: toDate,
        purpose,
        land_size_acres: parseFloat(landSize),
        operator_required: operatorRequired,
        special_requirements: specialReqs,
        village: equipment.village || 'Amaravati',
      };
      const res = await submitBooking(payload);
      onSuccess(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, maxWidth: 440, width: '100%',
        padding: 20, boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--line)', paddingBottom: 10, marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', margin: 0 }}>
            🚜 Book {equipment.name}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✖</button>
        </div>

        {error && <div className="advisory-banner error" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label className="form-label">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="form-input" required />
            </div>
            <div>
              <label className="form-label">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="form-input" required />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Rental Purpose</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="form-select">
              <option value="Land Preparation">🚜 Land Preparation</option>
              <option value="Sowing">🌱 Sowing / Planting</option>
              <option value="Harvesting">🌾 Harvesting</option>
              <option value="Transportation">🚛 Transportation</option>
              <option value="Spraying">🧴 Spraying</option>
              <option value="Other">🪓 Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Farm Size (Acres)</label>
            <input type="number" step="0.5" value={landSize} onChange={(e) => setLandSize(e.target.value)} className="form-input" required />
          </div>

          <div style={{ marginBottom: 12, background: 'var(--paper-dim)', padding: 10, borderRadius: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              <input type="checkbox" checked={operatorRequired} onChange={(e) => setOperatorRequired(e.target.checked)} style={{ width: 18, height: 18 }} />
              👨‍🌾 Operator Required?
            </label>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
              {equipment.operator_available ? 'Owner offers driver operator services.' : 'Owner does not typically include driver.'}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Special Requirements / Notes</label>
            <input type="text" placeholder="e.g. Need rotavator attachment, cultivator" value={specialReqs} onChange={(e) => setSpecialReqs(e.target.value)} className="form-input" />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn-farmer btn-farmer-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-farmer btn-farmer-primary" style={{ flex: 2 }}>
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
