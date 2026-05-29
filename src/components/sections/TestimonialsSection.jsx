"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialsSection — Visual identity matches ServicesSection exactly
// Typography : Cormorant Garamond (display) + DM Sans (UI)
// Palette    : pale sage bg, forest green accents, glassmorphism surfaces
// Responsive : 7-tier breakpoint system (xxs → 2xl)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Shared motion presets (identical to ServicesSection) ────────────────────
const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.65, ease } },
};

const ruleVariant = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.80, delay: 0.16, ease } },
};

// ─── Palette (exact ServicesSection tokens) ───────────────────────────────────
const C = {
  bg:          "#EEF1EE",
  bgGrad: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 38%, transparent 72%),
    radial-gradient(ellipse 55% 75% at 100% 45%, rgba(45,115,86,0.045) 0%, transparent 65%),
    radial-gradient(ellipse 45% 55% at 0% 100%, rgba(13,43,30,0.035) 0%, transparent 60%),
    linear-gradient(180deg, #F4F6F4 0%, #EEF1EE 38%, #E8ECE8 72%, #E3E8E4 100%)
  `,
  forest:      "#0D2B1E",
  accent:      "#2D7356",
  accentLight: "#235E44",
  border:      "rgba(45,115,86,0.18)",
  borderSolid: "#c8ddd4",
  cardBg:      "linear-gradient(160deg,#ffffff 0%,#f3f9f6 100%)",
  cardShadow:  "0 2px 18px 0 rgba(13,43,30,0.10)",
  text:        "rgba(13,43,30,0.72)",
  textMuted:   "rgba(13,43,30,0.42)",
  glass:       "rgba(255,255,255,0.60)",
};

// ─── Fonts (identical to ServicesSection) ────────────────────────────────────
const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

// ─── Data ─────────────────────────────────────────────────────────────────────
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

// ─── Breakpoint helper (matches ServicesSection exactly) ─────────────────────
function getBreakpoint(w) {
  if (w < 360)  return "xxs";
  if (w < 480)  return "xs";
  if (w < 640)  return "sm";
  if (w < 768)  return "md";
  if (w < 1024) return "lg";
  if (w < 1280) return "xl";
  return "2xl";
}

function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

// ─── Card dimension config per breakpoint ────────────────────────────────────
function getCardConfig(bp) {
  const map = {
    xxs: { folderW: 230, folderH: 152, scale: 230 / 320 },
    xs:  { folderW: 260, folderH: 170, scale: 260 / 320 },
    sm:  { folderW: 300, folderH: 196, scale: 300 / 320 },
    md:  { folderW: 330, folderH: 215, scale: 330 / 320 },
    lg:  { folderW: 360, folderH: 234, scale: 360 / 320 },
    xl:  { folderW: 400, folderH: 260, scale: 400 / 320 },
    "2xl": { folderW: 440, folderH: 286, scale: 440 / 320 },
  };
  return map[bp] || map["xl"];
}

// ─── Card spread variants ─────────────────────────────────────────────────────
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
      zIndex: i === Math.floor(mid) ? 20 : 10,
    };
  });
}

const CARD_SPRING = { type: "spring", bounce: 0.15, stiffness: 170, damping: 22 };

// ─────────────────────────────────────────────────────────────────────────────
// DecoLines — identical SVG from ServicesSection
// ─────────────────────────────────────────────────────────────────────────────
function DecoLines({ isTiny }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        pointerEvents: "none",
        zIndex:        0,
        overflow:      "hidden",
        opacity:       isTiny ? 0.05 : 0.08,
      }}
    >
      <svg
        viewBox="0 0 420 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
        style={{
          position: "absolute",
          bottom:   0,
          right:    0,
          width:    isTiny ? "70%" : "55%",
          maxWidth: "420px",
        }}
      >
        <path
          d="M420 280 C360 260, 300 290, 260 270 C220 250, 200 230, 160 240 C120 250, 90 240, 40 260"
          stroke="#1B4835" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"
        />
        <path
          d="M420 300 C370 285, 320 310, 275 295 C230 280, 210 265, 170 275 C130 285, 100 270, 50 290"
          stroke="#1B4835" strokeWidth="0.5" strokeLinecap="round" opacity="0.22"
        />
        <path
          d="M380 310 C340 295, 295 316, 250 305 C205 294, 185 278, 145 290"
          stroke="#2D7356" strokeWidth="0.4" strokeLinecap="round" opacity="0.18"
        />
        <circle cx="180" cy="270" r="1.5" fill="#2D7356" opacity="0.28" />
        <circle cx="220" cy="258" r="1"   fill="#2D7356" opacity="0.22" />
        <circle cx="310" cy="280" r="1.2" fill="#1B4835" opacity="0.24" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialCard — mini card rendered inside the folder deck
// ─────────────────────────────────────────────────────────────────────────────
const TestimonialCard = memo(function TestimonialCard({ testimonial, scale }) {
  const fs       = Math.max(9,  Math.round(10.5 * scale));
  const authorFs = Math.max(8,  Math.round(9.5  * scale));
  const avatarSz = Math.round(20 * scale);
  const avatarFs = Math.max(7,  Math.round(8.5  * scale));
  const pad      = Math.round(14 * scale);
  const lineH    = Math.round(fs * 1.5);
  const lineW    = Math.round(28 * scale);
  const dotW     = Math.round(9  * scale);
  const ptTop    = Math.round(7  * scale);
  const gap      = Math.round(6  * scale);

  return (
    <div
      style={{
        width:       "100%",
        height:      "100%",
        borderRadius: "14px",
        display:     "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:  C.cardBg,
        border:      `1px solid ${C.borderSolid}`,
        padding:     pad,
        boxShadow:   C.cardShadow,
        userSelect:  "none",
        boxSizing:   "border-box",
      }}
    >
      {/* Top decorative rule — same proportion as ServicesSection eyebrow line */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            opacity:         0.35,
          }}
        >
          <div
            style={{
              width:        lineW,
              height:       3,
              background:   `linear-gradient(to right, ${C.accent}, transparent)`,
              borderRadius: 99,
            }}
          />
          <div
            style={{
              width:        dotW,
              height:       3,
              background:   C.borderSolid,
              borderRadius: 99,
            }}
          />
        </div>

        {/* Quote — italic Cormorant Garamond like ServicesSection subtitle */}
        <p
          style={{
            fontFamily:  FONT_DISPLAY,
            fontSize:    fs,
            lineHeight:  `${lineH}px`,
            color:       C.text,
            fontStyle:   "italic",
            fontWeight:  300,
            paddingTop:  Math.round(2 * scale),
            overflow:    "hidden",
            display:     "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            margin:      0,
          }}
        >
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author row */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap,
          borderTop:  `1px solid ${C.borderSolid}`,
          paddingTop: ptTop,
        }}
      >
        <div
          style={{
            width:          avatarSz,
            height:         avatarSz,
            borderRadius:   "50%",
            background:     C.forest,
            color:          "white",
            fontSize:       avatarFs,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontFamily:     FONT_BODY,
            fontWeight:     700,
            flexShrink:     0,
            letterSpacing:  "0.02em",
          }}
        >
          {testimonial.initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily:   FONT_BODY,
              fontSize:     authorFs,
              fontWeight:   600,
              color:        C.forest,
              lineHeight:   1.1,
              margin:       0,
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {testimonial.author}
          </p>
          <p
            style={{
              fontFamily:   FONT_BODY,
              fontSize:     Math.max(7, Math.round(authorFs * 0.85)),
              fontWeight:   400,
              color:        C.accentLight,
              opacity:      0.75,
              lineHeight:   1.2,
              margin:       "2px 0 0",
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "0.01em",
            }}
          >
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// FolderFace — animated folder flap with face
// ─────────────────────────────────────────────────────────────────────────────
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
  const eyeColor = `${C.accent}70`;

  return (
    <motion.div
      onClick={onToggle}
      animate={{ rotateX: isOpen ? -35 : 0 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      style={{
        position:    "absolute",
        left:        0,
        right:       0,
        bottom:      -1,
        zIndex:      30,
        transformOrigin: "bottom",
        display:     "flex",
        justifyContent: "center",
        alignItems:  "center",
        overflow:    "visible",
        cursor:      "pointer",
        height:      flapH,
        perspective: 1000,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <svg
          style={{ width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 235 121"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z"
            fill="#daeae2"
            stroke={C.borderSolid}
            strokeWidth="1.5"
          />
        </svg>

        <div
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            pointerEvents:  "none",
            userSelect:     "none",
            paddingTop:     Math.round(6 * scale),
          }}
        >
          <div
            style={{
              width:          faceW,
              height:         faceH,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >
            {/* Eyes */}
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

            {/* Mouth */}
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

// ─────────────────────────────────────────────────────────────────────────────
// FolderDeck — stacked cards inside the folder body
// ─────────────────────────────────────────────────────────────────────────────
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
      style={{
        position:      "relative",
        width:         "87.5%",
        height:        "100%",
        margin:        "0 auto",
        display:       "flex",
        justifyContent: "center",
        borderRadius:  "14px",
        overflow:      "visible",
        cursor:        "pointer",
        background:    "#daeae2",
        border:        `1.5px solid ${C.borderSolid}`,
        boxSizing:     "border-box",
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
            style={{
              position:     "absolute",
              top:          Math.round(8 * scale),
              width:        cardW,
              height:       cardH,
              zIndex:       v.zIndex,
              cursor:       isOpen ? "pointer" : "default",
              pointerEvents: isOpen ? "auto" : "none",
              boxShadow:    "0 8px 32px rgba(13,43,30,0.14)",
              borderRadius: "14px",
            }}
          >
            <TestimonialCard testimonial={testimonial} scale={scale} />
          </motion.div>
        );
      })}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialModal — full-screen overlay, same glass style as ServicesSection
// ─────────────────────────────────────────────────────────────────────────────
const TestimonialModal = memo(function TestimonialModal({ testimonial, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        50,
        display:       "flex",
        alignItems:    "center",
        justifyContent: "center",
        padding:       "clamp(1rem, 4vw, 2rem)",
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position:   "absolute",
          inset:      0,
          background: "rgba(13,43,30,0.48)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        aria-hidden="true"
      />

      {/* Dialog */}
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0  }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
        style={{
          position:      "relative",
          width:         "100%",
          maxWidth:      "clamp(280px, 90vw, 520px)",
          background:    "linear-gradient(160deg,#ffffff 0%,#f3f9f6 100%)",
          borderRadius:  "clamp(16px, 3vw, 24px)",
          padding:       "clamp(1.25rem, 4vw, 2.5rem)",
          boxShadow:     "0 24px 60px rgba(13,43,30,0.22), 0 4px 16px rgba(13,43,30,0.10)",
          border:        `1.5px solid ${C.borderSolid}`,
          zIndex:        10,
          display:       "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close testimonial"
          style={{
            position:       "absolute",
            top:            "clamp(12px, 2vw, 20px)",
            right:          "clamp(12px, 2vw, 20px)",
            width:          32,
            height:         32,
            borderRadius:   "50%",
            border:         `1px solid ${C.borderSolid}`,
            background:     "transparent",
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          C.textMuted,
            transition:     "background 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.bg;
            e.currentTarget.style.color      = C.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color      = C.textMuted;
          }}
        >
          <X size={15} />
        </button>

        {/* Decorative accent rule — identical to ServicesSection rule */}
        <div
          style={{
            width:    40,
            height:   1,
            background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
            opacity:  0.45,
            marginBottom: "clamp(1rem, 3vw, 1.5rem)",
          }}
        />

        {/* Quote — Cormorant Garamond italic, same as ServicesSection subtitle */}
        <p
          style={{
            fontFamily:  FONT_DISPLAY,
            fontSize:    "clamp(1rem, 2.5vw, 1.25rem)",
            fontWeight:  300,
            fontStyle:   "italic",
            color:       C.forest,
            lineHeight:  1.75,
            marginBottom: "clamp(1.25rem, 3vw, 2rem)",
            margin:      0,
          }}
        >
          "{testimonial.quote}"
        </p>

        {/* Rule separator */}
        <div
          style={{
            width:     "100%",
            height:    1,
            background: `linear-gradient(to right, ${C.borderSolid}, transparent)`,
            margin:    "clamp(1rem, 2.5vw, 1.5rem) 0",
          }}
        />

        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 16px)" }}>
          <div
            style={{
              width:          "clamp(36px, 8vw, 48px)",
              height:         "clamp(36px, 8vw, 48px)",
              borderRadius:   "50%",
              background:     C.forest,
              color:          "white",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     FONT_BODY,
              fontWeight:     700,
              fontSize:       "clamp(11px, 2vw, 14px)",
              flexShrink:     0,
              letterSpacing:  "0.02em",
            }}
          >
            {testimonial.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                fontFamily:   FONT_BODY,
                fontSize:     "clamp(0.82rem, 2vw, 1rem)",
                fontWeight:   600,
                color:        C.forest,
                margin:       0,
                lineHeight:   1.2,
              }}
            >
              {testimonial.author}
            </h4>
            <p
              style={{
                fontFamily:   FONT_BODY,
                fontSize:     "clamp(0.65rem, 1.5vw, 0.78rem)",
                fontWeight:   400,
                color:        C.accentLight,
                opacity:      0.75,
                margin:       "3px 0 0",
                letterSpacing: "0.02em",
                lineHeight:   1.3,
              }}
            >
              {testimonial.role}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// InfiniteColumn — scrolling marquee column for desktop left panel
// ─────────────────────────────────────────────────────────────────────────────
const InfiniteColumn = memo(function InfiniteColumn({ testimonials, duration, shift }) {
  return (
    <div
      style={{
        overflow:   "hidden",
        maxHeight:  "520px",
        position:   "relative",
        borderRadius: "20px",
        maskImage:  "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        width:      "100%",
      }}
    >
      <motion.div
        animate={{ translateY: shift ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 20px)", paddingBottom: "clamp(12px, 2vw, 20px)" }}
      >
        {[...Array(2)].map((_, dupIdx) => (
          <React.Fragment key={dupIdx}>
            {testimonials.map((t, i) => (
              <div
                key={`${dupIdx}-${i}`}
                style={{
                  padding:      "clamp(14px, 2.5vw, 22px)",
                  borderRadius: "16px",
                  border:       `1px solid ${C.borderSolid}`,
                  background:   "rgba(255,255,255,0.62)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow:    "0 2px 14px rgba(13,43,30,0.07)",
                  width:        "100%",
                  boxSizing:    "border-box",
                  userSelect:   "none",
                }}
              >
                {/* Accent rule */}
                <div
                  style={{
                    width:        28,
                    height:       2,
                    background:   `linear-gradient(to right, ${C.accent}, transparent)`,
                    borderRadius: 99,
                    marginBottom: "clamp(8px, 1.5vw, 12px)",
                    opacity:      0.45,
                  }}
                />
                {/* Quote */}
                <p
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize:   "clamp(0.78rem, 1.2vw, 0.92rem)",
                    fontWeight: 300,
                    fontStyle:  "italic",
                    color:      C.text,
                    lineHeight: 1.65,
                    margin:     0,
                    marginBottom: "clamp(10px, 1.5vw, 14px)",
                  }}
                >
                  "{t.quote}"
                </p>
                {/* Author */}
                <div
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "clamp(7px, 1.2vw, 10px)",
                    borderTop:  `1px solid ${C.borderSolid}`,
                    paddingTop: "clamp(8px, 1.2vw, 11px)",
                  }}
                >
                  <div
                    style={{
                      width:          "clamp(26px, 3.5vw, 30px)",
                      height:         "clamp(26px, 3.5vw, 30px)",
                      borderRadius:   "50%",
                      background:     C.forest,
                      color:          "white",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      fontFamily:     FONT_BODY,
                      fontWeight:     700,
                      fontSize:       "clamp(7px, 1.1vw, 9px)",
                      flexShrink:     0,
                      letterSpacing:  "0.02em",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily:   FONT_BODY,
                        fontSize:     "clamp(0.65rem, 1vw, 0.76rem)",
                        fontWeight:   600,
                        color:        C.forest,
                        margin:       0,
                        lineHeight:   1.1,
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace:   "nowrap",
                      }}
                    >
                      {t.author}
                    </p>
                    <p
                      style={{
                        fontFamily:   FONT_BODY,
                        fontSize:     "clamp(0.58rem, 0.88vw, 0.68rem)",
                        fontWeight:   400,
                        color:        C.accentLight,
                        opacity:      0.70,
                        margin:       "2px 0 0",
                        letterSpacing: "0.01em",
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace:   "nowrap",
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const headerRef      = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-40px" });

  const [isOpen,              setIsOpen]              = useState(false);
  const [isFolderHovered,     setIsFolderHovered]     = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const windowWidth = useWindowWidth();
  const bp          = getBreakpoint(windowWidth);
  const isTiny      = bp === "xxs" || bp === "xs";
  const isMobile    = bp === "sm"  || bp === "md";
  const isDesktop   = bp === "lg" || bp === "xl" || bp === "2xl";

  const cfg   = getCardConfig(bp);
  const scale = cfg.scale;

  const cardW = Math.round(144 * scale);
  const cardH = Math.round(176 * scale);
  const cardVariants = useMemo(
    () => buildCardVariants(TESTIMONIALS.length, 38 * scale, 68 * scale, 82 * scale),
    [scale],
  );

  const toggleOpen   = useCallback(() => setIsOpen((v) => !v), []);
  const closeModal   = useCallback(() => setSelectedTestimonial(null), []);

  const folderMarginBottom = isOpen
    ? Math.round(64 * scale)
    : Math.round(16 * scale);

  // Column subsets for desktop marquee
  const col1 = useMemo(() => TESTIMONIALS.slice(0, 3), []);
  const col2 = useMemo(() => [...TESTIMONIALS.slice(2), TESTIMONIALS[0]], []);
  const col3 = useMemo(() => [TESTIMONIALS[4], ...TESTIMONIALS.slice(0, 2)], []);

  // ── Responsive type values (same logic as ServicesSection) ───────────────
  const sectionPadH  = isTiny ? "1rem" : isMobile ? "1.25rem" : "clamp(1.5rem, 6vw, 6rem)";
  const headerPadT   = isTiny ? "2.5rem" : isMobile ? "3rem" : "4rem";
  const headerPadB   = isTiny ? "1.25rem" : isMobile ? "1.5rem" : "1.75rem";
  const headerGap    = isTiny ? "0.45rem" : isMobile ? "0.55rem" : "0.7rem";
  const eyebrowSize  = isTiny ? "0.55rem" : isMobile ? "0.60rem" : "clamp(0.60rem,0.90vw,0.72rem)";
  const eyebrowLineW = isTiny ? "10px" : isMobile ? "14px" : "18px";
  const titleSize    = isTiny
    ? "clamp(1.45rem, 8vw, 1.85rem)"
    : isMobile
    ? "clamp(1.75rem, 6.5vw, 2.4rem)"
    : "clamp(2rem, 4.5vw, 3.8rem)";
  const subtitleSize = isTiny ? "0.72rem" : isMobile ? "0.80rem" : "clamp(0.82rem,1.2vw,0.96rem)";
  const ruleW        = isTiny ? "28px" : "40px";

  // Footer
  const footerFS   = isTiny ? "0.50rem" : isMobile ? "0.54rem" : "0.58rem";
  const footerPadT = isTiny ? "0.75rem" : "1.1rem";
  const footerPadB = isTiny ? "2rem" : "3rem";

  // Instruction text under folder
  const instructionSize = isTiny ? "0.72rem" : isMobile ? "0.80rem" : "clamp(0.82rem,1.2vw,0.92rem)";

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      style={{
        position:        "relative",
        width:           "100%",
        overflow:        "hidden",
        backgroundColor: C.bg,
        backgroundImage: C.bgGrad,
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "flex-start",
        boxSizing:       "border-box",
      }}
    >
      {/* ── Decorative Lines (identical to ServicesSection) ─────────────── */}
      <DecoLines isTiny={isTiny} />

      {/* ── Section Header ──────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        style={{
          width:         "100%",
          padding:       `${headerPadT} ${sectionPadH} ${headerPadB}`,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          textAlign:     "center",
          gap:           headerGap,
          position:      "relative",
          zIndex:        1,
          boxSizing:     "border-box",
        }}
      >
        {/* Eyebrow — identical structure to ServicesSection */}
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           isTiny ? "0.40rem" : "0.55rem",
            fontFamily:    FONT_BODY,
            fontSize:      eyebrowSize,
            fontWeight:    400,
            letterSpacing: isTiny ? "0.22em" : "0.28em",
            textTransform: "uppercase",
            color:         C.accent,
            opacity:       0.85,
          }}
        >
          <span
            style={{
              display:    "block",
              width:      eyebrowLineW,
              height:     "1px",
              background: C.accent,
              opacity:    0.45,
              flexShrink: 0,
            }}
          />
          {isTiny ? "Client Stories" : "Design Synthesis · Client Stories"}
          <span
            style={{
              display:    "block",
              width:      eyebrowLineW,
              height:     "1px",
              background: C.accent,
              opacity:    0.45,
              flexShrink: 0,
            }}
          />
        </motion.span>

        {/* Title — Cormorant Garamond, identical weight/style to ServicesSection */}
        <motion.h2
          id="testimonials-heading"
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily:    FONT_DISPLAY,
            fontSize:      titleSize,
            fontWeight:    300,
            lineHeight:    1.08,
            color:         C.forest,
            margin:        0,
            letterSpacing: "0.01em",
          }}
        >
          Words of{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentLight }}>
            Praise
          </em>{" "}
          &amp; Trust
        </motion.h2>

        {/* Rule — identical to ServicesSection */}
        <motion.div
          variants={ruleVariant}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{
            width:           ruleW,
            height:          "1px",
            background:      `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
            opacity:         0.45,
            margin:          isTiny ? "0.02rem 0" : "0.05rem 0",
            transformOrigin: "center",
          }}
        />

        {/* Subtitle — Cormorant Garamond italic, identical to ServicesSection */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.22 }}
          style={{
            fontFamily:  FONT_DISPLAY,
            fontSize:    subtitleSize,
            fontWeight:  300,
            fontStyle:   "italic",
            color:       "rgba(13,43,30,0.60)",
            lineHeight:  isTiny ? 1.7 : 1.85,
            maxWidth:    isTiny ? "280px" : "440px",
            margin:      0,
          }}
        >
          {isTiny
            ? "Real words from the clients who trusted us."
            : "Real words from the teams and clients who trusted us to shape their spaces and stories."}
        </motion.p>
      </header>

      {/* ── Content Grid ──────────────────────────────────────────────────── */}
      <div
        style={{
          position:      "relative",
          zIndex:        1,
          width:         "100%",
          padding:       `0 ${sectionPadH}`,
          boxSizing:     "border-box",
          display:       "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap:           isDesktop ? "clamp(2rem, 4vw, 5rem)" : "2.5rem",
          alignItems:    "center",
        }}
      >
        {/* ── Left: Infinite marquee columns (desktop only) ─────────────── */}
        {isDesktop && (
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: bp === "2xl" ? "1fr 1fr 1fr" : "1fr 1fr",
              gap:                 "clamp(12px, 2vw, 20px)",
              position:            "relative",
              zIndex:              2,
              width:               "100%",
            }}
          >
            <InfiniteColumn testimonials={col1} duration={35} shift={false} />
            <InfiniteColumn testimonials={col2} duration={28} shift={true}  />
            {bp === "2xl" && (
              <InfiniteColumn testimonials={col3} duration={42} shift={false} />
            )}
          </div>
        )}

        {/* ── Right (or full-width mobile): Folder interaction ──────────── */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          {/* Folder */}
          <div
            onMouseEnter={() => setIsFolderHovered(true)}
            onMouseLeave={() => setIsFolderHovered(false)}
            style={{
              position:    "relative",
              userSelect:  "none",
              transition:  "margin 0.4s ease",
              zIndex:      10,
              width:       cfg.folderW,
              height:      cfg.folderH,
              marginBottom: folderMarginBottom,
            }}
          >
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
            <FolderFace
              scale={scale}
              isFolderHovered={isFolderHovered}
              isOpen={isOpen}
              onToggle={toggleOpen}
            />
          </div>

          {/* Count badge — DM Sans, same pill style as ServicesSection footer */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
            <span
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "6px",
                fontFamily:    FONT_BODY,
                fontSize:      isTiny ? "0.58rem" : "0.65rem",
                fontWeight:    400,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color:         C.accent,
                padding:       "4px 12px",
                borderRadius:  "999px",
                border:        `1px solid ${C.borderSolid}`,
                background:    "rgba(255,255,255,0.80)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   C.accent,
                  display:      "block",
                  flexShrink:   0,
                }}
              />
              {TESTIMONIALS.length} letters inside
            </span>
          </div>

          {/* Instruction — animated, Cormorant Garamond italic */}
          <AnimatePresence mode="wait">
            <motion.p
              key={String(isOpen)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily:  FONT_DISPLAY,
                fontSize:    instructionSize,
                fontWeight:  300,
                fontStyle:   "italic",
                color:       "rgba(13,43,30,0.58)",
                textAlign:   "center",
                margin:      0,
                letterSpacing: "0.01em",
              }}
            >
              {isOpen
                ? "Tap a card to read the full testimonial"
                : "Click the folder to reveal the letters"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Section Footer (identical structure to ServicesSection) ─────── */}
      <footer
        aria-hidden="true"
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        isTiny ? "0.65rem" : "1.1rem",
          padding:    `${footerPadT} ${sectionPadH} ${footerPadB}`,
          width:      "100%",
          position:   "relative",
          zIndex:     1,
          boxSizing:  "border-box",
          marginTop:  "1rem",
        }}
      >
        <div
          style={{
            flex:       1,
            height:     "1px",
            background: `linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)`,
          }}
        />
        <span
          style={{
            fontFamily:    FONT_BODY,
            fontSize:      footerFS,
            fontWeight:    400,
            letterSpacing: isTiny ? "0.16em" : "0.22em",
            textTransform: "uppercase",
            color:         "rgba(13,43,30,0.40)",
            whiteSpace:    "nowrap",
          }}
        >
          {isTiny ? "Client reviews" : "V Testimonials · Architecture & Design"}
        </span>
        <div
          style={{
            flex:       1,
            height:     "1px",
            background: `linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)`,
          }}
        />
      </footer>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
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