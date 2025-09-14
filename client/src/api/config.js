// src/api/config.js - تحديث
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // تصحيح
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
      // إعادة توجيه للوجة تسجيل الدخول
    }

    return Promise.reject(error.response?.data || error.message);
  }
);
