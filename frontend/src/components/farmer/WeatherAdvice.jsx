/** Farmer UI Component: Weather Advice Card */
export default function WeatherAdvice({ icon = '⛅', title, advice, priority = 'normal' }) {
  const isHigh = priority === 'high';
  return (
    <div className={`result-card ${isHigh ? 'warn' : 'good'}`} style={{ marginTop: 0, marginBottom: 12 }}>
      <div className="result-head">
        <div className="ic">{icon}</div>
        <div>
          <div className="t1">{title}</div>
          <div className="t2">{isHigh ? 'High Priority Action' : 'Farming Guidance'}</div>
        </div>
      </div>
      <div className="result-body">{advice}</div>
    </div>
  );
}
