// src/store/product.js
import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  // set all products
  setProducts: (products) => set({ products }),

  // fetch products
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/products");
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

  // create product
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill all the fields" };
    }

    try {
      const res = await fetch("/api/products", {
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

  // update product
  updateProduct: async (id, updatedProduct) => {
    if (!updatedProduct.name || !updatedProduct.image || !updatedProduct.price) {
      return { success: false, message: "Please fill all the fields" };
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to update product" };
      }

      // update the product in the store immediately
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

  // delete product
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to delete product" };
      }

      // remove product from store immediately
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
