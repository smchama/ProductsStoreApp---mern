// backend/server.js
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ Correctly get __dirname first so we can point to the parent folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Explicitly point dotenv to the .env file in the parent folder
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import helmet from "helmet";

import cors from "cors";
import { devCSP, prodCSP } from "./config/cspConfig.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ✅ Enable CORS with explicit allowedHeaders for Authorization
app.use(
  cors({
    origin: [
      "https://products-frontend-1.onrender.com", 
      "http://localhost:5173"
    ], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // 👈 Crucial for Bearer tokens
    credentials: true,
  })
);

// Helmet with external CSP config
const cspConfig = process.env.NODE_ENV === "production" ? prodCSP : devCSP;
app.use(
  helmet({
    contentSecurityPolicy: cspConfig,
    crossOriginEmbedderPolicy: false,
  })
);

// Connect to MongoDB
connectDB();

// ✅ API routes
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Start the server 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Export the app for Vercel serverless deployment
export default app;