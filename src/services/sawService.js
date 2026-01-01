export const calculateSAW = (data, weights, criteria, userPreferences = {}) => {
  const keys = Object.keys(weights);
  console.log("🎯 User preferences:", userPreferences);

  console.log("🔍 SAW Input Data:", JSON.stringify(data.slice(0, 3), null, 2));
  console.log("⚖️  Weights:", weights);
  console.log("📊 Criteria:", criteria);

  // cari max / min
  const max = {};
  const min = {};

  keys.forEach(k => {
    const values = data.map(d => Number(d[k])).filter(v => !Number.isNaN(v));
    if (values.length === 0) {
      max[k] = 0;
      min[k] = 0;
    } else {
      max[k] = Math.max(...values);
      min[k] = Math.min(...values);
    }
  });

  console.log("📈 Max values:", max);
  console.log("📉 Min values:", min);

  // Mapping user preferences ke nilai numerik untuk boost
  const mappingCriteria = {
    tujuan: {
      main: 20,
      sekolah: 60,
      kerja: 100,
    },
    variasi: {
      "simple & lucu": 60,
      elegan: 100,
    },
    usia: {
      "12-18": 33,
      "19-25": 66,
      "26-30": 100,
    },
  };

  const preferenceValues = {};
  if (userPreferences.tujuan && mappingCriteria.tujuan[userPreferences.tujuan]) {
    preferenceValues.c1 = mappingCriteria.tujuan[userPreferences.tujuan];
    console.log(`✅ Tujuan preference: "${userPreferences.tujuan}" → ${preferenceValues.c1}`);
  }
  if (userPreferences.variasi && mappingCriteria.variasi[userPreferences.variasi]) {
    preferenceValues.c2 = mappingCriteria.variasi[userPreferences.variasi];
    console.log(`✅ Variasi preference: "${userPreferences.variasi}" → ${preferenceValues.c2}`);
  }
  if (userPreferences.usia && mappingCriteria.usia[userPreferences.usia]) {
    preferenceValues.c3 = mappingCriteria.usia[userPreferences.usia];
    console.log(`✅ Usia preference: "${userPreferences.usia}" → ${preferenceValues.c3}`);
  }

  console.log("📌 Preference values converted:", preferenceValues);

  const results = data.map(item => {
    let score = 0;
    const normalizedScores = {};

    keys.forEach(k => {
      const value = Number(item[k]);

      let normalized = 0;
      if (Number.isNaN(value) || value === 0) {
        normalized = 0;
      } else if (criteria[k] === 'benefit') {
        normalized = max[k] > 0 ? value / max[k] : 0;
      } else {
        normalized = value > 0 ? (min[k] / value) : 0;
      }

      normalizedScores[k] = normalized;
      score += normalized * (Number(weights[k]) || 0);
    });

    // Tambahan boost untuk produk yang match dengan preferensi user
    // Ini memastikan produk yang sesuai input user mendapat skor lebih tinggi
    let preferenceBoost = 0;
    if (preferenceValues.c1 && Number(item.c1) === preferenceValues.c1) preferenceBoost += 20;
    if (preferenceValues.c2 && Number(item.c2) === preferenceValues.c2) preferenceBoost += 20;
    if (preferenceValues.c3 && Number(item.c3) === preferenceValues.c3) preferenceBoost += 20;

    const finalScore = score + preferenceBoost;

    return {
      ...item,
      score: finalScore,
      normalizedScores,
      baseScore: score,
      preferenceBoost
    };
  });

  console.log("🎯 Top 3 Results:", results.slice(0, 3).map(r => ({ id: r.id_produk, score: r.score, normalized: r.normalizedScores })));

  return results;
};
