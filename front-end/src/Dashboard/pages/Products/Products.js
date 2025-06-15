import React, { useEffect, useState } from "react";
import { GET_PRODUCT } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Galleria } from "primereact/galleria";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "cookie-universal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const fetchProducts = async () => {
    try {
      const res = await Axios.get(`/${GET_PRODUCT}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.data);
    } catch (err) {
      toast.error("Error loading products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openImageGallery = (images) => {
    const fixedImages = images.map((img) =>
      img.includes("uploads/uploads")
        ? img.replace("uploads/uploads", "uploads")
        : img
    );
    setSelectedImages(fixedImages);
    setVisible(true);
    setActiveIndex(0);
  };

  const imageBodyTemplate = (product) => {
    if (
      !product.image ||
      !Array.isArray(product.image) ||
      product.image.length === 0
    ) {
      return (
        <img
          src="http://localhost:4000/uploads/category.webp"
          alt="default"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      );
    }

    const firstImage = product.image[0].includes("uploads/uploads")
      ? product.image[0].replace("uploads/uploads", "uploads")
      : product.image[0];

    return (
      <img
        src={firstImage}
        alt={product.title}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => openImageGallery(product.image)}
        onError={(e) =>
          (e.target.src = "http://localhost:4000/uploads/category.webp")
        }
      />
    );
  };

  const priceBodyTemplate = (product) =>
    product.price
      ? product.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      : "N/A";

  const ratingBodyTemplate = (product) => (
    <Rating value={product.rating || 4} readOnly cancel={false} />
  );

  const statusBodyTemplate = (product) => (
    <Tag value={product.status} severity={getStatusSeverity(product.status)} />
  );

  const getStatusSeverity = (status) => {
    switch (status) {
      case "Available":
        return "success";
      case "Limited Stock":
        return "warning";
      case "Pre-order":
        return "info";
      case "Not available":
      case "Discontinued":
      case "Sold Out":
        return "danger";
      default:
        return null;
    }
  };

  const itemTemplate = (item) => (
    <img
      src={item}
      alt="Product"
      style={{
        width: "100%",
        maxHeight: "400px",
        objectFit: "contain",
        display: "block",
      }}
    />
  );

  const thumbnailTemplate = (item) => (
    <img
      src={item}
      alt="Thumb"
      style={{ width: 50, height: 50, objectFit: "cover", display: "block" }}
    />
  );

  return (
    <div className="card">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <DataTable
        value={products}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column field="title" header="Title" style={{ width: "15%" }} />
        <Column header="Image" body={imageBodyTemplate} />
        <Column field="price" header="Price" body={priceBodyTemplate} />
        <Column field="category.name" header="Category" />
        <Column field="discount" header="Discount" />
        <Column field="about" header="About" />
        <Column field="description" header="Description" />
        <Column field="ratings_number" header="# Ratings" />
        <Column header="Rating" body={ratingBodyTemplate} />
        <Column header="Status" body={statusBodyTemplate} />
      </DataTable>

      <Dialog
        header="Product Images"
        visible={visible}
        style={{ width: "60vw" }}
        onHide={() => setVisible(false)}
      >
        <Galleria
          value={selectedImages}
          activeIndex={activeIndex}
          onItemChange={(e) => setActiveIndex(e.index)}
          item={itemTemplate}
          thumbnail={thumbnailTemplate}
          showItemNavigators
          showThumbnails
          circular
          style={{ maxWidth: "100%" }}
        />
      </Dialog>
    </div>
  );
};

export default Products;
