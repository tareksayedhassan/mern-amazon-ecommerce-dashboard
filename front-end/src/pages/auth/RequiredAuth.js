import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import ErrorPage from "../Error/Error";

const RequiredAuth = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsAllowed(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "admin" || role === "superAdmin") {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch (err) {
      setIsAllowed(false);
    }
  }, [token]);

  if (isAllowed === null) return <div>Loading...</div>;

  if (!isAllowed) return <ErrorPage />;

  return <Outlet />;
};

export default RequiredAuth;
