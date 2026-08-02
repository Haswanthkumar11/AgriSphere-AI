import { useEffect, useState, useCallback } from 'react';
import { getCurrentWeather, getWeatherForecast } from '@api/weatherApi';

const POPULAR_CITIES = [
  'Tirupati',
  'Vijayawada',
  'Visakhapatnam',
  'Hyderabad',
  'Anantapur',
  'Kurnool',
  'Guntur',
  'Bengaluru',
  'Chennai',
  'Delhi',
  'Mumbai',
];

const LOCAL_STORAGE_CITY_KEY = 'agrisphere_weather_city';

export default function WeatherCard({ cropType = 'Paddy', onCityChange }) {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_CITY_KEY) || 'Tirupati';
  });
  const [customCityInput, setCustomCityInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        getCurrentWeather(city, cropType),
        getWeatherForecast(city),
      ]);

      const currentData = currentRes?.data || currentRes;
      const forecastData = forecastRes?.data || forecastRes;

      if (!currentData || typeof currentData !== 'object') {
        throw new Error('Invalid weather data structure returned');
      }

      setCurrentWeather(currentData);
      setForecast(forecastData?.forecast || []);
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError(err?.message || 'Unable to retrieve live weather data. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [cropType]);

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity, fetchWeatherData]);

  const handleCitySelectChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomMode(true);
      setCustomCityInput('');
    } else {
      setIsCustomMode(false);
      setSelectedCity(val);
      localStorage.setItem(LOCAL_STORAGE_CITY_KEY, val);
      if (onCityChange) onCityChange(val);
    }
  };

  const handleCustomCitySubmit = (e) => {
    e.preventDefault();
    const trimmed = customCityInput.trim();
    if (trimmed) {
      setSelectedCity(trimmed);
      localStorage.setItem(LOCAL_STORAGE_CITY_KEY, trimmed);
      setIsCustomMode(false);
      if (onCityChange) onCityChange(trimmed);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4" id="weather-card-container">
      {/* Card Header & City Selector */}
      <div className="card-header bg-success text-white p-3 p-md-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="h4 mb-0 fw-bold text-white">📡 Live Weather Intelligence</h2>
            {currentWeather && (
              <span className={`badge ${currentWeather.is_live ? 'bg-success text-white border border-light' : 'bg-danger text-white border border-light'} rounded-pill px-2 py-1 small fw-bold`}>
                {currentWeather.status_label || (currentWeather.is_live ? '🟢 LIVE' : '🔴 Offline')}
              </span>
            )}
          </div>
          <p className="mb-0 text-white-50 small d-flex align-items-center gap-2">
            <span>Real-time atmospheric telemetry & Gemini crop advisory</span>
            {currentWeather?.updated_time_str && (
              <span>• Last Updated: <strong>{currentWeather.updated_time_str}</strong></span>
            )}
          </p>
        </div>

        {/* City Selector Controls */}
        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-sm-auto">
          {!isCustomMode ? (
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white bg-opacity-20 text-white border-0">
                <i className="bi bi-geo-alt-fill"></i>
              </span>
              <select
                id="city-select-dropdown"
                className="form-select form-select-sm bg-white text-dark border-0 fw-semibold shadow-none"
                value={POPULAR_CITIES.includes(selectedCity) ? selectedCity : '__custom__'}
                onChange={handleCitySelectChange}
                aria-label="Select City Location"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__custom__">🔍 Search Other City...</option>
              </select>
            </div>
          ) : (
            <form onSubmit={handleCustomCitySubmit} className="d-flex gap-2 w-100">
              <input
                type="text"
                className="form-select form-select-sm bg-white text-dark border-0 fw-semibold"
                placeholder="Enter city name..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-sm btn-light fw-bold text-success px-3">
                Go
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light px-2"
                onClick={() => setIsCustomMode(false)}
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="card-body p-3 p-md-4 bg-light">
        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span className="visually-hidden">Loading weather...</span>
            </div>
            <h5 className="text-muted fw-semibold">Fetching live weather & crop advisory...</h5>
            <p className="small text-muted mb-0">Connecting to OpenWeatherMap & Gemini AI</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 my-2" role="alert">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
              <div>
                <h6 className="fw-bold mb-1">Weather Data Unavailable</h6>
                <p className="small mb-0">{error}</p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-danger px-3 rounded-pill fw-semibold ms-2"
              onClick={() => fetchWeatherData(selectedCity)}
            >
              Retry
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && !currentWeather && (
          <div className="text-center py-5 bg-white rounded-3 border border-dashed">
            <i className="bi bi-cloud-slash fs-1 text-muted"></i>
            <h5 className="mt-2 text-dark">No Weather Data Found</h5>
            <p className="text-muted small">Please select a different city or try searching again.</p>
          </div>
        )}

        {/* CONTENT DISPLAY */}
        {!loading && !error && currentWeather && (
          <div>
            {/* TRANSPARENT OFFLINE NOTICE BANNER */}
            {!currentWeather.is_live && (
              <div className="alert alert-secondary d-flex align-items-center gap-3 p-3 rounded-3 shadow-sm mb-4 border-start border-4 border-secondary">
                <span className="fs-3">🔴</span>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1 text-dark">Live Weather Service Unavailable</div>
                  <div className="small text-muted mb-0">
                    Live OpenWeatherMap API key is not configured or external service is unreachable. Showing agricultural baseline telemetry.
                  </div>
                </div>
              </div>
            )}

            {/* WEATHER ALERTS BANNERS */}
            {Array.isArray(currentWeather.alerts) && currentWeather.alerts.length > 0 && (
              <div className="mb-4">
                {currentWeather.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`alert alert-${alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'} d-flex align-items-start gap-3 p-3 rounded-3 shadow-sm mb-2 border-start border-4 border-${alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}`}
                  >
                    <span className="fs-3">{alert.icon || '⚠️'}</span>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="fw-bold mb-0">{alert.title}</h6>
                        <span className={`badge bg-${alert.severity === 'danger' ? 'danger' : 'warning'} text-dark rounded-pill text-uppercase`}>
                          Active Alert
                        </span>
                      </div>
                      <p className="small mb-1 text-dark">{alert.description}</p>
                      <div className="small fw-semibold text-dark d-flex align-items-center gap-1">
                        <i className="bi bi-arrow-right-circle-fill"></i> Suggested Action: {alert.suggested_action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MAIN CURRENT WEATHER METRICS ROW */}
            <div className="row g-3 align-items-center mb-4">
              {/* Primary Temp & Condition Banner */}
              <div className="col-12 col-md-5 col-lg-4">
                <div className="p-3 bg-white rounded-3 shadow-sm text-center border h-100 d-flex flex-column justify-content-center align-items-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <img
                      src={currentWeather.icon_url}
                      alt={currentWeather.description}
                      width="72"
                      height="72"
                      className="img-fluid"
                    />
                    <div className="text-start">
                      <span className="display-4 fw-extrabold text-dark lh-1">
                        {Math.round(currentWeather.temp_c)}°C
                      </span>
                      <div className="text-muted small fw-semibold">
                        Feels like {Math.round(currentWeather.feels_like_c)}°C
                      </div>
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mt-2 mb-0">
                    {currentWeather.description}
                  </h5>
                  <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill mt-2">
                    📍 {currentWeather.city}, {currentWeather.country}
                  </span>
                </div>
              </div>

              {/* Grid of Key Weather Metrics */}
              <div className="col-12 col-md-7 col-lg-8">
                <div className="row g-2">
                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center border h-100">
                      <div className="text-primary fs-4 mb-1">💧</div>
                      <div className="text-muted small fw-medium">Humidity</div>
                      <div className="fs-5 fw-bold text-dark">{currentWeather.humidity_pct}%</div>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center border h-100">
                      <div className="text-info fs-4 mb-1">💨</div>
                      <div className="text-muted small fw-medium">Wind Speed</div>
                      <div className="fs-5 fw-bold text-dark">{currentWeather.wind_speed_kmh} km/h</div>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center border h-100">
                      <div className="text-primary fs-4 mb-1">🌧️</div>
                      <div className="text-muted small fw-medium">Rain Chance</div>
                      <div className="fs-5 fw-bold text-dark">{currentWeather.rain_probability_pct}%</div>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center border h-100">
                      <div className="text-warning fs-4 mb-1">⏲️</div>
                      <div className="text-muted small fw-medium">Pressure</div>
                      <div className="fs-5 fw-bold text-dark">{currentWeather.pressure_hpa} hPa</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CROP-AWARE AI RECOMMENDATION CARD */}
            {currentWeather.ai_advice && (
              <div className="p-3 p-md-4 bg-white rounded-3 border border-success border-2 shadow-sm mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">🌱</span>
                    <h6 className="fw-bold mb-0 text-dark">
                      Farming Recommendation for{' '}
                      <span className="text-success text-decoration-underline">{currentWeather.ai_advice.crop_type}</span>
                    </h6>
                  </div>
                  <span className={`badge ${currentWeather.ai_advice.is_gemini_generated ? 'bg-gradient bg-success text-white' : 'bg-light text-success border border-success'} px-3 py-1 rounded-pill small`}>
                    {currentWeather.ai_advice.is_gemini_generated ? '✨ Gemini AI Generated' : '📜 ICAR Grounded Advisory'}
                  </span>
                </div>
                <p className="mb-0 text-dark fs-6 lh-base bg-light p-3 rounded-3 border-start border-4 border-success">
                  "{currentWeather.ai_advice.recommendation}"
                </p>
              </div>
            )}

            {/* NEXT 48 HOURS AI WEATHER IMPACT CARD */}
            {currentWeather.ai_advice?.impact_48h && (
              <div className="p-3 p-md-4 bg-light rounded-3 border shadow-sm mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">🌾</span>
                  <h6 className="fw-bold mb-0 text-dark">AI Weather Impact (Next 48 Hours)</h6>
                </div>
                <p className="fw-semibold text-dark mb-3">
                  {currentWeather.ai_advice.impact_48h.summary}
                </p>
                {Array.isArray(currentWeather.ai_advice.impact_48h.actions) && (
                  <div>
                    <div className="small fw-bold text-muted text-uppercase mb-2">Recommended Actions:</div>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                      {currentWeather.ai_advice.impact_48h.actions.map((act, i) => (
                        <li key={i} className="d-flex align-items-start gap-2 bg-white p-2 rounded-2 border">
                          <span className="text-success fw-bold">•</span>
                          <span className="small text-dark fw-medium">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 5-DAY WEATHER FORECAST STRIP */}
            {forecast.length > 0 && (
              <div>
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <span>📅 5-Day Weather Forecast</span>
                  <span className="badge bg-secondary text-white rounded-pill small fw-normal">
                    {currentWeather.city}
                  </span>
                </h6>

                <div className="row g-2 row-cols-2 row-cols-sm-3 row-cols-md-5">
                  {forecast.map((day, idx) => (
                    <div key={idx} className="col">
                      <div className="p-2 p-md-3 bg-white rounded-3 shadow-sm border text-center h-100 hover-elevation transition-all">
                        <div className="fw-bold text-dark mb-1">{day.day_name}</div>
                        <div className="text-muted small mb-2">{day.short_date}</div>
                        <img
                          src={day.icon_url}
                          alt={day.description}
                          width="48"
                          height="48"
                          className="my-1"
                        />
                        <div className="fw-extrabold text-dark fs-6 mb-1">
                          {Math.round(day.temp_max_c)}° / <span className="text-muted">{Math.round(day.temp_min_c)}°C</span>
                        </div>
                        <div className="small text-truncate text-secondary mb-1" title={day.description}>
                          {day.description}
                        </div>
                        <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 small">
                          🌧️ {day.rain_probability_pct}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Telemetry */}
      {currentWeather && (
        <div className="card-footer bg-white border-top p-3 d-flex flex-column flex-sm-row justify-content-between align-items-center text-muted small">
          <div>
            Data Source: <strong className="text-dark">{currentWeather.source || 'OpenWeatherMap'}</strong>
          </div>
          <div>
            Updated: {currentWeather.updated_at ? new Date(currentWeather.updated_at).toLocaleTimeString() : 'Just now'}
          </div>
        </div>
      )}
    </div>
  );
}
