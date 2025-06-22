import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import { GET_GATEGORY } from "../../../Api/APi";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TableView = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`);
        console.log("Categories Data:", res.data.data);

        setCategories(res.data.data);
      } catch (error) {
        toast.error("Cannt get Categories");
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="p-3">
      <div className="grid">
        {categories.map((cat, index) => (
          <div
            key={cat._id || index}
            className="col-12 sm:col-6 md:col-4 lg:col-3"
          >
            <Card
              className="p-0 border-1 surface-border border-round"
              style={{
                overflow: "hidden",
                minHeight: "320px",
                borderRadius: "12px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <img
                src={cat.image || "https://via.placeholder.com/300x200"}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <div className="p-3 text-center">
                <h3
                  className="text-900 font-semibold mb-2"
                  style={{ fontSize: "1.1rem", color: "#333" }}
                >
                  {cat.name}
                </h3>
                <Button
                  label="Shop Now"
                  className="p-button-sm p-button-outlined"
                  onClick={() => navigate(`/show-categories/${cat._id}`)}
                  style={{
                    borderColor: "#0d6efd",
                    color: "#0d6efd",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#0d6efd";
                    e.target.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#0d6efd";
                  }}
                />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableView;
