import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@components/layout/PageHeader';
import Skeleton from '@components/ui/Skeleton';
import { getHarvestHistory } from '@api/harvestApi';

export default function HarvestHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHarvestHistory()
      .then((res) => {
        const data = res?.data || res;
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const handleCompare = () => {
    if (selected.length === 2) {
      navigate(`/harvest/compare?id1=${selected[0]}&id2=${selected[1]}`);
    }
  };

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader title="📜 Grain Check History" subtitle="View past quality scans & compare harvest progression" />

      {selected.length === 2 && (
        <button onClick={handleCompare} className="btn-farmer btn-farmer-primary" style={{ width: '100%', marginBottom: 14 }}>
          📊 Compare Selected 2 Harvests Side-by-Side
        </button>
      )}

      {loading && <Skeleton height={100} count={3} style={{ borderRadius: 14, marginBottom: 10 }} />}

      {!loading && history.length === 0 && (
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--ink-soft)' }}>
          No grain quality check sessions recorded yet.
        </div>
      )}

      {!loading && history.map((item) => {
        const isSel = selected.includes(item.session_id);
        return (
          <div
            key={item.session_id}
            onClick={() => toggleSelect(item.session_id)}
            style={{
              background: isSel ? '#EDF6EC' : '#fff',
              border: `1.5px solid ${isSel ? 'var(--good)' : 'var(--line)'}`,
              borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase' }}>
                {item.passport_id} • {item.crop_type}
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--soil-dark)', marginTop: 2 }}>
                {item.grade} (Score: {item.quality_score}/100)
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                Moisture: {item.moisture_status} | {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <input type="checkbox" checked={isSel} readOnly style={{ width: 20, height: 20 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
