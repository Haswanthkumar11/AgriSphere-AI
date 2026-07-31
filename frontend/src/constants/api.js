export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    ADMIN_LOGIN: '/api/v1/auth/admin-login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
  },
  WEATHER: {
    CURRENT: '/api/v1/weather/current',
    FORECAST: '/api/v1/weather/forecast',
    ALERTS: '/api/v1/weather/alerts',
  },
  DISEASE: {
    SCAN: '/api/v1/disease/scan',
    VOICE_DISPATCH: '/api/v1/advisory/voice-dispatch',
  },
  GRAIN: {
    GRADE: '/api/v1/quality/grade',
  },
  MARKET: {
    PRICES: '/api/v1/prices',
    OVERVIEW: '/api/v1/market/overview',
    PREDICT: '/api/v1/market/predict',
    FORECAST: '/api/v1/market/forecast',
  },
  EQUIPMENT: {
    LIST: '/api/v1/rentals/equipment',
    BOOK: '/api/v1/rentals/book',
    HISTORY: '/api/v1/rentals/history',
  },
  YIELD: {
    PREDICT: '/api/v1/yield/predict',
    CROPS: '/api/v1/yield/crops',
    HISTORY: '/api/v1/yield/history',
  },
};
