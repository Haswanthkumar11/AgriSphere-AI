/**
 * AgriSphere AI — Dynamic Role Menu Navigation
 * Single source of truth for Role-Based Access Control (RBAC) Menus.
 */
import { ROUTES } from './routes';

export const ROLE_MENUS = {
  farmer: [
    { label: 'Dashboard',         path: ROUTES.DASHBOARD,       icon: '🌾' },
    { label: 'AI Crop Analysis',  path: ROUTES.SCAN,            icon: '📸' },
    { label: 'Grain Quality',     path: ROUTES.GRAIN,           icon: '🌽' },
    { label: 'P2P Marketplace',   path: ROUTES.EQUIPMENT,       icon: '🚜' },
    { label: 'My Bookings',       path: ROUTES.BOOKINGS,        icon: '📅' },
    { label: 'Weather',           path: ROUTES.WEATHER,         icon: '☀️' },
    { label: 'Market Prices',     path: ROUTES.MARKET,          icon: '📈' },
    { label: 'Yield Estimator',   path: ROUTES.YIELD,           icon: '📊' },
    { label: 'Scan History',      path: ROUTES.CROP_HISTORY,    icon: '📜' },
    { label: 'Profile',           path: ROUTES.PROFILE,         icon: '👤' },
  ],
  officer: [
    { label: 'Extension Portal',  path: ROUTES.OFFICER_DASHBOARD, icon: '🌾' },
    { label: 'Farmer Reports',   path: ROUTES.CROP_HISTORY,      icon: '📊' },
    { label: 'Disease KB',        path: ROUTES.CROP_KB,           icon: '🔬' },
    { label: 'Market Intelligence', path: ROUTES.MARKET,          icon: '📈' },
  ],
  admin: [
    { label: 'Admin Control',     path: ROUTES.ADMIN_DASHBOARD,  icon: '🛡️' },
    { label: 'User Management',   path: ROUTES.ADMIN_USERS,      icon: '👥' },
    { label: 'P2P Equipment',     path: ROUTES.EQUIPMENT,        icon: '🚜' },
    { label: 'AI Disease KB',     path: ROUTES.CROP_KB,          icon: '📚' },
  ],
};
