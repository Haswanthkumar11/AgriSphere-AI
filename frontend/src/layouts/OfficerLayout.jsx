import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROLE_MENUS } from '@constants/permissions';

export default function OfficerLayout() {
  const { logout, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const officerMenu = ROLE_MENUS.officer || [];

  return (
    <div className="admin-layout" style={{ background: '#F4F7F5' }}>
      {/* Extension Officer Sidebar */}
      <aside className="admin-sidebar" style={{ background: 'linear-gradient(180deg, #14532D 0%, #166534 100%)' }}>
        {/* Brand */}
        <div className="admin-sidebar-brand" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div className="brand-icon" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>🌾</div>
          <div className="brand-title">AgriSphere AI</div>
          <div className="brand-role" style={{ color: '#86EFAC' }}>Extension Officer Portal</div>
        </div>

        {/* Dynamic Officer Navigation */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {officerMenu.map(({ label, path, icon }) => (
            <div
              key={path}
              className={`admin-nav-item ${pathname === path ? 'active' : ''}`}
              onClick={() => navigate(path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(path)}
              style={{
                background: pathname === path ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: '#fff',
                borderRadius: 10,
                margin: '4px 10px',
                padding: '10px 14px',
              }}
            >
              <span style={{ fontSize: 16, marginRight: 10 }}>{icon}</span>
              <span style={{ fontWeight: pathname === path ? 800 : 600 }}>{label}</span>
            </div>
          ))}
        </nav>

        {/* Officer Profile Footer */}
        <div className="admin-sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: 12, color: '#DCFCE7', marginBottom: 2, fontWeight: 800 }}>
            👨‍💼 {user?.name || 'Sandya'}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
            Extension Officer • Tirupati District
          </div>
          <button
            onClick={logout}
            className="btn-secondary btn-sm"
            style={{ width: '100%', background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Extension Officer Workspace Content */}
      <main className="admin-main screen-enter" style={{ background: '#F4F7F5', minHeight: '100vh', padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
