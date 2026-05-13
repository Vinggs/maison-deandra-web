// File: src/utils/helpers.js

export const aspectRatios = [
  "2/3", // Sangat tinggi
  "1/1", // Kotak (pengganti aspect-square)
  "3/4", // Tinggi standar
  "4/5", // Agak tinggi
  "5/7", // Bervariasi
];

export const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
