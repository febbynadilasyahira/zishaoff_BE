import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import kriteriaRoutes from "./src/routes/kriteriaRoutes.js";
import selectionRoutes from "./src/routes/selectionRoutes.js";
import sawResultRoutes from "./src/routes/sawResultRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// CORS (AMAN & CUKUP)
// ==========================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
// SERVER
// ==========================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("ENV CHECK:");
  console.log("MYSQLHOST:", !!process.env.MYSQLHOST);
  console.log("MYSQLUSER:", !!process.env.MYSQLUSER);
  console.log("MYSQLPASSWORD:", !!process.env.MYSQLPASSWORD);
  console.log("MYSQLDATABASE:", !!process.env.MYSQLDATABASE);
  console.log("MYSQLPORT:", !!process.env.MYSQLPORT);
});
