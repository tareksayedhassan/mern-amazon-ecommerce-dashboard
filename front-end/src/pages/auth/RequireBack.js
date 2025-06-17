import React, { useEffect } from "react";
import Cookie from "cookie-universal";
import { Outlet, useNavigate } from "react-router-dom";

const RequireBack = () => {
  const cookie = Cookie();
  const token = cookie.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(-1);
    }
  }, [token, navigate]);

  return !token ? <Outlet /> : null;
};

export default RequireBack;
