import { formatCurrency, formatTrend } from '@utils/format';

/** PriceCard — single crop price row with trend pill. */
export default function PriceCard({ crop, icon, price, trendPercent, mandi }) {
  const isUp = trendPercent >= 0;

  return (
    <div className="info-card">
      <div className="row1">
        <div className="crop">{icon} {crop}</div>
        <div className={`trend ${isUp ? 'up' : 'down'}`}>
          {formatTrend(trendPercent)}
        </div>
      </div>
      <div className="sub">
        {formatCurrency(price)} / quintal · {mandi}
      </div>
    </div>
  );
}
