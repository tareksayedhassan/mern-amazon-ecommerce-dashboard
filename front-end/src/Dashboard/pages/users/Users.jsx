import React, { useState, useEffect, useContext } from "react";
import { BASE_URL, USERS, DELETE_USER } from "../../../Api/APi";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WindowSize } from "../../../context/WindowContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Axios } from "../../../Api/Axios";

const Users = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const { windowSize } = useContext(WindowSize);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        toast.info("Loading users...", { autoClose: 1000 });

        const decoded = jwtDecode(token);
        const currentUserId = decoded.id;

        const response = await Axios.get(`${BASE_URL}/${USERS}`, {
          headers: { Authorization: ` ${token}` },
        });

        const allUsers = response.data.data.users;
        const filtered = allUsers.filter((user) => user._id !== currentUserId);

        setUsers(filtered);
        setFilteredUsers(filtered);
        setLoading(false);
        toast.success("Users loaded successfully");
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error("Failed to load users");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const DeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      toast.info("Deleting user...");
      await Axios.delete(`/${DELETE_USER}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setLoading(false);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to delete user");
    }
  };

  const roleTemplate = (rowData) => (
    <span
      style={{
        backgroundColor: rowData.role === "Admin" ? "#10b981" : "#3b82f6",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "12px",
        fontSize: "0.85rem",
      }}
    >
      {rowData.role}
    </span>
  );

  const actionsTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon={<FontAwesomeIcon icon={faTrash} />}
        className="p-button-danger p-button-sm"
        onClick={() => DeleteUser(rowData._id)}
        disabled={loading}
      />
      <Link to={`/dashboard/users/edit/${rowData._id}`}>
        <Button
          icon={<FontAwesomeIcon icon={faEdit} />}
          className="p-button-secondary p-button-sm"
          disabled={loading}
        />
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem" }}>
      <ToastContainer position="top-right" limit={2} />
      <div
        className="flex flex-wrap justify-content-between align-items-center mb-4"
        style={{ gap: "1rem" }}
      >
        <h2 style={{ margin: 0 }}>Users List</h2>
        <Link to="/dashboard/users/add">
          <Button label="Add User" icon="pi pi-plus" className="p-button-sm" />
        </Link>
        <span className="p-input-icon-left w-full md:w-20rem">
          <FontAwesomeIcon icon={faSearch} className="p-input-icon" />
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full"
          />
        </span>
      </div>

      <DataTable
        value={filteredUsers}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={loading}
        emptyMessage="No users found."
        scrollable
        scrollHeight="400px"
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column field="name" header="Name" style={{ width: "25%" }} />
        <Column field="email" header="Email" style={{ width: "35%" }} />
        <Column header="Role" body={roleTemplate} style={{ width: "20%" }} />
        <Column
          header="Actions"
          body={actionsTemplate}
          style={{ width: "20%" }}
        />
      </DataTable>
    </div>
  );
};

export default Users;
