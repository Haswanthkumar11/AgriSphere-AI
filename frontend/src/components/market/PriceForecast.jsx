import { formatCurrency } from '@utils/format';

/**
 * PriceForecast — CSS-only bar chart for 7-day price forecast.
 * points: array of { date, predicted_price, confidence }
 */
export default function PriceForecast({ points = [], title = '7-Day Price Forecast' }) {
  if (!points.length) return null;

  const prices = points.map((p) => p.predicted_price);
  const min = Math.min(...prices) * 0.98;
  const max = Math.max(...prices) * 1.02;
  const range = max - min || 1;

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{title}</div>
      <div className="price-forecast">
        {points.map((p, i) => {
          const heightPct = Math.max(10, ((p.predicted_price - min) / range) * 100);
          return (
            <div key={i} className="forecast-bar-wrap">
              <div className="forecast-bar-price">{(p.predicted_price / 1000).toFixed(1)}K</div>
              <div className="forecast-bar" style={{ height: `${heightPct}%` }} />
              <div className="forecast-bar-label">{DAYS[i] || `D${i + 1}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
