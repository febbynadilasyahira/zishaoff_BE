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

// ==========================
// SETUP __DIRNAME (ESM)
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// CORS CONFIG (AMAN & STABIL)
// ==========================
const allowedOrigins = [
  "https://zishaofficial1.vercel.app",
  "https://zishaofficial1-clmsuxvrl-fnadilasyahira-3815s-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / postman
      if (!origin) return callback(null, true);

      // allow Vercel (all preview + prod)
      if (
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// ROOT (WAJIB UNTUK RAILWAY)
// ==========================
app.get("/", (req, res) => {
  res.send("🚀 Zisha OFFBE API is running");
});

// ==========================
// ROUTES
// ==========================
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/selection", selectionRoutes);
app.use("/api/saw-results", sawResultRoutes);

// ==========================
// SEED (NON-BLOCKING)
// ==========================
seedProducts()
  .then(() => console.log("🌱 Seed selesai"))
  .catch((err) => console.error("❌ Seed error:", err));

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
