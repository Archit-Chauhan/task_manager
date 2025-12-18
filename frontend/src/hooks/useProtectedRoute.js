// src/hooks/useProtectedRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export const useProtectedRoute = (allowedRoles) => {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();
  
 
  const LOGIN_PATH = '/login'; 
  const HOME_PATH = '/home'; 

  useEffect(() => {
    // 1. Check Authentication Status
    if (user === undefined) return; 
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      console.log('Access denied: Not authenticated. Redirecting to login.');
      navigate(LOGIN_PATH, { replace: true });
      return;
    }

    // 2. Check Role Authorization
    if (allowedRoles && allowedRoles.length > 0) {
      const isAuthorized = allowedRoles.includes(role);

      if (!isAuthorized) {
        // If authenticated but role is not allowed, redirect to the default home page
        console.warn(`Access denied: Role "${role}" not authorized for this route. Redirecting.`);
        navigate(HOME_PATH, { replace: true });
      }
    }
  }, [isAuthenticated, role, user, navigate, allowedRoles, logout]); 

  const isAccessGranted = isAuthenticated && 
                          (allowedRoles.length === 0 || allowedRoles.includes(role));
                          
  return { isAccessGranted, isAuthenticated, role, user };
};