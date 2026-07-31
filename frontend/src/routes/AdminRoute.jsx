import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@constants/routes';

/** Redirects non-admin users back to farmer dashboard. */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  if (user?.role !== 'admin') return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
}
