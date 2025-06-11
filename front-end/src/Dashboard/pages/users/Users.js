import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL, USERS } from "../../../Api/APi";
import Cookie from "cookie-universal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Table.css";
import { jwtDecode } from "jwt-decode";
import { WindowSize } from "../../../context/WindowContext";
import Util from "./util";

const Users = () => {
  const cookie = Cookie();
  const token = cookie.get("Bearer");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const { windowSize } = useContext(WindowSize);
  const [currentUser, setCurrentUser] = useState("");

  // Decode token to get user ID
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

  // Fetch all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        toast.info("Loading users...", { autoClose: 1000 });

        // decode token
        const decoded = jwtDecode(token);
        const currentUserId = decoded.id;

        // get all users
        const response = await axios.get(`${BASE_URL}/${USERS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = response.data.data.users;

        // filter out current user
        const filtered = allUsers.filter((user) => user._id !== currentUserId);

        setUsers(filtered);
        setFilteredUsers(filtered);
        setCurrentUser(currentUserId);
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

  // Search filter
  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  return (
    <Util
      users={users}
      setUsers={setUsers}
      filteredUsers={filteredUsers}
      setFilteredUsers={setFilteredUsers}
      loading={loading}
      setLoading={setLoading}
      search={search}
      setSearch={setSearch}
      windowSize={windowSize.width}
    />
  );
};

export default Users;
