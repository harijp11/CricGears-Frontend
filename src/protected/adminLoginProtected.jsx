import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLoginProtectedRoute = ({ element: Component }) => {
  const adminData = useSelector((state) => state.admin.adminDatas);

  // If admin is logged in, redirect to the admin home/dashboard page
  if (adminData) {
    return <Navigate to="/admin/home" replace />;
  }

  // If admin is not logged in, allow access to the login page
  return <Component />;
};

export default AdminLoginProtectedRoute;
