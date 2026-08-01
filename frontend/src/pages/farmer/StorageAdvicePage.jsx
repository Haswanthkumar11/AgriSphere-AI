import { useState, useEffect } from 'react';
import PageHeader from '@components/layout/PageHeader';
import Skeleton from '@components/ui/Skeleton';
import { getHarvestKnowledgeBase } from '@api/harvestApi';

export default function StorageAdvicePage() {
  const [kb, setKb] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHarvestKnowledgeBase()
      .then((res) => {
        const data = res?.data || res;
        setKb(Array.isArray(data) ? data : []);
      })
      .catch(() => setKb([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader title="📦 Storage Advice & Grain Guide" subtitle="Official AGMARK grain guidelines & warehouse best practices" />

      {loading && <Skeleton height={140} count={2} style={{ borderRadius: 14, marginBottom: 12 }} />}

      {!loading && kb.map((item, idx) => (
        <div key={idx} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 8 }}>
            🌾 {item.crop_type} AGMARK Quality Standard
          </h3>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 10 }}>{item.government_mandate}</p>

          <div style={{ background: 'var(--paper-dim)', padding: 12, borderRadius: 12, fontSize: 12, marginBottom: 10 }}>
            <strong>Max Moisture Allowance:</strong> {item.quality_parameters?.max_moisture_pct}% | 
            <strong> Max Broken:</strong> {item.quality_parameters?.max_broken_pct}% | 
            <strong> Max Foreign Matter:</strong> {item.quality_parameters?.max_foreign_matter_pct}%
          </div>

          <div style={{ fontSize: 12 }}>
            <strong>Storage Best Practices:</strong>
            {Array.isArray(item.storage_best_practices) && item.storage_best_practices.map((p, i) => (
              <div key={i}>• {p}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
