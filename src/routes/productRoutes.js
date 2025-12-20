import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct
} from "../controllers/productController.js";
import multer from "multer";

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // simpan ke folder uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Endpoint produk
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("gambar"), addProduct); // ✅ tambahkan upload.single("gambar")
router.delete("/:id", deleteProduct);

export default router;
