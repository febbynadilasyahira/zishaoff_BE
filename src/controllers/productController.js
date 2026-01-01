import db from "../config/db.js";
import multer from "multer";
import path from "path";

// ==================== KONFIGURASI MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });


// ==================== GET ALL PRODUCTS ====================
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_produk,
        nama_produk,
        gambar,
        c1, c2, c3, c4, c5, c6
      FROM produk
      ORDER BY id_produk DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching produk:", err);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};


// ==================== GET PRODUCT BY ID ====================
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        id_produk,
        nama_produk,
        gambar,
        c1, c2, c3, c4, c5, c6
      FROM produk
      WHERE id_produk = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching produk:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ==================== ADD PRODUCT ====================
export const addProduct = async (req, res) => {
  const { nama_produk, c1, c2, c3, c4, c5, c6 } = req.body;
  const gambar = req.file?.filename || null;

  try {
    const [result] = await db.query(
      `
      INSERT INTO produk
      (nama_produk, gambar, c1, c2, c3, c4, c5, c6)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [nama_produk, gambar, c1, c2, c3, c4, c5, c6]
    );

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      id_produk: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error tambah produk:", err);
    res.status(500).json({ message: "Gagal menambahkan produk" });
  }
};


// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nama_produk, c1, c2, c3, c4, c5, c6 } = req.body;
  const gambarBaru = req.file?.filename || null;

  try {
    const [[existing]] = await db.query(
      "SELECT gambar FROM produk WHERE id_produk = ?",
      [id]
    );

    if (!existing) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await db.query(
      `
      UPDATE produk SET
        nama_produk = ?,
        c1 = ?, c2 = ?, c3 = ?, c4 = ?, c5 = ?, c6 = ?,
        gambar = ?
      WHERE id_produk = ?
      `,
      [
        nama_produk,
        c1, c2, c3, c4, c5, c6,
        gambarBaru || existing.gambar,
        id,
      ]
    );

    res.json({ message: "Produk berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Error update produk:", err);
    res.status(500).json({ message: "Gagal update produk" });
  }
};


// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM produk WHERE id_produk = ?", [id]);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error delete produk:", error);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
