"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote } from "lucide-react";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const TOKEN = {
  forest:       "#2c4a3b",
  forestLight:  "#3d6652",
  forestBg:     "#eef4f1",
  forestBorder: "#c8ddd4",
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:    "The attention to detail and clean architecture delivered exceeded our expectations. Truly professional-grade frontend designs.",
    author:   "Alex Rivers",
    role:     "Lead Developer, TechFlow",
    initials: "AR",
  },
  {
    quote:    "Incredible fluid animations and modular code architecture. It significantly cut down our development lifecycle.",
    author:   "Sarah Jenkins",
    role:     "Product Manager, Apex Studio",
    initials: "SJ",
  },
  {
    quote:    "Stunning aesthetic presentation coupled with semantic, high-performance code. A masterclass in modern UI development.",
    author:   "Marcus Chen",
    role:     "Founder, Quantum Creative",
    initials: "MC",
  },
  {
    quote:    "We integrated the components into our design system within days. The scalability and flexibility of each module is outstanding.",
    author:   "Priya Nair",
    role:     "Design Systems Lead, Orbit Labs",
    initials: "PN",
  },
  {
    quote:    "From landing pages to dashboards, every deliverable has been pixel-perfect. Our clients keep asking who built it.",
    author:   "Daniel Osei",
    role:     "Creative Director, Luma Agency",
    initials: "DO",
  },
];

// Spring preset shared across card animations
const CARD_SPRING = { type: "spring", bounce: 0.15, stiffness: 170, damping: 22 };

// ─── buildCardVariants ─────────────────────────────────────────────────────────
function buildCardVariants(count, spreadX, openSpreadX, openSpreadY) {
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    const offset = i - mid;
    return {
      initial: {
        rotate: offset * 3.5,
        x:      offset * spreadX,
        y:      Math.abs(offset) * 1.2,
        scale:  1,
      },
      open: {
        rotate: offset * 8,
        x:      offset * openSpreadX,
        y:      -openSpreadY - Math.abs(offset) * 12,
        scale:  1.02,
      },
      hover: {
        rotate: offset * 12,
        x:      offset * openSpreadX,
        y:      -openSpreadY - Math.abs(offset) * 12 - 18,
        scale:  1.06,
      },
      zClass: i === Math.floor(mid) ? "z-20" : "z-10",
    };
  });
}

// ─── PageCard ──────────────────────────────────────────────────────────────────
const PageCard = memo(function PageCard({ testimonial, scale = 1 }) {
  const fs       = Math.max(9,  Math.round(10.5 * scale));
  const authorFs = Math.max(8,  Math.round(9.5  * scale));
  const avatarSz = Math.round(18 * scale);
  const avatarFs = Math.max(7,  Math.round(8.5  * scale));
  const pad      = Math.round(14 * scale);
  const lineH    = Math.round(fs * 1.45);
  const lineW    = Math.round(32 * scale);
  const dotW     = Math.round(10 * scale);
  const ptTop    = Math.round(7  * scale);
  const gap      = Math.round(6  * scale);

  return (
    <div
      className="w-full h-full rounded-xl flex flex-col justify-between select-none"
      style={{
        background:  "linear-gradient(160deg,#ffffff 0%,#f3f9f6 100%)",
        border:      `1px solid ${TOKEN.forestBorder}`,
        padding:     pad,
        boxShadow:   `0 2px 14px 0 rgba(44,74,59,0.10)`,
      }}
    >
      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {/* Decorative rule */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            opacity:         0.35,
          }}
        >
          <div style={{ width: lineW, height: 3, background: TOKEN.forest,       borderRadius: 99 }} />
          <div style={{ width: dotW,  height: 3, background: TOKEN.forestBorder, borderRadius: 99 }} />
        </div>

        {/* Quote */}
        <p
          className="line-clamp-4"
          style={{
            fontSize:   fs,
            lineHeight: `${lineH}px`,
            color:      "#4a6358",
            fontStyle:  "italic",
            paddingTop: Math.round(2 * scale),
          }}
        >
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author row */}
      <div
        style={{
          display:     "flex",
          alignItems:  "center",
          gap,
          borderTop:   `1px solid ${TOKEN.forestBorder}`,
          paddingTop:  ptTop,
        }}
      >
        <div
          style={{
            width:        avatarSz,
            height:       avatarSz,
            borderRadius: "50%",
            background:   TOKEN.forest,
            color:        "white",
            fontSize:     avatarFs,
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            fontFamily:   "monospace",
            fontWeight:    700,
            flexShrink:    0,
          }}
        >
          {testimonial.initials}
        </div>
        <p
          className="truncate"
          style={{ fontSize: authorFs, fontWeight: 600, color: TOKEN.forest, lineHeight: 1 }}
        >
          {testimonial.author}
        </p>
      </div>
    </div>
  );
});

// ─── TestimonialModal ──────────────────────────────────────────────────────────
const TestimonialModal = memo(function TestimonialModal({ testimonial, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: "rgba(20,38,28,0.48)" }}
        aria-hidden="true"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl flex flex-col z-10"
        style={{ border: `1.5px solid ${TOKEN.forestBorder}` }}
      >
        <button
          onClick={onClose}
          aria-label="Close testimonial"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full transition-colors"
          style={{ color: "#94a3a0" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = TOKEN.forestBg;
            e.currentTarget.style.color      = TOKEN.forest;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color      = "#94a3a0";
          }}
        >
          <X size={17} />
        </button>

        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 flex-shrink-0"
          style={{ background: TOKEN.forestBg, color: TOKEN.forest }}
        >
          <Quote size={20} fill="currentColor" className="opacity-80" />
        </div>

        <p className="text-base sm:text-lg md:text-xl text-neutral-800 font-light leading-relaxed mb-5 sm:mb-8">
          "{testimonial.quote}"
        </p>

        <div
          className="flex items-center gap-3 sm:gap-4 border-t pt-4 sm:pt-5 mt-auto"
          style={{ borderColor: TOKEN.forestBorder }}
        >
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center font-mono text-xs sm:text-sm font-bold flex-shrink-0"
            style={{ background: TOKEN.forest }}
          >
            {testimonial.initials}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
              {testimonial.author}
            </h4>
            <p
              className="text-[10px] sm:text-xs font-mono mt-0.5 truncate"
              style={{ color: TOKEN.forestLight }}
            >
              {testimonial.role}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// ─── FolderFace ────────────────────────────────────────────────────────────────
const FolderFace = memo(function FolderFace({ scale, isFolderHovered, isOpen, onToggle }) {
  const faceW  = Math.round(90  * scale);
  const faceH  = Math.round(30  * scale);
  const eyeW   = Math.round(54  * scale);
  const eyeH   = Math.round(10  * scale);
  const eyeMb  = Math.round(4   * scale);
  const mouthW = Math.round(36  * scale);
  const mouthH = Math.round(10  * scale);
  const sw     = Math.round(3.5 * scale);
  const msw    = Math.round(4   * scale);
  const flapH  = Math.round(176 * scale);
  const eyeColor = `${TOKEN.forest}70`;

  return (
    <motion.div
      onClick={onToggle}
      animate={{ rotateX: isOpen ? -35 : 0 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      className="absolute inset-x-0 -bottom-px z-30 origin-bottom flex justify-center items-center overflow-visible cursor-pointer"
      style={{ height: flapH, perspective: 1000 }}
    >
      <div className="relative w-full h-full">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 235 121"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z"
            fill="#daeae2"
            stroke={TOKEN.forestBorder}
            strokeWidth="1.5"
          />
        </svg>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ paddingTop: `${Math.round(6 * scale)}px` }}
        >
          <div style={{ width: faceW, height: faceH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <svg
              style={{ width: eyeW, height: eyeH, marginBottom: eyeMb }}
              viewBox="0 0 54 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                animate={{
                  d: isFolderHovered ? "M 2,8 Q 7,1 12,8" : "M 7,5 A 4,4 0 1 1 6.99,5",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                stroke={eyeColor}
                strokeWidth={sw}
                strokeLinecap="round"
                fill={isFolderHovered ? "none" : eyeColor}
              />
              <motion.path
                animate={{
                  d: isFolderHovered ? "M 42,8 Q 47,1 52,8" : "M 47,5 A 4,4 0 1 1 46.99,5",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                stroke={eyeColor}
                strokeWidth={sw}
                strokeLinecap="round"
                fill={isFolderHovered ? "none" : eyeColor}
              />
            </svg>

            <svg
              style={{ width: mouthW, height: mouthH }}
              viewBox="0 0 36 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                animate={{
                  d: isFolderHovered ? "M 2,2 Q 18,10 34,2" : "M 2,5 Q 18,5 34,5",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                stroke={eyeColor}
                strokeWidth={msw}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ─── FolderDeck ────────────────────────────────────────────────────────────────
const FolderDeck = memo(function FolderDeck({
  testimonials,
  isOpen,
  isFolderHovered,
  scale,
  cardW,
  cardH,
  cardVariants,
  onToggle,
  onSelectCard,
}) {
  return (
    <div
      onClick={onToggle}
      className="relative mx-auto h-full flex justify-center rounded-xl overflow-visible cursor-pointer"
      style={{
        width:      "87.5%",
        background: "#daeae2",
        border:     `1.5px solid ${TOKEN.forestBorder}`,
      }}
    >
      {testimonials.map((testimonial, i) => {
        const v = cardVariants[i % cardVariants.length];
        return (
          <motion.div
            key={testimonial.author}
            initial={v.initial}
            animate={isOpen ? v.open : v.initial}
            whileHover={isOpen ? v.hover : undefined}
            transition={CARD_SPRING}
            onClick={(e) => {
              if (isOpen) {
                e.stopPropagation();
                onSelectCard(testimonial);
              }
            }}
            className={`absolute shadow-xl rounded-xl ${
              isOpen ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
            } ${v.zClass}`}
            style={{
              top:    Math.round(8 * scale),
              width:  cardW,
              height: cardH,
            }}
          >
            <PageCard testimonial={testimonial} scale={scale} />
          </motion.div>
        );
      })}
    </div>
  );
});

// ─── useResponsiveDims ─────────────────────────────────────────────────────────
function useResponsiveDims() {
  const getDims = useCallback(() => {
    if (typeof window === "undefined") return { w: 440, h: 286 };
    const vw = window.innerWidth;
    if (vw < 360) return { w: 240, h: 160 };
    if (vw < 480) return { w: 272, h: 180 };
    if (vw < 640) return { w: 320, h: 208 };
    if (vw < 1024) return { w: 360, h: 234 };
    return { w: 440, h: 286 };
  }, []);

  const [dims, setDims] = useState(getDims);

  useEffect(() => {
    const handler = () => setDims(getDims());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [getDims]);

  return dims;
}

// ─── Infinite Marquee Column Component ───────────────────────────────────────
const TestimonialsColumn = ({ testimonials, className, duration = 25, shift = false }) => {
  return (
    <div className={`${className} overflow-hidden max-h-[520px] relative rounded-3xl [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]`}>
      <motion.div
        animate={{ translateY: shift ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ quote, author, role, initials }, i) => (
              <div 
                className="p-6 rounded-2xl border bg-white/60 backdrop-blur-sm shadow-md w-full select-none" 
                key={`${index}-${i}`}
                style={{ borderColor: TOKEN.forestBorder }}
              >
                <div className="text-neutral-700 font-normal italic text-sm leading-relaxed">
                  "{quote}"
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
                    style={{ background: TOKEN.forest }}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="font-semibold text-xs text-neutral-900 truncate leading-none">
                      {author}
                    </div>
                    <div 
                      className="text-[10px] font-medium tracking-tight mt-1 truncate leading-none opacity-70"
                      style={{ color: TOKEN.forestLight }}
                    >
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

// ─── TestimonialsSection ───────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [isOpen,              setIsOpen]              = useState(false);
  const [isFolderHovered,     setIsFolderHovered]     = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const dims = useResponsiveDims();
  const scale = dims.w / 320;

  const cardW        = Math.round(144 * scale);
  const cardH        = Math.round(176 * scale);
  const cardVariants = useMemo(
    () => buildCardVariants(TESTIMONIALS.length, 38 * scale, 68 * scale, 82 * scale),
    [scale],
  );

  const toggleOpen      = useCallback(() => setIsOpen((v) => !v), []);
  const closeModal      = useCallback(() => setSelectedTestimonial(null), []);

  const folderMarginBottom = isOpen
    ? Math.round(64 * scale)
    : Math.round(16 * scale);

  // Divide testimonials into subsets for multiple columns
  const firstColSubset  = useMemo(() => TESTIMONIALS.slice(0, 3), []);
  const secondColSubset = useMemo(() => [...TESTIMONIALS.slice(2), TESTIMONIALS[0]], []);
  const thirdColSubset  = useMemo(() => [TESTIMONIALS[4], ...TESTIMONIALS.slice(0, 2)], []);

  return (
    <section
      className="w-full py-16 sm:py-24 lg:py-32 flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        background:   "#f7faf8",
        borderTop:    `1px solid ${TOKEN.forestBorder}`,
        borderBottom: `1px solid ${TOKEN.forestBorder}`,
      }}
    >
      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 72% 48% at 50% 0%, #eef4f1 0%, transparent 72%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-16 xl:px-12 z-10">

        {/* ── Section Header (Shows Everywhere) ───────────────────────────── */}
        <div className="w-full flex flex-col items-center justify-center mb-12 sm:mb-16 md:mb-20">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-4 py-1.5 rounded-full mb-5 border bg-white/80 backdrop-blur-md"
            style={{
              color:        TOKEN.forest,
              borderColor:  TOKEN.forestBorder,
              letterSpacing: "0.12em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: TOKEN.forest }} />
            Client Stories
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 text-center leading-tight">
            Wall of{" "}
            <span
              className="relative cursor-default inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-2xl border transition-colors duration-300"
              style={{
                background:  "#eef4f1",
                borderColor: TOKEN.forestBorder,
                color:       TOKEN.forest,
              }}
            >
              Love 💚
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 text-center max-w-md">
            Real words from the teams who shipped with us.
          </p>
        </div>

        {/* ── Layout Content Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">

          {/* ── Left Dynamic Wall Side (Desktop Only: 2-3 Columns Structure) ── */}
          <div className="hidden lg:grid lg:col-span-6 grid-cols-2 xl:grid-cols-3 gap-5 relative w-full z-40 max-w-3xl mx-auto">
            <TestimonialsColumn testimonials={firstColSubset} className="w-full" duration={35} />
            <TestimonialsColumn testimonials={secondColSubset} className="w-full" duration={28} shift={true} />
            <TestimonialsColumn testimonials={thirdColSubset} className="w-full hidden xl:block" duration={42} />
          </div>

          {/* ── Right Folder Side (Matches original structure perfectly) ───── */}
          <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center">
            <div
              onMouseEnter={() => setIsFolderHovered(true)}
              onMouseLeave={() => setIsFolderHovered(false)}
              className="relative select-none transition-all duration-300 ease-out z-30"
              style={{
                width:         dims.w,
                height:        dims.h,
                marginBottom:  folderMarginBottom,
              }}
            >
              {/* Back panel with stacked cards */}
              <FolderDeck
                testimonials={TESTIMONIALS}
                isOpen={isOpen}
                isFolderHovered={isFolderHovered}
                scale={scale}
                cardW={cardW}
                cardH={cardH}
                cardVariants={cardVariants}
                onToggle={toggleOpen}
                onSelectCard={setSelectedTestimonial}
              />

              {/* Animated folder flap with face */}
              <FolderFace
                scale={scale}
                isFolderHovered={isFolderHovered}
                isOpen={isOpen}
                onToggle={toggleOpen}
              />
            </div>

            {/* Count badge */}
            <div className="flex items-center mb-4">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide px-3 py-1 rounded-full border bg-white/90 backdrop-blur-md"
                style={{ color: TOKEN.forest, borderColor: TOKEN.forestBorder }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: TOKEN.forest }} />
                {TESTIMONIALS.length} letters inside
              </span>
            </div>

            {/* Instruction text */}
            <div className="text-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={String(isOpen)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base font-medium tracking-tight"
                  style={{ color: TOKEN.forest }}
                >
                  {isOpen
                    ? "Tap a card to read the full testimonial"
                    : "Click the folder to reveal the letters"}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal popup display component ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedTestimonial && (
          <TestimonialModal
            key="modal"
            testimonial={selectedTestimonial}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}