import { calculateSAW } from "../services/sawService.js";

/**
 * Hasil SAW khusus admin
 */
export const getSawResultForAdmin = async (req, res) => {
  try {
    const result = await calculateSAW();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error SAW admin:", error);
    res.status(500).json({ message: "Gagal mengambil hasil SAW" });
  }
};
