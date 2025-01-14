import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserProtectedRoute = ({ element: Component, adminOnly = false }) => {
  const userData = useSelector((state) => state.user.userDatas);
  
  if (!userData) {
    // If no user data, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If protected route criteria met, render component
  return <Component />;
};

export default UserProtectedRoute;