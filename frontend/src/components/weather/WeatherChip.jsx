/**
 * WeatherChip — a single day chip in the 7-day strip.
 * alert: boolean — adds alert styling (red background)
 */
export default function WeatherChip({ day, icon, temp, alert = false }) {
  return (
    <div className={`weather-chip ${alert ? 'alert' : ''}`}>
      <div className="day">{day}</div>
      <div className="wic" aria-hidden="true">{icon}</div>
      <div className="temp">{temp}°C</div>
    </div>
  );
}
