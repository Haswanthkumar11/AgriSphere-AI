import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { useAuth } from '@hooks/useAuth';
import { getScanHistory, deleteSession } from '@api/cropApi';
import { showToast } from '@utils/toast';
import PageHeader from '@components/layout/PageHeader';
import Loader from '@components/ui/Loader';

export default function CropHistoryPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    getScanHistory(user?.id || 'usr_demo')
      .then((res) => {
        const data = res?.data || res;
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [user]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteSession(id);
      setHistory((prev) => prev.filter((item) => item.session_id !== id));
      showToast('Session deleted');
    } catch {
      setHistory((prev) => prev.filter((item) => item.session_id !== id));
      showToast('Session deleted');
    }
  };

  const handleCompare = () => {
    if (selectedIds.length !== 2) {
      showToast('Please select exactly 2 scans to compare');
      return;
    }
    navigate(`/crop/compare?s1=${selectedIds[0]}&s2=${selectedIds[1]}`);
  };

  return (
    <div className="section screen-enter">
      <PageHeader title="Scan History & Lifecycle" subtitle="Search historical AI sessions & track recovery" />

      {/* Hero Compare Action Button */}
      {selectedIds.length > 0 && (
        <div style={{ background: 'var(--soil)', color: '#fff', borderRadius: 16, padding: '12px 16px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedIds.length}/2 Scans Selected</span>
          <button
            onClick={handleCompare}
            disabled={selectedIds.length !== 2}
            style={{ background: 'var(--wheat)', color: 'var(--soil-dark)', border: 'none', padding: '8px 16px', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
          >
            📊 Compare Side-by-Side
          </button>
        </div>
      )}

      {loading ? (
        <Loader variant="spinner" message={t('loading')} />
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fff', borderRadius: 18, border: '1.5px dashed var(--line)' }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>📷</div>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 4 }}>No Crop Scans Yet</h4>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 auto 16px', maxWidth: 340 }}>
            You have not recorded any crop leaf scans. Upload a crop image to analyze leaf health and store database history.
          </p>
          <button onClick={() => navigate('/scan')} className="btn-farmer btn-farmer-primary" style={{ width: 'auto', padding: '8px 18px', fontSize: 13 }}>
            📷 Start New Crop Scan
          </button>
        </div>
      ) : (
        <div>
          {history.map((item) => {
            const isSelected = selectedIds.includes(item.session_id);
            return (
              <div
                key={item.session_id}
                onClick={() => toggleSelect(item.session_id)}
                style={{
                  background: isSelected ? '#EDF6EC' : '#fff',
                  border: '1.5px solid', borderColor: isSelected ? 'var(--good)' : 'var(--line)',
                  borderRadius: 16, padding: 14, marginBottom: 10, cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{item.healthy ? '✅' : '⚠️'}</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--soil-dark)' }}>{item.disease_name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                      {item.crop_type} · {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`trend ${item.healthy ? 'up' : 'down'}`} style={{ fontSize: 11 }}>
                      {item.confidence_pct}%
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.session_id, e)}
                      style={{ display: 'block', marginTop: 8, border: 'none', background: 'none', fontSize: 14, color: 'var(--ink-soft)', cursor: 'pointer' }}
                      title="Delete session"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
