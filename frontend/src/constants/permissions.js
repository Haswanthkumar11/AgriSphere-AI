import { ROLES } from './roles';

/** Permission definitions per user role */
export const PERMISSIONS = {
  [ROLES.FARMER]: [
    'crop.scan',
    'weather.view',
    'yield.predict',
    'grain.grade',
    'equipment.view',
    'equipment.book',
    'market.view',
    'profile.update',
  ],
  [ROLES.EQUIPMENT_OWNER]: [
    'crop.scan',
    'weather.view',
    'equipment.view',
    'equipment.create',
    'equipment.manage',
    'bookings.manage',
    'market.view',
    'profile.update',
  ],
  [ROLES.BOTH]: [
    'crop.scan',
    'weather.view',
    'yield.predict',
    'grain.grade',
    'equipment.view',
    'equipment.book',
    'equipment.create',
    'equipment.manage',
    'bookings.manage',
    'market.view',
    'profile.update',
  ],
  [ROLES.ADMIN]: [
    'users.read',
    'users.write',
    'users.delete',
    'equipment.moderate',
    'analytics.view',
    'system.health',
    'reports.view',
  ],
};

/** Permission checker helper */
export function hasPermission(role, permission) {
  if (!role) return false;
  const userPerms = PERMISSIONS[role] || [];
  return userPerms.includes(permission);
}
