import axios from "axios";
import Cookies from "js-cookie";

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

export default api;