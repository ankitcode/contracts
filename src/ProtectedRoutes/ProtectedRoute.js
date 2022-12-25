// Imports
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminRoute,
  isAdmin,
  redirect = "/login",
  redirectAdmin = "/",
}) => {
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirect} />;
  }
  // Redirect to home page and give notification if admin route but not admin
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
