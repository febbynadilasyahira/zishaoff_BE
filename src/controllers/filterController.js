import * as Product from '../models/productModel.js';


// GET /api/filters
export const getFilters = async (req, res) => {
  const warna = [...new Set(Product.map(p => p.warna))];
  const bahan = [...new Set(Product.map(p => p.bahan))];
  const model = [...new Set(Product.map(p => p.model))];
  const variasi = [...new Set(Product.map(p => p.variasi))];
  const ukuran = [...new Set(Product.map(p => p.ukuran))];
  const tujuan = [...new Set(Product.map(p => p.tujuan))];

  res.json({ warna, bahan, model, variasi, ukuran, tujuan });
};
