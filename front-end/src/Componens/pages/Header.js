import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/30Sep24 Anis Online Store Free Upload.png";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <header className="surface-0 shadow-2 px-4 py-2">
      <div className="flex align-items-center justify-content-between gap-4 flex-wrap">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Store Logo"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-4 flex-wrap">
          <span className="cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span className="cursor-pointer" onClick={() => navigate("/shop")}>
            Shop
          </span>
          <span
            className="cursor-pointer"
            onClick={() => navigate("/categories")}
          >
            Categories
          </span>
          <span className="cursor-pointer" onClick={() => navigate("/contact")}>
            Contact
          </span>
        </nav>

        {/* Search */}
        <div className="flex-grow-1 max-w-20rem w-full">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full"
            />
          </span>
        </div>

        {/* Auth Buttons */}
        <div className="flex align-items-center gap-2">
          <Link to="/login">
            <Button label="Login" className="p-button-text p-button-sm" />
          </Link>
          <Link to="/register">
            <Button
              label="Register"
              className="p-button-outlined p-button-sm"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
