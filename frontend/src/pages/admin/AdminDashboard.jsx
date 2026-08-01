import { useState, useEffect } from 'react';
import { useLang } from '@hooks/useLang';
import { formatCompact } from '@utils/format';
import { getAdminStats } from '@api/authApi';
import Skeleton from '@components/ui/Skeleton';

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState({
    totalFarmers: 1,
    totalEquipOwners: 0,
    activeBookings: 0,
    aiRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        const data = res?.data || res;
        if (data) {
          setStats({
            totalFarmers: data.totalFarmers || 1,
            totalEquipOwners: data.totalEquipOwners || 0,
            activeBookings: data.activeBookings || 0,
            aiRequests: data.aiRequests || 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { key: 'totalFarmers',     value: stats.totalFarmers,     sub: 'Registered Database Farmers', icon: '👨‍🌾' },
    { key: 'totalEquipOwners', value: stats.totalEquipOwners, sub: 'Verified Equipment Owners',   icon: '🚜' },
    { key: 'activeBookings',   value: stats.activeBookings,   sub: 'Active Rental Bookings',       icon: '📅' },
    { key: 'aiRequests',       value: stats.aiRequests,       sub: 'AI Scans & Predictions',       icon: '🤖' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, color: 'var(--soil-dark)' }}>
        {t('adminDashboard')} — AgriSphere AI
      </h2>

      {loading ? (
        <Skeleton height={120} style={{ borderRadius: 16, marginBottom: 28 }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {statCards.map(({ key, value, sub, icon }) => (
            <div key={key} className="admin-stat-card">
              <div style={{ fontSize: 28 }}>{icon}</div>
              <div className="stat-label">{t(key)}</div>
              <div className="stat-value">{formatCompact(value)}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ color: 'var(--soil-dark)', marginBottom: 14, fontSize: 15 }}>System Status</h3>
        {[
          { label: 'FastAPI Backend',         status: 'Operational', color: 'var(--good)' },
          { label: 'YOLOv8 + Vision Engine',  status: 'Operational', color: 'var(--good)' },
          { label: 'Gemini LLM Advisory',     status: 'Operational', color: 'var(--good)' },
          { label: 'ChromaDB RAG Engine',     status: 'Operational', color: 'var(--good)' },
          { label: 'PostgreSQL Database',     status: 'Operational', color: 'var(--good)' },
        ].map(({ label, status, color }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
            <span style={{ fontSize: 13, color: 'var(--ink)' }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
