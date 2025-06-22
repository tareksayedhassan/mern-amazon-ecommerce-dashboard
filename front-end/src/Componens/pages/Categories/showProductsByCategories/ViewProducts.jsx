import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_SINGLE_CATEGORY } from "../../../../Api/APi";
import { Axios } from "../../../../Api/Axios";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Image } from "primereact/image";

const Viewproducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [productss, setproductss] = useState([]);
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await Axios.get(`${GET_SINGLE_CATEGORY}/${id}`);
        setCategory(res.data.data.category);
        setproductss(res.data.data.products);
        console.log(res.data.data.products);
      } catch (error) {
        toast.error("Cannot get Category");
        console.error(error);
      }
    };
    fetchCategoryData();
  }, [id]);
  const getSeverity = (products) => {
    switch (products.status?.toLowerCase()) {
      case "available":
        return "success";
      case "limited stock":
        return "warning";
      case "pre-order":
        return "info";
      case "not available":
      case "discontinued":
      case "sold out":
        return "danger";
      default:
        return "info"; // افتراضي لو فيه حالة مش متوقعة
    }
  };

  const listItem = (products, index) => {
    return (
      <div className="col-12" key={products.id}>
        <div
          className={classNames(
            "flex flex-column xl:flex-row xl:align-items-start p-3 gap-3",
            { "border-top-1 surface-border": index !== 0 }
          )}
        >
          <Image
            src={
              Array.isArray(products.image) && products.image.length > 0
                ? `http://localhost:4000/uploads/${products.image[0]}`
                : "http://localhost:4000/uploads/category.webp"
            }
            alt={products.title}
            imageClassName="w-6rem h-6rem shadow-2 border-round"
            preview
            onError={(e) => {
              e.target.src = "http://localhost:4000/uploads/category.webp";
            }}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-3">
            <div className="flex flex-column align-items-center sm:align-items-start gap-2">
              <div className="text-lg font-semibold text-900">
                {products.name}
              </div>
              <Rating value={products.rating} readOnly cancel={false} />
              <div className="flex align-items-center gap-2 text-sm">
                <span className="flex align-items-center gap-1">
                  <i className="pi pi-tag"></i>
                  <span className="font-medium">{products.category}</span>
                </span>
                <Tag value={products.status} severity={getSeverity(products)} />
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-2 sm:gap-1">
              <span className="text-lg font-semibold">${products.price}</span>
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded p-button-sm"
                disabled={products.inventoryStatus === "OUTOFSTOCK"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  const gridItem = (products) => {
    return (
      <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2" key={products.id}>
        <div
          className="p-3 border-1 surface-border surface-card border-round shadow-1 hover:shadow-4 transition-shadow"
          style={{ position: "relative" }}
        >
          <Tag
            value={products.status}
            severity={getSeverity(products)}
            className=" px-3 py-1 border-round "
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "0.75rem",
            }}
          />

          <div className="flex align-items-center justify-content-between mb-2 mt-4">
            <div className="flex align-items-center gap-2 text-sm">
              <i className="pi pi-tag text-primary"></i>
              <span className="font-medium">{products.category}</span>
            </div>
          </div>

          <div className="flex flex-column align-items-center gap-2 mb-3">
            <Image
              src={
                Array.isArray(products.image) && products.image.length > 0
                  ? `http://localhost:4000/uploads/${products.image[0]}`
                  : "http://localhost:4000/uploads/category.webp"
              }
              alt={products.title}
              imageClassName="w-8rem h-8rem shadow-2 border-round"
              preview
              onError={(e) => {
                e.target.src = "http://localhost:4000/uploads/category.webp";
              }}
            />
            <div className="text-md font-semibold text-center">
              {products.name}
            </div>
            <Rating value={products.rating} readOnly cancel={false} />
          </div>

          <div className="flex align-items-center justify-content-between">
            <span className="text-lg font-bold text-primary">
              ${products.price}
            </span>
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded p-button-sm"
              disabled={products.status?.toLowerCase() === "out of stock"}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (products, layout, index) => {
    if (!products) {
      return;
    }

    if (layout === "list") return listItem(products, index);
    else if (layout === "grid") return gridItem(products);
  };

  const listTemplate = (productss, layout) => {
    return (
      <div className="grid grid-nogutter">
        {productss.map((products, index) =>
          itemTemplate(products, layout, index)
        )}
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-content-end">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <DataView
        value={productss}
        listTemplate={listTemplate}
        layout={layout}
        header={header()}
      />
    </div>
  );
};

export default Viewproducts;
