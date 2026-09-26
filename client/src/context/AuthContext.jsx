import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('ssrc_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
      return null;
    }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('ssrc_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('ssrc_token');
    sessionStorage.removeItem('ssrc_user');
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      localStorage.removeItem('ssrc_token');
      localStorage.removeItem('ssrc_user');
      const storedToken = sessionStorage.getItem('ssrc_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (isMounted && res.data.success) {
            setUser(res.data.user);
            sessionStorage.setItem('ssrc_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session check error:', err);
          if (isMounted) {
            logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  useEffect(() => {
    if (!token) return undefined;

    let timeoutId;
    try {
      const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(encodedPayload));
      const remaining = payload.exp * 1000 - Date.now();
      if (!Number.isFinite(remaining) || remaining <= 0) {
        timeoutId = window.setTimeout(logout, 0);
      } else {
        timeoutId = window.setTimeout(logout, remaining);
      }
    } catch {
      timeoutId = window.setTimeout(logout, 0);
    }

    return () => window.clearTimeout(timeoutId);
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: authUser, token: authToken } = res.data;
        // Save to sessionStorage immediately
        sessionStorage.setItem('ssrc_token', authToken);
        sessionStorage.setItem('ssrc_user', JSON.stringify(authUser));
        setUser(authUser);
        setToken(authToken);
        return { success: true, user: authUser };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
