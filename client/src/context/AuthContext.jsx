import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi, getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const storeSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setAuthenticated(true);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setAuthenticated(false);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await authApi.login({ email, password });
      const { token, user: userData } = res.data;
      storeSession(token, userData);
      return userData;
    },
    [storeSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await authApi.register({ name, email, password });
      const { token, user: userData } = res.data;
      storeSession(token, userData);
      return userData;
    },
    [storeSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const getCurrentUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      const data = res.data.data;
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      setUser(data);
      return data;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      await getCurrentUser();
      setLoading(false);
    };
    verify();
  }, [getCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        login,
        register,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export { getErrorMessage };
