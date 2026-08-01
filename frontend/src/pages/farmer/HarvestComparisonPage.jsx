import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '@components/layout/PageHeader';
import QualityComparisonCard from '@components/farmer/QualityComparisonCard';
import Skeleton from '@components/ui/Skeleton';
import { compareHarvests } from '@api/harvestApi';

export default function HarvestComparisonPage() {
  const [params] = useSearchParams();
  const id1 = params.get('id1');
  const id2 = params.get('id2');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id1 && id2) {
      compareHarvests(id1, id2)
        .then((res) => {
          const data = res?.data || res;
          setComparison(data);
        })
        .catch((err) => setError(err?.response?.data?.detail || 'Failed to compare harvest sessions.'))
        .finally(() => setLoading(false));
    } else {
      setError('Please select two harvest sessions from history to compare.');
      setLoading(false);
    }
  }, [id1, id2]);

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader title="📊 Compare Grain Quality" subtitle="Side-by-side progression & quality metrics delta" />

      {loading && <Skeleton height={220} style={{ borderRadius: 18 }} />}

      {error && <div className="advisory-banner error">⚠️ {error}</div>}

      {comparison && !loading && <QualityComparisonCard comparison={comparison} />}
    </div>
  );
}
