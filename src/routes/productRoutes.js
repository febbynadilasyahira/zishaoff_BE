import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,     // ⬅️ TAMBAH
  deleteProduct
} from "../controllers/productController.js";
import multer from "multer";

// =======================
// Konfigurasi upload gambar
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// =======================
// ROUTES PRODUK
// =======================
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// CREATE
router.post("/", upload.single("gambar"), addProduct);

// UPDATE (EDIT)  🔥🔥🔥
router.put("/:id", upload.single("gambar"), updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;
