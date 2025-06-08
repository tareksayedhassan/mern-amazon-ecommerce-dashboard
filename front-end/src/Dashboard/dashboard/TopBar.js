import React, { useContext } from "react";
import "./bars.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "../../context/menuContext";

const Topbar = () => {
  const menu = useContext(Menu);
  const setIsOpen = menu.setIsOpen;
  return (
    <div className="top-bar">
      <div className="topbar-left">
        <h3 className="topbar-title">E-Commerce</h3>
        <FontAwesomeIcon
          icon={faBars}
          className="topbar-icon"
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
    </div>
  );
};

export default Topbar;
