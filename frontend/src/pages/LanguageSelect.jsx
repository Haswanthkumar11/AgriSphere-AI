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
    <div className="lang-select-page">
      <div style={{ fontSize: 52, marginBottom: 16 }}>🌾</div>
      <h1>AgriSphere AI</h1>
      <p>{t('chooseLanguageSub')}</p>

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
    </div>
  );
}
