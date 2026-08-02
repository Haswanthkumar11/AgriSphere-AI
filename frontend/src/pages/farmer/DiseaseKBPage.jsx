import { useEffect, useState } from 'react';
import { getKnowledgeBase } from '@api/cropApi';
import PageHeader from '@components/layout/PageHeader';
import DiseaseKnowledgeCard from '@components/farmer/DiseaseKnowledgeCard';
import Loader from '@components/ui/Loader';

export default function DiseaseKBPage() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKnowledgeBase()
      .then((res) => {
        const data = res?.data || res;
        setDiseases(Array.isArray(data) ? data : []);
      })
      .catch(() => setDiseases([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section screen-enter">
      <PageHeader title="Disease Knowledge Base" subtitle="ICAR & KVK Grounded Extension Database" />

      {loading ? (
        <Loader variant="spinner" message="Loading Knowledge Base..." />
      ) : diseases.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fff', borderRadius: 18, border: '1.5px dashed var(--line)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 4 }}>No Disease Manuals Found</h4>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
            Knowledge base entries are currently empty in the database.
          </p>
        </div>
      ) : (
        <div>
          {diseases.map((d) => (
            <DiseaseKnowledgeCard key={d.disease_code} disease={d} />
          ))}
        </div>
      )}
    </div>
  );
}
