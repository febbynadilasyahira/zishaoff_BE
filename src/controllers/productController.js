import db from "../config/db.js";
import multer from "multer";
import path from "path";

// ==================== KONFIGURASI MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder tempat nyimpan gambar
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
        p.id_produk,
        p.nama_produk,
        p.model,
        p.warna,
        p.variasi,
        p.bahan,
        p.gambar,
        p.tujuan,
        GROUP_CONCAT(pu.ukuran ORDER BY pu.ukuran) AS ukuran
      FROM produk p
      LEFT JOIN produk_ukuran pu 
        ON p.id_produk = pu.produk_id
      GROUP BY 
        p.id_produk, 
        p.nama_produk, 
        p.model, 
        p.warna, 
        p.variasi,
        p.bahan,
        p.gambar,
        p.tujuan
    `);

    // Convert ukuran dari string ke array number
    const formatted = rows.map(item => ({
      ...item,
      ukuran: item.ukuran ? item.ukuran.split(',').map(Number) : []
    }));

    res.json(formatted);

  } catch (err) {
    console.error("❌ Error fetching produk:", err);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};
// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nama_produk, model, warna, ukuran, variasi, bahan, tujuan } = req.body;
  const gambarBaru = req.file ? req.file.filename : null;

  // ===== PARSE UKURAN =====
  let parsedUkuran = ukuran;
  if (typeof ukuran === "string") {
    try {
      if (ukuran.startsWith("[")) {
        parsedUkuran = JSON.parse(ukuran);
      } else {
        parsedUkuran = ukuran.split(",").map(u => Number(u.trim()));
      }
    } catch (err) {
      return res.status(400).json({ message: "Format ukuran tidak valid" });
    }
  }

  if (!Array.isArray(parsedUkuran) || parsedUkuran.length === 0) {
    return res.status(400).json({ message: "Ukuran harus diisi" });
  }

  try {
    // cek produk
    const [cek] = await db.query(
      "SELECT gambar FROM produk WHERE id_produk = ?",
      [id]
    );

    if (cek.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const gambarFinal = gambarBaru || cek[0].gambar;

    // UPDATE PRODUK
    await db.query(`
      UPDATE produk SET
        nama_produk = ?,
        model = ?,
        warna = ?,
        variasi = ?,
        bahan = ?,
        tujuan = ?,
        gambar = ?
      WHERE id_produk = ?
    `, [
      nama_produk,
      model,
      warna,
      variasi,
      bahan,
      tujuan,
      gambarFinal,
      id
    ]);

    // HAPUS UKURAN LAMA
    await db.query(
      "DELETE FROM produk_ukuran WHERE produk_id = ?",
      [id]
    );

    // INSERT UKURAN BARU
    const ukuranValues = parsedUkuran.map(u => [id, u]);
    await db.query(`
      INSERT INTO produk_ukuran (produk_id, ukuran) VALUES ?
    `, [ukuranValues]);

    res.json({ message: "Produk berhasil diperbarui" });

  } catch (error) {
    console.error("❌ Error update produk:", error);
    res.status(500).json({ message: "Gagal update produk" });
  }
};



// ==================== GET PRODUCT BY ID ====================
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_produk,
        p.nama_produk,
        p.model,
        p.warna,
        p.variasi,
        p.bahan,
        p.gambar,
        p.tujuan,
        GROUP_CONCAT(pu.ukuran ORDER BY pu.ukuran) AS ukuran
      FROM produk p
      LEFT JOIN produk_ukuran pu 
        ON p.id_produk = pu.produk_id
      WHERE p.id_produk = ?
      GROUP BY 
        p.id_produk,
        p.nama_produk,
        p.model,
        p.warna,
        p.variasi,
        p.bahan,
        p.gambar,
        p.tujuan
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Convert ukuran string → array
    const product = {
      ...rows[0],
      ukuran: rows[0].ukuran ? rows[0].ukuran.split(',').map(Number) : []
    };

    res.json(product);

  } catch (error) {
    console.error("❌ Error fetching produk by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addProduct = async (req, res) => {
  const { nama_produk, model, warna, ukuran, variasi, bahan, tujuan } = req.body;
  const gambar = req.file ? req.file.filename : null;

  // ----- PARSE UKURAN -----
  let parsedUkuran = ukuran;
  if (typeof ukuran === "string") {
    try {
      if (ukuran.startsWith("[")) {
        parsedUkuran = JSON.parse(ukuran);
      } else {
        parsedUkuran = ukuran.split(",").map(u => Number(u.trim()));
      }
    } catch (err) {
      return res.status(400).json({ message: "Format ukuran tidak valid" });
    }
  }

  // Validasi
  if (!nama_produk || !model || !warna || !variasi || !bahan || !tujuan || !gambar) {
    return res.status(400).json({ message: "Semua field harus diisi termasuk tujuan" });
  }

  if (!Array.isArray(parsedUkuran) || parsedUkuran.length === 0) {
    return res.status(400).json({ message: "Ukuran harus berupa array" });
  }

  try {
    // Insert produk
    const [result] = await db.query(`
  INSERT INTO produk (nama_produk, model, warna, variasi, bahan, tujuan, gambar)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`, [nama_produk, model, warna, variasi, bahan, tujuan, gambar]);

const id_produk = result.insertId; // ✔ ini variabel yang benar

// multiple insert ukuran
const ukuranValues = parsedUkuran.map(u => [id_produk, u]);

await db.query(`
  INSERT INTO produk_ukuran (produk_id, ukuran) VALUES ?
`, [ukuranValues]);



    res.status(201).json({ message: "Produk berhasil ditambahkan", id_produk });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Gagal menambahkan produk" });
  }
};


// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM produk WHERE id_produk = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error menghapus produk:", error);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};
