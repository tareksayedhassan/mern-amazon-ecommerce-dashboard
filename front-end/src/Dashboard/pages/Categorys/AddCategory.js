import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
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
  const decoded = jwtDecode(token);
  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Adding Category...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("createdBy", decoded.id);
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
        navigate("/dashboard/product-manager");
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
    margin: "0 auto",
    padding: windowSize < 768 ? "0.75rem" : "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <>
      {loading && <Loading />}
      <div className="edit-user-container" style={containerStyle}>
        <h3 className="mb-4 text-center">Add Category</h3>
        <Form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddCategory;
