/** Supported crops for yield prediction */
export const CROPS = [
  { value: 'tomato',  label: 'Tomato 🍅',  icon: '🍅' },
  { value: 'paddy',   label: 'Paddy 🌾',   icon: '🌾' },
  { value: 'chilli',  label: 'Chilli 🌶️',  icon: '🌶️' },
  { value: 'cotton',  label: 'Cotton 🌱',  icon: '🌱' },
  { value: 'maize',   label: 'Maize 🌽',   icon: '🌽' },
  { value: 'groundnut', label: 'Groundnut 🥜', icon: '🥜' },
];

export const SOIL_TYPES = [
  { value: 'red_loam',   label: 'Red Loam' },
  { value: 'black',      label: 'Black Cotton Soil' },
  { value: 'sandy_loam', label: 'Sandy Loam' },
  { value: 'clay',       label: 'Clay Soil' },
  { value: 'alluvial',   label: 'Alluvial Soil' },
];

export const SEASONS = [
  { value: 'kharif', label: 'Kharif (Jun–Oct)' },
  { value: 'rabi',   label: 'Rabi (Oct–Mar)' },
  { value: 'zaid',   label: 'Zaid (Mar–Jun)' },
];

export const IRRIGATION_TYPES = [
  { value: 'drip',       label: 'Drip Irrigation' },
  { value: 'flood',      label: 'Flood Irrigation' },
  { value: 'sprinkler',  label: 'Sprinkler' },
  { value: 'rainfed',    label: 'Rainfed (No Irrigation)' },
];

export const FERTILIZER_TYPES = [
  { value: 'npk',     label: 'NPK Balanced' },
  { value: 'urea',    label: 'Urea' },
  { value: 'organic', label: 'Organic / Compost' },
  { value: 'mixed',   label: 'Mixed (NPK + Organic)' },
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',  nativeLabel: 'English',  flag: '🇬🇧' },
  { code: 'te', label: 'Telugu',   nativeLabel: 'తెలుగు',   flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada',  nativeLabel: 'ಕನ್ನಡ',    flag: '🇮🇳' },
];
