// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';


const initialUserState = {
  user: null, 
  token: null,
  role: null,
  isAuthenticated: false,
};

const AuthContext = createContext(initialUserState);


const parseJwt = (token) => {
  if (!token) return { role: null, user: null };
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return {
      role: payload.role,
      user: { id: payload.sub, email: payload.email, name: payload.name, role: payload.role },
    };
  } catch (e) {
    console.error("Failed to decode token:", e);
    return { role: null, user: null };
  }
};

// --- Auth Provider Component ---
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialUserState);
  const { execute: apiExecute } = useApi();
  
  // --- 1. Load Auth State from Local Storage on Mount ---
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user: user,
          token: storedToken,
          role: user.role,
          isAuthenticated: true,
        });
      } catch (e) {
        // Handle malformed storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
         // Explicitly set user to null if no token is found, confirming 'logged out' status
        setAuthState(prev => ({ ...prev, user: null, isAuthenticated: false }));
    }
  }, []);


  // --- 2. Login Function ---
  const login = useCallback(async (credentials) => {
    try {
      // Use the apiExecute function from useApi hook for the POST request
      const data = await apiExecute('/auth/login', 'post', credentials);

      const { token, user } = data; 
      // Store in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update global state
      setAuthState({
        user: user,
        token: token,
        role: user.role,
        isAuthenticated: true,
      });

      return user;
    } catch (error) {
      console.error("Login failed in AuthContext:", error);
      throw error;
    }
  }, [apiExecute]);


  // --- 3. Logout Function ---
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState(initialUserState);
    window.location.href = "/login"; 
  }, []);

  // --- 4. Context Value ---
  const contextValue = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook to Consume Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};