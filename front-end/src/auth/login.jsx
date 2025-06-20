import axios from "axios";
import React from "react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, LOGIN } from "../Api/APi";
import Loading from "../Loading/Loading";
import Cookie from "cookie-universal";
import "./form.css";

import googleIcon from "../assets/download.png";
import "../css/google.css";
import { jwtDecode } from "jwt-decode";
import "./button.css";
import { Axios } from "../Api/Axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  // cookie
  const cookie = Cookie();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const res = await Axios.post(`${BASE_URL}/${LOGIN}`, {
        email,
        password,
      });

      const Bearer = res.data.data?.token;
      const refreshToken = res.data.data?.refreshToken;
      cookie.set("Bearer", Bearer);
      cookie.set("refreshToken", refreshToken);
      const decoded = jwtDecode(Bearer);

      cookie.set("Bearer", Bearer);

      setloading(false);
      setMessage("User logged in successfully");
      if (decoded.role == "admin" || decoded.role == "product manager") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setloading(false);
      if (error.response && error.response.status === 404) {
        setMessage("Wrong Email or Password");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="app-container">
        <div className="app-row h-100">
          <form onSubmit={handleSubmit} className="form custom-form">
            <div className="custom-form">
              <h1>Login Now</h1>
            </div>

            <div className="app-form-control">
              <div style={{ width: "50%" }}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@mail.com"
                  style={{ width: "100%" }}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="app-form-control">
              <div style={{ width: "50%" }}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  minLength={6}
                  style={{ width: "100%" }}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <div>
              <button type="submit" className="app-btn app-btn-primary">
                Login
              </button>{" "}
              <div className="google-btn">
                <a href="http://localhost:4000/api/auth/google">
                  <div className="google-icon-wrapper">
                    <img
                      src={googleIcon}
                      alt="sign in with google"
                      className="google-icon"
                    />
                  </div>
                  <div>
                    <p className="btn-text">
                      <b>sign in with google</b>
                    </p>
                  </div>
                </a>
              </div>
              {message && (
                <span className="error" style={{ width: "40%" }}>
                  {message}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
