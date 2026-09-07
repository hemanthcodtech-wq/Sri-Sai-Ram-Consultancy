import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ssrc_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ssrc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const storedToken = localStorage.getItem('ssrc_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (isMounted && res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('ssrc_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session check error:', err);
          if (err.response && err.response.status === 401) {
            if (isMounted) {
              logout();
            }
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
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: authUser, token: authToken } = res.data;
        // Save to localStorage immediately
        localStorage.setItem('ssrc_token', authToken);
        localStorage.setItem('ssrc_user', JSON.stringify(authUser));
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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ssrc_token');
    localStorage.removeItem('ssrc_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!(user || token || localStorage.getItem('ssrc_token')),
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
