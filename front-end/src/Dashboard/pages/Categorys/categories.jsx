import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import Cookie from "cookie-universal";
import { BASE_URL, DELETE_CATEGORY, GET_GATEGORY } from "../../../Api/APi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Table.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
const Categories = () => {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCategory, setFilteredCategory] = useState([]);

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
  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await Axios.delete(`${BASE_URL}/${DELETE_CATEGORY}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategory((prev) => prev.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Delete Error:", error);
    }
  };

  // handel Search
  useEffect(() => {
    const result = category.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(search.toLowerCase()) ||
        cat.createdBy.name
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        cat.createdBy.email
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase())
    );
    setFilteredCategory(result);
  }, [category, search]);

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

      <DataTable
        value={filteredCategory}
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

export default Categories;
