// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, protectedRoles }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  if (protectedRoles && !protectedRoles.includes(currentUser.role)) {
    // If the user's role is not in the allowed roles array, redirect to the unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If everything is fine, render the protected component
  return children;
};

export default ProtectedRoute;
