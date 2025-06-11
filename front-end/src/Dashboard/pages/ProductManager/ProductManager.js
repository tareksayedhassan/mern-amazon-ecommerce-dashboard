// ProductManager.js
import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import Cookie from "cookie-universal";
import { GET_GATEGORY } from "../../../Api/APi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Table.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const ProductManager = () => {
  const [category, setCategory] = useState([]);
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await Axios.get(`/${GET_GATEGORY}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setCategory(data);
      toast.success("Categories loaded successfully");
    } catch (error) {
      toast.error("Failed to load categories");
      console.error("Error fetching categories:", error);
      setCategory([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const editCategory = (rowData) => {
    navigate(`/dashboard/edit-Category/${rowData._id}`);
  };

  const deleteCategory = (id) => {
    console.log("Delete category:", id);
  };

  const imageBodyTemplate = (rowData) => {
    let imageUrl = rowData.image;

    if (imageUrl?.includes("uploads/uploads")) {
      imageUrl = imageUrl.replace("uploads/uploads", "uploads");
    }

    return imageUrl ? (
      <img
        src={imageUrl}
        alt={rowData.name || "Category Image"}
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "http://localhost:4000/uploads/category.webp";
        }}
      />
    ) : (
      <span>No Image Found</span>
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <DataTable
        value={category}
        paginator
        rows={5}
        responsiveLayout="scroll"
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
      >
        <Column field="name" header="Category Name" style={{ width: "20%" }} />
        <Column header="Image" body={imageBodyTemplate} />
        <Column
          field="createdBy.name"
          header="Created By"
          style={{ width: "30%" }}
        />
        <Column
          field="createdBy.email"
          header="Creator Email"
          style={{ width: "30%" }}
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="action-buttons">
              <Button
                label="Edit"
                severity="secondary"
                rounded
                onClick={() => editCategory(rowData)}
                className="p-button-sm"
              />
              <Button
                label="Delete"
                severity="danger"
                rounded
                onClick={() => deleteCategory(rowData._id)}
                className="p-button-sm"
              />
            </div>
          )}
        />
      </DataTable>
    </>
  );
};

export default ProductManager;
