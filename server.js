import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import kriteriaRoutes from "./src/routes/kriteriaRoutes.js";
import selectionRoutes from "./src/routes/selectionRoutes.js";
import sawResultRoutes from "./src/routes/sawResultRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { seedProducts } from "./src/utils/seedData.js";

const app = express();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS (AMAN UNTUK VERCEL + LOCAL)
// CORS: accept requests from configured FRONTEND_URL or allow all when not set
const FRONTEND_URL = process.env.FRONTEND_URL || "https://zishaofficial1.vercel.app";

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl) or from the configured frontend
      if (!origin) return callback(null, true);
      if (FRONTEND_URL === "*" || origin === FRONTEND_URL) return callback(null, true);
      // allow other localhost variants for development
      if (/localhost/.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Fallback: ensure preflight handled and headers present for all responses
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL === "*" ? "*" : FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  return res.sendStatus(200);
});

// Also add simple header middleware to ensure header present even on errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL === "*" ? "*" : FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROOT ENDPOINT (WAJIB UNTUK RAILWAY)
app.get("/", (req, res) => {
  res.send("🚀 Zisha OFFBE API is running");
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/selection", selectionRoutes);
app.use("/api/saw-results", sawResultRoutes);

// ✅ SEED DIJALANKAN TANPA BLOCK SERVER
seedProducts()
  .then(() => console.log("🌱 Seed selesai"))
  .catch((err) => console.error("❌ Seed error:", err));

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
