// backend/routes/product.route.js
import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect, protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (anyone can view products)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes (protected: verify token first, then verify admin role)
router.post("/", protect, protectAdmin, createProduct);
router.put("/:id", protect, protectAdmin, updateProduct);
router.delete("/:id", protect, protectAdmin, deleteProduct);

export default router;