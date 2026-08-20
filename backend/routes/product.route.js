// backend/routes/product.route.js
import express from "express";
import {
  getProducts,
  getProductById, // 👈 1. Import the controller function
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (anyone can view products)
router.get("/", getProducts);
router.get("/:id", getProductById); // 👈 2. Add the route to fetch a single product by ID

// Admin-only routes (protected)
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;