import { useState, useEffect, useContext } from "react";
import axios from "axios";
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
import "primereact/resources/themes/lara-light-blue/theme.css";

const Users = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const { windowSize } = useContext(WindowSize);

  // Decode token
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

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        toast.info("Loading users...", { autoClose: 1000 });

        const decoded = jwtDecode(token);
        const currentUserId = decoded.id;

        const response = await axios.get(`${BASE_URL}/${USERS}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  // Handle Search
  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  // Handle Delete
  const DeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      toast.info("Deleting user...");
      await axios.delete(`${BASE_URL}/${DELETE_USER}/${id}`, {
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

  // Badge Template
  const roleTemplate = (rowData) => (
    <span
      className={`badge ${
        rowData.role === "Admin" ? "bg-success" : "bg-primary"
      }`}
    >
      {rowData.role}
    </span>
  );

  // Actions Template
  const actionsTemplate = (rowData) => (
    <div className="d-flex gap-2">
      <button
        onClick={() => DeleteUser(rowData._id)}
        className="btn btn-sm btn-danger"
        disabled={loading}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <Link to={`/dashboard/users/edit/${rowData._id}`}>
        <button className="btn btn-sm btn-secondary" disabled={loading}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </Link>
    </div>
  );

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" limit={2} />
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h2>Users List</h2>
        <Link to="/dashboard/users/add" className="btn btn-primary">
          Add User
        </Link>
        <div className="input-group w-auto">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        value={filteredUsers}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "60rem" }}
        loading={loading}
        emptyMessage="No users found."
      >
        <Column field="name" header="Name" style={{ width: "20%" }} />
        <Column field="email" header="Email" style={{ width: "30%" }} />
        <Column header="Role" body={roleTemplate} style={{ width: "15%" }} />
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
