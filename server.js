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
app.use(
  cors({
    origin: [
      "https://zishaofficial1.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Preflight
app.options("*", cors());

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
