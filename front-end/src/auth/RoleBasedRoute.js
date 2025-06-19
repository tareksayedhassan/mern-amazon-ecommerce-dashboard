import React from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles }) => {
  const context = useOutletContext();
  const role = context?.role;

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
