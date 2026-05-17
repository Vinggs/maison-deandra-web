import { client } from "../client";
import { imageToVector } from "./aiSearch";

let isSyncing = false;

export const syncSanityToPinecone = async () => {
  if (isSyncing) return;
  isSyncing = true;

  console.log("🚀 Memulai proses sinkronisasi...");

  try {
    const query = '*[_type == "outfit"]{ _id, title, image }';
    const outfits = await client.fetch(query);

    console.log(`📦 Ditemukan ${outfits.length} item di Sanity.`);

    const pineconeHost = import.meta.env.VITE_PINECONE_HOST;
    const pineconeApiKey = import.meta.env.VITE_PINECONE_API_KEY;

    for (const item of outfits) {
      // 🔥 TAMBAHAN BARU: Pelindung Per-Item (Biar kalau 1 gagal, yang lain lanjut)
      try {
        console.log(`🔄 Memproses: ${item.title || "Tanpa Judul"}...`);

        if (!item._id) {
          console.error("❌ Skip: Baju ini tidak punya ID Sanity.");
          continue;
        }

        const imageUrl = `${item.image.asset._ref.replace("image-", "https://cdn.sanity.io/images/7z000okv/production/").replace("-jpg", ".jpg")}?w=300`;

        const vector = await imageToVector(imageUrl);

        if (!vector || !Array.isArray(vector) || vector.length !== 512) {
          console.error(`❌ Skip: Vektor cacat untuk ${item.title}`);
          continue;
        }

        const cleanVector = vector.map((v) =>
          isNaN(v) || v === null ? 0 : Number(v),
        );

        const pineconeRecord = {
          id: String(item._id),
          values: cleanVector,
          metadata: { title: String(item.title || "Tanpa Judul") },
        };

        const response = await fetch(`${pineconeHost}/vectors/upsert`, {
          method: "POST",
          headers: {
            "Api-Key": pineconeApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vectors: [pineconeRecord],
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`❌ Gagal masuk gudang: ${errText}`);
          continue;
        }

        console.log(`🟢 ${item.title} RESMI MASUK GUDANG!`);

        // Jeda 1 detik penuh biar internetnya nafas
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (itemError) {
        // Kalau 1 gambar gagal download, errornya ditangkap di sini, loop tetap jalan!
        console.error(
          `⚠️ Gagal memproses ${item.title} karena jaringan. Lanjut ke baju berikutnya...`,
          itemError.message,
        );
      }
    }

    console.log(
      "🎉 SINKRONISASI SELESAI 100%! Silakan cek dashboard Pinecone kamu.",
    );
  } catch (error) {
    console.error("❌ Waduh, sinkronisasi gagal total:", error);
  } finally {
    isSyncing = false;
  }
};
