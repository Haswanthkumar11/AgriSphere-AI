import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@constants/routes';

/**
 * ProfileGuard — Intercepts farmer workspace routes.
 * If farmer's location (state or district) is missing, redirects immediately to /complete-profile.
 */
export default function ProfileGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role === 'farmer') {
    const hasLocation = user.district || user.state || user.region;
    const isCompleteProfilePage = location.pathname === '/complete-profile';

    if (!hasLocation && !isCompleteProfilePage) {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  return children;
}
