import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children, adminRoute, isAdmin, redirect = "/login", redirectAdmin = "/" }) => {
  //console.log(children);
  if (!isAuthenticated) {
    return <Navigate to={redirect} />;
  }
  if (adminRoute && !isAdmin) {
    return <Navigate to={redirectAdmin} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
