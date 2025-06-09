import React, { useContext } from "react";
import Topbar from "./TopBar";
import SideBar from "./SideBar";
import "./dashboard.css";
import { Outlet, useOutletContext } from "react-router-dom";
import { Menu } from "../../context/menuContext";
import { WindowSize } from "../../context/WindowContext";

const Dashboard = () => {
  const { isOpen } = useContext(Menu);
  const { windowSize } = useContext(WindowSize);
  const { role } = useOutletContext();

  const contentStyle = {
    marginLeft:
      windowSize < 768
        ? isOpen
          ? "180px"
          : "0"
        : isOpen
        ? "240px"
        : "fit-content",
    transition: "margin-left 0.3s ease",
    width:
      windowSize < 768
        ? isOpen
          ? "calc(100% - 180px)"
          : "100%"
        : isOpen
        ? "calc(100% - 240px)"
        : "100%",
    minHeight: "calc(100vh - 70px)",
  };

  return (
    <div className="position-relative">
      <Topbar />
      <div style={{ marginTop: "70px" }} className="d-flex">
        <SideBar role={role} />
        <div className="dashboard-content p-3" style={contentStyle}>
          <Outlet context={{ role }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
