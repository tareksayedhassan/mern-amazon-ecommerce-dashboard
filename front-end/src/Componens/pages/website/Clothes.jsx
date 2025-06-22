import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import { GET_PRODUCT } from "../../../Api/APi";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

const Clothes = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDescoundPro = async () => {
      try {
        const res = await Axios.get(`/${GET_PRODUCT}?category=clothes`);
        const allProducts = res.data.data;

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching clothes products:", error);
      }
    };
    getDescoundPro();
  }, []);

  const getSeverity = (product) => {
    switch (product.status) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warning";
      case "OUTOFSTOCK":
      case "Discontinued":
        return "danger";
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-content-between	">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          Daily
          <span
            style={{
              color: "var(--primary-color)",
              borderBottom: "2px solid var(--primary-color)",
            }}
          >
            Clothes{" "}
          </span>
        </h2>{" "}
        <div className="mt-4 text-left ">
          <Button
            label="View all >"
            className="p-button-text text-primary font-semibold"
            onClick={() => navigate("/clothes")}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-content-center">
        {products.map((product) => (
          <div
            key={product._id}
            className="surface-card border-round-xl shadow-2 p-3 transition-duration-200 hover:shadow-4"
            style={{
              width: "200px",
              position: "relative",
              cursor: "pointer",
              background: "var(--surface-card)",
              overflow: "hidden",
            }}
            onClick={() => navigate(`/product/${product._id}`)}
          >
            {product.clothes && (
              <span
                className="text-xs font-semibold bg-blue-500 text-white px-2 py-1 border-round-md"
                style={{
                  color: "var(--primary-color)",
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  zIndex: 1,
                }}
              >
                {product.discount}% OFF
              </span>
            )}

            <img
              src={product.image?.[0]}
              alt={product.title}
              className="w-full border-round-md mb-2"
              style={{
                height: "120px",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />

            <div className="flex flex-column gap-1">
              <h4
                className="text-base font-semibold m-0 text-900 line-height-2"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.title}
              </h4>
              <p className="text-xs text-600 m-0">
                {product.category?.name || "No Category"}
              </p>
              <Rating
                value={product.rating}
                readOnly
                cancel={false}
                className="mt-1"
                pt={{
                  onIcon: { style: { color: "var(--yellow-500)" } },
                  offIcon: { style: { color: "var(--surface-300)" } },
                }}
              />
              <Tag
                value={product.status}
                severity={getSeverity(product)}
                className="mt-1 text-xs"
                pt={{
                  root: { style: { padding: "0.2rem 0.6rem" } },
                }}
              />
            </div>

            <div className="flex justify-content-between align-items-center mt-3">
              <span className="text-lg font-bold text-primary">
                ${product.price}
              </span>
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded p-button-outlined"
                disabled={product.status === "Discontinued"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                pt={{
                  root: { style: { padding: "0.4rem" } },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clothes;
