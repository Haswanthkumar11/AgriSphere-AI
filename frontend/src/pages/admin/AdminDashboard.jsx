import { useLang } from '@hooks/useLang';
import { formatCompact } from '@utils/format';

const STATS = [
  { key: 'totalFarmers',   value: 2847, sub: '+128 this month', icon: '👨‍🌾' },
  { key: 'totalEquipOwners', value: 184, sub: '+12 this month', icon: '🚜' },
  { key: 'activeBookings', value: 67,  sub: 'Active today',    icon: '📅' },
  { key: 'aiRequests',     value: 1243, sub: 'Scans + predictions', icon: '🤖' },
];

export default function AdminDashboard() {
  const { t } = useLang();

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, color: 'var(--soil-dark)' }}>
        {t('adminDashboard')} — AgriSphere AI
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {STATS.map(({ key, value, sub, icon }) => (
          <div key={key} className="admin-stat-card">
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div className="stat-label">{t(key)}</div>
            <div className="stat-value">{formatCompact(value)}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ color: 'var(--soil-dark)', marginBottom: 14, fontSize: 15 }}>System Status</h3>
        {[
          { label: 'FastAPI Backend',     status: 'Operational', color: 'var(--good)' },
          { label: 'Disease AI Engine',   status: 'Operational', color: 'var(--good)' },
          { label: 'Grain Quality AI',    status: 'Operational', color: 'var(--good)' },
          { label: 'Weather Service',     status: 'Operational', color: 'var(--good)' },
          { label: 'Voice Advisory',      status: 'Simulated',   color: 'var(--warn)' },
          { label: 'Database (SQLite)',   status: 'Operational', color: 'var(--good)' },
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
