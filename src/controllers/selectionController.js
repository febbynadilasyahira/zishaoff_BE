// src/controllers/selectionController.js
import { calculateSAW } from '../services/sawService.js';

export const postSelection = async (req, res) => {
  try {
    const { data, weights, criteria } = req.body;

    if (!data || !weights || !criteria) {
      return res.status(400).json({ message: "Data, weights, dan criteria wajib dikirim." });
    }

    const results = calculateSAW(data, weights, criteria);
    return res.status(200).json({
      message: "Perhitungan SAW berhasil.",
      results
    });

  } catch (error) {
    console.error("Error SAW:", error);
    return res.status(500).json({
      message: "Gagal menghitung SAW",
      error: error.message
    });
  }
};
