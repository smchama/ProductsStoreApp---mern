// backend/routes/auth.route.js

import express from "express";
import {
  signup,
  login,
  getUsers,
  adminResetUserPassword,
  deleteUser,
} from "../controllers/auth.controller.js";
import { protect, protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- Public Auth Routes ---
router.post("/signup", signup);
router.post("/login", login);

// --- Admin User Management Routes ---
router.get("/users", protect, protectAdmin, getUsers);
router.put("/users/:id/reset-password", protect, protectAdmin, adminResetUserPassword);
router.delete("/users/:id", protect, protectAdmin, deleteUser);

export default router;