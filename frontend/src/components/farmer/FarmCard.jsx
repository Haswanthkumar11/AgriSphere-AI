/** Farmer UI Component: Farm Overview Card */
export default function FarmCard({ farmerName, location, totalLand, primaryCrop }) {
  return (
    <div className="result-card good" style={{ marginTop: 0, marginBottom: 14 }}>
      <div className="result-head">
        <div className="ic">🏡</div>
        <div>
          <div className="t1">{farmerName}'s Farm</div>
          <div className="t2">{location}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13 }}>
        <span><strong>Land Size:</strong> {totalLand} acres</span>
        <span><strong>Primary Crop:</strong> {primaryCrop}</span>
      </div>
    </div>
  );
}
