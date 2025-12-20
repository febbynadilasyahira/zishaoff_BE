import db from "../config/db.js";

export const createAdmin = async (username, hashedPassword) => {
  const sql = "INSERT INTO admin (username, password) VALUES (?, ?)";
  await db.query(sql, [username, hashedPassword]);
};

export const findAdminByUsername = async (username) => {
  const sql = "SELECT * FROM admin WHERE username = ?";
  const [rows] = await db.query(sql, [username]);
  return rows[0];
};
