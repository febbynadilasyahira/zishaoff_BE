import { getSelectionResult } from "./selectionController.js";

export const getSawResultForAdmin = async (req, res) => {
  try {
    const results = await getSelectionResult({
      query: req.query,
      adminView: true,
    });

    res.json(results);
  } catch (error) {
    console.error("Error SAW admin:", error);
    res.status(500).json({ message: "Gagal mengambil hasil SAW" });
  }
};
