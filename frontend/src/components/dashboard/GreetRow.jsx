import { useLang } from '@hooks/useLang';

/**
 * GreetRow — "Namaste, [Name]" + online/offline status pill.
 */
export default function GreetRow({ name = 'Farmer', isOnline = true }) {
  const { t } = useLang();

  return (
    <div className="greet-row">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500, marginBottom: 2 }}>
            {t('hello')}
          </div>
          <div className="greet-name">{name}</div>
        </div>
        <div className={`status-pill ${isOnline ? '' : 'offline'}`} aria-label={isOnline ? t('online') : t('offline')}>
          <span className={isOnline ? 'online-dot' : undefined} style={!isOnline ? { width: 8, height: 8, borderRadius: '50%', background: 'var(--terra)', display: 'inline-block' } : undefined} />
          <span>{isOnline ? t('online') : t('offline')}</span>
        </div>
      </div>
    </div>
  );
}
