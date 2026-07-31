import { useAuthContext } from '@context/AuthContext';

/** Short-form hook: const { user, isAuthenticated, login, logout } = useAuth() */
export function useAuth() {
  return useAuthContext();
}
