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
import authRoutes from "./routes/auth.route.js"; // 👈 Fixed import path
import productRoute from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import helmet from "helmet";

import cors from "cors"; // ✅ Import cors
import { devCSP, prodCSP } from "./config/cspConfig.js"; // ✅ CSP rules

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ✅ Enable CORS for both live and local frontends
app.use(
  cors({
    origin: [
      "https://products-frontend-1.onrender.com", 
      "http://localhost:5173"
    ], 
    methods: ["GET", "POST", "PUT", "DELETE"],
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

/* 
  COMMENT OUT OR REMOVE FRONTEND SERVING FOR BACKEND-ONLY DEPLOYMENT
  -----------------------------------------------------------------
  This section is only needed if your backend serves the frontend.
  Since this is a backend-only repo, remove or comment it out
  to avoid "ENOENT: no such file or directory" errors on Render.
*/

// if (process.env.NODE_ENV === "production") {
//   const frontendDist = path.join(__dirname, "../frontend/dist");
//   console.log("Serving frontend from:", frontendDist);

//   app.use(express.static(frontendDist));

//   app.get("/*", (req, res) => {
//     res.sendFile(path.resolve(frontendDist, "index.html"));
//   });
// }

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode at http://localhost:${PORT}`
  );
});