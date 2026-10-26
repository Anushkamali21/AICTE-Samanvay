import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoLogin as apiDemoLogin, verifyOtp as apiVerifyOtp, getMe } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('samanvay_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('samanvay_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.user);
          localStorage.setItem('samanvay_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('Session expired or token invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const setAuthData = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('samanvay_token', newToken);
    localStorage.setItem('samanvay_user', JSON.stringify(newUser));
  };

  const loginWithOtp = async (identifier, otp, extra = {}) => {
    const res = await apiVerifyOtp({ identifier, otp, ...extra });
    if (res.success) {
      setAuthData(res.token, res.user);
    }
    return res;
  };

  const quickDemoLogin = async (role) => {
    const res = await apiDemoLogin(role);
    if (res.success) {
      setAuthData(res.token, res.user);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('samanvay_token');
    localStorage.removeItem('samanvay_user');
  };

  const updateProfile = async (updates) => {
    const res = await api.patch('/users/profile', updates);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('samanvay_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      loginWithOtp,
      quickDemoLogin,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
