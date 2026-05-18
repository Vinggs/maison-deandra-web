import React, { useState, useEffect, useRef } from "react";
import { client } from "./client";
import { shuffleArray } from "./utils/helpers";
import GalleryCard from "./components/GalleryCard";
import ItemDetail from "./components/ItemDetail";
import { syncSanityToPinecone } from "./utils/syncData";
import { imageToVector, searchSimilarOutfits } from "./utils/aiSearch";

// --- IMPORT BARU: Library Color Picker Modern ---
import { HexColorPicker } from "react-colorful";

const CATEGORIES = ["All", "Man", "Woman"];

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const isColorSimilar = (color1, color2, threshold = 90) => {
  if (!color1 || !color2) return false;
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return false;

  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  return distance < threshold;
};

export default function App() {
  const [outfits, setOutfits] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeColor, setActiveColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  useEffect(() => {
    // syncSanityToPinecone();
  }, []);

  // --- LOGIKA BARU: Menutup color picker saat klik di luar area ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    window.history.pushState({}, "", `?id=${item._id}`);
  };

  const handleBack = () => {
    setSelectedItem(null);
    window.history.pushState({}, "", window.location.pathname);
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setSelectedItem(null);
    window.history.pushState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageSearch = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsAiLoading(true);
      setAiResults(null);
      setActiveFilter("All");
      setSearchQuery("");
      setActiveColor("");

      const imageUrl = URL.createObjectURL(file);
      const vector = await imageToVector(imageUrl);
      const matches = await searchSimilarOutfits(vector);

      const matchedIds = matches.map((match) => match.id);
      const matchedOutfits = matchedIds
        .map((id) => outfits.find((o) => o._id === id))
        .filter(Boolean);

      setAiResults(matchedOutfits);
    } catch (error) {
      console.error("Kesalahan analisis AI:", error);
      alert("Pencarian gambar gagal.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearAiSearch = () => {
    setAiResults(null);
    document.getElementById("ai-image-upload").value = "";
  };

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const query = '*[_type == "outfit"] | order(_createdAt asc)';
        const rawData = await client.fetch(query);

        const dataWithVol = rawData.map((item, i) => ({
          ...item,
          volNumber: String(i + 1).padStart(2, "0"),
        }));

        const randomizedData = shuffleArray(dataWithVol);
        setOutfits(randomizedData);

        const params = new URLSearchParams(window.location.search);
        const itemIdFromUrl = params.get("id");
        if (itemIdFromUrl) {
          const foundItem = randomizedData.find(
            (item) => item._id === itemIdFromUrl,
          );
          if (foundItem) setSelectedItem(foundItem);
        }

        setTimeout(() => {
          setIsAppLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Gagal menarik data dari Sanity:", error);
        setIsAppLoading(false);
      }
    };
    fetchOutfits();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const itemIdFromUrl = params.get("id");
      if (!itemIdFromUrl) {
        setSelectedItem(null);
      } else if (outfits.length > 0) {
        const foundItem = outfits.find((item) => item._id === itemIdFromUrl);
        if (foundItem) setSelectedItem(foundItem);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [outfits]);

  const filteredData = outfits.filter((item) => {
    const matchCategory =
      activeFilter === "All" ||
      item.category?.toLowerCase() === activeFilter.toLowerCase();

    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      item.title?.toLowerCase().includes(searchLower) ||
      (item.dominantColor &&
        item.dominantColor.toLowerCase().includes(searchLower)) ||
      (item.volNumber && item.volNumber.includes(searchQuery)) ||
      (item.tags &&
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower)));

    const matchColor =
      activeColor === "" || isColorSimilar(item.dominantColor, activeColor);

    return matchCategory && matchSearch && matchColor;
  });

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] bg-[#F5F4F1] flex flex-col items-center justify-center transition-all duration-[1500ms] ease-in-out ${
          isAppLoading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <h1 className="font-display text-3xl md:text-5xl uppercase tracking-[0.2em] text-stone-900 animate-pulse">
          Maison{" "}
          <span className="italic font-light text-stone-400">Deandra</span>
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-6">
          L'Archive En Chargement...
        </p>
      </div>

      <div className="min-h-screen bg-[#F5F4F1] text-stone-900">
        <header className="pt-20 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1
            className="text-5xl md:text-8xl font-display uppercase tracking-tighter text-stone-900 leading-[0.9] mb-4 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={handleBack}
          >
            Maison{" "}
            <span className="text-stone-400 italic font-light">Deandra</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500">
            The Architecture of Aesthetics
          </p>
        </header>

        {selectedItem ? (
          <ItemDetail
            item={selectedItem}
            allOutfits={outfits}
            onBack={handleBack}
            onSelect={handleSelectItem}
            onTagClick={handleTagClick}
          />
        ) : (
          <>
            <nav className="sticky top-0 z-50 bg-[#F5F4F1]/80 backdrop-blur-md border-y border-stone-300/50 mb-10">
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center space-x-6 md:space-x-12">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`font-mono text-[11px] uppercase tracking-widest transition-all relative pb-1
                    ${activeFilter === cat ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-600"}`}
                  >
                    {cat}
                    {activeFilter === cat && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900 animate-in fade-in"></span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            <div className="max-w-md mx-auto px-6 mb-6">
              <div className="flex items-center gap-3 border-b border-stone-300 py-2 transition-colors focus-within:border-stone-900">
                <input
                  type="text"
                  placeholder="Search archive (e.g. flannel, 41)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-stone-900 font-mono text-[10px] uppercase tracking-widest focus:outline-none text-center placeholder:text-stone-400"
                />

                <button
                  onClick={() =>
                    document.getElementById("ai-image-upload").click()
                  }
                  className="text-stone-400 hover:text-stone-900 transition-colors p-1"
                  title="Search by Image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </button>

                <input
                  type="file"
                  id="ai-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSearch}
                />
              </div>
            </div>

            {/* --- UI BARU: react-colorful Popover --- */}
            {!isAiLoading && !aiResults && (
              <div
                className="max-w-xl mx-auto px-6 mb-12 flex flex-col items-center justify-center gap-3 relative"
                ref={colorPickerRef}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500">
                    Filter by Color:
                  </span>

                  {/* Tombol Pemicu Color Picker */}
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-6 h-6 rounded-full border border-stone-300 shadow-sm transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      background:
                        activeColor ||
                        "conic-gradient(from 90deg, red, yellow, lime, aqua, blue, magenta, red)",
                    }}
                    title="Open Color Picker"
                  />
                </div>

                {/* Panel Color Picker (Tampil saat showColorPicker bernilai true) */}
                {showColorPicker && (
                  <div className="absolute top-10 z-50 p-4 bg-[#F5F4F1] border border-stone-300 shadow-xl rounded-sm">
                    <HexColorPicker
                      color={activeColor || "#000000"}
                      onChange={setActiveColor}
                    />

                    <div className="mt-4 flex justify-between items-center border-t border-stone-300/50 pt-3">
                      <span className="font-mono text-[10px] text-stone-500 uppercase">
                        {activeColor || "#000000"}
                      </span>
                      <button
                        onClick={() => {
                          setActiveColor("");
                          setShowColorPicker(false);
                        }}
                        className="text-[9px] font-mono border border-stone-900 px-3 py-1 uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-[#F5F4F1] transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <main className="max-w-7xl mx-auto px-4 md:px-10 pb-32">
              {isAiLoading && (
                <div className="text-center py-20 animate-pulse">
                  <p className="font-mono text-xs text-stone-900 uppercase tracking-widest font-bold">
                    [ AI is scanning the archive... ]
                  </p>
                </div>
              )}

              {aiResults && !isAiLoading && (
                <div className="flex flex-col items-center mb-8">
                  <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-3">
                    Showing visually similar items
                  </p>
                  <button
                    onClick={clearAiSearch}
                    className="text-[10px] font-mono border border-stone-900 px-4 py-1.5 uppercase tracking-widest hover:bg-stone-900 hover:text-[#F5F4F1] transition-colors"
                  >
                    Clear AI Search
                  </button>
                </div>
              )}

              {!isAiLoading && (
                <div className="columns-3 lg:columns-4 gap-2 md:gap-8 space-y-2 md:space-y-8">
                  {(aiResults || filteredData).map((item, index) => (
                    <GalleryCard
                      key={item._id}
                      item={item}
                      index={index}
                      onImageClick={handleSelectItem}
                    />
                  ))}
                </div>
              )}

              {!isAiLoading && (aiResults || filteredData).length === 0 && (
                <div className="text-center py-20">
                  <p className="font-mono text-xs text-stone-400 uppercase tracking-widest italic">
                    No items match your criteria.
                  </p>
                </div>
              )}
            </main>
          </>
        )}

        <footer className="py-12 border-t border-stone-300/50 text-center px-6">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest mb-4 leading-relaxed text-center">
              This website is a non-commercial digital gallery showcasing
              AI-generated fashion concepts.
              <br className="hidden sm:block" /> All designs are for artistic
              inspiration only.
            </p>
            <div className="h-px w-12 bg-stone-300 mb-4"></div>
            <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
              Maison Deandra // Farrell Shaan Deandra // 2026
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
