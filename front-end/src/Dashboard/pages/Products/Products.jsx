import React, { useEffect, useState } from "react";
import { DELETE_PRODUCT, GET_PRODUCT } from "../../../Api/APi";
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
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const navigate = useNavigate();
  const truncateText = (text, maxWords) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const fetchProducts = async (page, limit) => {
    try {
      const res = await Axios.get(
        `/${GET_PRODUCT}?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(res.data.data);
      setTotalRecords(res.data.total);
      setCurrentPage(res.data.page);
    } catch (err) {
      toast.error("Error loading products");
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, search]);

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
    const img =
      product.image?.[0]?.replace("uploads/uploads", "uploads") ||
      "http://localhost:4000/uploads/category.webp";

    return (
      <img
        src={img}
        alt={product.title}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => openImageGallery(product.image || [])}
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
      style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
    />
  );

  const thumbnailTemplate = (item) => (
    <img
      src={item}
      alt="Thumb"
      style={{ width: 50, height: 50, objectFit: "cover" }}
    />
  );

  const DELETEPRODUCT = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Product?"
    );
    if (!confirmDelete) return;

    try {
      await Axios.delete(`/${DELETE_PRODUCT}/${id}`);
      fetchProducts(currentPage, rowsPerPage);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete Product");
    }
  };

  const editProduct = (rowData) => {
    navigate(`/dashboard/edit/products/${rowData._id}`);
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1px",
        }}
      >
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </IconField>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <DataTable
        value={products}
        lazy
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        first={(currentPage - 1) * rowsPerPage}
        onPage={(e) => {
          setCurrentPage(e.page + 1);
          setRowsPerPage(e.rows);
        }}
        rowsPerPageOptions={[5, 10, 20]}
        tableStyle={{ minWidth: "60rem" }}
        emptyMessage="No products found."
      >
        <Column field="title" header="Title" style={{ width: "15%" }} />
        <Column header="Image" body={imageBodyTemplate} />
        <Column field="price" header="Price" body={priceBodyTemplate} />
        <Column field="category.name" header="Category" />
        <Column field="discount" header="Discount" />
        <Column
          field="about"
          header="About"
          body={(rowData) => truncateText(rowData.about, 5)}
        />
        <Column
          field="description"
          header="Description"
          body={(rowData) => truncateText(rowData.about, 5)}
        />
        <Column field="ratings_number" header="Ratings" />
        <Column header="Rating" body={ratingBodyTemplate} />
        <Column header="Status" body={statusBodyTemplate} />
        <Column
          header="Actions"
          body={(rowData) => (
            <div
              className="action-buttons"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <Button
                label="Edit"
                severity="secondary"
                rounded
                onClick={() => editProduct(rowData)}
                className="p-button-sm"
              />
              <Button
                label="Delete"
                severity="danger"
                rounded
                onClick={() => DELETEPRODUCT(rowData._id)}
                className="p-button-sm"
              />
            </div>
          )}
        />
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
        />
      </Dialog>
    </div>
  );
};

export default Products;
