import React, { useContext, useEffect, useState } from "react";
import "./bars.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "../../context/menuContext";
import { jwtDecode } from "jwt-decode";
import Cookie from "cookie-universal";
import { GET_SINGLE_USER } from "../../Api/APi";
import { Axios } from "../../Api/Axios";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const Topbar = () => {
  const [name, setName] = useState("User");
  const cookie = Cookie();
  const navigate = useNavigate();

  const token = cookie.get("Bearer");

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

  const options = [
    { name: name, code: "user" },
    { name: "Logout", code: "logout" },
  ];

  const handleLogout = () => {
    cookie.remove("Bearer");
    cookie.remove("refreshToken");
    navigate("/login");
  };

  const handleDropdownChange = (e) => {
    if (e.value.code === "logout") {
      handleLogout();
    }
  };

  return (
    <div className="top-bar flex justify-content-between align-items-center px-3 py-2 shadow-1 surface-0">
      <div className="flex align-items-center gap-2">
        <h3 className="m-0 text-xl font-bold">E-Commerce</h3>
        <FontAwesomeIcon
          icon={faBars}
          className="text-xl cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ color: "#555" }}
        />
      </div>

      <div className="flex align-items-center gap-2">
        <Button
          label="Website"
          className="p-button-sm p-button-outlined"
          onClick={() => navigate("/")}
        />
        <Dropdown
          value={{ name: name, code: "user" }}
          onChange={handleDropdownChange}
          options={options}
          optionLabel="name"
          placeholder={name}
          className="w-full md:w-14rem"
        />
      </div>
    </div>
  );
};

export default Topbar;
