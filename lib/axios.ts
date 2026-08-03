import axios from "axios";
import Cookies from "js-cookie";
import { clearAuth } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("admin_token") || Cookies.get("admin_token");

    if (token) {
      config.headers.Authorization = `${token}`;
      if (!localStorage.getItem("admin_token")) {
        localStorage.setItem("admin_token", token);
      }
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const payload = error.response?.data;
      const message = String(
        payload?.message ?? payload?.error ?? payload?.msg ?? ""
      );
      const isUnauthorized =
        status === 401 || /unauthorized/i.test(message);

      if (
        isUnauthorized &&
        !window.location.pathname.startsWith("/login")
      ) {
        clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
