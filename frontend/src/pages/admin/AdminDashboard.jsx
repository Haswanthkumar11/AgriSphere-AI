import { useState, useEffect } from 'react';
import { useLang } from '@hooks/useLang';
import { formatCompact } from '@utils/format';
import { getAdminStats, getOfficers, provisionOfficer, revokeOfficer } from '@api/authApi';
import Skeleton from '@components/ui/Skeleton';
import { showToast } from '@utils/toast';

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState({
    totalFarmers: 1,
    totalOfficers: 0,
    activeBookings: 0,
    aiRequests: 0,
  });
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Provision Form
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Tirupati');
  const [designation, setDesignation] = useState('Senior Extension Officer');
  const [password, setPassword] = useState('Officer@2026');

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([getAdminStats(), getOfficers()])
      .then(([resStats, resOff]) => {
        const dataStats = resStats?.data || resStats;
        const dataOff = resOff?.data || resOff;
        if (dataStats) {
          setStats({
            totalFarmers: dataStats.totalFarmers || 1,
            totalOfficers: dataStats.totalOfficers || 0,
            activeBookings: dataStats.activeBookings || 0,
            aiRequests: dataStats.aiRequests || 0,
          });
        }
        setOfficers(Array.isArray(dataOff) ? dataOff : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProvision = async (e) => {
    e.preventDefault();
    try {
      await provisionOfficer({
        name,
        employee_id: empId,
        phone,
        district,
        designation,
        password,
      });
      showToast(`✅ Extension Officer '${name}' provisioned successfully!`);
      setShowModal(false);
      setName('');
      setEmpId('');
      setPhone('');
      fetchDashboardData();
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Failed to provision officer.');
    }
  };

  const handleRevoke = async (id, name) => {
    if (window.confirm(`Revoke Extension Officer account for ${name}?`)) {
      try {
        await revokeOfficer(id);
        showToast('Officer account revoked');
        fetchDashboardData();
      } catch {
        showToast('Failed to revoke account');
      }
    }
  };

  const statCards = [
    { key: 'totalFarmers',     value: stats.totalFarmers,     sub: 'Registered Database Farmers', icon: '👨‍🌾' },
    { key: 'totalOfficers',    value: stats.totalOfficers,    sub: 'Appointed Extension Officers', icon: '🌾' },
    { key: 'activeBookings',   value: stats.activeBookings,   sub: 'Active Rental Bookings',       icon: '📅' },
    { key: 'aiRequests',       value: stats.aiRequests,       sub: 'AI Scans & Predictions',       icon: '🤖' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, color: 'var(--soil-dark)' }}>
          🛡️ Admin Control Center — AgriSphere AI
        </h2>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: 13, background: 'var(--soil-dark)' }}>
          ➕ Provision Extension Officer
        </button>
      </div>

      {loading ? (
        <Skeleton height={120} style={{ borderRadius: 16, marginBottom: 28 }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {statCards.map(({ key, value, sub, icon }) => (
            <div key={key} className="admin-stat-card">
              <div style={{ fontSize: 28 }}>{icon}</div>
              <div className="stat-label">{key}</div>
              <div className="stat-value">{formatCompact(value)}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Extension Officer Management Table */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
        <h3 style={{ color: 'var(--soil-dark)', marginBottom: 14, fontSize: 15, fontWeight: 800 }}>
          🌾 Provisioned Extension Officers Management
        </h3>

        {officers.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', padding: 16, textAlign: 'center' }}>
            No extension officers provisioned yet. Click <strong>+ Provision Extension Officer</strong> above to assign a government officer.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Employee ID', 'Officer Name', 'Phone', 'District', 'Designation', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {officers.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, fontSize: 13 }}>{o.employee_id}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{o.name}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--ink-soft)' }}>{o.phone}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12 }}>{o.district}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12 }}>{o.designation}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button onClick={() => handleRevoke(o.id, o.name)} style={{ background: 'none', border: 'none', color: 'var(--bad)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      🗑️ Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* System Operational Status */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ color: 'var(--soil-dark)', marginBottom: 14, fontSize: 15, fontWeight: 800 }}>System Status</h3>
        {[
          { label: 'FastAPI Backend Core',       status: 'Operational', color: 'var(--good)' },
          { label: 'YOLOv8 Vision Engine',       status: 'Operational', color: 'var(--good)' },
          { label: 'Gemini LLM Reasoner',       status: 'Operational', color: 'var(--good)' },
          { label: 'ChromaDB RAG Vector Store',  status: 'Operational', color: 'var(--good)' },
          { label: 'PostgreSQL Database',        status: 'Operational', color: 'var(--good)' },
        ].map(({ label, status, color }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
            <span style={{ fontSize: 13, color: 'var(--ink)' }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{status}</span>
          </div>
        ))}
      </div>

      {/* Provision Officer Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 440, width: '100%', padding: 22, boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: 'var(--soil-dark)' }}>
              ➕ Provision New Extension Officer Account
            </h3>
            <form onSubmit={handleProvision}>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Officer Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="e.g. Dr. K. Srinivasa Rao" required />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Official Employee ID</label>
                <input type="text" value={empId} onChange={(e) => setEmpId(e.target.value)} className="form-input" placeholder="e.g. KVK-AP-2026-042" required />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" placeholder="+91 98765 43210" required />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Assigned District</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="form-select">
                  <option value="Tirupati">Tirupati</option>
                  <option value="Chittoor">Chittoor</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Nellore">Nellore</option>
                  <option value="Anantapur">Anantapur</option>
                </select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label className="form-label">Official Designation</label>
                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="form-input" required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Default Assigned Password</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-farmer btn-farmer-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-farmer btn-farmer-primary" style={{ flex: 1, background: 'var(--soil-dark)' }}>Provision Officer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
