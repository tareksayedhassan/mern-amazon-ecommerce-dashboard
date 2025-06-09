import React, { useEffect, useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, GET_SINGLE_USER, UPDATE_USER } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { Menu } from "../../../context/menuContext";
import { WindowSize } from "../../../context/WindowContext";
import "./EditUser.css";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOpen } = useContext(Menu);
  const { windowSize } = useContext(WindowSize);
  const [role, setrole] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await Axios.get(`${GET_SINGLE_USER}/${id}`, {
          withCredentials: true,
        });
        setName(data.data.user.name);
        setEmail(data.data.user.email);
        setrole(data.data.user.role);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const res = await Axios.patch(
        `${BASE_URL}/${UPDATE_USER}/${id}`,
        { name, email, role },
        {
          withCredentials: true,
        }
      );

      if (res.data.status === "success") {
        toast.success("User updated successfully!");
        navigate("/dashboard/users");
      } else {
        setloading(false);
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
        <h3 className="mb-4 text-center">Edit User</h3>
        <Form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="roleSelect">
            <Form.Label>Select Role:</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setrole(e.target.value)}
              aria-label="Select a role"
            >
              <option value="">-- Select a role --</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
              <option value="user">User</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit" disabled={loading}>
              Update Changes
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditUser;
