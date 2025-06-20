import React, { useEffect, useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, GET_SINGLE_USER, UPDATE_USER } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { WindowSize } from "../../../context/WindowContext";
import { Menu } from "../../../context/menuContext";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { windowSize } = useContext(WindowSize);

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Product Manager", value: "product manager" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await Axios.get(`${GET_SINGLE_USER}/${id}`, {
          withCredentials: true,
        });
        const user = data.data.user;
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user");
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Updating user...");

    try {
      const res = await Axios.patch(
        `${BASE_URL}/${UPDATE_USER}/${id}`,
        { name, email, role },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        toast.update(toastId, {
          render: "User updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/dashboard/users");
      } else {
        toast.update(toastId, {
          render: "Failed to update user!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setLoading(false);
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Update error:", error);
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

  return (
    <>
      {loading && <Loading />}
      <div style={containerStyle}>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Edit User
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="flex flex-column gap-2">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
              className="w-full"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              className="w-full"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="role">Select Role</label>
            <Dropdown
              id="role"
              value={role}
              options={roleOptions}
              onChange={(e) => setRole(e.value)}
              placeholder="-- Select Role --"
              className="w-full"
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              label={loading ? "Updating..." : "Update User"}
              className="p-button-primary"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;
