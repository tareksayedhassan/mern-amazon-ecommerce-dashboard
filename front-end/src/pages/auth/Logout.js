import React, { useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading/Loading";
import { Button } from "react-bootstrap";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cookie = Cookie();

  const handelDelete = () => {
    setLoading(true);
    cookie.remove("Bearer");
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Button variant="primary" onClick={handelDelete}>
      Logout
    </Button>
  );
};

export default Logout;
