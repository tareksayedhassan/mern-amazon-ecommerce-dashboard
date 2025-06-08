import React from "react";

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2c3e50", // لون هادئ مناسب للداشبورد
        padding: "0.75rem 1.5rem",
        color: "#ecf0f1",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontSize: "1.1rem",
        fontWeight: "600",
      }}
    >
      <div>Dashboard</div>
      <nav>
        <ul
          style={{
            display: "flex",
            gap: "1.5rem",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          <li>
            <a href="/" style={{ color: "#ecf0f1", textDecoration: "none" }}>
              Home
            </a>
          </li>
          <li>
            <a
              href="/profile"
              style={{ color: "#ecf0f1", textDecoration: "none" }}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="/settings"
              style={{ color: "#ecf0f1", textDecoration: "none" }}
            >
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
