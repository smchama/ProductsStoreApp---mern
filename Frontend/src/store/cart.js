// src/store/cart.js
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  // Add product to cart (or increment quantity if it already exists)
  addToCart: (product) => {
    const cart = get().cart;
    const productId = product._id || product.id;
    const existingIndex = cart.findIndex((item) => (item._id || item.id) === productId);

    if (existingIndex > -1) {
      // Item exists, increase quantity
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      set({ cart: updatedCart });
    } else {
      // Brand new item, set quantity to 1
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  // Remove item completely from cart
  removeFromCart: (productId) => {
    set({
      cart: get().cart.filter((item) => (item._id || item.id) !== productId),
    });
  },

  // Update item quantity directly (+ or -)
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      ),
    });
  },

  // Clear entire cart (e.g., after checkout)
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;