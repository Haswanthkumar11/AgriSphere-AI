import { useLang } from '@hooks/useLang';
import { showToast } from '@utils/toast';
import { bookEquipment } from '@api/equipmentApi';
import { useState } from 'react';

/**
 * EquipmentCard — thumb + info + book button.
 * Replaces both the static HTML and the dynamic template literal in the prototype.
 */
export default function EquipmentCard({ id, icon, name, ownerName, distanceKm, pricePerDay, available = true }) {
  const { t } = useLang();
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (booked || loading) return;
    setLoading(true);
    try {
      await bookEquipment(id);
      showToast(t('bookedMsg'));
      setBooked(true);
    } catch {
      showToast(t('bookedMsg') + ' (offline)');
      setBooked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equip-card">
      <div className="thumb" aria-hidden="true">{icon}</div>
      <div className="info">
        <div className="equip-name">{name}</div>
        <div className="equip-meta">{distanceKm} {t('kmAway')} · {ownerName}</div>
        <div className="equip-price">₹{pricePerDay} {t('perDay')}</div>
      </div>
      <button
        className="book-btn"
        onClick={handleBook}
        disabled={!available || booked || loading}
        aria-label={booked ? 'Booked' : `Book ${name}`}
        style={booked ? { background: 'var(--good)' } : {}}
      >
        {loading ? '...' : booked ? '✓' : t('bookBtn')}
      </button>
    </div>
  );
}
