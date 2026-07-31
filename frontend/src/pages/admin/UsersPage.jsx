import { useLang } from '@hooks/useLang';

const DEMO_USERS = [
  { id: 'usr_001', name: 'Ramesh Kumar',   phone: '+919876543210', role: 'farmer',           district: 'Tirupati',   status: 'active' },
  { id: 'usr_002', name: 'Lakshmi Devi',   phone: '+919876543211', role: 'equipment_owner',  district: 'Nellore',    status: 'active' },
  { id: 'usr_003', name: 'Venkat Rao',     phone: '+919876543212', role: 'farmer',           district: 'Chittoor',   status: 'active' },
  { id: 'usr_004', name: 'Suresh Reddy',   phone: '+919876543213', role: 'equipment_owner',  district: 'Tirupati',   status: 'active' },
  { id: 'usr_005', name: 'Ravi Kumar',     phone: '+919876543214', role: 'both',             district: 'Kadapa',     status: 'inactive' },
];

const ROLE_LABELS = { farmer: 'Farmer 👨‍🌾', equipment_owner: 'Equipment Owner 🚜', both: 'Both 🌾', admin: 'Admin 🛡️' };
const STATUS_COLOR = { active: 'var(--good)', inactive: 'var(--ink-soft)' };

export default function UsersPage() {
  const { t } = useLang();

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, color: 'var(--soil-dark)' }}>
        {t('adminUsers')}
      </h2>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--paper-dim)' }}>
              {['Name', 'Phone', 'Role', 'District', 'Status'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMO_USERS.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{u.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink-soft)' }}>{u.phone}</td>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>{ROLE_LABELS[u.role]}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{u.district}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[u.status] }}>● {u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
