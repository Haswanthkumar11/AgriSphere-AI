import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { getStoredToken, getStoredUser, setStoredToken, setStoredUser, clearStorage } from '@utils/storage';
import { getProfile, loginFarmer, loginAdmin } from '@api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]              = useState(getStoredUser);
  const [token, setToken]            = useState(getStoredToken);
  const [isLoading, setIsLoading]    = useState(false);

  const isAuthenticated = Boolean(token && user);

  /** Persist auth state to localStorage whenever it changes. */
  useEffect(() => {
    if (token && user) {
      setStoredToken(token);
      setStoredUser(user);
    }
  }, [token, user]);

  /** Login as farmer/user */
  const login = useCallback(async (phone, password) => {
    setIsLoading(true);
    try {
      const data = await loginFarmer(phone, password);
      setToken(data.access_token);
      setUser(data.user);
      setStoredToken(data.access_token);
      setStoredUser(data.user);
      return { success: true, role: data.user?.role };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Login as admin */
  const loginAsAdmin = useCallback(async (phone, password) => {
    setIsLoading(true);
    try {
      const data = await loginAdmin(phone, password);
      setToken(data.access_token);
      setUser(data.user);
      setStoredToken(data.access_token);
      setStoredUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Admin login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Refresh user profile from the API */
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await getProfile();
      setUser(profile);
      setStoredUser(profile);
    } catch {
      // Token may have expired
      logout();
    }
  }, [token]);

  /** Logout — clear everything */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStorage();
  }, []);

  const value = useMemo(() => ({
    user, token, isAuthenticated, isLoading,
    login, loginAsAdmin, logout, refreshUser,
  }), [user, token, isAuthenticated, isLoading, login, loginAsAdmin, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
