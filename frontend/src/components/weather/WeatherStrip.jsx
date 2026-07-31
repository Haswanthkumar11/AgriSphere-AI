import WeatherChip from './WeatherChip';

/** Default 7-day strip for when the API is offline. */
const STATIC_DAYS = [
  { day: 'Thu', icon: '🥵', temp: 41, alert: true },
  { day: 'Fri', icon: '🥵', temp: 40, alert: true },
  { day: 'Sat', icon: '☀️', temp: 36, alert: false },
  { day: 'Sun', icon: '⛅', temp: 33, alert: false },
  { day: 'Mon', icon: '🌦️', temp: 30, alert: false },
  { day: 'Tue', icon: '🌦️', temp: 29, alert: false },
  { day: 'Wed', icon: '☀️', temp: 32, alert: false },
];

/**
 * WeatherStrip — horizontally scrollable 7-day forecast row.
 * days: array of { day_label, icon, temp_c, heat_alert }
 *       Falls back to static data if not provided.
 */
export default function WeatherStrip({ days }) {
  const displayDays = days?.length
    ? days.map((d) => ({
        day: d.day_label,
        icon: d.icon,
        temp: d.temp_c,
        alert: d.heat_alert || d.rain_alert || false,
      }))
    : STATIC_DAYS;

  return (
    <div
      className="weather-strip no-scrollbar"
      role="list"
      aria-label="7-day weather forecast"
    >
      {displayDays.map((d, i) => (
        <WeatherChip key={i} {...d} />
      ))}
    </div>
  );
}
