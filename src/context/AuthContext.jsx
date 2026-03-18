import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    api.post('/auth/logout').catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};