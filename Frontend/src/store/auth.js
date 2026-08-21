// src/store/auth.js
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:5000" : "");

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to sign up");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to log in");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;