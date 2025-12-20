import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai password MySQL kamu
  database: 'zisha',
});

console.log('✅ Berhasil konek ke MySQL Database!');
export default db;
