// backend/routes/order.route.js
import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js"; // 👈 Must have .js here!
import { protect, protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- User Routes ---
// Place a new order (requires user to be logged in)
router.post("/", protect, createOrder);

// View logged-in user's personal orders and tracking status
router.get("/myorders", protect, getMyOrders);

// --- Admin Routes ---
// View all store orders
router.get("/", protect, protectAdmin, getOrders);

// Update order status (Pending -> Processing -> Delivered)
router.put("/:id/status", protect, protectAdmin, updateOrderStatus);

export default router;