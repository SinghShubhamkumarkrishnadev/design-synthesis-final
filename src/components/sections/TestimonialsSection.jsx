// components/sections/TestimonialsSection.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Quote } from "lucide-react";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const FOREST = "#2c4a3b";
const FOREST_LIGHT = "#3d6652";
const FOREST_BG = "#eef4f1";
const FOREST_BORDER = "#c8ddd4";

// ─── Data ─────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "The attention to detail and clean architecture delivered exceeded our expectations. Truly professional-grade frontend designs.",
    author: "Alex Rivers",
    role: "Lead Developer, TechFlow",
    initials: "AR",
  },
  {
    quote:
      "Incredible fluid animations and modular code architecture. It significantly cut down our development lifecycle.",
    author: "Sarah Jenkins",
    role: "Product Manager, Apex Studio",
    initials: "SJ",
  },
  {
    quote:
      "Stunning aesthetic presentation coupled with semantic, high-performance code. A masterclass in modern UI development.",
    author: "Marcus Chen",
    role: "Founder, Quantum Creative",
    initials: "MC",
  },
  {
    quote:
      "We integrated the components into our design system within days. The scalability and flexibility of each module is outstanding.",
    author: "Priya Nair",
    role: "Design Systems Lead, Orbit Labs",
    initials: "PN",
  },
  {
    quote:
      "From landing pages to dashboards, every deliverable has been pixel-perfect. Our clients keep asking who built it.",
    author: "Daniel Osei",
    role: "Creative Director, Luma Agency",
    initials: "DO",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildCardVariants = (count, spreadX, openSpreadX, openSpreadY) =>
  Array.from({ length: count }, (_, i) => {
    const mid = (count - 1) / 2;
    const offset = i - mid;
    return {
      initial: {
        rotate: offset * 3.5,
        x: offset * spreadX,
        y: Math.abs(offset) * 1.2,
        scale: 1,
      },
      open: {
        rotate: offset * 8,
        x: offset * openSpreadX,
        y: -openSpreadY - Math.abs(offset) * 12,
        scale: 1.02,
      },
      hover: {
        rotate: offset * 12,
        x: offset * openSpreadX,
        y: -openSpreadY - Math.abs(offset) * 12 - 18,
        scale: 1.06,
      },
      className: i === Math.floor(mid) ? "z-20" : "z-10",
    };
  });

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [dims, setDims] = useState({ w: 320, h: 208 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 360) setDims({ w: 240, h: 160 });
      else if (vw < 480) setDims({ w: 272, h: 180 });
      else if (vw < 640) setDims({ w: 300, h: 196 });
      else setDims({ w: 320, h: 208 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scale = dims.w / 320;
  const cardW = Math.round(144 * scale);
  const cardH = Math.round(176 * scale);
  const cardVariants = buildCardVariants(
    testimonials.length,
    38 * scale,
    68 * scale,
    82 * scale,
  );

  return (
    <div
      className="w-full py-16 sm:py-24 lg:py-32 flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        background: "#f7faf8",
        borderTop: `1px solid ${FOREST_BORDER}`,
        borderBottom: `1px solid ${FOREST_BORDER}`,
      }}
    >
      {/* Soft radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 72% 48% at 50% 0%, ${FOREST_BG} 0%, transparent 72%)`,
        }}
      />

      <div className="relative max-w-[1600px] mx-auto w-full px-4 sm:px-8 md:px-16 xl:px-24">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="w-full flex flex-col items-center justify-center mb-10 sm:mb-14 lg:mb-16">
          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-4 py-1.5 rounded-full mb-5 border"
            style={{
              color: FOREST,
              background: FOREST_BG,
              borderColor: FOREST_BORDER,
              letterSpacing: "0.12em",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: FOREST }}
            />
            Client Stories
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 text-center leading-tight">
            Wall of{" "}
            <motion.span
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative cursor-default inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-2xl border transition-colors duration-300"
              style={{
                background: FOREST_BG,
                borderColor: FOREST_BORDER,
                color: FOREST,
              }}
            >
              Love
              <motion.span
                animate={isHovered ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{
                  duration: 0.65,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="inline-block text-base sm:text-xl"
              >
                💚
              </motion.span>
            </motion.span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-neutral-500 text-center max-w-md">
            Real words from the teams who shipped with us.
          </p>
        </div>

        {/* ── Folder ─────────────────────────────────────────────────── */}
        <div className="w-full flex flex-col items-center justify-center mb-10 sm:mb-14 lg:mb-16">
          <div
            className="relative select-none mb-10 sm:mb-14"
            style={{ width: dims.w, height: dims.h }}
          >
            {/* Back panel */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="relative mx-auto h-full flex justify-center rounded-xl overflow-visible cursor-pointer"
              style={{
                width: "87.5%",
                background: "#daeae2",
                border: `1.5px solid ${FOREST_BORDER}`,
              }}
            >
              {testimonials.map((testimonial, i) => {
                const v = cardVariants[i % cardVariants.length];
                return (
                  <motion.div
                    key={i}
                    initial={v.initial}
                    animate={isOpen ? v.open : v.initial}
                    whileHover={isOpen ? v.hover : {}}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      stiffness: 170,
                      damping: 22,
                    }}
                    onClick={(e) => {
                      if (isOpen) {
                        e.stopPropagation();
                        setSelectedTestimonial(testimonial);
                      }
                    }}
                    className={`absolute shadow-xl rounded-xl cursor-pointer ${
                      isOpen ? "pointer-events-auto" : "pointer-events-none"
                    } ${v.className}`}
                    style={{
                      top: Math.round(8 * scale),
                      width: cardW,
                      height: cardH,
                    }}
                  >
                    <PageCard testimonial={testimonial} scale={scale} />
                  </motion.div>
                );
              })}
            </div>

            {/* Front flap */}
            <motion.div
              onClick={() => setIsOpen(!isOpen)}
              animate={{ rotateX: isOpen ? -35 : 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="absolute inset-x-0 -bottom-px z-30 origin-bottom flex justify-center items-center overflow-visible [perspective:1000px] cursor-pointer"
              style={{ height: Math.round(176 * scale) }}
            >
              <div className="relative w-full h-full">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 235 121"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z"
                    fill="#daeae2"
                    stroke={FOREST_BORDER}
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Face */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 sm:pt-8 pointer-events-none select-none">
                  <div
                    className="flex mb-2"
                    style={{ gap: Math.round(44 * scale) }}
                  >
                    {[0, 1].map((k) => (
                      <div
                        key={k}
                        className="rounded-full"
                        style={{
                          width: Math.round(10 * scale),
                          height: Math.round(10 * scale),
                          background: `${FOREST}70`,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="rounded-full"
                    style={{
                      width: Math.round(36 * scale),
                      height: Math.round(4 * scale),
                      background: `${FOREST}70`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Count badge */}
          <div className="flex items-center mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide px-3 py-1 rounded-full border"
              style={{
                color: FOREST,
                background: FOREST_BG,
                borderColor: FOREST_BORDER,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: FOREST }}
              />
              {testimonials.length} letters inside
            </span>
          </div>

          {/* Instruction */}
          <div className="text-center space-y-4 px-4">
            <motion.p
              key={String(isOpen)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm sm:text-base lg:text-lg font-medium tracking-tight"
              style={{ color: FOREST }}
            >
              {isOpen
                ? "Tap a card to read the full testimonial"
                : "Click the folder to reveal the letters"}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTestimonial(null)}
              className="absolute inset-0 backdrop-blur-md"
              style={{ background: "rgba(20,38,28,0.48)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl flex flex-col z-10"
              style={{ border: `1.5px solid ${FOREST_BORDER}` }}
            >
              {/* Close btn */}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full transition-colors"
                style={{ color: "#94a3a0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = FOREST_BG;
                  e.currentTarget.style.color = FOREST;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94a3a0";
                }}
              >
                <X size={17} />
              </button>

              {/* Quote icon */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 flex-shrink-0"
                style={{ background: FOREST_BG, color: FOREST }}
              >
                <Quote size={20} fill="currentColor" className="opacity-80" />
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg md:text-xl text-neutral-800 font-light leading-relaxed mb-5 sm:mb-8">
                "{selectedTestimonial.quote}"
              </p>

              {/* Author */}
              <div
                className="flex items-center gap-3 sm:gap-4 border-t pt-4 sm:pt-5 mt-auto"
                style={{ borderColor: FOREST_BORDER }}
              >
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center font-mono text-xs sm:text-sm font-bold flex-shrink-0"
                  style={{ background: FOREST }}
                >
                  {selectedTestimonial.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                    {selectedTestimonial.author}
                  </h4>
                  <p
                    className="text-[10px] sm:text-xs font-mono mt-0.5 truncate"
                    style={{ color: FOREST_LIGHT }}
                  >
                    {selectedTestimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PageCard ─────────────────────────────────────────────────────────────────
const PageCard = ({ testimonial, scale = 1 }) => {
  const fs = Math.max(8, Math.round(10 * scale));
  const authorFs = Math.max(7, Math.round(9 * scale));
  const avatarSz = Math.round(16 * scale);
  const avatarFs = Math.max(6, Math.round(8 * scale));
  const pad = Math.round(14 * scale);

  return (
    <div
      className="w-full h-full rounded-xl flex flex-col justify-between select-none"
      style={{
        background: "linear-gradient(160deg,#ffffff 0%,#f3f9f6 100%)",
        border: `1px solid ${FOREST_BORDER}`,
        padding: pad,
        boxShadow: `0 2px 14px 0 rgba(44,74,59,0.10)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {/* Decorative lines */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: 0.35,
          }}
        >
          <div
            style={{
              width: Math.round(32 * scale),
              height: 3,
              background: FOREST,
              borderRadius: 99,
            }}
          />
          <div
            style={{
              width: Math.round(10 * scale),
              height: 3,
              background: FOREST_BORDER,
              borderRadius: 99,
            }}
          />
        </div>
        {/* Quote */}
        <p
          className="line-clamp-4"
          style={{
            fontSize: fs,
            lineHeight: `${Math.round(fs * 1.5)}px`,
            color: "#4a6358",
            fontStyle: "italic",
            paddingTop: Math.round(2 * scale),
          }}
        >
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: Math.round(6 * scale),
          borderTop: `1px solid ${FOREST_BORDER}`,
          paddingTop: Math.round(7 * scale),
        }}
      >
        <div
          style={{
            width: avatarSz,
            height: avatarSz,
            borderRadius: "50%",
            background: FOREST,
            color: "white",
            fontSize: avatarFs,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {testimonial.initials}
        </div>
        <p
          className="truncate"
          style={{
            fontSize: authorFs,
            fontWeight: 600,
            color: FOREST,
            lineHeight: 1,
          }}
        >
          {testimonial.author}
        </p>
      </div>
    </div>
  );
};
