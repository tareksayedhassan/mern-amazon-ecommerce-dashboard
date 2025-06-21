import React, { use, useEffect, useState } from "react";
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

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [Categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        await Axios.get(`/${GET_GATEGORY}`)
          .then((res) => setCategories(res.data.data))
          .catch((err) => console.log(err));
      } catch (error) {
        toast.error("cannt get categories");
      }
    };
    getCategories();
  }, []);
  const navigate = useNavigate();
  const showCat = (
    <div className="flex justify-content-center py-3">
      <div className="flex flex-wrap gap-3 justify-content-center">
        {Categories.map((item, key) => {
          const isSelected = selected === item.name;

          return (
            <Button
              key={key}
              label={item.name}
              className={`text-sm border-round-md px-4 py-2 text-center`}
              style={{
                border: `1px solid var(--primary-color)`,
                backgroundColor: isSelected ? "var(--primary-color)" : "#fff",
                color: isSelected ? "#fff" : "var(--primary-color)",
                minWidth: "120px",
                transition: "0.3s ease",
              }}
              onClick={() => setSelected(item.name)}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="flex justify-content-between align-items-center px-4 py-2 shadow-2 bg-white"
        style={{ color: "var(--primary-color)" }}
      >
        <div className="flex align-items-center gap-3">
          <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
          <Badge
            value="MegaMart"
            className="text-xl font-bold bg-transparent border-none cursor-pointer"
            style={{ color: "var(--primary-color)" }}
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex align-items-center w-6">
          <IconField iconPosition="left" className="w-full">
            <InputIcon
              className="pi pi-search"
              style={{ color: "var(--primary-color)" }}
            />
            <InputText
              placeholder="Search essentiais, groceries and more...."
              className="w-full"
            />
          </IconField>
        </div>
        <div className="flex align-items-center gap-4">
          <FontAwesomeIcon
            icon={faUser}
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
          <div className="flex align-items-center gap-1">
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ color: "var(--primary-color)" }}
            />
            <p
              className="m-0 text-sm"
              style={{ color: "var(--primary-color)" }}
            >
              Cart
            </p>
          </div>
        </div>
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <h2>Sidebar</h2>
          <p>محتوى السايد بار هنا...</p>
        </Sidebar>
      </div>
      <br />
      {/* categories */}
      <div className="w-full flex justify-content-center">{showCat}</div>
    </>
  );
};

export default Header;
