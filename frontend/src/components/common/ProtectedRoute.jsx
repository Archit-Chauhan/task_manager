import React from 'react';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { LoadingSpinner } from './LoadingSpinner'; // We'll populate this later

/**
 * A wrapper component to protect routes based on authentication and user role.
 * * @param {string[]} allowedRoles - Array of roles allowed to view the content (e.g., ['ADMIN']). Empty array allows any authenticated user.
 * * @param {React.ReactNode} children - The content to render if access is granted.
 */
export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAccessGranted, user } = useProtectedRoute(allowedRoles);
  
 
  if (user === undefined) { 
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner />
        <p className="ml-3 text-gray-600">Loading application...</p>
      </div>
    );
  }

  
  if (isAccessGranted) {
    return <>{children}</>;
  }

  return null;
};