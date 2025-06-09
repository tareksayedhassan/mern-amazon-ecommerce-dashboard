import { faFeather, faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./bars.css";
import { Menu } from "../../context/menuContext";
import { WindowSize } from "../../context/WindowContext";

const SideBar = ({ role }) => {
  const { isOpen } = useContext(Menu);
  const { windowSize } = useContext(WindowSize);

  const sidebarWidth =
    windowSize < 768
      ? isOpen
        ? "180px"
        : "fit-content"
      : isOpen
      ? "240px"
      : "fit-content";

  const sidebarStyle = {
    width: sidebarWidth,
    left: windowSize < 768 ? (isOpen ? "0" : "-100%") : "0",
    transition: "left 0.3s ease, width 0.3s ease",
    position: "fixed",
    top: "70px",
    height: "calc(100vh - 70px)",
    backgroundColor: "white",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
    padding: "20px 10px",
    zIndex: 1000,
  };

  return (
    <div className="side-bar" style={sidebarStyle}>
      {role === "admin" && (
        <>
          <NavLink
            to={"users"}
            className={({ isActive }) =>
              isActive ? "nav-icon active" : "nav-icon"
            }
          >
            <FontAwesomeIcon
              icon={faUsers}
              className="icon"
              style={{ padding: isOpen ? "10px 8px 10px 15px" : "10px 13px" }}
            />
            <span
              className="label"
              style={{ display: isOpen ? "block" : "none" }}
            >
              Users
            </span>
          </NavLink>
          <NavLink
            to={"users/add"}
            className={({ isActive }) =>
              isActive ? "nav-icon active" : "nav-icon"
            }
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="icon"
              style={{ padding: isOpen ? "10px 8px 10px 15px" : "10px 13px" }}
            />
            <span
              className="label"
              style={{ display: isOpen ? "block" : "none" }}
            >
              add user
            </span>
          </NavLink>
        </>
      )}

      {(role === "admin" || role === "writer") && (
        <NavLink
          to={"writer"}
          className={({ isActive }) =>
            isActive ? "nav-icon active" : "nav-icon"
          }
        >
          <FontAwesomeIcon
            icon={faFeather}
            className="icon"
            style={{ padding: isOpen ? "10px 8px 10px 15px" : "10px 13px" }}
          />
          <span
            className="label"
            style={{ display: isOpen ? "block" : "none" }}
          >
            Writer{" "}
          </span>
        </NavLink>
      )}
    </div>
  );
};

export default SideBar;
