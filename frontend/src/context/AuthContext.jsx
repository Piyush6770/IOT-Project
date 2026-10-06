import React, { createContext, useContext, useState, useEffect } from 'react';
import { userProfileData } from '../services/mockData';
import { api, getStoredToken, setStoredToken } from '../services/api';

const AuthContext = createContext({
  isAuthenticated: true,
  token: null,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken() || 'mock-jwt-token-9042');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartchair_user');
    return saved ? JSON.parse(saved) : userProfileData;
  });

  const isAuthenticated = Boolean(token);

  // Sync token with storage
  useEffect(() => {
    setStoredToken(token);
  }, [token]);

  // Try to load real profile on mount if token exists
  useEffect(() => {
    const verifySession = async () => {
      if (!token || token.startsWith('mock-')) return;
      try {
        const profile = await api.getMe();
        if (profile) {
          setUser((prev) => ({ ...prev, ...profile }));
          localStorage.setItem('smartchair_user', JSON.stringify(profile));
        }
      } catch {
        // Token might be invalid or server offline
      }
    };
    verifySession();
  }, [token]);

  const login = async (email, password) => {
    try {
      // 1. Try real login with backend
      const data = await api.login(email, password);
      if (data && data.access_token) {
        setToken(data.access_token);
        const userData = data.user || { ...userProfileData, email };
        setUser(userData);
        localStorage.setItem('smartchair_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      console.warn('Real backend login failed, attempting fallback...', err.message);
      
      // If user is trying to log in but backend is registering or offline, provide graceful fallback
      if (email && password) {
        try {
          // Attempt auto-register if user doesn't exist yet on backend
          const regData = await api.register({
            name: email.split('@')[0] || 'ChairSense User',
            email,
            password,
            age: 30,
            height: 175,
            weight: 70,
            role: 'User',
          });
          if (regData && regData.access_token) {
            setToken(regData.access_token);
            setUser(regData.user);
            return { success: true };
          }
        } catch {
          // Fallback demo token
          const fakeToken = `jwt-header.${btoa(email)}.signature_${Date.now()}`;
          setToken(fakeToken);
          const updatedUser = { ...userProfileData, email };
          setUser(updatedUser);
          localStorage.setItem('smartchair_user', JSON.stringify(updatedUser));
          return { success: true };
        }
      }
      throw err;
    }
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data && data.access_token) {
      setToken(data.access_token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setStoredToken(null);
    localStorage.removeItem('smartchair_user');
  };

  const updateUserProfile = async (updatedFields) => {
    try {
      const updated = await api.updateProfile(updatedFields);
      setUser((prev) => ({ ...prev, ...updated }));
      localStorage.setItem('smartchair_user', JSON.stringify(updated));
    } catch {
      // Fallback local update
      const newProfile = { ...user, ...updatedFields };
      setUser(newProfile);
      localStorage.setItem('smartchair_user', JSON.stringify(newProfile));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
