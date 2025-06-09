import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL } from "./APi";

const cookie = Cookie();

export const Axios = axios.create({
  baseURL: BASE_URL,
});

Axios.interceptors.request.use(
  (config) => {
    const token = cookie.get("Bearer");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
