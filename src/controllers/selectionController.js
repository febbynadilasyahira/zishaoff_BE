import db from "../config/db.js";
import { calculateSAW } from "../services/sawService.js";
import { mappingCriteria, convertProductToSAW } from "../utils/mappingCriteria.js";

export const getSelection = async (req, res) => {
  try {
    const { tujuan, variasi, usia } = req.query;
    console.log("📨 Selection query params:", { tujuan, variasi, usia });

    // 1️⃣ Ambil semua produk
    const [products] = await db.query("SELECT * FROM produk");
    console.log(`📊 Total products: ${products.length}`);

    if (products.length === 0) {
      return res.json([]);
    }

    // 2️⃣ Convert semua produk ke format SAW (tanpa filtering ketat)
    const scoredProducts = products.map((p) => convertProductToSAW(p));
    console.log(`✅ Converted all ${scoredProducts.length} products to SAW format`);

    // 3️⃣ Ambil kriteria dari DB
    const [criteriaRows] = await db.query("SELECT * FROM kriteria");
    console.log("📋 Kriteria dari DB:", JSON.stringify(criteriaRows, null, 2));

    const weights = {};
    const criteria = {};

    criteriaRows.forEach((c) => {
      weights[c.kode] = Number(c.bobot);
      criteria[c.kode] = c.sifat.toLowerCase(); // benefit / cost
      console.log(`⚖️  ${c.kode} (${c.nama_kriteria}): bobot=${c.bobot}, sifat=${c.sifat}`);
    });

    // 4️⃣ Hitung SAW untuk semua produk dengan user preferences
    const userPreferences = { tujuan, variasi, usia };
    const results = calculateSAW(scoredProducts, weights, criteria, userPreferences);

    // 5️⃣ Sorting ranking
    results.sort((a, b) => b.score - a.score);

    console.log(`✅ Final results (top 5):`);
    results.slice(0, 5).forEach((r, idx) => {
      console.log(`${idx + 1}. ${r.nama_produk} - Score: ${r.score.toFixed(4)}`);
    });

    // Return plain array (frontend expects an array)
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memproses SPK" });
  }
};
