import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { compareSessions } from '@api/cropApi';
import PageHeader from '@components/layout/PageHeader';
import ScanComparisonCard from '@components/farmer/ScanComparisonCard';
import Loader from '@components/ui/Loader';

export default function ScanComparisonPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const s1 = params.get('s1');
  const s2 = params.get('s2');

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (s1 && s2) {
      compareSessions(s1, s2)
        .then((res) => {
          const data = res?.data || res;
          setComparison(data);
        })
        .catch(() => setComparison(null))
        .finally(() => setLoading(false));
    } else {
      setComparison(null);
      setLoading(false);
    }
  }, [s1, s2]);

  return (
    <div className="section screen-enter">
      <PageHeader title="Side-by-Side Progression" subtitle="Track disease recovery or spread over time" />

      {loading ? (
        <Loader variant="spinner" message="Comparing scan sessions..." />
      ) : comparison ? (
        <ScanComparisonCard comparison={comparison} />
      ) : (
        <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fff', borderRadius: 18, border: '1.5px dashed var(--line)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 4 }}>No Comparison Selected</h4>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 auto 16px', maxWidth: 360 }}>
            Select any 2 historical crop scans from your Scan History page to compare leaf health progression side-by-side.
          </p>
          <button onClick={() => navigate('/crop/history')} className="btn-farmer btn-farmer-primary" style={{ width: 'auto', padding: '8px 18px', fontSize: 13 }}>
            📋 Go to Scan History
          </button>
        </div>
      )}
    </div>
  );
}
