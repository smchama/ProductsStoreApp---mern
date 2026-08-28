// backend/server.js
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://products-frontend-1.onrender.com", 
      "http://localhost:5173"
    ], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const cspConfig = process.env.NODE_ENV === "production" ? prodCSP : devCSP;
app.use(
  helmet({
    contentSecurityPolicy: cspConfig,
    crossOriginEmbedderPolicy: false,
  })
);

connectDB();

// Explicit request logging middleware to track incoming paths and methods
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/products", productRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;  