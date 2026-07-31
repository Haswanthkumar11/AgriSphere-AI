import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import GreetRow from '@components/dashboard/GreetRow';
import AdvisoryBanner from '@components/dashboard/AdvisoryBanner';
import { getFarmerBookings, getNotifications } from '@api/resourceApi';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch dashboard summaries
    getFarmerBookings()
      .then((res) => setBookingsCount(res.data?.length || 0))
      .catch(() => {});

    getNotifications()
      .then((res) => setUnreadNotifs(res.data?.unread_count || 0))
      .catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="screen-enter" style={{ paddingBottom: 24 }}>
      {/* Greeting Row */}
      <GreetRow name={user?.name || 'Ramesh'} isOnline={isOnline} />

      {/* Unified Platform Executive Overview Grid */}
      <div className="section" style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div onClick={() => navigate(ROUTES.WEATHER)} style={{ background: '#EAEFFF', border: '1.5px solid #A6C2F0', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#2B4A8E', textTransform: 'uppercase' }}>Today's Weather</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--soil-dark)', marginTop: 4 }}>☀️ 31°C</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Sunny • Tirupati</div>
          </div>

          <div onClick={() => navigate(ROUTES.SCAN)} style={{ background: '#EDF6EC', border: '1.5px solid #BFE0BE', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--good)', textTransform: 'uppercase' }}>Crop Health</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--soil-dark)', marginTop: 4 }}>🟢 Healthy</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Last scan: 2 hrs ago</div>
          </div>

          <div onClick={() => navigate(ROUTES.GRAIN)} style={{ background: '#FFF3D6', border: '1.5px solid #F0CFA6', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--warn)', textTransform: 'uppercase' }}>Harvest Quality</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--soil-dark)', marginTop: 4 }}>🌟 Grade A</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Moisture: 10–12%</div>
          </div>

          <div onClick={() => navigate(ROUTES.BOOKINGS)} style={{ background: '#FBEAE5', border: '1.5px solid #F0BCA9', borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--bad)', textTransform: 'uppercase' }}>Rentals & Alerts</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--soil-dark)', marginTop: 4 }}>🚜 {bookingsCount} Bookings</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>🔔 {unreadNotifs} Unread Notifs</div>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="section" style={{ marginTop: 8 }}>
        <AdvisoryBanner
          icon="🌡️"
          title={t('advTitle')}
          body={t('advBody')}
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="section">
        <div className="section-title">
          <h2>⚡ Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => navigate(ROUTES.SCAN)} className="btn-farmer btn-farmer-primary" style={{ padding: 14, justifyContent: 'center', fontSize: 13 }}>
            📷 Scan Crop Disease
          </button>
          <button onClick={() => navigate(ROUTES.GRAIN)} className="btn-farmer btn-farmer-primary" style={{ padding: 14, justifyContent: 'center', fontSize: 13, background: 'var(--wheat-deep)' }}>
            🌾 Grain Quality Check
          </button>
          <button onClick={() => navigate(ROUTES.EQUIPMENT)} className="btn-farmer btn-farmer-outline" style={{ padding: 14, justifyContent: 'center', fontSize: 13 }}>
            🚜 Rent Equipment
          </button>
          <button onClick={() => navigate(ROUTES.WEATHER)} className="btn-farmer btn-farmer-outline" style={{ padding: 14, justifyContent: 'center', fontSize: 13 }}>
            ☁ Check Weather Forecast
          </button>
        </div>
      </div>

      {/* Recent Activity summary */}
      <div className="section" style={{ marginTop: 12 }}>
        <div className="section-title">
          <span className="eyebrow">RECENT PLATFORM ACTIVITY</span>
        </div>
        <div className="info-card">
          <div className="row1">
            <div className="crop">🍅 <span>Tomato Scan • Early Blight (Recovering)</span></div>
            <div className="trend up">Passed</div>
          </div>
          <div className="sub">Passport ID: GRN-2026-00012 • Paddy Grade A</div>
        </div>
      </div>
    </div>
  );
}
