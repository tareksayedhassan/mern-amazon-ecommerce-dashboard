import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL } from "./APi";

const cookie = Cookie();
const token = cookie.get("Bearer");

export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
