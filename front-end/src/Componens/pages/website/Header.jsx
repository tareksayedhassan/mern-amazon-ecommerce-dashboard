import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../../../Api/Axios";
import { GET_GATEGORY } from "../../../Api/APi";
import { toast } from "react-toastify";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../../../context/CartContext";
const Header = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const name = token ? jwtDecode(token)?.name : null;
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [product, setProduct] = useState(0);
  const navigate = useNavigate();
  const { cart } = useCart();
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`);
        setCategories(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    getCategories();
  }, []);

  const handleLogout = () => {
    cookie.remove("Bearer", { path: "/" });
    cookie.remove("refreshToken", { path: "/" });
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    } else {
      toast.warn("Please enter a search term");
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
    setSearchQuery("");
  };

  const showCategories = (
    <div className="flex justify-content-center py-3">
      <div className="flex flex-wrap gap-3 justify-content-center">
        {categories.length > 0 ? (
          categories.map((item, key) => {
            const isSelected = selected === item.name;

            return (
              <Button
                key={item.id || key}
                label={item.name}
                className="text-sm border-round-md px-4 py-2 text-center"
                style={{
                  border: `1px solid var(--primary-color)`,
                  backgroundColor: isSelected ? "var(--primary-color)" : "#fff",
                  color: isSelected ? "#fff" : "var(--primary-color)",
                  minWidth: "120px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => {
                  setSelected(item.name);
                  navigate(`/show-categories/${item._id}`);
                }}
              />
            );
          })
        ) : (
          <p className="text-sm" style={{ color: "var(--primary-color)" }}>
            No categories available
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="flex flex-wrap justify-content-between align-items-center gap-3 px-3 py-2 shadow-2 bg-white"
        style={{ color: "var(--primary-color)" }}
      >
        <div className="flex align-items-center gap-2">
          <Button
            icon="pi pi-bars"
            onClick={() => setVisible(true)}
            className="p-button-sm"
            aria-label="Toggle Sidebar"
          />
          <Badge
            value="MegaMart"
            className="text-lg font-bold bg-transparent border-none cursor-pointer"
            style={{ color: "var(--primary-color)" }}
            onClick={() => navigate("/")}
          />
        </div>

        <div className="w-full md:w-6 hidden md:block">
          <IconField iconPosition="left" className="w-full">
            <InputIcon
              className="pi pi-search"
              style={{ color: "var(--primary-color)" }}
            />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search essentials, groceries and more..."
              className="w-full text-sm"
            />
          </IconField>
        </div>

        <div className="flex align-items-center gap-3">
          {name ? (
            <div className="flex align-items-center gap-2">
              <span className="hidden sm:block text-sm">Hello, {name}</span>
              <Button
                icon="pi pi-search"
                className="p-button-text block md:hidden"
                onClick={toggleMobileSearch}
                tooltip="Search"
                tooltipOptions={{ position: "bottom" }}
                aria-label="Search"
              />
              <Button
                icon="pi pi-sign-out"
                onClick={handleLogout}
                className="p-button-text p-button-sm"
                tooltip="Logout"
                tooltipOptions={{ position: "bottom" }}
                aria-label="Logout"
              />
            </div>
          ) : (
            <div className="flex align-items-center gap-2">
              <FontAwesomeIcon
                icon={faUser}
                className="text-sm"
                style={{ color: "var(--primary-color)" }}
              />
              <Link
                to="/register"
                className="no-underline text-sm"
                style={{ color: "var(--primary-color)" }}
              >
                Sign Up
              </Link>
              <span className="text-sm">/</span>
              <Link
                to="/login"
                className="no-underline text-sm"
                style={{ color: "var(--primary-color)" }}
              >
                Sign In
              </Link>
              <Button
                icon="pi pi-search"
                className="p-button-text block md:hidden"
                onClick={toggleMobileSearch}
                tooltip="Search"
                tooltipOptions={{ position: "bottom" }}
                aria-label="Search"
              />
            </div>
          )}

          {/* Cart */}
          <div className="flex align-items-center gap-1">
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "var(--primary-color)" }}
              onClick={() => navigate("/cart")}
              className="cursor-pointer"
            />
            <p
              className="m-0 text-sm hidden sm:block cursor-pointer"
              style={{ color: "var(--primary-color)" }}
              onClick={() => navigate("/cart")}
            >
              {cart.length}
            </p>
          </div>
        </div>
      </div>

      {showMobileSearch && (
        <div className="w-full px-3 py-2 bg-white block md:hidden">
          <IconField iconPosition="left" className="w-full">
            <InputIcon
              className="pi pi-search"
              style={{ color: "var(--primary-color)" }}
            />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search essentials, groceries and more..."
              className="w-full text-sm"
              autoFocus
            />
          </IconField>
        </div>
      )}

      {/* Sidebar */}

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        header={<h2 className="m-0">Menu</h2>}
        className="w-full md:w-3"
      >
        <div className="flex flex-column gap-3">
          <Link
            to="/"
            className="no-underline text-sm"
            style={{ color: "var(--primary-color)" }}
            onClick={() => setVisible(false)}
          >
            Home
          </Link>
          <h2>Categories</h2>
          {categories.map((item) => (
            <Link
              key={item.id || item.name}
              to={`/show-categories/${item._id}`}
              className="no-underline text-sm"
              style={{ color: "var(--primary-color)" }}
              onClick={() => setVisible(false)}
            >
              {item.name}
            </Link>
          ))}

          <h2>Options</h2>

          {name ? (
            <Button
              label="Logout"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              className="p-button-text p-button-sm"
            />
          ) : (
            <>
              <Link
                to="/login"
                className="no-underline text-sm"
                style={{ color: "var(--primary-color)" }}
                onClick={() => setVisible(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="no-underline text-sm"
                style={{ color: "var(--primary-color)" }}
                onClick={() => setVisible(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </Sidebar>

      <div className="w-full flex justify-content-center">{showCategories}</div>
    </>
  );
};

export default Header;
