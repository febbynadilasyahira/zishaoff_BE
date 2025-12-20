import db from '../config/db.js';

export const getAllProducts = async () => {
  const [rows] = await db.query('SELECT * FROM produk');
  return rows;
};
