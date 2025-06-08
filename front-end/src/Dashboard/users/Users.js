import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, DELETE_USER, USERS } from "../../Api/APi";
import Cookie from "cookie-universal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./Table.css";
import { Link } from "react-router-dom";

const Users = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/${USERS}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data.data.users);
        setFilteredUsers(response.data.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  async function DeleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/${DELETE_USER}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const dataShow = filteredUsers.map((item, index) => (
    <tr key={item._id || index}>
      <th scope="row">{index + 1}</th>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>
        <span
          className={`badge ${
            item.role === "Admin" ? "bg-success" : "bg-primary"
          }`}
        >
          {item.role}
        </span>
      </td>
      <td>
        <button
          onClick={() => DeleteUser(item._id)}
          className="action-btn delete-btn"
          aria-label="Delete user"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
        <button
          className="action-btn edit-btn"
          aria-label="Edit user"
          disabled={loading}
        >
          <Link to={`/dashboard/users/${item._id}`}>
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </Link>
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="users-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users List</h2>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="2x"
            className="text-primary"
          />
        </div>
      ) : (
        <table className="table custom-table align-middle">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>{dataShow}</tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
