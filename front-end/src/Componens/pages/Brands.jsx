import React, { useEffect, useState } from "react";
import { Axios } from "../../Api/Axios";
import { GET_BRANDS } from "../../Api/APi";
import { Carousel } from "primereact/carousel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const Brands = () => {
  const [Brands, setBrands] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await Axios.get(`/${GET_BRANDS}`);
        setBrands(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Brands");
      }
    };

    fetchBrand();
  }, []);
  const BrandsTemplate = (bra) => {
    return (
      <div
        className=" border-round surface-card flex align-items-center justify-content-center"
        style={{
          width: "330px",
          height: "200px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #eee",
          margin: "auto",
          backgroundColor: "#fff",
        }}
      >
        <img
          src={bra.logo}
          alt="brand"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "10px",
          }}
          onError={(e) => {
            e.target.src = "http://localhost:4000/uploads/category.webp";
          }}
        />
      </div>
    );
  };

  return (
    <div className="p-5 surface-100 text-center">
      <div className="flex justify-content-between">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          Shop By
          <span
            style={{
              color: "var(--primary-color)",
              borderBottom: "2px solid var(--primary-color)",
            }}
          >
            Brand{" "}
          </span>
        </h2>{" "}
        <div className="mt-4 text-left ">
          <Button
            label="View all >"
            className="p-button-text text-primary font-semibold"
            onClick={() => navigate("/brands")}
          />
        </div>
      </div>

      <Carousel
        value={Brands}
        itemTemplate={BrandsTemplate}
        autoplayInterval={3000}
        circular
        showIndicators
        showNavigators
        numScroll={1}
        numVisible={4}
        responsiveOptions={[
          { breakpoint: "1024px", numVisible: 3, numScroll: 1 },
          { breakpoint: "768px", numVisible: 2, numScroll: 1 },
          { breakpoint: "560px", numVisible: 1, numScroll: 1 },
        ]}
      />
    </div>
  );
};

export default Brands;
