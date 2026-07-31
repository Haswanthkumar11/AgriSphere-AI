/**
 * AgriSphere AI — English (en) translations
 * All keys must be present in every language file.
 * New keys go here first, then translated in te.js / hi.js / kn.js.
 */
const en = {
  // ── App ──
  appName: 'AgriSphere AI',
  tagline: 'Your farm, one app',
  chooseLanguage: 'Choose Your Language',
  chooseLanguageSub: 'Select your preferred language to continue',

  // ── Auth ──
  farmerLogin: 'Farmer Login',
  adminLogin: 'Administrator Login',
  loginBtn: 'Login',
  registerBtn: 'Register',
  phone: 'Phone Number',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  fullName: 'Full Name',
  email: 'Email (Optional)',
  district: 'District',
  village: 'Village',
  state: 'State',
  role: 'I am a...',
  roleFarmer: 'Farmer',
  roleEquipOwner: 'Equipment Owner',
  roleBoth: 'Both',
  noAccount: "Don't have an account?",
  haveAccount: 'Already have an account?',
  loginHere: 'Login here',
  registerHere: 'Register here',
  adminLoginLink: 'Administrator? Login here',
  logoutBtn: 'Logout',

  // ── Navigation ──
  navHome: 'Home',
  navScan: 'Scan',
  navWeather: 'Weather',
  navEquip: 'Rent',
  navProfile: 'Profile',

  // ── Dashboard ──
  hello: 'Namaste,',
  online: 'Online',
  offline: 'Offline',
  modulesTitle: 'What do you need today?',
  eyebrowRecent: 'Recent activity',
  recentScan: 'Tomato leaf scan',
  recentHealthy: 'Healthy',
  recentTime: '2 hours ago · Field 2',

  advTitle: 'Heatwave warning — Tirupati region',
  advBody: 'Temperatures rising to 41°C over next 3 days. Water tomato crops early morning or evening.',

  m1title: '📷 Scan Crop',
  m1sub: 'Detect disease instantly',
  m2title: '☁ Today\'s Weather',
  m2sub: 'Forecast & alerts',
  m3title: '🌾 Harvest Prediction',
  m3sub: 'Estimate your yield',
  m4title: '🌾 Grain Quality',
  m4sub: 'Check quality & fair price',
  m5title: '🚜 Rent Equipment',
  m5sub: 'Tractors near you',
  m6title: '📈 Market Prices',
  m6sub: 'Mandi prices & trend',

  scanCtaTitle: 'Scan a crop leaf',
  scanCtaSub: 'Works with no internet — instant result',

  // ── Scan Page ──
  scanTitle: 'Crop Health Scan',
  scanSub: 'Point camera at an affected leaf',
  edgeBadge: 'Running on-device — no data used',
  serverBadge: 'Server CV analysis (FastAPI + OpenCV)',
  scanBtn: '📸 Capture & Analyze',
  diseaseTitle: 'Early Blight detected',
  diseaseBody: 'Fungal infection on lower leaves. Spray copper-based fungicide within 48 hours. Remove and destroy infected leaves.',
  healthyTitle: 'Leaf looks healthy',
  healthyBody: 'No signs of disease detected. Keep monitoring weekly.',
  voiceTitle: 'Voice alert queued',
  voiceBody: 'Sending WhatsApp voice note to your phone',

  // ── Weather Page ──
  weatherTitle: '☁ Today\'s Weather',
  weatherSub: 'Live forecast & farming alerts',
  weatherEyebrow: '7-day outlook',
  currentWeather: 'Current Conditions',
  feelsLike: 'Feels like',
  humidity: 'Humidity',
  windSpeed: 'Wind',
  uvIndex: 'UV Index',
  rainChance: 'Rain chance',
  farmingAdvisory: 'Farming Advisory',
  weatherAlerts: 'Weather Alerts',
  ndviTitle: 'Satellite check: Field 2 stressed',
  ndviBody: 'NDVI dropped 14% this week — sign of water stress. Consider irrigation.',

  // ── Yield Prediction Page ──
  yieldTitle: '🌾 Harvest Prediction',
  yieldSub: 'AI-powered yield estimation',
  cropLabel: 'Crop',
  soilType: 'Soil Type',
  farmSize: 'Farm Size (acres)',
  season: 'Season',
  irrigationType: 'Irrigation Type',
  fertilizerType: 'Fertilizer Type',
  predictBtn: '🌾 Predict My Harvest',
  estimatedYield: 'Estimated Yield',
  yieldPerAcre: 'Per Acre',
  confidenceScore: 'Confidence',
  aiExplanation: 'AI Explanation',
  improvementTips: 'Improvement Tips',
  estimatedRevenue: 'Estimated Revenue',
  factorsTitle: 'Key Factors',

  // ── Market Intelligence Page ──
  marketTitle: '📈 Market Intelligence',
  marketSub: 'Real-time mandi prices & AI predictions',
  pricesEyebrow: 'Nearby mandi prices',
  currentPrice: 'Current Price',
  weekHigh: 'Week High',
  weekLow: 'Week Low',
  trendLabel: 'Trend',
  bestSelling: 'Best Selling Window',
  aiRecommendation: 'AI Recommendation',
  priceforecast: '7-Day Price Forecast',

  // ── Grain Grading Page ──
  grainTitle: 'Grain Quality Grading',
  grainSub: 'Photograph your harvest to get a fair price',
  grainBtn: '📸 Analyze Grain Sample',

  // ── Equipment Page ──
  equipTitle: 'Rent Equipment',
  equipSub: 'From farmers near Tirupati',
  bookBtn: 'Book',
  bookedMsg: 'Booked! Owner will confirm shortly.',
  kmAway: 'km away',
  perDay: '/ day',

  // ── Profile Page ──
  profileTitle: 'Your Profile',
  profileSub: 'Manage farm details',
  fName: 'Name',
  fRegion: 'Region',
  fCrop: 'Primary crop',
  fLand: 'Land size (acres)',
  saveBtn: 'Save changes',

  // ── Admin ──
  adminDashboard: 'Dashboard',
  adminUsers: 'Users',
  adminEquipment: 'Equipment',
  adminAnalytics: 'Analytics',
  adminHealth: 'System Health',
  adminSettings: 'Settings',
  totalUsers: 'Total Users',
  totalFarmers: 'Farmers',
  totalEquipOwners: 'Equipment Owners',
  activeBookings: 'Active Bookings',
  aiRequests: 'AI Requests Today',

  // ── Common ──
  loading: 'Loading...',
  error: 'Something went wrong. Please try again.',
  retry: 'Retry',
  back: '←',
  close: '✕',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  view: 'View',
  search: 'Search',
  filter: 'Filter',
  all: 'All',
  noData: 'No data available',
};

export default en;
