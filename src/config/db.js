import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "zisha"
});

console.log("✅ Berhasil konek ke MySQL Localhost!");
export default db;
