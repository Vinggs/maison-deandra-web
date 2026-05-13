import React, { useEffect, useRef } from "react";
import { urlFor } from "../client";
import GalleryCard from "./GalleryCard";

const ItemDetail = ({ item, allOutfits, onBack, onSelect, onTagClick }) => {
  const imageRef = useRef(null);

  const openFullScreen = () => {
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
              className="w-full h-auto rounded-2xl object-contain max-h-[85vh] cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Kolom Teks */}
        <div className="w-full md:w-1/2 lg:w-2/5 md:pt-10">
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
            <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Bagian Rekomendasi di Bawah */}
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
