import db from "../config/db.js";
import { calculateSAW } from "../services/sawService.js";
import { mappingCriteria, convertProductToSAW } from "../utils/mappingCriteria.js";

/**
 * SELECTION UNTUK USER
 * (INI TIDAK DIUBAH SAMA SEKALI)
 */
export const getSelection = async (req, res) => {
  try {
    const { tujuan, variasi, usia } = req.query;
    
    console.log("📍 Selection endpoint hit with query:", { tujuan, variasi, usia });

    const [products] = await db.query("SELECT * FROM produk");
    console.log(`✅ Fetched ${products.length} products from database`);
    
    if (products.length === 0) {
      console.log("⚠️ No products found, returning empty array");
      return res.json([]);
    }

    const scoredProducts = products.map((p) => convertProductToSAW(p));

    const [criteriaRows] = await db.query("SELECT * FROM kriteria");
    console.log(`✅ Fetched ${criteriaRows.length} criteria from database`);

    const weights = {};
    const criteria = {};

    criteriaRows.forEach((c) => {
      weights[c.kode] = Number(c.bobot);
      criteria[c.kode] = c.sifat.toLowerCase();
    });

    const userPreferences = { tujuan, variasi, usia };

    const results = calculateSAW(
      scoredProducts,
      weights,
      criteria,
      userPreferences
    );

    results.sort((a, b) => b.score - a.score);
    
    console.log(`✅ Selection results calculated: ${results.length} products returned`);
    res.json(results);
  } catch (error) {
    console.error("❌ Error in getSelection:", error.message, error.stack);
    res.status(500).json({ message: "Gagal memproses SPK", error: error.message });
  }
};

/**
 * ✅ WRAPPER KHUSUS ADMIN (AMAN)
 * ❗ TANPA Promise Manual
 * ❗ TIDAK BLOCK LOGIN
 */
export const getSelectionResult = async ({ query }) => {
  const mockReq = { query };

  let resultData;

  const mockRes = {
    json: (data) => {
      resultData = data;
    },
    status: () => ({
      json: (err) => {
        throw err;
      },
    }),
  };

  await getSelection(mockReq, mockRes);

  return resultData;
};
