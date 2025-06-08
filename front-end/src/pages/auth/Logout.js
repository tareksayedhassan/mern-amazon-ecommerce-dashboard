import React, { useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading/Loading";

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
    }, 1000); // وقت بسيط عشان تظهر اللودينج لو حابب
  };

  if (loading) {
    return <Loading />;
  }

  return <button onClick={handelDelete}>Logout</button>;
};

export default Logout;
