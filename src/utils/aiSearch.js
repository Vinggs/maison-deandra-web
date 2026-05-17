import { pipeline, env } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";

env.allowLocalModels = false;

const pc = new Pinecone({
  apiKey: import.meta.env.VITE_PINECONE_API_KEY,
});

let extractor = null;

export const imageToVector = async (imageUrl) => {
  try {
    if (!extractor) {
      console.log("⏳ Mengunduh AI ke browser (Hanya terjadi sekali)...");
      extractor = await pipeline(
        "image-feature-extraction",
        "Xenova/clip-vit-base-patch32",
      );
      console.log("🤖 AI berhasil terpasang di browser!");
    }

    const output = await extractor(imageUrl);

    // 🔥 PEMAKSAAN FORMAT: Pastikan semuanya murni angka desimal biasa
    const vectorArray = Array.from(output.data).map((num) => Number(num));

    return vectorArray;
  } catch (error) {
    console.error("Gagal mengubah gambar ke vektor:", error);
    throw error;
  }
};

export const searchSimilarOutfits = async (vector) => {
  try {
    const index = pc.index(import.meta.env.VITE_PINECONE_INDEX);
    const queryResponse = await index.query({
      vector: vector,
      topK: 6,
      includeMetadata: true,
    });
    return queryResponse.matches;
  } catch (error) {
    console.error("Gagal mencari di Pinecone:", error);
    throw error;
  }
};
