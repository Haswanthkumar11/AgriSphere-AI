import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';

const ADMIN_NAV = [
  { key: 'adminDashboard', icon: '📊', route: ROUTES.ADMIN_DASHBOARD },
  { key: 'adminUsers',     icon: '👥', route: ROUTES.ADMIN_USERS },
  { key: 'adminEquipment', icon: '🚜', route: ROUTES.ADMIN_EQUIPMENT },
  { key: 'adminAnalytics', icon: '📈', route: ROUTES.ADMIN_ANALYTICS },
  { key: 'adminHealth',    icon: '❤️', route: ROUTES.ADMIN_HEALTH },
];

/** AdminLayout — sidebar + main content area. */
export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🌾</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>AgriSphere</div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>Administrator</div>
        </div>

        <nav style={{ marginTop: 16 }}>
          {ADMIN_NAV.map(({ key, icon, route }) => (
            <div
              key={route}
              className={`admin-nav-item ${pathname === route ? 'active' : ''}`}
              onClick={() => navigate(route)}
              role="button"
              tabIndex={0}
              aria-label={t(key)}
            >
              <span>{icon}</span>
              <span>{t(key)}</span>
            </div>
          ))}
        </nav>

        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, padding: '0 20px' }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>{user?.name || 'Admin'}</div>
          <button
            onClick={logout}
            style={{
              background: 'rgba(217,164,65,0.15)', border: 'none', color: 'var(--wheat)',
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%',
            }}
          >
            {t('logoutBtn')}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
