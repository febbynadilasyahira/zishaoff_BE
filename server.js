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

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/selection", selectionRoutes);
app.use("/api/saw-results", sawResultRoutes);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    await seedProducts();
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
});
