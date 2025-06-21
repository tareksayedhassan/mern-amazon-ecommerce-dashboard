import {
  faArrowDownWideShort,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import { GET_GATEGORY } from "../../../Api/APi";
import { toast } from "react-toastify";
import { TieredMenu } from "primereact/tieredmenu";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";

const SideBar = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const colors = [
    "red",
    "blue",
    "green",
    "black",
    "white",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "gray",
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`);
        setCategories(res.data.data.slice(0, 5));
      } catch (error) {
        toast.error("Cannot get categories");
      }
    };
    getCategories();
  }, []);

  const menuItems = categories.map((cat) => ({
    label: cat.name,
    command: () => setSelectedCategory(cat.id),
    template: (item, options) => (
      <div
        className="p-menuitem-content flex align-items-center justify-content-between"
        style={{
          padding: "10px 16px",
          margin: "6px 0",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onClick={options.onClick}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span className="p-menuitem-text" style={{ flexGrow: 1 }}>
          {item.label}
        </span>
        <FontAwesomeIcon icon={faArrowRight} className="p-menuitem-icon" />
      </div>
    ),
  }));

  return (
    <div
      className="flex flex-column gap-4 surface-0 border-round p-3 shadow-1"
      style={{
        minWidth: "260px",
        maxWidth: "280px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Categories Filter */}
      <div style={{ width: "100%" }}>
        <div className="flex justify-content-between align-items-center border-bottom-2 pb-2 mb-3">
          <h3 className="m-0">Categories</h3>
          <FontAwesomeIcon icon={faArrowDownWideShort} />
        </div>

        <div style={{ padding: 0, margin: 0, width: "100%" }}>
          <TieredMenu
            model={menuItems}
            className="w-full md:w-14rem"
            breakpoint="767px"
            style={{
              all: "unset",
              padding: 0,
              margin: 0,
              background: "transparent",
              border: "none",
            }}
          />
        </div>
      </div>

      {/* Price Filter */}
      <div style={{ width: "100%" }}>
        <div className="flex justify-content-between align-items-center border-bottom-2 pb-2 mb-3">
          <h3 className="m-0">Price</h3>
          <FontAwesomeIcon icon={faArrowUp} />
        </div>

        <div style={{ padding: "0 8px" }}>
          <Slider
            value={priceRange}
            onChange={(e) => setPriceRange(e.value)}
            range
            min={0}
            max={5000}
          />
          <div
            style={{ marginTop: "10px", fontSize: "0.95rem", color: "#333" }}
          >
            From <strong>{priceRange[0]}$</strong> to{" "}
            <strong>{priceRange[1]}$</strong>
          </div>
        </div>
      </div>

      {/* Colors Filter */}
      <div style={{ width: "100%" }}>
        <div className="flex justify-content-between align-items-center border-bottom-2 pb-2 mb-3">
          <h3 className="m-0">Colors</h3>
          <FontAwesomeIcon icon={faArrowUp} />
        </div>

        <div className="flex flex-wrap gap-3 pl-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              title={color}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: color,
                border:
                  selectedColor === color ? "2px solid #333" : "1px solid #ccc",
                boxShadow:
                  selectedColor === color ? "0 0 5px rgba(0,0,0,0.4)" : "none",
                cursor: "pointer",
                transition: "0.3s",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Sizes Filter */}
      <div style={{ width: "100%" }}>
        <div className="flex justify-content-between align-items-center border-bottom-2 pb-2 mb-3">
          <h3 className="m-0">Size</h3>
          <FontAwesomeIcon icon={faArrowDownWideShort} />
        </div>

        <div className="flex flex-wrap gap-3 pl-2">
          {sizes.map((size) => (
            <div
              key={size}
              onClick={() => setSelectedSize(size)}
              className="text-center font-semibold cursor-pointer transition-all"
              style={{
                padding: "8px 16px",
                borderRadius: "25px",
                border:
                  selectedSize === size ? "2px solid #000" : "1px solid #ccc",
                backgroundColor: selectedSize === size ? "#e6e6e6" : "#f7f7f7",
                color: "#333",
                minWidth: "48px",
                userSelect: "none",
              }}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <Button
        label="Apply Filter"
        className="w-full border-round-xl"
        style={{ backgroundColor: "black", color: "white" }}
      />
    </div>
  );
};

export default SideBar;
