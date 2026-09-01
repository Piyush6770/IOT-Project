import React, { createContext, useContext, useState, useEffect } from 'react';
import { userProfileData } from '../services/mockData';

const AuthContext = createContext({
  isAuthenticated: true,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('smartchair_jwt_token') || 'mock-jwt-token-9042');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartchair_user');
    return saved ? JSON.parse(saved) : userProfileData;
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smartchair_jwt_token', token);
    } else {
      localStorage.removeItem('smartchair_jwt_token');
    }
  }, [token]);

  const login = async (email, password) => {
    // Simulate JWT network call latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    const fakeToken = `jwt-header.${btoa(email)}.signature_${Date.now()}`;
    setToken(fakeToken);
    const updatedUser = { ...userProfileData, email };
    setUser(updatedUser);
    localStorage.setItem('smartchair_user', JSON.stringify(updatedUser));
    return { success: true };
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('smartchair_jwt_token');
  };

  const updateUserProfile = (updatedFields) => {
    const newProfile = { ...user, ...updatedFields };
    setUser(newProfile);
    localStorage.setItem('smartchair_user', JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
