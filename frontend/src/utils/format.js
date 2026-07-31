/** Pure formatting utilities — no React, no API. */

/** Format number as Indian Rupees. e.g. 1840 → "₹1,840" */
export const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

/** Format a float as a percentage with sign. e.g. 6.2 → "▲ 6.2%" */
export const formatTrend = (percent) => {
  const abs = Math.abs(Number(percent)).toFixed(1);
  return percent >= 0 ? `▲ ${abs}%` : `▼ ${abs}%`;
};

/** Shorten large numbers. e.g. 1500 → "1.5K", 1200000 → "1.2M" */
export const formatCompact = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

/** Convert ISO date string to readable label. e.g. "Mon" */
export const formatDayLabel = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
};

/** Clamp confidence value to a readable percentage string */
export const formatConfidence = (score) =>
  `${Math.round(Number(score))}%`;
