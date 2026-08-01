import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROLE_MENUS } from '@constants/permissions';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const adminMenu = ROLE_MENUS.admin || [];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="brand-icon">🛡️</div>
          <div className="brand-title">AgriSphere AI</div>
          <div className="brand-role">Administrator Control Center</div>
        </div>

        {/* Dynamic Admin Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {adminMenu.map(({ label, path, icon }) => (
            <div
              key={path}
              className={`admin-nav-item ${pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(path)}
            >
              <span style={{ fontSize: 16, marginRight: 10 }}>{icon}</span>
              <span style={{ fontWeight: pathname === path ? 800 : 600 }}>{label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontWeight: 700 }}>
            🛡️ {user?.name || 'Administrator'}
          </div>
          <button
            onClick={logout}
            className="btn-secondary btn-sm"
            style={{ width: '100%', background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            Sign Out
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
