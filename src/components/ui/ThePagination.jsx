import React from "react";

export function PaginationBasic({ currentPage, totalPages, onPageChange }) {
  // Sembunyikan kalau cuma 1 halaman
  if (totalPages <= 1) return null;

  // Logika pintar agar angka tidak kepanjangan di layar (maksimal 5 angka berjajar)
  const getVisiblePages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-16 mb-8 w-full animate-in fade-in duration-700">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 font-mono text-xs px-2 md:px-3 py-1.5 text-stone-900 hover:bg-stone-200/50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span>←</span> <span className="hidden md:inline">Previous</span>
      </button>

      {/* Deretan Angka Halaman */}
      <div className="flex items-center gap-1 md:gap-2">
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center font-mono text-[10px] md:text-xs rounded-md transition-all ${
              currentPage === page
                ? "bg-stone-900 text-[#F5F4F1] shadow-sm font-bold"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 font-mono text-xs px-2 md:px-3 py-1.5 text-stone-900 hover:bg-stone-200/50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden md:inline">Next</span> <span>→</span>
      </button>
    </div>
  );
}
