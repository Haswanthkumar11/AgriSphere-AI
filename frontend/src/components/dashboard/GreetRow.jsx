import { useLang } from '@hooks/useLang';

/**
 * GreetRow — "Namaste, [Name]" + online/offline status pill.
 */
export default function GreetRow({ name = 'Farmer', isOnline = true }) {
  const { t } = useLang();

  return (
    <div className="greet-row">
      <div>
        <div className="hello">{t('hello')}</div>
        <div className="name">{name}</div>
      </div>
      <div className={`status-pill ${isOnline ? '' : 'offline'}`} aria-label={isOnline ? t('online') : t('offline')}>
        <span className="status-dot" />
        <span>{isOnline ? t('online') : t('offline')}</span>
      </div>
    </div>
  );
}
