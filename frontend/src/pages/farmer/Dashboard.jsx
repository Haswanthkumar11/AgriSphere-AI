import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import GreetRow from '@components/dashboard/GreetRow';
import AdvisoryBanner from '@components/dashboard/AdvisoryBanner';
import WeatherCard from '@components/farmer/WeatherCard';
import { getFarmerBookings, getNotifications } from '@api/resourceApi';
import { getCurrentWeather } from '@api/weatherApi';
import { getScanHistory } from '@api/cropApi';
import { getHarvestHistory } from '@api/harvestApi';

const STAT_CARDS = (navigate, bookingsCount, unreadNotifs, weatherSummary, latestScan, latestHarvest) => [
  {
    label: "Today's Weather",
    value: weatherSummary ? `${weatherSummary.temp_c}°C` : '☀️ --°C',
    sub: weatherSummary ? `${weatherSummary.description} · ${weatherSummary.city}` : 'Loading location...',
    color: 'blue',
    icon: '🌤️',
    route: ROUTES.WEATHER,
  },
  {
    label: 'Crop Health',
    value: latestScan ? (latestScan.healthy ? '🟢 Healthy' : `⚠️ ${latestScan.disease_name}`) : '🟢 Untested',
    sub: latestScan ? `Last scan: ${new Date(latestScan.date || latestScan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No scans performed yet',
    color: 'green',
    icon: '🌿',
    route: ROUTES.SCAN,
  },
  {
    label: 'Harvest Quality',
    value: latestHarvest ? `⭐ Grade ${latestHarvest.grade || 'A'}` : '🌾 Untested',
    sub: latestHarvest ? `Moisture: ${latestHarvest.moisture_pct || '11'}%` : 'No grain checks yet',
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
  const [weatherSummary, setWeatherSummary] = useState(null);
  const [latestScan, setLatestScan] = useState(null);
  const [latestHarvest, setLatestHarvest] = useState(null);

  const farmerCrop = user?.crop_type || user?.crop || 'Paddy';
  const userId = user?.id || 'usr_demo';

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);

    const savedCity = localStorage.getItem('agrisphere_weather_city') || 'Tirupati';
    getCurrentWeather(savedCity, farmerCrop)
      .then((res) => {
        const data = res?.data || res;
        if (data && data.temp_c) {
          setWeatherSummary({
            temp_c: Math.round(data.temp_c),
            description: data.description,
            city: data.city,
          });
        }
      })
      .catch(() => {});

    getScanHistory(userId)
      .then((res) => {
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setLatestScan(data[0]);
        }
      })
      .catch(() => {});

    getHarvestHistory(userId)
      .then((res) => {
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setLatestHarvest(data[0]);
        }
      })
      .catch(() => {});

    getFarmerBookings()
      .then((res) => {
        const data = res?.data || res;
        setBookingsCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => {});

    getNotifications()
      .then((res) => {
        const data = res?.data || res;
        setUnreadNotifs(data?.unread_count || 0);
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [farmerCrop, userId]);

  const stats = STAT_CARDS(navigate, bookingsCount, unreadNotifs, weatherSummary, latestScan, latestHarvest);
  const actions = QUICK_ACTIONS(navigate);

  return (
    <div className="screen-enter">
      {/* Greeting */}
      <GreetRow name={user?.name || 'Farmer'} isOnline={isOnline} />

      {/* Live Weather Card Component */}
      <div className="section mb-4">
        <WeatherCard cropType={farmerCrop} />
      </div>

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

      {/* Recent Activity — Database-Driven */}
      <div className="section">
        <div className="section-header">
          <span className="eyebrow">🕐 Recent Activity</span>
        </div>
        {latestScan || latestHarvest ? (
          <div className="info-card">
            {latestScan && (
              <div className="mb-2">
                <div className="row1">
                  <div className="crop">
                    {latestScan.crop_type === 'Tomato' ? '🍅' : '🌾'} {latestScan.crop_type} Scan · {latestScan.healthy ? 'Healthy Leaf' : latestScan.disease_name}
                  </div>
                  <span className={`badge-as ${latestScan.healthy ? 'good' : 'warn'}`}>
                    {latestScan.healthy ? 'Passed' : 'Action Required'}
                  </span>
                </div>
                <div className="sub">
                  Scan ID: {latestScan.session_id ? latestScan.session_id.substring(0, 14) : 'AI-SESSION'} · Confidence: {latestScan.confidence_pct}%
                </div>
              </div>
            )}
            {latestHarvest && (
              <div className={latestScan ? 'border-top pt-2 mt-2' : ''}>
                <div className="row1">
                  <div className="crop">
                    🌾 {latestHarvest.crop_type || 'Grain'} Quality Check · Grade {latestHarvest.grade || 'A'}
                  </div>
                  <span className="badge-as good">Grade Verified</span>
                </div>
                <div className="sub">
                  Passport ID: {latestHarvest.passport_id || 'GRN-PASSPORT'} · Moisture: {latestHarvest.moisture_pct || '11'}%
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="info-card text-center py-4 bg-white rounded-3 border">
            <div className="fs-3 text-muted mb-1">🌱</div>
            <h6 className="fw-bold text-dark mb-1">No Recent Activity Yet</h6>
            <p className="small text-muted mb-0">
              Perform your first crop disease scan or grain quality check to start tracking database activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
