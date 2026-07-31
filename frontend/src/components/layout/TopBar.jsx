import { useLang } from '@hooks/useLang';
import { SUPPORTED_LANGUAGES } from '@constants/crops';
import NotificationBell from '@components/ui/NotificationBell';

/** TopBar — brand mark + notification bell + language toggle. Used by FarmerLayout. */
export default function TopBar({ apiOnline = false }) {
  const { t, lang, setLang } = useLang();

  return (
    <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="brand">
        <div className="brand-mark">🌾</div>
        <div>
          <div className="brand-name">AgriSphere</div>
          <div className="brand-sub">{t('tagline')}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <NotificationBell />

        <div className="lang-toggle">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={lang === l.code ? 'active' : ''}
              onClick={() => setLang(l.code)}
              aria-label={`Switch to ${l.label}`}
            >
              {l.code === 'en' ? 'EN' : l.code === 'te' ? 'తె' : l.code === 'hi' ? 'हि' : 'ಕ'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
