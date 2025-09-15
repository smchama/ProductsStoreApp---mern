// src/store/product.js
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL; // Backend root URL

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  // Set all products
  setProducts: (products) => set({ products }),

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();

      if (res.ok) {
        set({ products: data.data || [], loading: false });
      } else {
        console.error("Failed to fetch products", data.message);
        set({ loading: false });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      set({ loading: false });
    }
  },

  // Create product
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill all the fields" };
    }

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Update product
  updateProduct: async (id, updatedProduct) => {
    if (!updatedProduct.name || !updatedProduct.image || !updatedProduct.price) {
      return { success: false, message: "Please fill all the fields" };
    }

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // Delete product
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${pid}`, {
        method: "DELETE",
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
