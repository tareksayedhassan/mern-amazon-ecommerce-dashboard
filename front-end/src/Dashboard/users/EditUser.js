import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, GET_SINGLE_USER, UPDATE_USER } from "../../Api/APi";
import { Axios } from "../../Api/Axios";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { id } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await Axios.get(`${GET_SINGLE_USER}/${id}`, {
          withCredentials: true,
        });
        console.log(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.patch(
        `${BASE_URL}/${UPDATE_USER}/${id}`,
        { name, email },
        {
          withCredentials: true,
        }
      );
      // navigate("/dashboard/users");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center">Edit User</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
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
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Update Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditUser;
