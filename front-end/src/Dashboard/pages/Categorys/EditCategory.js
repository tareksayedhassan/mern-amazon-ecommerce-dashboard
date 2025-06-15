import React, { useEffect, useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { useNavigate, useParams } from "react-router-dom";
import {
  BASE_URL,
  GET_SINGLE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { Menu } from "../../../context/menuContext";
import { WindowSize } from "../../../context/WindowContext";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen } = useContext(Menu);
  const { windowSize } = useContext(WindowSize);

  const fetchCategory = async () => {
    try {
      const res = await Axios.get(`${BASE_URL}/${GET_SINGLE_CATEGORY}/${id}`, {
        withCredentials: true,
      });
      const category = res.data.data;
      setName(category.name);
      setPreview(category.image);
    } catch (err) {
      toast.error("Failed to fetch category");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const res = await Axios.patch(
        `${BASE_URL}/${UPDATE_CATEGORY}/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success("Category updated successfully!");
        navigate("/dashboard/categories");
      } else {
        toast.error("Update failed!");
      }
    } catch (error) {
      toast.error("Update failed!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <Card
        title="Edit Category"
        className="m-auto mt-5"
        style={{
          maxWidth: "500px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleSubmit} className="p-fluid">
          {/* Name Input */}
          <div className="field mb-4">
            <label htmlFor="name">Category Name</label>
            <InputText
              id="name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Current Image Preview */}
          {preview && (
            <div className="text-center mb-4">
              <p className="mb-2">Current Image:</p>
              <img
                src={preview}
                alt="Current"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}

          {/* File Upload */}
          <div className="field mb-4">
            <label htmlFor="image">Upload New Image (optional)</label>
            <FileUpload
              mode="basic"
              name="image"
              accept="image/*"
              customUpload
              chooseLabel="Choose"
              onSelect={(e) => setImage(e.files[0])}
              auto={false}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            label="Update Category"
            icon="pi pi-check"
            type="submit"
            className="p-button-success w-full"
            disabled={loading}
          />
        </form>
      </Card>
    </>
  );
};

export default EditCategory;
