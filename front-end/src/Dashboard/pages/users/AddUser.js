import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { ADD_USER, BASE_URL } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import { Menu } from "../../../context/menuContext";
import { WindowSize } from "../../../context/WindowContext";
import "./EditUser.css";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const { windowSize } = useContext(WindowSize);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Adding user...");

    try {
      const res = await Axios.post(
        `${BASE_URL}/${ADD_USER}`,
        { name, email, password, role },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        toast.update(toastId, {
          render: "User added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/dashboard/users");
      } else {
        toast.update(toastId, {
          render: "Failed to add user!",
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
      console.error("Add user error:", error);
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
        <h3 className="mb-4 text-center">Add User</h3>
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

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="roleSelect">
            <Form.Label>Select Role:</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">-- Select a role --</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="product manager">Product Manager</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddUser;
