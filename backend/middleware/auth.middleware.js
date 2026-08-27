// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 1. General Authentication Middleware (Verifies JWT)
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      req.user = decoded; // Attaches decoded user payload to request
      return next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided.",
    });
  }
};

// 2. Admin Authorization Middleware (Smart Database Fallback)
export const protectAdmin = async (req, res, next) => {
  try {
    // Check if token already has admin role
    if (req.user && req.user.role === "admin") {
      return next();
    }

    // Fallback: Query database directly using userId from token if role is missing
    if (req.user && req.user.userId) {
      const user = await User.findById(req.user.userId);
      if (user && user.role === "admin") {
        req.user.role = "admin"; // Attach role for downstream controllers
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  } catch (error) {
    console.error("Admin authorization error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during admin verification",
    });
  }
};