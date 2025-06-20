import React, { useState, useContext, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ADD_BRAND, BASE_URL } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { WindowSize } from "../../../context/WindowContext";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Image } from "primereact/image";
import clude from "../../../assets/cloud-upload-a30f385a928e44e199a62210d578375a.jpg";

const AddBrand = () => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [logo, setLogo] = useState(null);
  const [status, setStatus] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const navigate = useNavigate();
  const { windowSize } = useContext(WindowSize);

  const statusOptions = [
    { label: "unqualified", value: "unqualified" },
    { label: "qualified", value: "qualified" },
    { label: "new", value: "new" },
    { label: "negotiation", value: "negotiation" },
    { label: "renewal", value: "renewal" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Adding Brand...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("country", country);
      formData.append("status", status);
      formData.append("verified", verified ? "true" : "false"); // important!
      formData.append("createdBy", decoded?.id || "");
      if (logo) {
        formData.append("image", logo); // key must match multer field name
      }

      const res = await Axios.post(`${BASE_URL}/${ADD_BRAND}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.status === "SUCCESS") {
        toast.update(toastId, {
          render: "Brand added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/dashboard/brand");
      } else {
        toast.update(toastId, {
          render: "Failed to add brand!",
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
      console.error(
        "Error adding brand:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div
        className="surface-0 p-4 border-round m-auto"
        style={{ maxWidth: "700px" }}
      >
        <h3 className="text-center mb-5 text-2xl font-bold">Add Brand</h3>

        <form onSubmit={handleSubmit} className="flex flex-column gap-4">
          <div className="flex align-items-center gap-2">
            <label htmlFor="verified">Verified</label>
            <input
              type="checkbox"
              id="verified"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label>Brand Name</label>
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brand name..."
              required
            />
          </div>

          <div className="flex flex-column gap-2">
            <label>Country</label>
            <InputText
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country..."
              required
            />
          </div>

          <div className="flex flex-column gap-2">
            <label>Status</label>
            <Dropdown
              value={status}
              options={statusOptions}
              onChange={(e) => setStatus(e.value)}
              placeholder="Select Status"
              className="w-full"
              required
            />
          </div>

          {/* Upload */}
          <div className="flex flex-column align-items-center">
            <input
              type="file"
              id="upload-logo"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="upload-logo"
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
                Upload Logo
              </span>
            </label>
          </div>

          {/* Preview */}
          {logo && (
            <div className="flex justify-content-center py-2">
              <div
                className="relative border-1 surface-border border-round overflow-hidden"
                style={{ width: "150px", height: "150px" }}
              >
                <Image
                  src={URL.createObjectURL(logo)}
                  alt="preview-logo"
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
                  onClick={() => setLogo(null)}
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
            </div>
          )}

          <div className="flex justify-content-center mt-4">
            <Button type="submit" label="Add Brand" icon="pi pi-plus" />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBrand;
