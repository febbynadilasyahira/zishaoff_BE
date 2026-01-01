/* ===============================
   🎯 MAPPING KRITERIA (TAJAM)
   Versi diperbaiki untuk variasi skor nyata
================================ */

export const mappingCriteria = {
  // c1: Tujuan pemakaian
  tujuan: {
    main: 20,
    sekolah: 60,
    kerja: 100,
  },

  // c2: Variasi / style
  variasi: {
    "simple & lucu": 60,
    elegan: 100,
  },

  // c3: Rentang usia
  usia: {
    "12-18": 33,
    "19-25": 66,
    "26-30": 100,
  },
};

/* ===============================
   🔥 CONVERT TEKS → ANGKA (SAW)
================================ */

export const convertProductToSAW = (product, requestParams = null) => {
  const safe = (v) => {
    if (v === null || v === undefined) return "";
    return String(v)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const toNumberOrMap = (fieldMap, val) => {
    if (val === null || val === undefined || val === "") return 0;
    const n = Number(val);
    if (!Number.isNaN(n)) return n;
    const key = safe(val);
    return fieldMap[key] ?? 0;
  };

  return {
    ...product,

    // c1: Tujuan Pemakaian
    c1: toNumberOrMap(mappingCriteria.tujuan, product.c1 ?? product.tujuan),
    
    // c2: Variasi/Style
    c2: toNumberOrMap(mappingCriteria.variasi, product.c2 ?? product.variasi),
    
    // c3: Rentang Usia
    c3: toNumberOrMap(mappingCriteria.usia, product.c3 ?? product.usia),
    
    // c4: Kecocokan (sudah berupa angka dari database)
    c4: Number(product.c4 ?? 0),
  };
};
