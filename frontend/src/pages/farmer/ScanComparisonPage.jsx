import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compareSessions } from '@api/cropApi';
import PageHeader from '@components/layout/PageHeader';
import ScanComparisonCard from '@components/farmer/ScanComparisonCard';
import Loader from '@components/ui/Loader';

const MOCK_COMPARISON = {
  session_a: { id: 'ses_001', date: '2026-07-24T10:00:00', disease_name: 'Early Blight', severity: 'moderate', affected_area_pct: 18.5 },
  session_b: { id: 'ses_002', date: '2026-07-31T10:00:00', disease_name: 'Early Blight', severity: 'mild', affected_area_pct: 6.2 },
  comparison_metrics: {
    area_delta_pct: -12.3,
    trend: 'improved',
    trend_label: 'Disease Recovering 🎉',
    recommendation: 'Treatment is working effectively. Continue current spray protocol for 3 more days.',
  },
};

export default function ScanComparisonPage() {
  const [params] = useSearchParams();
  const s1 = params.get('s1');
  const s2 = params.get('s2');

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (s1 && s2) {
      compareSessions(s1, s2)
        .then((res) => setComparison(res))
        .catch(() => setComparison(MOCK_COMPARISON))
        .finally(() => setLoading(false));
    } else {
      setComparison(MOCK_COMPARISON);
      setLoading(false);
    }
  }, [s1, s2]);

  return (
    <div className="section screen-enter">
      <PageHeader title="Side-by-Side Progression" subtitle="Track disease recovery or spread over time" />

      {loading ? (
        <Loader variant="spinner" message="Comparing scan sessions..." />
      ) : (
        <ScanComparisonCard comparison={comparison} />
      )}
    </div>
  );
}
