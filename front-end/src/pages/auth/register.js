import React, { useState } from "react";
import { BASE_URL, REGISTER } from "../../Api/APi";
import "./form.css";
import "./button.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading/Loading";
import Cookie from "cookie-universal";
import googleIcon from "../../assets/download.png";
import "../../css/google.css";
import { Axios } from "../../Api/Axios";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);
  // cookie
  const cookie = Cookie();

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setloading(false);
      return;
    }

    try {
      const res = await Axios.post(`${BASE_URL}/${REGISTER}`, {
        name,
        email,
        password,
        confirmPassword,
      });

      const token = res.data.data?.token;
      const refreshToken = res.data.data?.refreshToken;
      cookie.set("Bearer", token);
      cookie.set("refreshToken", refreshToken);

      setloading(false);
      Navigate("/");
      setMessage("User registered successfully");
    } catch (error) {
      setloading(false);
      if (error.response && error.response.status === 400) {
        setMessage("Email is already been taken");
      } else {
        setMessage("Internal Server Error");
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
              <h1>Register Now</h1>
              <div className="app-form-control">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
                <label htmlFor="name">Full Name</label>
              </div>
              <div className="app-form-control">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@mail.com"
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="app-form-control">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  minLength={6}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="app-form-control">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="********"
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <div className="register-section">
                <button
                  type="submit"
                  className="app-btn app-btn-primary simple-btn"
                >
                  Register
                </button>
                <div className="login-text">
                  <p>Already have an account?</p>
                  <a href="/login">Login here</a>
                </div>
              </div>

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

              {message !== "" && <span className="error">{message}</span>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
