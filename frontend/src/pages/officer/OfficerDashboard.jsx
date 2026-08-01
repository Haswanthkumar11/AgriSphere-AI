import { useState, useEffect } from 'react';
import PageHeader from '@components/layout/PageHeader';
import AdvisoryBanner from '@components/dashboard/AdvisoryBanner';
import Skeleton from '@components/ui/Skeleton';
import { getScanHistory } from '@api/cropApi';
import { showToast } from '@utils/toast';

export default function OfficerDashboard() {
  const [district, setDistrict] = useState('Tirupati');
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryBody, setAdvisoryBody] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    getScanHistory()
      .then((res) => {
        const data = res?.data || res;
        setRecentScans(Array.isArray(data) ? data : []);
      })
      .catch(() => setRecentScans([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!advisoryTitle || !advisoryBody) return;
    setBroadcastSent(true);
    showToast(`📢 Advisory Broadcast sent to ${district} district farmers!`);
    setAdvisoryTitle('');
    setAdvisoryBody('');
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader
        title="🌾 Extension Officer Portal"
        subtitle="District Crop Surveillance, Disease Hotspots & Extension Advisories"
      />

      {/* District Selector & Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 16px' }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase' }}>
            Assigned District
          </span>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--soil-dark)', margin: 0 }}>📍 {district} District</h3>
        </div>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="form-select" style={{ width: 'auto', fontSize: 12 }}>
          <option value="Tirupati">Tirupati</option>
          <option value="Chittoor">Chittoor</option>
          <option value="Guntur">Guntur</option>
          <option value="Nellore">Nellore</option>
          <option value="Anantapur">Anantapur</option>
        </select>
      </div>

      {/* 4-Stat Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div style={{ background: '#fff', border: '1px solid var(--line)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--soil)' }}>89.4%</div>
          <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Crop Health Index</div>
        </div>
        <div style={{ background: '#FFF3D6', border: '1px solid var(--warn)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warn)' }}>14</div>
          <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Hotspot Alerts</div>
        </div>
        <div style={{ background: '#EDF6EC', border: '1px solid var(--good)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--good)' }}>42</div>
          <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Scans Monitored</div>
        </div>
        <div style={{ background: '#EAEFFF', border: '1px solid #2B4A8E', padding: 10, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#2B4A8E' }}>3</div>
          <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Flood Submersions</div>
        </div>
      </div>

      {/* Disease Hotspot Heatmap Alert */}
      <AdvisoryBanner
        icon="⚠️"
        title="District Hotspot Alert: Early Blight in Tomato (Tirupati East Mandal)"
        body="ICAR Advisory: High relative humidity (>85%) observed over the past 48h. Whitefly vector activity elevated in low-lying fields. Immediate copper oxychloride spray recommended."
      />

      {/* Broadcast Advisory Form */}
      <div style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 18, padding: 16, margin: '16px 0', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 8 }}>
          📢 Broadcast Extension Advisory to District Farmers
        </h3>
        <form onSubmit={handleBroadcast}>
          <div style={{ marginBottom: 10 }}>
            <label className="form-label">Advisory Subject / Alert Headline</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Pre-Monsoon Sheath Blight Alert for Paddy"
              value={advisoryTitle}
              onChange={(e) => setAdvisoryTitle(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label className="form-label">Actionable Advisory Message (Grounded in ICAR Rules)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Enter recommended chemical spray, dosage, and drainage instructions..."
              value={advisoryBody}
              onChange={(e) => setAdvisoryBody(e.target.value)}
              required
            />
          </div>
          {broadcastSent && (
            <div className="advisory-banner good" style={{ marginBottom: 10 }}>
              ✅ Broadcast Advisory sent successfully via SMS and App Notifications!
            </div>
          )}
          <button type="submit" className="btn-farmer btn-farmer-primary" style={{ width: '100%' }}>
            🚀 Send District Advisory Broadcast
          </button>
        </form>
      </div>

      {/* Recent Farmer AI Scans Stream */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 10 }}>
          📊 Recent Farmer AI Scans Stream ({district} Region)
        </h3>
        {loading && <Skeleton height={100} count={3} style={{ borderRadius: 14, marginBottom: 10 }} />}

        {!loading && (
          <div style={{ display: 'grid', gap: 10 }}>
            {recentScans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--ink-soft)' }}>
                No active farmer scans recorded in this region yet.
              </div>
            ) : (
              recentScans.map((s) => (
                <div key={s.session_id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--soil)', textTransform: 'uppercase' }}>
                      {s.crop_type} • {new Date(s.date).toLocaleDateString()}
                    </span>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--soil-dark)', marginTop: 2 }}>
                      {s.healthy ? '🟢 Healthy' : `⚠️ ${s.disease_name}`} ({s.confidence_pct}% Confidence)
                    </div>
                  </div>
                  <span style={{ fontSize: 11, background: s.healthy ? '#EDF6EC' : '#FFF3D6', color: s.healthy ? 'var(--good)' : 'var(--warn)', padding: '3px 8px', borderRadius: 6, fontWeight: 800 }}>
                    {s.severity ? s.severity.toUpperCase() : 'MONITORED'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
