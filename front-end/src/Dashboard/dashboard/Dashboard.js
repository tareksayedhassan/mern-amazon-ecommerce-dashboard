import React from "react";
import Topbar from "./TopBar";
import SideBar from "./SideBar";
import "./dashboard.css";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="position-relative">
      <Topbar />
      <div style={{ marginTop: "70px" }} className="d-flex">
        <SideBar />
        <div className="dashboard-content p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
