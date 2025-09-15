// backend/server.js
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import productRoute from "./routes/product.route.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors"; // ✅ Import cors
import { devCSP, prodCSP } from "./config/cspConfig.js"; // ✅ CSP rules

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Correct way to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());

// ✅ Enable CORS
app.use(
  cors({
    origin: "https://products-frontend-1.onrender.com", // frontend URL
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

// Serve frontend in production (optional since frontend is deployed separately)
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  console.log("Serving frontend from:", frontendDist);

  app.use(express.static(frontendDist));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(frontendDist, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode at http://localhost:${PORT}`
  );
});
