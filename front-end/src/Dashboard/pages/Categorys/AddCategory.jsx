import React, { useState, useContext, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useNavigate } from "react-router-dom";
import { ADD_CATEGORY, BASE_URL } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { WindowSize } from "../../../context/WindowContext";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import "./Category.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Adding Category...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("createdBy", decoded?.id || "");
      if (image) {
        formData.append("image", image);
      }

      const res = await Axios.post(`${BASE_URL}/${ADD_CATEGORY}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.status === "success") {
        toast.update(toastId, {
          render: "Category added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/dashboard/categories");
      } else {
        toast.update(toastId, {
          render: "Failed to add category!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Add category error:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: windowSize < 768 ? "100%" : "700px",
  };

  return (
    <>
      {loading && <Loading />}
      <div
        className="mx-auto p-3 flex flex-column align-items-center"
        style={containerStyle}
      >
        <h3 className="mb-4 text-2xl font-semibold text-center">
          Add Category
        </h3>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-column gap-3"
          style={{ maxWidth: "400px" }}
        >
          {/* الاسم */}
          <div className="flex flex-column mb-3">
            <label htmlFor="name" className="mb-2 text-900 font-medium">
              Name
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              required
              className="w-full"
            />
          </div>

          <div className="flex flex-column mb-3">
            <label htmlFor="image" className="mb-2 text-900 font-medium">
              Image
            </label>
            <FileUpload
              name="image"
              accept="image/*"
              mode="basic"
              auto
              customUpload
              chooseLabel="Choose Image"
              onSelect={(e) => setImage(e.files[0])}
              className="w-full"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-3 border-round shadow-2"
                style={{ width: "160px", height: "160px", objectFit: "cover" }}
              />
            )}
          </div>

          <div className="flex justify-content-center">
            <Button
              type="submit"
              label="Add Category"
              className="p-button-primary"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
