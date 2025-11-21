import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, hasRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // User doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;