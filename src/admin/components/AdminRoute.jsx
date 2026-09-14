import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminAuth } from '../services/adminAuth';

export function AdminRoute({ children }) {
  const location = useLocation();
  const isAuth = adminAuth.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
