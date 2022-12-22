import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ isAuthenticated, children, adminRoute, isAdmin, redirect = "/login", redirectAdmin = "/" }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirect} />;
  }
  if (adminRoute && !isAdmin) {
    toast.info("Admin Login Required !", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
    return <Navigate to={redirectAdmin} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
