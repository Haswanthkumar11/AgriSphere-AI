import { useEffect, useState } from 'react';
import { useLang } from '@hooks/useLang';
import { getCurrentWeather, getWeatherForecast, getWeatherAlerts } from '@api/weatherApi';
import PageHeader from '@components/layout/PageHeader';
import WeatherStrip from '@components/weather/WeatherStrip';
import WeatherAlert from '@components/weather/WeatherAlert';
import AdvisoryBanner from '@components/dashboard/AdvisoryBanner';
import Loader from '@components/ui/Loader';

// Static data for demo/offline mode
const STATIC_WEATHER = {
  temp_c: 36, feels_like_c: 40, humidity_pct: 58,
  wind_kmh: 12, uv_index: 8.2, rain_probability_pct: 15,
  condition: 'Partly cloudy', icon: '⛅',
};

const STATIC_ALERTS = [
  {
    type: 'HEATWAVE', severity: 'high',
    title: 'Heatwave Warning',
    description: 'Temperatures expected to reach 41°C over the next 3 days.',
    suggestedAction: 'Water crops early morning or after sunset.',
    aiAdvice: 'Consider mulching to retain soil moisture.',
  },
];

export default function WeatherPage() {
  const { t } = useLang();
  const [current, setCurrent]   = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [curr, fore, alrt] = await Promise.all([
          getCurrentWeather('Tirupati'),
          getWeatherForecast('Tirupati'),
          getWeatherAlerts('Tirupati'),
        ]);
        setCurrent(curr?.current || STATIC_WEATHER);
        setForecast(fore?.forecast || []);
        setAlerts(alrt?.alerts || STATIC_ALERTS);
      } catch {
        setCurrent(STATIC_WEATHER);
        setAlerts(STATIC_ALERTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const w = current || STATIC_WEATHER;

  return (
    <div className="section screen-enter">
      <PageHeader title={t('weatherTitle')} subtitle={t('weatherSub')} />

      {loading ? (
        <Loader variant="spinner" message={t('loading')} />
      ) : (
        <>
          {/* Current conditions card */}
          <div className="result-card good" style={{ marginBottom: 16, marginTop: 0 }}>
            <div className="result-head">
              <div className="ic" style={{ fontSize: 36 }}>{w.icon || '⛅'}</div>
              <div>
                <div className="t1" style={{ fontSize: 28 }}>{w.temp_c}°C</div>
                <div className="t2">{w.condition || 'Partly cloudy'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 0', marginTop: 8 }}>
              {[
                { label: t('feelsLike'), val: `${w.feels_like_c || w.temp_c + 4}°C` },
                { label: t('humidity'), val: `${w.humidity_pct || 58}%` },
                { label: t('windSpeed'), val: `${w.wind_kmh || 12} km/h` },
                { label: t('uvIndex'), val: `${w.uv_index || 8.2}` },
                { label: t('rainChance'), val: `${w.rain_probability_pct || 15}%` },
              ].map(({ label, val }) => (
                <div key={label} className="metric-row" style={{ border: 'none', padding: '4px 0' }}>
                  <span className="label">{label}</span>
                  <span className="value">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t('weatherAlerts')}</div>
              {alerts.map((a, i) => (
                <WeatherAlert key={i} {...a} suggestedAction={a.suggested_action || a.suggestedAction} aiAdvice={a.ai_advice || a.aiAdvice} />
              ))}
            </div>
          )}

          {/* 7-day forecast */}
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('weatherEyebrow')}</div>
          <WeatherStrip days={forecast} />

          {/* Farming advisory */}
          <AdvisoryBanner icon="🛰️" title={t('ndviTitle')} body={t('ndviBody')} />

          <div style={{ marginTop: 14 }}>
            <AdvisoryBanner
              icon="🌱"
              title={t('farmingAdvisory')}
              body={`Water your tomato crop before 7am or after 6pm during the heatwave period.`}
            />
          </div>
        </>
      )}
    </div>
  );
}
