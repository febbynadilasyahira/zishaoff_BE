import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET semua kriteria
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kriteria ORDER BY id_kriteria ASC");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data kriteria"
    });
  }
});

// GET kriteria by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kriteria WHERE id_kriteria = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Kriteria tidak ditemukan" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data kriteria" });
  }
});

// POST tambah kriteria baru
router.post("/", async (req, res) => {
  try {
    const { nama_kriteria, bobot, sifat } = req.body;

    if (!nama_kriteria || bobot === undefined || !sifat) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [result] = await db.query(
      "INSERT INTO kriteria (nama_kriteria, bobot, sifat) VALUES (?, ?, ?)",
      [nama_kriteria, bobot, sifat]
    );

    res.status(201).json({
      message: "Kriteria berhasil ditambahkan",
      id_kriteria: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan kriteria" });
  }
});

// PUT update kriteria
router.put("/:id", async (req, res) => {
  try {
    const { nama_kriteria, bobot, sifat } = req.body;
    const { id } = req.params;

    if (!nama_kriteria || bobot === undefined || !sifat) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [existing] = await db.query("SELECT * FROM kriteria WHERE id_kriteria = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Kriteria tidak ditemukan" });
    }

    await db.query(
      "UPDATE kriteria SET nama_kriteria = ?, bobot = ?, sifat = ? WHERE id_kriteria = ?",
      [nama_kriteria, bobot, sifat, id]
    );

    res.status(200).json({ message: "Kriteria berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui kriteria" });
  }
});

// DELETE kriteria
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT * FROM kriteria WHERE id_kriteria = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Kriteria tidak ditemukan" });
    }

    await db.query("DELETE FROM kriteria WHERE id_kriteria = ?", [id]);

    res.status(200).json({ message: "Kriteria berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus kriteria" });
  }
});

export default router;
