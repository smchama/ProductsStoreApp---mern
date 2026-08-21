// src/store/product.js
import { create } from "zustand";

// Automatically switches between localhost for dev and Vercel for production
const API_URL = import.meta.env.VITE_API_URL ||(import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://products-backend-7.onrender.com"); // 👈 Fixed fallback URL

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  // Pagination and Filter state variables
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  search: "",
  category: "all",
  sort: "newest",

  // Set all products
  setProducts: (products) => set({ products }),

  // Fetch products with support for search, category, sort, and pagination
  fetchProducts: async (params = {}) => {
    set({ loading: true });
    try {
      const currentState = get();

      // Merge current state with any new params passed in
      const queryParams = new URLSearchParams({
        page: params.page !== undefined ? params.page : currentState.currentPage,
        limit: 8,
        search: params.search !== undefined ? params.search : currentState.search,
        category: params.category !== undefined ? params.category : currentState.category,
        sort: params.sort !== undefined ? params.sort : currentState.sort,
      });

      const res = await fetch(`${API_URL}/api/products?${queryParams.toString()}`);
      const data = await res.json();

      if (res.ok) {
        set({
          products: data.data || [],
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalProducts: data.totalProducts || 0,
          loading: false,
          ...params, // Update local state properties that were passed
        });
      } else {
        console.error("Failed to fetch products", data.message);
        set({ loading: false });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      set({ loading: false });
    }
  },

  // Fetch a single product by ID
  fetchProduct: async (pid) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${pid}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to fetch product" };
      }
      return { success: true, data: data.data };
    } catch (err) {
      console.error("Error fetching single product:", err);
      return { success: false, message: "Server error" };
    }
  },

  // Create product (Admin Only)
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price || !newProduct.category) {
      return { success: false, message: "Please fill all the fields, including category" };
    }

    try {
      const token = localStorage.getItem("token"); // 🔑 Grab token

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 Send token
        },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to create product" };
      }

      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  },

  // Update product (Admin Only)
  updateProduct: async (id, updatedProduct) => {
    if (!updatedProduct.name || !updatedProduct.image || !updatedProduct.price) {
      return { success: false, message: "Please fill all the fields" };
    }

    try {
      const token = localStorage.getItem("token"); // 🔑 Grab token

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 Send token
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to update product" };
      }

      set((state) => ({
        products: state.products.map((p) =>
          p._id === id || p.id === id ? data.data : p
        ),
      }));

      return { success: true, message: "Product updated successfully" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  },

  // Delete product (Admin Only)
  deleteProduct: async (pid) => {
    try {
      const token = localStorage.getItem("token"); // 🔑 Grab token

      const res = await fetch(`${API_URL}/api/products/${pid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 Send token
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to delete product" };
      }

      set((state) => ({
        products: state.products.filter((p) => p._id !== pid && p.id !== pid),
      }));

      return { success: true, message: "Product deleted successfully" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  },
}));

export default useProductStore;