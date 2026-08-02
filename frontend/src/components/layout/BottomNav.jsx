import { useNavigate, useLocation } from 'react';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';

const NAV_ITEMS = [
  { key: 'navHome', label: 'Home', icon: '🏠', route: ROUTES.DASHBOARD },
  { key: 'navScan', label: 'Diagnose', icon: '📷', route: ROUTES.SCAN },
  { key: 'navVoice', label: 'Voice', icon: '🎤', isCompanion: true },
  { key: 'navWeather', label: 'Weather', icon: '☁️', route: ROUTES.WEATHER },
  { key: 'navProfile', label: 'Profile', icon: '👤', route: ROUTES.PROFILE },
];

/** Fixed bottom navigation bar for all farmer pages with AgriSphere Companion trigger. */
export default function BottomNav({ onOpenCompanion }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useLang();

  return (
    <nav className="bottomnav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        if (item.isCompanion) {
          return (
            <button
              key="nav-voice-companion"
              className="navbtn"
              onClick={onOpenCompanion}
              aria-label="AgriSphere Voice Companion"
            >
              <span className="navic" aria-hidden="true" style={{ fontSize: 20 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        }

        const isCurrent = pathname === item.route;
        return (
          <button
            key={item.route}
            className={`navbtn ${isCurrent ? 'active' : ''}`}
            onClick={() => navigate(item.route)}
            aria-label={t(item.key) || item.label}
            aria-current={isCurrent ? 'page' : undefined}
          >
            <span className="navic" aria-hidden="true">
              {item.icon}
            </span>
            <span>{t(item.key) || item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
