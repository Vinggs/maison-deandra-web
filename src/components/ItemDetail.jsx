import React, { useEffect, useRef, useState } from "react";
import { urlFor } from "../client";
import GalleryCard from "./GalleryCard";
// 🔥 IMPORT AI TOOLS
import { imageToVector, searchSimilarOutfits } from "../utils/aiSearch";

const ItemDetail = ({ item, allOutfits, onBack, onSelect, onTagClick }) => {
  const imageRef = useRef(null);

  // --- STATE HOTSPOT LENS ---
  const [activeLens, setActiveLens] = useState(null);

  // --- STATE AI VISUAL MATCH ---
  const [similarItems, setSimilarItems] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const openFullScreen = () => {
    // Kita nonaktifkan fullscreen sementara jika ada animasi Lens yang berjalan
    if (activeLens !== null) return;

    const elem = imageRef.current;
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* Edge/IE */
        elem.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [item]);

  // --- EFEK AI VISUAL MATCH ---
  useEffect(() => {
    const findSimilar = async () => {
      if (!item || !item.image) return;
      try {
        setIsLoadingSimilar(true);
        const imageUrl = urlFor(item.image).width(300).url();
        const vector = await imageToVector(imageUrl);
        const matches = await searchSimilarOutfits(vector);

        const matchedOutfits = matches
          .filter((m) => String(m.id) !== String(item._id))
          .map((m) => allOutfits.find((o) => String(o._id) === String(m.id)))
          .filter(Boolean)
          .slice(0, 3); // Ambil 3 terbaik

        setSimilarItems(matchedOutfits);
      } catch (err) {
        console.error("Gagal memuat rekomendasi AI:", err);
      } finally {
        setIsLoadingSimilar(false);
      }
    };
    findSimilar();
  }, [item, allOutfits]);

  // --- FUNGSI MENANGANI KLIK HOTSPOT (GOOGLE LENS STYLE) ---
  const handleLensClick = (e, spot, index) => {
    e.stopPropagation(); // Cegah gambar jadi fullscreen
    setActiveLens(index); // Nyalakan animasi kotak di titik ini

    // Tunggu 800ms biar animasinya kelihatan beres, baru lempar ke pencarian
    setTimeout(() => {
      onTagClick(spot.searchQuery || spot.label);
      setActiveLens(null); // Reset state
    }, 800);
  };

  const isMan = item.category?.toLowerCase() === "man";
  const oppositeCategoryName = isMan ? "Woman" : "Man";

  const sameCategoryRecs = allOutfits
    .filter(
      (outfit) =>
        outfit.category?.toLowerCase() === item.category?.toLowerCase() &&
        outfit._id !== item._id,
    )
    .slice(0, 4);

  const oppositeCategoryRecs = allOutfits
    .filter(
      (outfit) =>
        outfit.category?.toLowerCase() === oppositeCategoryName.toLowerCase(),
    )
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button
        onClick={onBack}
        className="group flex items-center space-x-2 text-stone-500 hover:text-stone-900 transition-colors mb-10"
      >
        <span className="font-mono text-lg transition-transform group-hover:-translate-x-1">
          ←
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest">
          Back to Archive
        </span>
      </button>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
        {/* Kolom Gambar */}
        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="bg-white p-3 md:p-4 rounded-[2rem] shadow-sm sticky top-24">
            {/* WRAPPER RELATIVE UNTUK HOTSPOTS / LENS */}
            <div className="relative w-full rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <img
                ref={imageRef}
                onClick={openFullScreen}
                title="Klik untuk layar penuh"
                src={urlFor(item.image)
                  .width(1080)
                  .quality(100)
                  .auto("format")
                  .url()}
                alt={item.title}
                className="w-full h-auto object-contain max-h-[85vh] cursor-zoom-in block"
              />

              {/* MAPPING LENS HOTSPOT */}
              {item.hotspots && item.hotspots.length > 0 && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                  {item.hotspots.map((spot, index) => (
                    <div
                      key={index}
                      className="absolute pointer-events-auto cursor-pointer"
                      style={{
                        top: `${spot.y}%`,
                        left: `${spot.x}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={(e) => handleLensClick(e, spot, index)}
                    >
                      <div className="w-24 h-24 bg-transparent"></div>
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 ease-out flex items-center justify-center rounded-2xl
                          ${
                            activeLens === index
                              ? "w-48 h-56 opacity-100 scale-100 border-[3px] border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
                              : "w-8 h-8 opacity-0 scale-50 border-0 shadow-none"
                          }
                        `}
                      >
                        {activeLens === index && (
                          <>
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Teks */}
        <div className="w-full md:w-1/2 lg:w-2/5 md:pt-10 flex flex-col h-full">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-5">
              Maison Deandra // {item.category}
            </p>

            <h1 className="text-4xl lg:text-5xl font-display italic text-stone-900 leading-tight mb-6">
              {item.title}
            </h1>

            {/* Garis pemisah gaya editorial majalah */}
            <div className="h-px w-16 bg-stone-800 mb-8"></div>

            {item.description && (
              <p className="text-stone-600 text-sm leading-loose mb-10 whitespace-pre-wrap font-light">
                {item.description}
              </p>
            )}

            {/* BAGIAN TAGS YANG SUDAH DIPERBAIKI JADI TOMBOL AKTIF */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {item.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    className="border border-stone-300 text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-full cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PANEL AI VISUAL MATCH BARU DISINI */}
          <div className="mt-auto bg-stone-200/50 p-6 rounded-2xl border border-stone-200">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-900 mb-5 flex items-center gap-2 font-bold">
              <span className="w-2 h-2 bg-stone-900 rounded-full animate-pulse"></span>
              AI Visual Match
            </h3>

            {isLoadingSimilar ? (
              <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500 animate-pulse">
                Scanning aesthetic...
              </p>
            ) : similarItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {similarItems.map((similar) => (
                  <div
                    key={similar._id}
                    onClick={() => onSelect(similar)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-2 rounded-lg">
                      <img
                        src={urlFor(similar.image).width(200).url()}
                        alt={similar.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="font-mono text-[8px] uppercase truncate tracking-tighter text-stone-600 group-hover:text-stone-900">
                      {similar.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400 italic">
                No exact match found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Rekomendasi di Bawah (PERSIS SEPERTI ASLINYA) */}
      <div className="mt-32">
        {sameCategoryRecs.length > 0 && (
          <div className="border-t border-stone-300/50 pt-16 mb-24">
            <div className="text-center mb-12">
              <h3 className="font-display text-4xl text-stone-900 mb-2">
                More in{" "}
                <span className="italic text-stone-400">{item.category}</span>
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
                Related Archives
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {sameCategoryRecs.map((recItem, index) => (
                <GalleryCard
                  key={recItem._id}
                  item={recItem}
                  index={index}
                  onImageClick={(img) => onSelect(img)}
                  uniform={true}
                />
              ))}
            </div>
          </div>
        )}

        {oppositeCategoryRecs.length > 0 && (
          <div className="border-t border-stone-300/50 pt-16">
            <div className="text-center mb-12">
              <h3 className="font-display text-4xl text-stone-900 mb-2">
                Discover{" "}
                <span className="italic text-stone-400">
                  {oppositeCategoryName}
                </span>
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
                Cross-Aesthetic Recommendation
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {oppositeCategoryRecs.map((recItem, index) => (
                <GalleryCard
                  key={recItem._id}
                  item={recItem}
                  index={index}
                  onImageClick={(img) => onSelect(img)}
                  uniform={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
