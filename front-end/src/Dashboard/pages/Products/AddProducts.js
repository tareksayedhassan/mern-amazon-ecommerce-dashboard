import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { ADD_PRODUCT, BASE_URL, GET_GATEGORY } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { WindowSize } from "../../../context/WindowContext";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Image } from "primereact/image";

const AddProducts = () => {
  const [category, setcategory] = useState("");
  const [title, settitle] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [rating_number, setRatingNumber] = useState("");
  const [discount, setdiscount] = useState("");
  const [about, setabout] = useState("");
  const [status, setStatus] = useState("");
  const [description, setdescription] = useState("");
  const [image, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("accessToken");
  const decoded = useMemo(() => jwtDecode(token), [token]);
  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const res = await Axios.get(`/${GET_GATEGORY}`);
      setCategoriesList(res.data.data);
    } catch (err) {
      toast.error("Can't get categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

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
      formData.append("createdBy", decoded.id);
      formData.append("rating", rating);
      formData.append("ratings_number", rating_number);
      formData.append("discount", discount);
      formData.append("about", about);
      formData.append("status", status);
      if (image && image.length > 0) {
        image.forEach((img) => {
          formData.append("image", img);
        });
      }

      const res = await Axios.post(`${BASE_URL}/${ADD_PRODUCT}`, formData, {
        headers: {
          Authorization: `accessToken ${token}`,
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

  const containerStyle = {
    maxWidth: windowSize < 768 ? "100%" : "700px",
    margin: "0 auto",
    padding: windowSize < 768 ? "0.75rem" : "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const images = (
    <div
      style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        paddingBottom: "10px",
        marginBottom: "1rem",
      }}
    >
      {image.map((item, key) => (
        <div key={key} style={{ position: "relative", flex: "0 0 auto" }}>
          <Image
            src={URL.createObjectURL(item)}
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
        <h3 className="mb-4 text-center">Add Product</h3>

        <Form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "1650px" }}
        >
          <Form.Group className="mb-3" controlId="categorySelect">
            <Form.Label>Select Category:</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setcategory(e.target.value)}
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
          <Form.Group className="mb-3" controlId="formtitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Product title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Rating"
              maxLength={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRatingNumber">
            <Form.Label>Rating Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Number of Ratings"
              value={rating_number}
              onChange={(e) => setRatingNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formdiscount">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setdiscount(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formabout">
            <Form.Label>About</Form.Label>
            <Form.Control
              type="text"
              placeholder="about"
              value={about}
              onChange={(e) => setabout(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="categorySelect">
            <Form.Label>Select Status:</Form.Label>
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
          <Form.Group
            className="mb-3"
            controlId="formImage"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
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
                    !image.some(
                      (img) =>
                        img.name === file.name &&
                        img.lastModified === file.lastModified
                    )
                );
                setImages((prev) => [...prev, ...uniqueFiles]);
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
          <div>{images}</div>
          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddProducts;
