import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import GreetRow from '@components/dashboard/GreetRow';
import AdvisoryBanner from '@components/dashboard/AdvisoryBanner';
import { getFarmerBookings, getNotifications } from '@api/resourceApi';

const STAT_CARDS = (navigate, bookingsCount, unreadNotifs) => [
  {
    label: "Today's Weather",
    value: '☀️ 31°C',
    sub: 'Sunny · Tirupati',
    color: 'blue',
    icon: '🌤️',
    route: ROUTES.WEATHER,
  },
  {
    label: 'Crop Health',
    value: '🟢 Healthy',
    sub: 'Last scan: 2 hrs ago',
    color: 'green',
    icon: '🌿',
    route: ROUTES.SCAN,
  },
  {
    label: 'Harvest Quality',
    value: '⭐ Grade A',
    sub: 'Moisture: 10–12%',
    color: 'amber',
    icon: '🌾',
    route: ROUTES.GRAIN,
  },
  {
    label: 'Equipment & Alerts',
    value: `🚜 ${bookingsCount} Bookings`,
    sub: `🔔 ${unreadNotifs} Unread Notifications`,
    color: 'red',
    icon: '📋',
    route: ROUTES.BOOKINGS,
  },
];

const QUICK_ACTIONS = (navigate) => [
  { label: 'Scan Crop Disease', icon: '📷', route: ROUTES.SCAN, variant: 'primary' },
  { label: 'Grain Quality Check', icon: '🌾', route: ROUTES.GRAIN, variant: 'amber' },
  { label: 'Rent Equipment', icon: '🚜', route: ROUTES.EQUIPMENT, variant: '' },
  { label: 'Weather Forecast', icon: '☁️', route: ROUTES.WEATHER, variant: '' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);

    getFarmerBookings()
      .then((res) => setBookingsCount(res.data?.length || 0))
      .catch(() => {});

    getNotifications()
      .then((res) => setUnreadNotifs(res.data?.unread_count || 0))
      .catch(() => {});

    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const stats = STAT_CARDS(navigate, bookingsCount, unreadNotifs);
  const actions = QUICK_ACTIONS(navigate);

  return (
    <div className="screen-enter">
      {/* Greeting */}
      <GreetRow name={user?.name || 'Farmer'} isOnline={isOnline} />

      {/* Platform Overview — 2×2 Stat Grid */}
      <div className="section">
        <div className="section-header">
          <span className="eyebrow">📊 Platform Overview</span>
        </div>
        <div className="dashboard-grid-2">
          {stats.map((card) => (
            <div
              key={card.label}
              className={`stat-card ${card.color}`}
              onClick={() => navigate(card.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(card.route)}
            >
              <div className="sc-label">{card.label}</div>
              <div className="sc-value">{card.value}</div>
              <div className="sc-sub">{card.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Advisory Banner */}
      <div className="section">
        <AdvisoryBanner
          icon="🌡️"
          title={t('advTitle')}
          body={t('advBody')}
        />
      </div>

      {/* Quick Actions — 2×2 Grid */}
      <div className="section">
        <div className="section-header">
          <span className="eyebrow">⚡ Quick Actions</span>
        </div>
        <div className="dashboard-grid-2">
          {actions.map((action) => (
            <button
              key={action.route}
              className={`quick-action-btn ${action.variant}`}
              onClick={() => navigate(action.route)}
            >
              <span className="qab-icon">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <div className="section-header">
          <span className="eyebrow">🕐 Recent Activity</span>
        </div>
        <div className="info-card">
          <div className="row1">
            <div className="crop">🍅 Tomato Scan · Early Blight (Recovering)</div>
            <span className="badge-as good">Passed</span>
          </div>
          <div className="sub">Passport ID: GRN-2026-00012 · Paddy Grade A</div>
        </div>
      </div>
    </div>
  );
}
