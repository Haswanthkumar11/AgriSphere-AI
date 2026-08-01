import { useState, useEffect } from 'react';
import { useLang } from '@hooks/useLang';
import { getUsers } from '@api/authApi';
import Skeleton from '@components/ui/Skeleton';

const ROLE_LABELS = { farmer: 'Farmer 👨‍🌾', owner: 'Equipment Owner 🚜', officer: 'Extension Officer 🌾', admin: 'Admin 🛡️' };
const STATUS_COLOR = { active: 'var(--good)', inactive: 'var(--ink-soft)' };

export default function UsersPage() {
  const { t } = useLang();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((res) => {
        const data = res?.data || res;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, color: 'var(--soil-dark)' }}>
        {t('adminUsers')}
      </h2>

      {loading && <Skeleton height={140} count={2} style={{ borderRadius: 14, marginBottom: 12 }} />}

      {!loading && (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Name', 'Phone', 'Role', 'Region', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--ink-soft)' }}>
                    No users found in database.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{u.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink-soft)' }}>{u.phone}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12 }}>{ROLE_LABELS[u.role] || u.role}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{u.region || 'Tirupati, AP'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[u.status] || 'var(--good)' }}>
                        ● {u.status || 'active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
