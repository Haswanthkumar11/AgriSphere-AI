import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';

const ADMIN_NAV = [
  { key: 'adminDashboard', icon: 'bi-speedometer2', label: 'Dashboard',   route: ROUTES.ADMIN_DASHBOARD },
  { key: 'adminUsers',     icon: 'bi-people',        label: 'Users',       route: ROUTES.ADMIN_USERS },
  { key: 'adminEquipment', icon: 'bi-truck',          label: 'Equipment',   route: ROUTES.ADMIN_EQUIPMENT },
  { key: 'adminAnalytics', icon: 'bi-bar-chart-line', label: 'Analytics',   route: ROUTES.ADMIN_ANALYTICS },
  { key: 'adminHealth',    icon: 'bi-heart-pulse',    label: 'Health',      route: ROUTES.ADMIN_HEALTH },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="brand-icon">🌾</div>
          <div className="brand-title">AgriSphere AI</div>
          <div className="brand-role">Administrator Panel</div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {ADMIN_NAV.map(({ key, icon, label, route }) => (
            <div
              key={route}
              className={`admin-nav-item ${pathname === route ? 'active' : ''}`}
              onClick={() => navigate(route)}
              role="button"
              tabIndex={0}
              aria-label={t(key)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(route)}
            >
              <i className={`bi ${icon} nav-icon`}></i>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10, fontWeight: 600 }}>
            {user?.name || 'Admin'}
          </div>
          <button
            onClick={logout}
            className="btn-secondary btn-sm"
            style={{ width: '100%', background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main screen-enter">
        <Outlet />
      </main>
    </div>
  );
}
