import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@constants/routes';

/** Route guard for Farmers (/dashboard, /scan, /equipment, etc.). Redirects cross-role attempts. */
export default function FarmerRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;

  const role = (user?.role || '').toLowerCase();
  if (role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  if (role === 'officer') return <Navigate to={ROUTES.OFFICER_DASHBOARD} replace />;

  return children;
}
