import client from './client';

/** Get current weather for a region. */
export const getCurrentWeather = (region = 'Tirupati') =>
  client.get(`/api/v1/weather/current?region=${encodeURIComponent(region)}`);

/** Get 7-day weather forecast. */
export const getWeatherForecast = (region = 'Tirupati', days = 7) =>
  client.get(`/api/v1/weather/forecast?region=${encodeURIComponent(region)}&days=${days}`);

/** Get weather alerts for a region. */
export const getWeatherAlerts = (region = 'Tirupati') =>
  client.get(`/api/v1/weather/alerts?region=${encodeURIComponent(region)}`);

/** Legacy endpoint — used by existing weather strip on market screen. */
export const getWeatherLegacy = () =>
  client.get('/api/v1/weather');
