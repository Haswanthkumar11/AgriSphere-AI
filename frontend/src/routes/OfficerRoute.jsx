import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@constants/routes';

/** Route guard for Extension Officers (/officer/*). Redirects cross-role attempts. */
export default function OfficerRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  const role = (user?.role || '').toLowerCase();
  if (role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  if (role === 'farmer') return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
}
