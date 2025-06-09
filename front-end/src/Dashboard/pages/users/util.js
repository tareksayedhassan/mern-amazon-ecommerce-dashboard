import {
  faEdit,
  faSearch,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL, DELETE_USER } from "../../../Api/APi";
import Cookie from "cookie-universal";
import { toast } from "react-toastify";

const Util = ({
  users,
  setUsers,
  filteredUsers,
  setFilteredUsers,
  loading,
  setLoading,
  search,
  setSearch,
  windowSize,
}) => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  // Delete user
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

  const dataShow = filteredUsers.map((item, index) => (
    <tr key={item._id}>
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
          disabled={loading}
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
        <Link to={`/dashboard/users/edit/${item._id}`}>
          <button className="action-btn edit-btn" disabled={loading}>
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </button>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="users-container">
      <ToastContainer position="top-right" limit={3} />
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>Users List</h2>
        <Link to="/dashboard/users/add" className="btn btn-primary">
          Add User
        </Link>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="    Search by name or email..."
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
      ) : windowSize < 768 ? (
        <div className="users-cards">
          {filteredUsers.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            filteredUsers.map((user, index) => (
              <div key={user._id} className="card mb-3 p-3 shadow-sm">
                <h5>{user.name}</h5>
                <p>{user.email}</p>
                <p>
                  <span
                    className={`badge ${
                      user.role === "Admin" ? "bg-success" : "bg-primary"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
                <div>
                  <button
                    onClick={() => DeleteUser(user._id)}
                    className="btn btn-sm btn-danger me-2"
                    disabled={loading}
                  >
                    Delete
                  </button>
                  <Link to={`/dashboard/users/edit/${user._id}`}>
                    <button
                      className="btn btn-sm btn-secondary"
                      disabled={loading}
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="table-responsive">
          {filteredUsers.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{dataShow}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Util;
