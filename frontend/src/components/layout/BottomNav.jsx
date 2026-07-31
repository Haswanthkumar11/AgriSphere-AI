import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';

const NAV_ITEMS = [
  { key: 'navHome',    icon: '🏠', route: ROUTES.DASHBOARD },
  { key: 'navScan',    icon: '📷', route: ROUTES.SCAN },
  { key: 'navWeather', icon: '☁',  route: ROUTES.WEATHER },
  { key: 'navEquip',   icon: '🚜', route: ROUTES.EQUIPMENT },
  { key: 'navProfile', icon: '👤', route: ROUTES.PROFILE },
];

/** Fixed bottom navigation bar for all farmer pages. */
export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useLang();

  return (
    <nav className="bottomnav" aria-label="Main navigation">
      {NAV_ITEMS.map(({ key, icon, route }) => (
        <button
          key={route}
          className={`navbtn ${pathname === route ? 'active' : ''}`}
          onClick={() => navigate(route)}
          aria-label={t(key)}
          aria-current={pathname === route ? 'page' : undefined}
        >
          <span className="navic" aria-hidden="true">{icon}</span>
          <span>{t(key)}</span>
        </button>
      ))}
    </nav>
  );
}
