import React, { useState, useContext, useEffect, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_GATEGORY,
  GET_SINGLE_PRODUCT,
  EDIT_PRODUCT,
  BASE_URL,
} from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { WindowSize } from "../../../context/WindowContext";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Image } from "primereact/image";

const EditProduct = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [ratingNumber, setRatingNumber] = useState("");
  const [discount, setDiscount] = useState("");
  const [about, setAbout] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("accessToken");
  const decoded = useMemo(() => jwtDecode(token), [token]);
  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();
  const { id } = useParams();

  const getAllCategories = async () => {
    try {
      const res = await Axios.get(`/${GET_GATEGORY}`);
      setCategoriesList(res.data.data);
    } catch {
      toast.error("Can't get categories");
    }
  };

  const getProductData = async () => {
    try {
      const res = await Axios.get(`/${GET_SINGLE_PRODUCT}/${id}`);
      const data = res.data.data;
      setCategory(data.category._id || data.category);
      setTitle(data.title);
      setPrice(data.price);
      setDescription(data.description);
      setRating(data.rating);
      setRatingNumber(data.ratings_number);
      setDiscount(data.discount);
      setAbout(data.about);
      setStatus(data.status);
      setImagesList(data.image.map((url) => ({ url })));
    } catch {
      toast.error("Can't fetch product data");
    }
  };

  useEffect(() => {
    getAllCategories();
    getProductData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating Product...");
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("createdBy", decoded.id);
      formData.append("rating", rating);
      formData.append("ratings_number", ratingNumber);
      formData.append("discount", discount);
      formData.append("about", about);
      formData.append("status", status);

      imagesList.forEach((img) => {
        if (img instanceof File) {
          formData.append("image", img);
        }
      });

      const res = await Axios.patch(`/${EDIT_PRODUCT}/${id}`, formData, {
        withCredentials: true,
      });

      if (res.data.status === "success") {
        toast.update(toastId, {
          render: "Product updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/dashboard/products");
      } else {
        toast.update(toastId, {
          render: "Failed to update product!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
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

  const removeImage = (index) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const imagesPreview = (
    <div
      style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        paddingBottom: "10px",
        marginBottom: "1rem",
      }}
    >
      {imagesList.map((item, key) => (
        <div key={key} style={{ position: "relative", flex: "0 0 auto" }}>
          <Image
            src={
              item instanceof File
                ? URL.createObjectURL(item)
                : `${BASE_URL}/${item.url}`
            }
            alt={`preview-${key}`}
            preview
            imageClassName={`custom-preview-image-${key}`}
            style={{
              borderRadius: "10px",
              border: "1px solid #ddd",
              padding: "3px",
            }}
          />
          <button
            onClick={() => removeImage(key)}
            style={{
              position: "absolute",
              top: "1px",
              right: "-5px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            ×
          </button>
          <style>
            {`
            .custom-preview-image-${key} {
              width: 120px !important;
              height: 120px !important;
              object-fit: cover;
              border-radius: 8px;
            }
          `}
          </style>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {loading && <Loading />}
      <div className="edit-user-container" style={containerStyle}>
        <h3 className="mb-4 text-center">Edit Product</h3>
        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Form.Group className="mb-3">
            <Form.Label>Select Category:</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select a category --</option>
              {categoriesList.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              max={5}
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Number of Ratings"
              value={ratingNumber}
              onChange={(e) => setRatingNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>About</Form.Label>
            <Form.Control
              type="text"
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status:</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Available">Available</option>
              <option value="Limited Stock">Limited Stock</option>
              <option value="Pre-order">Pre-order</option>
              <option value="Not-available">Not available</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Sold Out">Sold Out</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" style={{ textAlign: "center" }}>
            <input
              type="file"
              id="upload-images"
              accept="image/*"
              multiple
              onChange={(e) => {
                const filesArray = Array.from(e.target.files);
                const uniqueFiles = filesArray.filter(
                  (file) =>
                    !imagesList.some(
                      (img) =>
                        img.name === file.name &&
                        img.lastModified === file.lastModified
                    )
                );
                setImagesList((prev) => [...prev, ...uniqueFiles]);
                e.target.value = null;
              }}
              style={{ display: "none" }}
            />
            <label
              htmlFor="upload-images"
              style={{
                border: "2px dashed #0086fa",
                borderRadius: "10px",
                padding: "20px",
                width: "100%",
                textAlign: "center",
                cursor: "pointer",
                color: "#0086fa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={require("../../../assets/cloud-upload-a30f385a928e44e199a62210d578375a.jpg")}
                alt="Upload"
                style={{ width: "50px", marginBottom: "10px" }}
              />
              <span>Upload Images</span>
            </label>
          </Form.Group>

          {imagesPreview}

          <Button variant="primary" type="submit" disabled={loading}>
            Save Changes
          </Button>
        </Form>
      </div>
    </>
  );
};

export default EditProduct;
