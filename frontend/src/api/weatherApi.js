import client from './client';

/** Get current weather for a city with crop-aware AI recommendation. */
export const getCurrentWeather = (city = 'Tirupati', crop = 'Paddy') =>
  client.get(`/api/v1/weather/current?city=${encodeURIComponent(city)}&crop=${encodeURIComponent(crop)}`);

/** Get 5-day weather forecast. */
export const getWeatherForecast = (city = 'Tirupati') =>
  client.get(`/api/v1/weather/forecast?city=${encodeURIComponent(city)}`);

/** Get weather alerts for a city. */
export const getWeatherAlerts = (city = 'Tirupati') =>
  client.get(`/api/v1/weather/alerts?city=${encodeURIComponent(city)}`);

/** Legacy endpoint — used by existing weather strip on market screen. */
export const getWeatherLegacy = () =>
  client.get('/api/v1/weather');
