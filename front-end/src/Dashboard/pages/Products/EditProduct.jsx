import React, { useState, useContext, useEffect, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
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
import clude from "../../../assets/cloud-upload-a30f385a928e44e199a62210d578375a.jpg";

const EditProduct = () => {
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [ratingNumber, setRatingNumber] = useState("");
  const [discount, setDiscount] = useState("");
  const [about, setAbout] = useState("");
  const [status, setStatus] = useState(null);
  const [description, setDescription] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getAllCategories();
    getProductData();
  }, [id]);

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

  const statusOptions = [
    { label: "Available", value: "Available" },
    { label: "Limited Stock", value: "Limited Stock" },
    { label: "Pre-order", value: "Pre-order" },
    { label: "Not available", value: "Not-available" },
    { label: "Discontinued", value: "Discontinued" },
    { label: "Sold Out", value: "Sold Out" },
  ];

  const categoryOptions = categoriesList.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

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
      formData.append("createdBy", decoded?.id || "");
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
    padding: "1rem",
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
              width: "120px",
              height: "120px",
              objectFit: "cover",
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
      <div style={containerStyle}>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Edit Product
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="flex flex-column gap-2">
            <label htmlFor="category">Select Category</label>
            <Dropdown
              value={category}
              options={categoryOptions}
              onChange={(e) => setCategory(e.value)}
              placeholder="Select a category"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>Title</label>
            <InputText
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>Price</label>
            <InputText
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>Description</label>
            <InputText
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>Rating</label>
            <InputText
              type="number"
              maxLength={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Rating"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>Rating Number</label>
            <InputText
              type="number"
              value={ratingNumber}
              onChange={(e) => setRatingNumber(e.target.value)}
              placeholder="Number of Ratings"
              required
            />
          </div>
          {/* الخصم */}
          <div className="flex flex-column gap-2">
            <label>Discount</label>
            <InputText
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Discount"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>About</label>
            <InputText
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="About"
              required
            />
          </div>
          <div className="flex flex-column gap-2">
            <label>Select Status</label>
            <Dropdown
              value={status}
              options={statusOptions}
              onChange={(e) => setStatus(e.value)}
              placeholder="Select Status"
              className="w-full"
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                maxWidth: "500px",
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
                src={clude}
                alt="Upload"
                style={{
                  width: "50px",
                  marginBottom: "10px",
                  objectFit: "contain",
                }}
              />
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                Upload Images
              </span>
            </label>
          </div>

          {imagesPreview}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              label={loading ? "Saving..." : "Save Changes"}
              disabled={loading}
              className="p-button-primary"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
