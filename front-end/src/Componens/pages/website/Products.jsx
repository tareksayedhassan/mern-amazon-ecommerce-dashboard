import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import { GET_PRODUCT } from "../../../Api/APi";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { useCart } from "../../../context/CartContext";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [layout, setLayout] = useState("grid");
  const { addToCart } = useCart();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await Axios.get(`/${GET_PRODUCT}`);
        setProduct(res.data.data);
      } catch (error) {
        toast.error("Can't get products");
      }
    };
    getProduct();
  }, []);

  const itemTemplate = (product, layout) => {
    if (!product) return;

    return (
      <div className="col-12 md:col-4 lg:col-3 p-2">
        <Card
          title={product.name}
          subTitle={`Price: ${product.price}$`}
          className="shadow-3"
        >
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full"
            style={{ height: "200px", objectFit: "cover" }}
          />
          <p className="mt-3">{product.description}</p>
          <Button
            label="Buy Now"
            icon="pi pi-shopping-cart"
            className="mt-2"
            onClick={() => addToCart()}
          />
        </Card>
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-content-between align-items-center p-2">
        <h2 className="m-0 text-xl font-semibold text-primary">🛍 Products</h2>
        <div>
          <Button
            icon="pi pi-th-large"
            className="mr-2"
            onClick={() => setLayout("grid")}
            severity={layout === "grid" ? "primary" : "secondary"}
            text
          />
          <Button
            icon="pi pi-bars"
            onClick={() => setLayout("list")}
            severity={layout === "list" ? "primary" : "secondary"}
            text
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <DataView
        value={product}
        layout={layout}
        itemTemplate={itemTemplate}
        header={header()}
      />
    </div>
  );
};

export default Products;
