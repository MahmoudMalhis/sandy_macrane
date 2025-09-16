// client/src/api/config.js - مُصحح
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"; // تغيير من 3000 إلى 4000

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // معالجة انتهاء الصلاحية
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error.response?.data || error.message);
  }
);
