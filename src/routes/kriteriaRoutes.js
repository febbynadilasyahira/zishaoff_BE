import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET semua kriteria
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kriteria");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data kriteria"
    });
  }
});

export default router;
