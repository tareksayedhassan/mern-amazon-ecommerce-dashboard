import React, { useEffect, useState } from "react";
import { Axios } from "../../Api/Axios";
import { GET_GATEGORY } from "../../Api/APi";
import { Avatar } from "primereact/avatar";
import { toast } from "react-toastify";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`);
        const offerProducts = res.data.data.slice(0, 5);
        setCategories(offerProducts);
      } catch (error) {
        toast.error("Can't load categories");
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-5 surface-100 text-center">
      <div className="flex justify-content-between">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          Shop From{" "}
          <span
            style={{
              color: "var(--primary-color)",
              borderBottom: "2px solid var(--primary-color)",
            }}
          >
            Top categories
          </span>
        </h2>{" "}
        <div className="mt-4 text-left ">
          <Button
            label="View all >"
            className="p-button-text text-primary font-semibold"
            onClick={() => navigate("/categories")}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-content-center gap-5">
        {categories.map((cat, index) => (
          <div key={index} className="flex flex-col items-center">
            <Tooltip
              target={`.cat-${index}`}
              content={cat.name}
              position="top"
            />
            <Avatar
              image={cat.image}
              shape="circle"
              className={`cat-${index} shadow-4 hover:shadow-6 transition-shadow`}
              style={{
                width: "160px",
                height: "160px",
                border: "3px solid #e0e0e0",
              }}
            />
            <span
              className="text-base font-semibold text-gray-800 mt-2 text-center"
              style={{ maxWidth: "160px", wordBreak: "break-word" }}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
