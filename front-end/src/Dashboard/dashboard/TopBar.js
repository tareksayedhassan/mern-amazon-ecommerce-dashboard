import React, { useContext, useEffect, useMemo, useState } from "react";
import "./bars.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "../../context/menuContext";
import { jwtDecode } from "jwt-decode";
import Cookie from "cookie-universal";
import { GET_SINGLE_USER } from "../../Api/APi";
import { Axios } from "../../Api/Axios";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Logout from "../../pages/auth/Logout";

const Topbar = () => {
  const [name, setName] = useState("User");

  const cookie = Cookie();
  const token = cookie.get("accessToken");
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      Axios.get(`${GET_SINGLE_USER}/${userId}`)
        .then((res) => {
          const fetchedName = res.data?.data?.user?.name || "User";
          setName(fetchedName);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setName("User");
        });
    } catch (err) {
      console.error("Invalid token:", err);
      setName("User");
    }
  }, [token]);

  const { setIsOpen } = useContext(Menu);

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

      <div className="topbar-dropdown">
        <DropdownButton id="dropdown-basic-button" title={name} align="end">
          <Dropdown.Item>
            <Logout />
          </Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
};

export default Topbar;
