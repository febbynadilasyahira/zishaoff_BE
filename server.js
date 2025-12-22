import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js"; // ⭐ Tambahkan ini
import kriteriaRoutes from "./src/routes/kriteriaRoutes.js"; // ⭐ ROUTE KRITERIA
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Setup __dirname biar bisa akses folder upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // supaya gambar bisa diakses

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes); // ⭐ Tambahkan ini
app.use("/api/kriteria", kriteriaRoutes); // ⭐ ROUTE KRITERIA

// Jalankan server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
