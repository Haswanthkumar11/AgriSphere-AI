import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { ROUTES } from '@constants/routes';
import { registerUser } from '@api/authApi';
import FieldSet from '@components/forms/FieldSet';

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
  'Andhra Pradesh': ['Tirupati', 'Chittoor', 'Visakhapatnam', 'NTR (Vijayawada)', 'Guntur', 'Kurnool', 'Anantapur', 'SPS Nellore', 'YSR Kadapa', 'Kakinada', 'Eluru', 'Prakasam (Ongole)', 'Srikakulam', 'Vizianagaram', 'East Godavari', 'West Godavari', 'Anakapalli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Mahabubnagar', 'Medchal-Malkajgiri', 'Sangareddy', 'Nalgonda', 'Adilabad', 'Siddipet', 'Suryapet', 'Rangareddy', 'Mancherial', 'Jagtial'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Belagavi', 'Hubballi-Dharwad', 'Tumakuru', 'Mandya', 'Hassan', 'Davanagere', 'Ballari', 'Kalaburagi', 'Vijayapura', 'Shivamogga', 'Udupi', 'Dakshina Kannada'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Cuddalore', 'Tiruppur'],
  'Maharashtra': ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Satara', 'Ahmednagar'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Gurdaspur', 'Sangrur'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Yamunanagar', 'Kurukshetra'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Ghaziabad', 'Meerut', 'Gorakhpur', 'Mathura', 'Bareilly'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Rohtas', 'Begusarai', 'Nalanda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara', 'Sikar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Satna', 'Rewa', 'Dewas'],
  'West Bengal': ['Kolkata', 'Howrah', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas', 'Darjeeling', 'Murshidabad', 'Nadia'],
  'Kerala': ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Kottayam'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Balasore', 'Bhadrak', 'Berhampur'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'],
};

export default function Register() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialized completely empty without default sample values
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    crop_type: '',
    state: '',
    district: '',
    land_size_acres: '',
  });

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm((f) => {
      const updated = { ...f, [key]: val };
      // Reset district if state changes
      if (key === 'state') {
        updated.district = '';
      }
      return updated;
    });
  };

  const isFormValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword &&
    form.crop_type &&
    form.state &&
    form.district &&
    form.land_size_acres;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.crop_type) {
      setError('Please select your primary crop.');
      return;
    }
    if (!form.state) {
      setError('Please select your state.');
      return;
    }
    if (!form.district) {
      setError('Please select your district.');
      return;
    }
    if (!form.land_size_acres || parseFloat(form.land_size_acres) <= 0) {
      setError('Please enter your farm size in acres.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
        region: `${form.district}, ${form.state}`,
        crop_type: form.crop_type,
        land_size_acres: parseFloat(form.land_size_acres),
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = form.state ? INDIAN_STATES_DISTRICTS[form.state] || [] : [];

  return (
    <div className="auth-page" style={{ padding: '24px 16px 60px' }}>
      <div className="auth-card" style={{ maxWidth: 520, borderRadius: 24, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}>
        {/* Brand Header */}
        <div className="auth-logo">
          <div className="mark" style={{ fontSize: 32 }}>🌾</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2E7D32', margin: 0 }}>AgriSphere AI</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Create your farmer account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 16 }}>
            {/* Account Credentials */}
            <FieldSet label={<span>Full Name <span style={{ color: '#D32F2F' }}>*</span></span>}>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Enter your full name"
                required
                style={{ borderRadius: 12, padding: '12px 14px', fontSize: 14 }}
              />
            </FieldSet>

            <FieldSet label={<span>Phone Number <span style={{ color: '#D32F2F' }}>*</span></span>}>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="Enter your mobile number"
                required
                style={{ borderRadius: 12, padding: '12px 14px', fontSize: 14 }}
              />
            </FieldSet>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldSet label={<span>Password <span style={{ color: '#D32F2F' }}>*</span></span>}>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Create a strong password"
                  required
                  style={{ borderRadius: 12, padding: '12px 14px', fontSize: 14 }}
                />
              </FieldSet>

              <FieldSet label={<span>Confirm Password <span style={{ color: '#D32F2F' }}>*</span></span>}>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="Re-enter your password"
                  required
                  style={{ borderRadius: 12, padding: '12px 14px', fontSize: 14 }}
                />
              </FieldSet>
            </div>

            {/* Mandatory Farmer Details Header */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#2E7D32',
                borderBottom: '2px solid #E8F5E9',
                paddingBottom: 6,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              🌱 Farmer Details
            </div>

            {/* Crop Selection */}
            <FieldSet label={<span>Primary Crop <span style={{ color: '#D32F2F' }}>*</span></span>}>
              <select
                value={form.crop_type}
                onChange={set('crop_type')}
                required
                style={{ borderRadius: 12, padding: '12px 14px', fontSize: 14, background: '#FFFFFF', cursor: 'pointer' }}
              >
                <option value="" disabled>Select your primary crop</option>
                {CROPS_LIST.map((crop) => (
                  <option key={crop.value} value={crop.value}>
                    {crop.label}
                  </option>
                ))}
              </select>
            </FieldSet>

            {/* Dependent Location Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldSet label={<span>State <span style={{ color: '#D32F2F' }}>*</span></span>}>
                <select
                  value={form.state}
                  onChange={set('state')}
                  required
                  style={{ borderRadius: 12, padding: '12px 14px', fontSize: 14, background: '#FFFFFF', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select your state</option>
                  {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </FieldSet>

              <FieldSet label={<span>District / Region <span style={{ color: '#D32F2F' }}>*</span></span>}>
                <select
                  value={form.district}
                  onChange={set('district')}
                  disabled={!form.state}
                  required
                  style={{
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    background: form.state ? '#FFFFFF' : '#F3F4F6',
                    cursor: form.state ? 'pointer' : 'not-allowed',
                  }}
                >
                  <option value="" disabled>
                    {form.state ? 'Select your district' : 'Select state first'}
                  </option>
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </FieldSet>
            </div>

            {/* Farm Size */}
            <FieldSet label={<span>Farm Size <span style={{ color: '#D32F2F' }}>*</span></span>}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={form.land_size_acres}
                  onChange={set('land_size_acres')}
                  placeholder="Enter farm size in acres"
                  min="0.1"
                  step="0.1"
                  required
                  style={{ borderRadius: 12, padding: '12px 70px 12px 14px', fontSize: 14, width: '100%' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#2E7D32',
                    background: '#E8F5E9',
                    padding: '4px 10px',
                    borderRadius: 8,
                  }}
                >
                  Acres
                </span>
              </div>
            </FieldSet>
          </div>

          {/* Validation Error Alert */}
          {error && (
            <div
              className="error-alert"
              style={{
                marginTop: 16,
                borderRadius: 12,
                padding: '12px 14px',
                background: '#FFEBEE',
                border: '1px solid #FFCDD2',
                color: '#D32F2F',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Registration Submit Button */}
          <button
            type="submit"
            className="btn-primary btn-lg"
            disabled={loading || !isFormValid}
            style={{
              marginTop: 20,
              width: '100%',
              borderRadius: 14,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 800,
              background: isFormValid ? 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' : '#9E9E9E',
              cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
              boxShadow: isFormValid ? '0 6px 20px rgba(46, 125, 50, 0.3)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {loading ? '⏳ Creating Account…' : '🌱 Create Account'}
          </button>
        </form>

        {/* Why do we ask for these details? — Trust Info Card */}
        <div
          style={{
            marginTop: 24,
            background: '#F7FAF5',
            border: '1.5px solid #C8E6C9',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1B5E20', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            🛡️ Why do we ask for these details?
          </div>
          <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, display: 'grid', gap: 6 }}>
            <div>🌾 <strong>Crop:</strong> Personalized disease detection and recommendations.</div>
            <div>📍 <strong>State & District:</strong> Accurate weather and local market prices.</div>
            <div>🚜 <strong>Farm Size:</strong> Better AI recommendations and fertilizer planning.</div>
            <div style={{ marginTop: 4, color: '#2E7D32', fontWeight: 700 }}>
              🔒 Your information is secure and used only to improve your farming experience.
            </div>
          </div>
        </div>

        <div className="divider-label" style={{ margin: '20px 0 12px' }}>already have an account?</div>

        <button
          className="btn-secondary"
          onClick={() => navigate(ROUTES.LOGIN)}
          style={{ borderRadius: 12, width: '100%', padding: '12px', fontSize: 14, fontWeight: 700 }}
        >
          {t('haveAccount')} {t('loginHere')}
        </button>
      </div>
    </div>
  );
}
