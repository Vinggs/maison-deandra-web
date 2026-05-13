// File: src/components/GalleryCard.jsx
import React from "react";
import { urlFor } from "../client";
import { aspectRatios } from "../utils/helpers";

const GalleryCard = ({ item, index, onImageClick, uniform = false }) => {
  const getRandomRatioIndex = (id) => {
    if (!id) return index * 7;
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
      sum += id.charCodeAt(i);
    }
    return sum;
  };

  const ratioIndex = getRandomRatioIndex(item._id);

  const currentRatio = uniform
    ? "2/3"
    : aspectRatios[ratioIndex % aspectRatios.length];

  return (
    <div
      onClick={() => onImageClick(item)}
      className="group relative flex flex-col w-full outline-none cursor-pointer break-inside-avoid mb-2 md:mb-8"
    >
      <div className="relative bg-white p-1.5 md:p-3 rounded-xl md:rounded-3xl shadow-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-xl">
        <div
          className="relative rounded-lg md:rounded-2xl overflow-hidden bg-stone-200"
          style={{ aspectRatio: currentRatio }}
        >
          {item.image && (
            <img
              src={urlFor(item.image)
                .width(600)
                .quality(90)
                .auto("format")
                .url()}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 md:p-6">
            <span className="font-mono text-[6px] md:text-[10px] text-white/70 uppercase tracking-widest mb-0.5 md:mb-1">
              {/* Tinggal panggil volNumber yang kita buat abadi di App.jsx */}
              Vol.{item.volNumber || "00"}
            </span>
            <h3 className="font-display text-sm md:text-2xl text-white italic leading-tight">
              {item.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
