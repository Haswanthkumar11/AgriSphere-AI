import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';

const CROPS_LIST = [
  { value: 'Paddy', label: '🌾 Paddy / Rice' },
  { value: 'Rice', label: '🌾 Rice' },
  { value: 'Cotton', label: '☁️ Cotton' },
  { value: 'Maize', label: '🌽 Maize' },
  { value: 'Wheat', label: '🌾 Wheat' },
  { value: 'Tomato', label: '🍅 Tomato' },
  { value: 'Chilli', label: '🌶️ Chilli' },
  { value: 'Sugarcane', label: '🎋 Sugarcane' },
  { value: 'Groundnut', label: '🥜 Groundnut' },
  { value: 'Soybean', label: '🫘 Soybean' },
  { value: 'Sunflower', label: '🌻 Sunflower' },
  { value: 'Onion', label: '🧅 Onion' },
  { value: 'Potato', label: '🥔 Potato' },
  { value: 'Banana', label: '🍌 Banana' },
  { value: 'Mango', label: '🥭 Mango' },
  { value: 'Other', label: '🌱 Other Crop' },
];

const INDIAN_STATES_DISTRICTS = {
  'Andhra Pradesh': ['West Godavari', 'Tirupati', 'Chittoor', 'Visakhapatnam', 'NTR (Vijayawada)', 'Guntur', 'Kurnool', 'Anantapur', 'SPS Nellore', 'YSR Kadapa', 'Kakinada', 'Eluru', 'Prakasam (Ongole)', 'Srikakulam', 'Vizianagaram', 'East Godavari'],
  'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Mahabubnagar', 'Medchal-Malkajgiri', 'Sangareddy', 'Nalgonda', 'Adilabad', 'Siddipet', 'Suryapet'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Belagavi', 'Hubballi-Dharwad', 'Tumakuru', 'Mandya', 'Hassan', 'Davanagere', 'Ballari'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur'],
  'Maharashtra': ['Mumbai City', 'Pune', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Solapur', 'Amravati', 'Kolhapur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Gorakhpur'],
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
];

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { setLang } = useLang();

  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [village, setVillage] = useState(user?.village || '');
  const [preferredLang, setPreferredLang] = useState(user?.language || 'en');
  const [cropType, setCropType] = useState(user?.crop_type || 'Paddy');
  const [farmSize, setFarmSize] = useState(user?.land_size || 2.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!state) {
      setError('Please select your State.');
      return;
    }
    if (!district) {
      setError('Please select your District.');
      return;
    }

    setLoading(true);

    // Save profile locally and in user context
    const updatedUser = {
      ...user,
      state,
      district,
      village,
      region: `${district}, ${state}`,
      language: preferredLang,
      crop_type: cropType,
      land_size: parseFloat(farmSize) || 1.0,
    };

    localStorage.setItem('agrisphere_user', JSON.stringify(updatedUser));
    localStorage.setItem('agrisphere_weather_city', district);
    setLang(preferredLang);

    if (login) {
      login(updatedUser);
    }

    setLoading(false);
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const availableDistricts = state ? INDIAN_STATES_DISTRICTS[state] || [] : [];

  return (
    <div className="screen-enter" style={{ padding: '24px 16px 60px', maxWidth: 540, margin: '0 auto' }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1.5px solid #C8E6C9',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🌱</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#2E7D32', margin: '0 0 6px' }}>
            Complete Your Farmer Profile
          </h2>
          <p style={{ fontSize: 13, color: '#4B5563', margin: 0 }}>
            Location and crop details are required to fetch live weather telemetry and AI agricultural guidance.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          {/* State */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              State <span style={{ color: '#D32F2F' }}>*</span>
            </label>
            <select
              value={state}
              onChange={handleStateChange}
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, background: '#FFFFFF' }}
            >
              <option value="" disabled>Select State</option>
              {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              District <span style={{ color: '#D32F2F' }}>*</span>
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1.5px solid #E5E7EB',
                fontSize: 14,
                background: state ? '#FFFFFF' : '#F3F4F6',
              }}
            >
              <option value="" disabled>{state ? 'Select District' : 'Select State First'}</option>
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Village / Mandal (Optional)
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Tanuku / Bhimavaram"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14 }}
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Preferred Language <span style={{ color: '#D32F2F' }}>*</span>
            </label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, background: '#FFFFFF' }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Primary Crop */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Primary Crop <span style={{ color: '#D32F2F' }}>*</span>
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, background: '#FFFFFF' }}
            >
              {CROPS_LIST.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Farm Size */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Farm Size (Acres) <span style={{ color: '#D32F2F' }}>*</span>
            </label>
            <input
              type="number"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              min="0.1"
              step="0.1"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14 }}
            />
          </div>

          {error && (
            <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
              marginTop: 10,
            }}
          >
            {loading ? '⏳ Saving Profile...' : '🌱 Complete & Open Dashboard ➔'}
          </button>
        </form>
      </div>
    </div>
  );
}
