import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@api/resourceApi';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifs = () => {
    getNotifications()
      .then((res) => {
        const data = res?.data || res;
        setUnreadCount(data?.unread_count || 0);
        setNotifications(data?.notifications || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifs();
    const timer = setInterval(fetchNotifs, 12000); // Polling every 12s
    return () => clearInterval(timer);
  }, []);

  const handleRead = (n) => {
    markNotificationRead(n.id).then(fetchNotifs);
    if (n.link_url) {
      setIsOpen(false);
      navigate(n.link_url);
    }
  };

  const handleReadAll = () => {
    markAllNotificationsRead().then(fetchNotifs);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: 20, position: 'relative', padding: '4px 8px', color: 'inherit',
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 2, background: 'var(--bad)',
            color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 5px',
            borderRadius: 999, lineHeight: 1,
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', right: 0, top: 34, width: 300, background: '#fff',
          border: '1.5px solid var(--line)', borderRadius: 16, boxShadow: 'var(--shadow-lg)',
          zIndex: 9999, padding: 12, color: 'var(--soil-dark)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', pb: 8, mb: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 13 }}>Notifications ({unreadCount})</span>
            {unreadCount > 0 && (
              <button onClick={handleReadAll} style={{ background: 'none', border: 'none', color: 'var(--soil)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                Mark All Read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 250, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', padding: 12, textAlign: 'center' }}>No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n)}
                  style={{
                    padding: 8, borderRadius: 8, marginBottom: 6, cursor: 'pointer',
                    background: n.is_read ? 'var(--paper-dim)' : '#EDF6EC',
                    fontSize: 12, borderLeft: `3px solid ${n.is_read ? 'var(--line)' : 'var(--good)'}`,
                  }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--soil-dark)' }}>{n.title}</div>
                  <div style={{ color: 'var(--ink)', marginTop: 2 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 4 }}>
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
