import { create } from "zustand";
import { authAPI } from "../api/auth";

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  loading: false,

  // Actions
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response;

      localStorage.setItem("authToken", token);
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const user = await authAPI.getProfile();
      set({ user, isAuthenticated: true });
    } catch (error) {
      get().logout();
    }
  },
}));

export default useAuthStore;
