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
// SETUP __DIRNAME
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// CORS (FINAL, ANTI ERROR)
// ==========================
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for development/production
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));

// ⬅️ WAJIB: HANDLE PREFLIGHT
app.options("*", cors(corsOptions));

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// ROOT CHECK
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
// SEED (NON BLOCKING)
// ==========================
seedProducts()
  .then(() => console.log("🌱 Seed selesai"))
  .catch(console.error);

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Environment variables check:");
  console.log("- MYSQLHOST:", process.env.MYSQLHOST ? "✅" : "❌ MISSING");
  console.log("- MYSQLUSER:", process.env.MYSQLUSER ? "✅" : "❌ MISSING");
  console.log("- MYSQLPASSWORD:", process.env.MYSQLPASSWORD ? "✅" : "❌ MISSING");
  console.log("- MYSQLDATABASE:", process.env.MYSQLDATABASE ? "✅" : "❌ MISSING");
  console.log("- MYSQLPORT:", process.env.MYSQLPORT ? "✅" : "❌ MISSING");
});
