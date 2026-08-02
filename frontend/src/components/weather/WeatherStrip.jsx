import WeatherChip from './WeatherChip';

/**
 * WeatherStrip — horizontally scrollable forecast row.
 * days: array of { day_label, icon, temp_c, heat_alert }
 */
export default function WeatherStrip({ days }) {
  const displayDays = days?.length
    ? days.map((d) => ({
        day: d.day_label || d.date,
        icon: d.icon,
        temp: d.temp_c || d.temp,
        alert: d.heat_alert || d.rain_alert || false,
      }))
    : [];

  if (!displayDays.length) {
    return (
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', padding: '10px 0', textAlign: 'center' }}>
        Forecast data unavailable
      </div>
    );
  }

  return (
    <div
      className="weather-strip no-scrollbar"
      role="list"
      aria-label="Forecast strip"
    >
      {displayDays.map((d, i) => (
        <WeatherChip key={i} {...d} />
      ))}
    </div>
  );
}
