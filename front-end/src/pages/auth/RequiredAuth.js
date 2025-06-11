import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import ErrorPage from "../Error/Error";

const RequiredAuth = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUserRole(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    } catch (err) {
      setUserRole(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (userRole === "user") return <ErrorPage />;
  if (!userRole) return <ErrorPage />;

  return <Outlet context={{ role: userRole }} />;
};

export default RequiredAuth;
