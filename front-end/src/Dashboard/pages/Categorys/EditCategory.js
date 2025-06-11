import React, { useEffect, useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, GET_SINGLE_USER, UPDATE_CATEGORY } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { Menu } from "../../../context/menuContext";
import { WindowSize } from "../../../context/WindowContext";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen } = useContext(Menu);
  const { windowSize } = useContext(WindowSize);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Axios.patch(
        `${BASE_URL}/${UPDATE_CATEGORY}/${id}`,
        { name },
        {
          withCredentials: true,
        }
      );

      if (res.data.status === "success") {
        toast.success("User updated successfully!");
        navigate("/dashboard/product-manager");
      } else {
        setLoading(false);
        toast.error("Update failed!");
      }
    } catch (error) {
      toast.error("Update failed!");
      console.error("Update failed:", error);
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
        <h3 className="mb-4 text-center">Edit Category</h3>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <div className="p-field mb-3">
            <label htmlFor="name" className="p-d-block">
              Name
            </label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="p-inputtext-lg p-d-block w-full"
              required
            />
          </div>

          <div className="p-d-flex p-jc-center">
            <Button
              label="Update Changes"
              type="submit"
              className="p-button-lg"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
