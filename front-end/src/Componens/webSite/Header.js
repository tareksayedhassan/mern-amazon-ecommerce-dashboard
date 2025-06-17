import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <div style={{ width: "100%", height: "30px", backgroundColor: "black" }}>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Sign up and get 20% off to your first Order
          <Link
            style={{ color: "white", whiteSpace: "break-spaces" }}
            to={"/register"}
          >
            {" "}
            Sign Up Now
          </Link>
        </span>
      </div>
      <div></div>
    </div>
  );
};

export default Header;
