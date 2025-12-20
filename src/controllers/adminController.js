import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAdmin, findAdminByUsername } from "../models/adminModel.js";

const JWT_SECRET = "secretkey123"; // ganti ke .env kalo mau aman

// =========================
// Register Admin
// =========================
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check existing user
    const existing = await findAdminByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    // hash passwordA
    const hashed = await bcrypt.hash(password, 10);

    // insert
    await createAdmin(username, hashed);

    res.json({ message: "Admin berhasil dibuat" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// Login Admin
// =========================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await findAdminByUsername(username);
    if (!admin) {
      return res.status(400).json({ message: "Username tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Password salah" });
    }

    // generate token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
