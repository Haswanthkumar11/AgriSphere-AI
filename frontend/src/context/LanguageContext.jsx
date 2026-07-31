import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from '@locales/en';
import te from '@locales/te';
import hi from '@locales/hi';
import kn from '@locales/kn';

const languages = { en, te, hi, kn };
const STORAGE_KEY = 'agri_lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'en'
  );

  const dict = useMemo(() => languages[lang] || languages.en, [lang]);

  /** Translate a key. Falls back to the key itself — never throws. */
  const t = useCallback((key) => dict[key] ?? key, [dict]);

  const setLang = useCallback((code) => {
    if (!languages[code]) return;
    localStorage.setItem(STORAGE_KEY, code);
    setLangState(code);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t, dict }), [lang, setLang, t, dict]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Internal hook — use useLang() from hooks/useLang.js instead. */
export function useLanguageContext() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguageContext must be used inside <LanguageProvider>');
  return ctx;
}
