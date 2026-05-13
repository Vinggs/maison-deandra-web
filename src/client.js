import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "7z000okv",
  dataset: "production",
  apiVersion: "2026-04-22", // <--- Pastikan tanggalnya update ke hari ini
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Fungsi pembantu untuk mengubah data gambar dari Sanity menjadi URL yang bisa dibaca React
export const urlFor = (source) => builder.image(source);
