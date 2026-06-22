import React from "react";
import { urlFor } from "../client";

const ScrollCard = ({ item, index, onImageClick }) => {
  return (
    <div
      onClick={() => onImageClick(item)}
      className="group relative flex-none w-full h-full snap-start snap-always cursor-pointer overflow-hidden bg-stone-900 border-b border-stone-800"
    >
      {item.image && (
        <img
          src={urlFor(item.image).width(800).quality(90).auto("format").url()}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110"
          loading="lazy"
        />
      )}

      {/* Overlay Gradient biar teks tetep kebaca elegan */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 pointer-events-none">
        <div className="transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="inline-block font-mono text-[10px] text-[#F5F4F1] uppercase tracking-[0.3em] mb-3 border border-white/30 px-3 py-1 rounded-sm backdrop-blur-sm bg-black/20">
            Vol.{item.volNumber || "00"}
          </span>

          <h3 className="font-display text-3xl md:text-4xl text-[#F5F4F1] mb-2 leading-none drop-shadow-lg">
            {item.title}
          </h3>

          {item.description && (
            <p className="font-mono text-[10px] md:text-xs text-stone-300 leading-relaxed max-w-xs drop-shadow-md line-clamp-3 mt-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollCard;
