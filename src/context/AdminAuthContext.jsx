import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('santhiya_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('santhiya_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.admin) {
          setAdmin(res.data.admin);
          localStorage.setItem('santhiya_admin_user', JSON.stringify(res.data.admin));
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('santhiya_admin_token', res.data.token);
      localStorage.setItem('santhiya_admin_user', JSON.stringify(res.data.admin));
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async ({ name, email, password, otp }) => {
    const res = await api.post('/auth/register/verify-otp', { name, email, password, otp });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('santhiya_admin_token', res.data.token);
      localStorage.setItem('santhiya_admin_user', JSON.stringify(res.data.admin));
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('santhiya_admin_token');
    localStorage.removeItem('santhiya_admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      token,
      isAuthenticated: !!token && !!admin,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

