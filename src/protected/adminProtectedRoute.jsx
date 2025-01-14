// ProtectedRoute.js (Updated)
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ element: Element }) => {
  const adminData = useSelector((state) => state.admin.adminDatas);

  if (!adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Element />;
};

export default AdminProtectedRoute;
