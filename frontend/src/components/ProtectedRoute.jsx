import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuthStore();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'} replace />;
  }

  return children;
};

export default ProtectedRoute;