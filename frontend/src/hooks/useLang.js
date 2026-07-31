import { useLanguageContext } from '@context/LanguageContext';

/** Short-form hook: const { t, lang, setLang } = useLang() */
export function useLang() {
  return useLanguageContext();
}
