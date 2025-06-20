import React, { useEffect, useState } from "react";
import { Axios } from "../../Api/Axios";
import { GET_GATEGORY } from "../../Api/APi";
import { Carousel } from "primereact/carousel";
import { toast } from "react-toastify";

const Brands = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`);
        setCategories(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const categoryTemplate = (cat) => {
    return (
      <div className="flex flex-column align-items-center p-3">
        <img
          src={cat.image}
          alt={cat.name}
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
        <p className="mt-2 text-lg font-medium">{cat.name}</p>
      </div>
    );
  };

  return (
    <div className="p-5 surface-100 text-center">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "rgba(0,0,0,0.3)" }}
      >
        Shop by{" "}
        <span
          style={{
            color: "var(--primary-color)",
            borderBottom: "2px solid var(--primary-color)",
          }}
        >
          Brand
        </span>
      </h2>

      <Carousel
        value={categories}
        itemTemplate={categoryTemplate}
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
