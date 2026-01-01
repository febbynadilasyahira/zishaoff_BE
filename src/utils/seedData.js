import db from "../config/db.js";

export const seedProducts = async () => {
  try {
    // Check apakah sudah ada data
    const [existing] = await db.query("SELECT COUNT(*) as count FROM produk");
    
    if (existing[0].count > 0) {
      console.log("✅ Data produk sudah ada, skip seeding");
      return;
    }

    const products = [
      {
        nama_produk: "Sepatu Kerja Elegan Premium",
        gambar: "shoe1.jpg",
        c1: "kerja",
        c2: "elegan",
        c3: "26-30",
        c4: 95
      },
      {
        nama_produk: "Sneaker Casual Simple",
        gambar: "shoe2.jpg",
        c1: "main",
        c2: "simple & lucu",
        c3: "19-25",
        c4: 88
      },
      {
        nama_produk: "Sepatu Sekolah Cantik",
        gambar: "shoe3.jpg",
        c1: "sekolah",
        c2: "simple & lucu",
        c3: "12-18",
        c4: 92
      },
      {
        nama_produk: "Formal Kerja Sophisticated",
        gambar: "shoe4.jpg",
        c1: "kerja",
        c2: "elegan",
        c3: "19-25",
        c4: 90
      },
      {
        nama_produk: "Kasual Santai Playful",
        gambar: "shoe5.jpg",
        c1: "main",
        c2: "simple & lucu",
        c3: "26-30",
        c4: 85
      },
      {
        nama_produk: "Kampus Stylish Modern",
        gambar: "shoe6.jpg",
        c1: "sekolah",
        c2: "elegan",
        c3: "19-25",
        c4: 87
      }
    ];

    for (const product of products) {
      await db.query(
        "INSERT INTO produk (nama_produk, gambar, c1, c2, c3, c4) VALUES (?, ?, ?, ?, ?, ?)",
        [product.nama_produk, product.gambar, product.c1, product.c2, product.c3, product.c4]
      );
    }

    console.log("✅ Dummy data produk berhasil dimasukkan");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  }
};
