import { getSelectionResult } from "./selectionController.js";

/**
 * Hasil SAW khusus admin
 * return: semua produk + nilai SAW + ranking
 */
export const getSawResultForAdmin = async (req, res) => {
  try {
    // pakai logic SAW yang sudah ada
    const results = await getSelectionResult({
      query: req.query,
      adminView: true
    });

    res.json(results);
  } catch (error) {
    console.error("Error SAW admin:", error);
    res.status(500).json({ message: "Gagal mengambil hasil SAW" });
  }
};
