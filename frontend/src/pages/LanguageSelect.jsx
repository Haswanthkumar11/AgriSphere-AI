import { useNavigate } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { SUPPORTED_LANGUAGES } from '@constants/crops';
import { ROUTES } from '@constants/routes';

export default function LanguageSelect() {
  const { setLang, t } = useLang();
  const navigate = useNavigate();

  const handleSelect = (code) => {
    setLang(code);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="lang-select-page screen-enter">
      {/* Hero Brand */}
      <div className="hero-icon">🌾</div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'var(--soil)', marginBottom: 6 }}>
        AgriSphere AI
      </h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 8, maxWidth: 300 }}>
        {t('chooseLanguageSub')}
      </p>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#DCFCE7', borderRadius: 20, padding: '5px 14px',
        fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 36,
      }}>
        <span>🌐</span> Select your language to continue
      </div>

      <div className="lang-btn-grid">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className="lang-btn"
            onClick={() => handleSelect(lang.code)}
            aria-label={`Select ${lang.label}`}
          >
            <span className="lang-flag" aria-hidden="true">{lang.flag}</span>
            <span className="lang-name">{lang.nativeLabel}</span>
            <span className="lang-sub">{lang.label}</span>
          </button>
        ))}
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: 'var(--ink-soft)', opacity: 0.7 }}>
        AgriSphere AI v2.0 · Hackathon Edition
      </p>
    </div>
  );
}
