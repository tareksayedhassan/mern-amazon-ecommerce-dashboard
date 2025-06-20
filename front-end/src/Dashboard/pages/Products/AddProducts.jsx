import React, { useState, useContext, useEffect, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ADD_PRODUCT, BASE_URL, GET_GATEGORY } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { WindowSize } from "../../../context/WindowContext";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Image } from "primereact/image";
import clude from "../../../assets/cloud-upload-a30f385a928e44e199a62210d578375a.jpg";

const AddProducts = () => {
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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const res = await Axios.get(`/${GET_GATEGORY}`);
      setCategoriesList(res.data.data);
    } catch {
      toast.error("Can't get categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

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
    const toastId = toast.loading("Adding Product...");
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
      if (images.length > 0) {
        images.forEach((img) => {
          formData.append("image", img);
        });
      }

      const res = await Axios.post(`${BASE_URL}/${ADD_PRODUCT}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.status === "success") {
        toast.update(toastId, {
          render: "Product added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/dashboard/products");
      } else {
        toast.update(toastId, {
          render: "Failed to add product!",
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
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {loading && <Loading />}
      <div
        className="surface-0 p-4 border-round  m-auto"
        style={{ maxWidth: "700px" }}
      >
        <h3 className="text-center mb-5 text-2xl font-bold">Add Product</h3>

        <form onSubmit={handleSubmit} className="flex flex-column gap-4">
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
          <div className="flex flex-column align-items-center">
            <input
              type="file"
              id="upload-images"
              accept="image/*"
              multiple
              onChange={(e) => {
                const filesArray = Array.from(e.target.files);
                const uniqueFiles = filesArray.filter(
                  (file) =>
                    !images.some(
                      (img) =>
                        img.name === file.name &&
                        img.lastModified === file.lastModified
                    )
                );
                setImages((prev) => [...prev, ...uniqueFiles]);
                e.target.value = null;
              }}
              className="hidden"
            />
            <label
              htmlFor="upload-images"
              style={{
                border: "2px dashed #0086fa",
                borderRadius: "10px",
                padding: "20px",
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
                cursor: "pointer",
                color: "#0086fa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <img
                src={clude}
                alt="Upload"
                style={{
                  width: "80px",
                  marginBottom: "10px",
                  objectFit: "contain",
                }}
              />
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                Upload Images
              </span>
            </label>
          </div>
          <div className="flex gap-3 overflow-auto py-2 w-full">
            {images.map((item, key) => (
              <div
                key={key}
                className="relative border-1 surface-border border-round overflow-hidden"
                style={{
                  width: "150px",
                  height: "150px",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={URL.createObjectURL(item)}
                  alt={`preview-${key}`}
                  preview
                  imageClassName="w-full h-full border-round"
                  pt={{
                    previewContainer: {
                      style: {
                        width: "95vw",
                        maxWidth: "720px",
                        height: "auto",
                        margin: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    },
                    previewImage: {
                      style: {
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "12px",
                      },
                    },
                  }}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
                <Button
                  icon="pi pi-times"
                  rounded
                  text
                  severity="danger"
                  className="absolute top-0 right-0 m-1 z-3"
                  type="button"
                  onClick={() => removeImage(key)}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "50%",
                    width: "26px",
                    height: "26px",
                    padding: 0,
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-content-center mt-4">
            <Button type="submit" label="Add Product" icon="pi pi-plus" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProducts;
