import axios from "axios";
import Cookie from "cookie-universal";
import { BASE_URL } from "./APi";
import { REFRESH_TOKEN } from "./APi";

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

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookie.get("refreshToken");
        const res = await axios.post(`${BASE_URL}/${REFRESH_TOKEN}`, {
          refreshToken,
        });

        const newBearer = res.data?.Bearer;
        if (newBearer) {
          cookie.set("Bearer", newBearer);

          originalRequest.headers.Authorization = `Bearer ${newBearer}`;
          return Axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        cookie.remove("Bearer");
        cookie.remove("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
