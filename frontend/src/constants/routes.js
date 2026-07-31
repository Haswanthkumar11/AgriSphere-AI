/** Route path constants — change a path here, changes everywhere. */
export const ROUTES = {
  HOME: '/',
  LANGUAGE_SELECT: '/language-select',
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin/login',
  REGISTER: '/register',

  // Farmer routes
  DASHBOARD: '/dashboard',
  SCAN: '/scan',
  WEATHER: '/weather',
  GRAIN: '/grain',
  EQUIPMENT: '/equipment',
  BOOKINGS: '/bookings',
  YIELD: '/yield',
  MARKET: '/market',
  PROFILE: '/profile',

  // Crop Intelligence routes (Module 3)
  CROP_HISTORY: '/crop/history',
  CROP_COMPARE: '/crop/compare',
  CROP_KB: '/crop/knowledge-base',

  // Post-Harvest Intelligence routes (Module 4)
  HARVEST_HISTORY: '/harvest/history',
  HARVEST_COMPARE: '/harvest/compare',
  STORAGE_ADVICE: '/harvest/storage',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_EQUIPMENT: '/admin/equipment',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_HEALTH: '/admin/health',

  // Error routes
  UNAUTHORIZED_401: '/401',
  FORBIDDEN_403: '/403',
  NOT_FOUND_404: '/404',
  SERVER_ERROR_500: '/500',
};
