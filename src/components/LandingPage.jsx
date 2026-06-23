import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- KOMPONEN: LOGO CAROUSEL ---
const BRANDS = [
  "LEMAIRE",
  "THE ROW",
  "MAISON MARGIELA",
  "JIL SANDER",
  "CELINE",
  "KHAITE",
  "BOTTEGA VENETA",
  "LOEWE",
];

const LogoCarousel = () => {
  return (
    <div className="w-full overflow-hidden py-12 border-b border-stone-300/50 bg-[#F5F4F1] flex items-center relative group/carousel">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F5F4F1] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F5F4F1] to-transparent z-10 pointer-events-none"></div>

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        className="flex w-max items-center gap-16 md:gap-24 pr-16 md:pr-24 hover:[animation-play-state:paused]"
      >
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span
            key={i}
            className="font-display text-xl md:text-2xl text-stone-900 uppercase tracking-[0.2em] whitespace-nowrap opacity-30 hover:!opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- KOMPONEN: CARD FAN CAROUSEL ---
const FanCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    "https://cdn.sanity.io/images/7z000okv/production/64b9aa8a3a94aab2917a63ca0dd1e865e144b3d9-1080x1918.jpg?w=1080&q=100&auto=format",
    "https://cdn.sanity.io/images/7z000okv/production/e2580f2cbcd47deee15c9823d8075a9a5d895fdc-1080x1918.jpg?w=1080&q=100&auto=format",
    "https://cdn.sanity.io/images/7z000okv/production/487c48487e9835fceb2bf4c7ecad1f54bb71ae1d-1080x1918.jpg?w=1080&q=100&auto=format",
    "https://cdn.sanity.io/images/7z000okv/production/9f0402ee80e087c786b0cadba5743f3c47f84e2e-1080x1918.jpg?w=1080&q=100&auto=format",
    "https://cdn.sanity.io/images/7z000okv/production/bf3b47a31d7d4047c90ac17fd8a79004669cded4-1080x1918.jpg?w=1080&q=100&auto=format",
  ];

  const transforms = [
    { rotate: -15, x: -140, y: 20 },
    { rotate: -7.5, x: -70, y: 10 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 7.5, x: 70, y: 10 },
    { rotate: 15, x: 140, y: 20 },
  ];

  return (
    <div
      className="relative w-full aspect-[4/3] flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((img, i) => {
        const zIndex = isHovered ? 10 : images.length - Math.abs(2 - i);
        return (
          <motion.div
            key={i}
            className="absolute w-36 md:w-48 aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-stone-300/50 bg-stone-200 transform-gpu backface-hidden"
            initial={{ rotate: (i - 2) * 3, x: 0, y: 0 }}
            animate={{
              rotate: isHovered ? transforms[i].rotate : (i - 2) * 2,
              x: isHovered ? transforms[i].x : 0,
              y: isHovered ? transforms[i].y : 0,
            }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            style={{
              zIndex,
              WebkitBackfaceVisibility: "hidden",
              WebkitTransform: "translate3d(0, 0, 0)",
            }}
          >
            <img
              src={img}
              alt={`Archive item ${i + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// ----------------------------------------
// --- HALAMAN UTAMA ---
// ----------------------------------------
export default function LandingPage({ onEnter }) {
  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 300], [0.95, 1]);
  const borderRadius = useTransform(scrollY, [0, 300], ["2rem", "0rem"]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <div className="bg-[#111111] min-h-screen selection:bg-[#F5F4F1] selection:text-stone-900 relative">
      {/* 1. HEADER MINIMALIS (MICRO-COPY ATAS) */}
      <div className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-20 pointer-events-none mix-blend-difference text-white/70">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] leading-relaxed">
          <p>Maison Deandra</p>
          <p className="text-white/40">Digital Archive</p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-right leading-relaxed">
          <p>Jakarta, ID</p>
          <p className="text-white/40">Est. 2026</p>
        </div>
      </div>

      {/* BACKGROUND SHADER */}
      <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-rose-900 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-800 rounded-full blur-[120px]"
        />

        {/* HERO TEXT - FOKUS UTAMA */}
        <div className="text-center text-[#F5F4F1] mb-20 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-display text-7xl md:text-9xl uppercase tracking-tighter leading-[0.85]"
          >
            Maison
            <br />
            <span className="italic font-light text-white/50 pr-4 md:pr-8">
              Deandra
            </span>
          </motion.h1>
        </div>
      </div>

      {/* 2. MICRO-COPY BAWAH & SCROLL INDICATOR */}
      <div className="absolute bottom-0 left-0 w-full h-screen pointer-events-none z-10">
        <div className="absolute bottom-10 left-6 md:left-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mix-blend-difference">
          <p>Vol. 01</p>
          <p>Curated Essentials</p>
        </div>

        {/* Scroll Indicator Animasi */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 mix-blend-difference">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] origin-bottom -rotate-90 translate-y-[-20px]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/80 to-transparent"
          />
        </div>
      </div>

      <div className="h-[100vh] w-full relative z-0"></div>

      {/* CONTAINER UTAMA (KONTEN BAWAH) */}
      <motion.div
        style={{ scale, borderRadius }}
        className="relative z-20 bg-[#F5F4F1] text-stone-900 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] origin-bottom w-full min-h-screen pb-32"
      >
        <LogoCarousel />

        <div className="max-w-7xl mx-auto px-6">
          <section className="py-24 md:py-32 flex flex-col md:flex-row items-center gap-12 md:gap-16 border-b border-stone-300/50">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-5/12"
            >
              <h2 className="font-display text-3xl md:text-5xl uppercase tracking-widest mb-6">
                Curated <br />
                <span className="italic font-light text-stone-400">
                  Essentials
                </span>
              </h2>
              <p className="font-mono text-xs text-stone-500 leading-loose">
                A digital wardrobe built on the philosophy of quiet luxury.
                Every piece documented here is selected for its timeless
                silhouette and versatility. Hover to explore the archive.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-7/12"
            >
              <FanCarousel />
            </motion.div>
          </section>

          <section className="py-24 md:py-32 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-5/12"
            >
              <h2 className="font-display text-3xl md:text-5xl uppercase tracking-widest mb-6">
                Chromatic <br />
                <span className="italic font-light text-stone-400">
                  Selection
                </span>
              </h2>
              <p className="font-mono text-xs text-stone-500 leading-loose">
                Navigate the archive by precise hexadecimal codes. Select any
                shade, and the interface aligns to your palette.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-7/12"
            >
              <div className="aspect-video bg-stone-200 rounded-2xl overflow-hidden shadow-2xl border border-stone-300 p-2 bg-white/60 backdrop-blur-md">
                <div className="w-full h-full rounded-xl overflow-hidden bg-stone-100 relative">
                  <video
                    src="/color-demo.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.31] origin-center"
                  />
                </div>
              </div>
            </motion.div>
          </section>

          <section className="py-24 px-6 text-center border-t border-stone-300/50 mt-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <motion.button
                onClick={onEnter}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-5 bg-stone-900 text-[#F5F4F1] rounded-full pl-8 pr-3 py-3 shadow-xl hover:shadow-[0_0_30px_rgba(28,25,23,0.3)] transition-all border border-stone-800"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] font-bold pt-0.5">
                  Open The Gallery
                </span>
                <div className="relative w-12 h-12 bg-[#F5F4F1] rounded-full flex items-center justify-center overflow-hidden">
                  <svg
                    className="absolute text-stone-900 w-5 h-5 transform group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                  <svg
                    className="absolute text-stone-900 w-5 h-5 transform -translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            </motion.div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
