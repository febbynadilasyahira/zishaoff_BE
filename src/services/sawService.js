// src/services/sawService.js

/**
 * Fungsi perhitungan SAW (Simple Additive Weighting)
 * @param {Array} data - daftar alternatif (produk)
 * @param {Object} weights - bobot untuk setiap kriteria (0–1)
 * @param {Array} criteria - daftar kriteria yang digunakan
 * @returns {Array} hasil perhitungan SAW
 */
export function calculateSAW(data, weights, criteria) {
  // Konversi nilai teks menjadi angka agar bisa dihitung
  const convertToNumeric = (key, value) => {
    const mappings = {
      tujuan: { 'Olahraga': 5, 'Santai': 4, 'Formal': 3 },
      model: { 'Sneakers': 5, 'Slip On': 4, 'Boots': 3 },
      warna: { 'Putih': 5, 'Hitam': 4, 'Coklat': 3 },
      variasi: { 'High Cut': 5, 'Low Cut': 4 },
      bahan: { 'Kanvas': 5, 'Kulit': 4, 'Suede': 3 }
    };

    // Kalau ada di mapping, pakai nilainya
    if (mappings[key] && mappings[key][value]) {
      return mappings[key][value];
    }

    // Kalau bukan teks, coba ubah ke angka langsung
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Normalisasi data
  const normalized = data.map(item => {
    const normalizedItem = { ...item };

    criteria.forEach(k => {
      const numericValues = data.map(d => convertToNumeric(k, d[k]));
      const max = Math.max(...numericValues);
      const numericValue = convertToNumeric(k, item[k]);

      normalizedItem[k] = max === 0 ? 0 : numericValue / max;
    });

    return normalizedItem;
  });

  // Hitung skor akhir (utility)
  const results = normalized.map(item => {
    let score = 0;
    criteria.forEach(k => {
      score += item[k] * (weights[k] || 0);
    });
    return {
      ...item,
      score: Number(score.toFixed(3))
    };
  });

  // Urutkan hasil tertinggi dulu
  return results.sort((a, b) => b.score - a.score);
}
