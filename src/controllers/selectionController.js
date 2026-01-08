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

    const [products] = await db.query("SELECT * FROM produk");
    if (products.length === 0) {
      return res.json([]);
    }

    const scoredProducts = products.map((p) => convertProductToSAW(p));

    const [criteriaRows] = await db.query("SELECT * FROM kriteria");

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

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memproses SPK" });
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
