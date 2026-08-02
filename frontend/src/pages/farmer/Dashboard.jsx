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

  const materialQuickActions = [
    { label: '🌾 Diagnose', route: ROUTES.SCAN, icon: '🌿' },
    { label: '☁️ Weather', route: ROUTES.WEATHER, icon: '🌦️' },
    { label: '🎤 Companion', route: '/companion', icon: '🤖' },
    { label: '🚜 Marketplace', route: ROUTES.EQUIPMENT, icon: '🚜' },
    { label: '📈 Prices', route: ROUTES.MARKET, icon: '📊' },
    { label: '📷 Scan Crop', route: ROUTES.SCAN, icon: '📷' },
    { label: '🌱 Grain Quality', route: ROUTES.GRAIN, icon: '🌾' },
    { label: '👤 Profile', route: ROUTES.PROFILE, icon: '⚙️' },
  ];

  return (
    <div className="screen-enter" style={{ paddingBottom: 24 }}>
      {/* Greeting Row */}
      <GreetRow name={user?.name || 'Nikhil'} isOnline={isOnline} />

      {/* Hero Banner — AgriSphere Companion */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          color: '#FFFFFF',
          borderRadius: 22,
          padding: '20px 22px',
          marginBottom: 18,
          boxShadow: '0 10px 30px rgba(46, 125, 50, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
            <span>🌾</span> AgriSphere Companion Active
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
            Welcome {user?.name || 'Nikhil'} — Meet your AgriSphere Companion
          </h2>
          <p style={{ fontSize: 13, opacity: 0.92, margin: 0, maxWidth: 440, lineHeight: 1.4 }}>
            Your Intelligent Farming Companion — Empowering Every Farmer with AI to diagnose crops, check live weather telemetry, and navigate marketplace rentals.
          </p>
        </div>
      </div>

      {/* Live Weather Card Component */}
      <div className="section mb-4">
        <WeatherCard cropType={farmerCrop} />
      </div>

      {/* Material 3 8-Quick Action Grid */}
      <div className="section" style={{ marginBottom: 18 }}>
        <div className="section-header" style={{ marginBottom: 10 }}>
          <span className="eyebrow" style={{ fontSize: 11, fontWeight: 800, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            ⚡ Material 3 Quick Actions
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {materialQuickActions.map((act, idx) => (
            <button
              key={idx}
              onClick={() => navigate(act.route)}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                borderRadius: 16,
                padding: '14px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{act.icon}</div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#263238', lineHeight: 1.2 }}>{act.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Overview — 2×2 Stat Grid */}
      <div className="section">
        <div className="section-header">
          <span className="eyebrow">📊 Platform Telemetry</span>
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
