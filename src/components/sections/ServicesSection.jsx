import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ServicesSection — Fully responsive rewrite
// Fluid scaling: 320px → 2560px
// Typography: Cormorant Garamond (display) + DM Sans (UI)
// Palette: pale sage bg, forest green accents, glassmorphism surfaces
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.65, ease } },
};

const ruleVariant = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.80, delay: 0.16, ease },
  },
};

/* =========================
   BREAKPOINT HELPERS
========================= */
function getBreakpoint(w) {
  if (w < 360)  return "xxs";   // very small phones (e.g. 320–359px)
  if (w < 480)  return "xs";    // small phones
  if (w < 640)  return "sm";    // large phones / small landscape
  if (w < 768)  return "md";    // landscape phones / small tablets
  if (w < 1024) return "lg";    // tablets
  if (w < 1280) return "xl";    // small desktops
  return "2xl";                  // large desktops
}

// Returns a config object based on current breakpoint
function getConfig(w) {
  const bp = getBreakpoint(w);

  const map = {
    //                  cardW  cardH  radius  perspective  carouselH
    xxs: { cardW: 130, cardH: 200, radiusExtra: 30, persp: "900px",  carouselH: 260 },
    xs:  { cardW: 150, cardH: 230, radiusExtra: 35, persp: "1000px", carouselH: 300 },
    sm:  { cardW: 175, cardH: 270, radiusExtra: 45, persp: "1200px", carouselH: 345 },
    md:  { cardW: 195, cardH: 300, radiusExtra: 60, persp: "1400px", carouselH: 385 },
    lg:  { cardW: 220, cardH: 340, radiusExtra: 80, persp: "1600px", carouselH: 445 },
    xl:  { cardW: 250, cardH: 390, radiusExtra: 100, persp: "1800px", carouselH: 510 },
    "2xl": { cardW: 275, cardH: 430, radiusExtra: 120, persp: "2000px", carouselH: 560 },
  };

  return map[bp] || map["xl"];
}

/* =========================
   DATA
========================= */
const sectors = [
  { id: "res", imageSrc: "/resident.webp",      alt: "Residential"            },
  { id: "com", imageSrc: "/commercial.webp",    alt: "Commercial & Corporate"  },
  { id: "hea", imageSrc: "/healthcare.webp",    alt: "Healthcare"              },
  { id: "ins", imageSrc: "/institutional.webp", alt: "Institutional"           },
  { id: "hos", imageSrc: "/hospitality.webp",   alt: "Hospitality & Leisure"   },
  { id: "int", imageSrc: "/interior.webp",      alt: "Interior Design"         },
  { id: "lan", imageSrc: "/landscape.webp",     alt: "Landscape"               },
  { id: "spo", imageSrc: "/sports.webp",        alt: "Sports & Recreation"     },
];

/* =========================
   SERVICE CARD
========================= */
const ServiceCard = memo(function ServiceCard({
  sector,
  index,
  totalCards,
  rotation,
  cardWidth,
  cardHeight,
  radius,
  isTiny,   // xxs / xs
  isMobile, // sm / md
}) {
  const baseAngle = index * (360 / totalCards);
  const cur       = ((baseAngle + rotation) % 360 + 360) % 360;
  const rad       = (cur - 180) * (Math.PI / 180);
  const facing    = (Math.cos(rad) + 1) / 2;
  const dimAlpha  = Math.pow(1 - facing, 2) * 0.18;
  const isFront   = facing > (isTiny ? 0.38 : isMobile ? 0.36 : 0.44);
  const zIndex    = Math.round(facing * 100);

  // Responsive label sizes
  const labelSize  = isTiny ? "7px"    : isMobile ? "8px"    : "9px";
  const titleSize  = isTiny ? "0.82rem" : isMobile ? "0.95rem" : "1.22rem";
  const padBottom  = isTiny ? "12px"   : isMobile ? "16px"   : "22px";
  const padTop     = isTiny ? "36px"   : isMobile ? "48px"   : "64px";
  const padH       = isTiny ? "10px"   : isMobile ? "14px"   : "22px";

  return (
    <div
      style={{
        position         : "absolute",
        width            : `${cardWidth}px`,
        height           : `${cardHeight}px`,
        transform        : `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
        transformStyle   : "preserve-3d",
        pointerEvents    : isFront ? "auto" : "none",
        zIndex,
        backfaceVisibility: "hidden",
        willChange       : "transform",
      }}
    >
      {/* IMAGE */}
      <img
        src={sector.imageSrc}
        alt={sector.alt}
        draggable="false"
        loading="lazy"
        decoding="async"
        style={{
          position    : "absolute",
          inset       : 0,
          width       : "100%",
          height      : "100%",
          objectFit   : "cover",
          display     : "block",
          borderRadius: isTiny ? "10px" : "14px",
          pointerEvents: "none",
          boxShadow   : isFront
            ? "0 14px 40px rgba(13,43,30,0.22), 0 3px 12px rgba(13,43,30,0.12)"
            : "0 4px 14px rgba(13,43,30,0.07)",
          filter      : isFront
            ? "brightness(1.06) contrast(1.02)"
            : "brightness(0.86)",
          transform   : isFront ? "scale(1.02)" : "scale(1)",
          transition  : "transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.45s ease, box-shadow 0.45s ease",
          willChange  : "transform, filter",
        }}
        onMouseEnter={(e) => { if (isFront) e.currentTarget.style.transform = "scale(1.055)"; }}
        onMouseLeave={(e) => { if (isFront) e.currentTarget.style.transform = "scale(1.02)"; }}
      />

      {/* DIM OVERLAY */}
      <div
        style={{
          position     : "absolute",
          inset        : 0,
          borderRadius : isTiny ? "10px" : "14px",
          pointerEvents: "none",
          background   : `rgba(13,43,30,${dimAlpha})`,
          transition   : "background 0.35s ease",
        }}
      />

      {/* TITLE GRADIENT + LABEL */}
      <div
        style={{
          position     : "absolute",
          left         : 0,
          right        : 0,
          bottom       : 0,
          borderRadius : isTiny ? "0 0 10px 10px" : "0 0 14px 14px",
          pointerEvents: "none",
          padding      : `${padTop} ${padH} ${padBottom}`,
          background   : "linear-gradient(to top, rgba(13,43,30,0.78) 0%, rgba(13,43,30,0.22) 55%, transparent 100%)",
          opacity      : isFront ? 1 : 0,
          transform    : isFront ? "translateY(0)" : "translateY(10px)",
          transition   : "opacity 0.40s ease, transform 0.40s ease",
        }}
      >
        <span
          style={{
            display      : "block",
            fontFamily   : "'DM Sans', system-ui, sans-serif",
            fontSize     : labelSize,
            fontWeight   : 400,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color        : "rgba(180,220,195,0.80)",
            marginBottom : isTiny ? "3px" : "5px",
          }}
        >
          Specialisation
        </span>
        <span
          style={{
            display      : "block",
            fontFamily   : "'Cormorant Garamond', Georgia, serif",
            fontSize     : titleSize,
            fontWeight   : 400,
            letterSpacing: "0.02em",
            color        : "rgba(255,255,255,0.96)",
            lineHeight   : 1.2,
          }}
        >
          {sector.alt}
        </span>
      </div>

      {/* GLASS BORDER on front card */}
      {isFront && (
        <div
          style={{
            position     : "absolute",
            inset        : 0,
            borderRadius : isTiny ? "10px" : "14px",
            border       : "1px solid rgba(255,255,255,0.16)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
});

/* =========================
   DECORATIVE LINES
========================= */
function DecoLines({ isTiny }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position     : "absolute",
        inset        : 0,
        pointerEvents: "none",
        zIndex       : 0,
        overflow     : "hidden",
        opacity      : isTiny ? 0.05 : 0.08,
      }}
    >
      <svg
        viewBox="0 0 420 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
        style={{
          position : "absolute",
          bottom   : 0,
          right    : 0,
          width    : isTiny ? "70%" : "55%",
          maxWidth : "420px",
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

/* =========================
   DRAG HINT INDICATOR
========================= */
function DragHint({ isTiny }) {
  return (
    <div
      style={{
        display    : "flex",
        alignItems : "center",
        gap        : isTiny ? "5px" : "7px",
        marginTop  : isTiny ? "8px" : "10px",
        opacity    : 0.45,
      }}
    >
      {/* Left arrow */}
      <svg width={isTiny ? "10" : "13"} height={isTiny ? "8" : "10"} viewBox="0 0 13 10" fill="none">
        <path d="M6 1 L1 5 L6 9M1 5H12" stroke="#2D7356" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        style={{
          fontFamily   : "'DM Sans', system-ui, sans-serif",
          fontSize     : isTiny ? "0.55rem" : "0.62rem",
          fontWeight   : 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color        : "rgba(13,43,30,0.55)",
        }}
      >
        drag to explore
      </span>
      {/* Right arrow */}
      <svg width={isTiny ? "10" : "13"} height={isTiny ? "8" : "10"} viewBox="0 0 13 10" fill="none">
        <path d="M7 1 L12 5 L7 9M12 5H1" stroke="#2D7356" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function ServicesSection() {
  const headerRef      = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-40px" });

  const [rotation,    setRotation   ] = useState(0);
  const [isDragging,  setIsDragging ] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const startX               = useRef(0);
  const currentRotationStart = useRef(0);
  const velocity             = useRef(0);
  const lastX                = useRef(0);
  const lastTime             = useRef(0);
  const animationFrameId     = useRef(null);
  const rotationRef          = useRef(0);
  const isDraggingRef        = useRef(false);

  useEffect(() => { rotationRef.current   = rotation;  }, [rotation]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Derived config from window width ────────────────────────────────────
  const bp       = getBreakpoint(windowWidth);
  const isTiny   = bp === "xxs" || bp === "xs";
  const isMobile = bp === "sm"  || bp === "md";
  const cfg      = getConfig(windowWidth);

  const totalCards = sectors.length;
  const radius =
    Math.round((cfg.cardW / 2) / Math.tan(Math.PI / totalCards)) +
    cfg.radiusExtra;

  // ── Sensitivity scales with card width (smaller screens = more sensitive) ──
  const dragSensitivity = isTiny ? 0.52 : isMobile ? 0.44 : 0.30;

  /* Auto-rotation + momentum */
  useEffect(() => {
    const loop = () => {
      if (!isDraggingRef.current) {
        let speed = 0.045;
        if (Math.abs(velocity.current) > 0.01) {
          speed += velocity.current;
          velocity.current *= 0.93;
        } else {
          velocity.current = 0;
        }
        setRotation((prev) => prev + speed);
      }
      animationFrameId.current = requestAnimationFrame(loop);
    };
    animationFrameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  const getClientX = (e) =>
    e.touches ? e.touches[0].clientX : e.clientX;

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const cx = getClientX(e);
    startX.current               = cx;
    lastX.current                = cx;
    lastTime.current             = performance.now();
    currentRotationStart.current = rotationRef.current;
    velocity.current             = 0;
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!isDraggingRef.current) return;
      const cx  = getClientX(e);
      const now = performance.now();
      const dt  = now - lastTime.current;
      if (dt > 0) velocity.current = ((cx - lastX.current) / dt) * 2;
      lastX.current    = cx;
      lastTime.current = now;
      setRotation(
        currentRotationStart.current + (cx - startX.current) * dragSensitivity
      );
    },
    [dragSensitivity]
  );

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  /* Front card index */
  const frontIndex = (() => {
    let maxF = -Infinity, idx = 0;
    for (let i = 0; i < totalCards; i++) {
      const base = i * (360 / totalCards);
      const cur  = ((base + rotation) % 360 + 360) % 360;
      const rad  = (cur - 180) * (Math.PI / 180);
      const f    = (Math.cos(rad) + 1) / 2;
      if (f > maxF) { maxF = f; idx = i; }
    }
    return idx;
  })();

  // ── Typography fluid values ──────────────────────────────────────────────
  const fontDisplay = "'Cormorant Garamond', Georgia, serif";
  const fontBody    = "'DM Sans', system-ui, sans-serif";

  // Eyebrow
  const eyebrowSize = isTiny ? "0.55rem" : isMobile ? "0.60rem" : "clamp(0.60rem, 0.90vw, 0.72rem)";
  const eyebrowLineW = isTiny ? "10px" : isMobile ? "14px" : "18px";

  // Title
  const titleSize = isTiny
    ? "clamp(1.45rem, 8vw, 1.85rem)"
    : isMobile
    ? "clamp(1.75rem, 6.5vw, 2.4rem)"
    : "clamp(2rem, 4.5vw, 3.8rem)";

  // Subtitle
  const subtitleSize = isTiny ? "0.72rem" : isMobile ? "0.80rem" : "clamp(0.82rem, 1.2vw, 0.96rem)";

  // Padding
  const sectionPadH = isTiny ? "1rem" : isMobile ? "1.25rem" : "clamp(1.5rem, 6vw, 6rem)";
  const headerPadT  = isTiny ? "2.5rem" : isMobile ? "3rem" : "4rem";
  const headerPadB  = isTiny ? "1.25rem" : isMobile ? "1.5rem" : "1.75rem";
  const headerGap   = isTiny ? "0.45rem" : isMobile ? "0.55rem" : "0.7rem";

  // Rule
  const ruleW = isTiny ? "28px" : "40px";

  // Indicator dot
  const dotH        = isTiny ? "2.5px" : "3px";
  const dotActiveW  = isTiny ? "16px" : isMobile ? "22px" : "32px";
  const dotInactiveW = isTiny ? "5px" : "7px";
  const dotGap      = isTiny ? "4px" : "6px";

  // Footer
  const footerFS    = isTiny ? "0.50rem" : isMobile ? "0.54rem" : "0.58rem";
  const footerPadT  = isTiny ? "0.75rem" : "1.1rem";
  const footerPadB  = isTiny ? "2rem" : "3rem";

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      style={{
        position       : "relative",
        width          : "100%",
        overflow       : "hidden",
        backgroundColor: "#EEF1EE",
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 38%, transparent 72%),
          radial-gradient(ellipse 55% 75% at 100% 45%, rgba(45,115,86,0.045) 0%, transparent 65%),
          radial-gradient(ellipse 45% 55% at 0% 100%, rgba(13,43,30,0.035) 0%, transparent 60%),
          linear-gradient(180deg, #F4F6F4 0%, #EEF1EE 38%, #E8ECE8 72%, #E3E8E4 100%)
        `,
        display        : "flex",
        flexDirection  : "column",
        alignItems     : "flex-start",
        boxSizing      : "border-box",
      }}
    >
      <DecoLines isTiny={isTiny} />

      {/* ── Section Header ──────────────────────────────────────────── */}
      <header
        ref={headerRef}
        style={{
          width        : "100%",
          padding      : `${headerPadT} ${sectionPadH} ${headerPadB}`,
          display      : "flex",
          flexDirection: "column",
          alignItems   : "center",
          textAlign    : "center",
          gap          : headerGap,
          position     : "relative",
          zIndex       : 1,
          boxSizing    : "border-box",
        }}
      >
        {/* Eyebrow */}
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{
            display      : "inline-flex",
            alignItems   : "center",
            gap          : isTiny ? "0.40rem" : "0.55rem",
            fontFamily   : fontBody,
            fontSize     : eyebrowSize,
            fontWeight   : 400,
            letterSpacing: isTiny ? "0.22em" : "0.28em",
            textTransform: "uppercase",
            color        : "#2D7356",
            opacity      : 0.85,
          }}
        >
          <span
            style={{
              display   : "block",
              width     : eyebrowLineW,
              height    : "1px",
              background: "#2D7356",
              opacity   : 0.45,
              flexShrink: 0,
            }}
          />
          {isTiny ? "Specialisations" : "Design Synthesis · Specialisations"}
          <span
            style={{
              display   : "block",
              width     : eyebrowLineW,
              height    : "1px",
              background: "#2D7356",
              opacity   : 0.45,
              flexShrink: 0,
            }}
          />
        </motion.span>

        {/* Title */}
        <motion.h2
          id="services-heading"
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily   : fontDisplay,
            fontSize     : titleSize,
            fontWeight   : 300,
            lineHeight   : 1.08,
            color        : "#0D2B1E",
            margin       : 0,
            letterSpacing: "0.01em",
          }}
        >
          Conceived,{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: "#235E44" }}>
            Achieved
          </em>{" "}
          &amp; Delivered
        </motion.h2>

        {/* Rule */}
        <motion.div
          variants={ruleVariant}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{
            width          : ruleW,
            height         : "1px",
            background     : "linear-gradient(to right, transparent, #2D7356, transparent)",
            opacity        : 0.45,
            margin         : isTiny ? "0.02rem 0" : "0.05rem 0",
            transformOrigin: "center",
          }}
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.22 }}
          style={{
            fontFamily : fontDisplay,
            fontSize   : subtitleSize,
            fontWeight : 300,
            fontStyle  : "italic",
            color      : "rgba(13,43,30,0.60)",
            lineHeight : isTiny ? 1.7 : 1.85,
            maxWidth   : isTiny ? "280px" : "440px",
            margin     : 0,
          }}
        >
          {isTiny
            ? "Architecture, interiors & landscapes — designed collaboratively."
            : "We work collaboratively with clients, communities, and end-users to design architecture, interior space solutions, and landscapes."}
        </motion.p>
      </header>

      {/* ── Carousel ────────────────────────────────────────────────── */}
      <div
        style={{
          position      : "relative",
          zIndex        : 1,
          width         : "100%",
          display       : "flex",
          flexDirection : "column",
          alignItems    : "center",
          padding       : `0 0 0`,
          boxSizing     : "border-box",
        }}
      >
        {/* 3-D stage */}
        <div
          style={{
            position      : "relative",
            width         : "100%",
            display       : "flex",
            alignItems    : "center",
            justifyContent: "center",
            height        : `${cfg.carouselH}px`,
            perspective   : cfg.persp,
            cursor        : isDragging ? "grabbing" : "grab",
            touchAction   : "none",
            userSelect    : "none",
            WebkitUserSelect: "none",
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div
            style={{
              position      : "relative",
              width         : "100%",
              height        : "100%",
              display       : "flex",
              alignItems    : "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
              transform     : `rotateY(${rotation}deg)`,
            }}
          >
            {sectors.map((sector, index) => (
              <ServiceCard
                key={sector.id}
                sector={sector}
                index={index}
                totalCards={totalCards}
                rotation={rotation}
                cardWidth={cfg.cardW}
                cardHeight={cfg.cardH}
                radius={radius}
                isTiny={isTiny}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Indicator + drag hint */}
        <div
          style={{
            display      : "flex",
            flexDirection: "column",
            alignItems   : "center",
            gap          : isTiny ? "0.45rem" : "0.55rem",
            marginTop    : isTiny ? "1rem" : "1.5rem",
          }}
        >
          {/* Pill dots */}
          <div style={{ display: "flex", gap: dotGap, alignItems: "center" }}>
            {sectors.map((sector, index) => (
              <div
                key={sector.id}
                style={{
                  height         : dotH,
                  borderRadius   : "999px",
                  transition     : "all 0.45s ease",
                  width          : index === frontIndex ? dotActiveW : dotInactiveW,
                  backgroundColor: index === frontIndex
                    ? "#2D7356"
                    : "rgba(45,115,86,0.20)",
                }}
              />
            ))}
          </div>

          {/* Drag hint label (small screens especially) */}
          <DragHint isTiny={isTiny} />
        </div>
      </div>

      {/* ── Section Footer ──────────────────────────────────────────── */}
      <footer
        aria-hidden="true"
        style={{
          display    : "flex",
          alignItems : "center",
          gap        : isTiny ? "0.65rem" : "1.1rem",
          padding    : `${footerPadT} ${sectionPadH} ${footerPadB}`,
          width      : "100%",
          position   : "relative",
          zIndex     : 1,
          boxSizing  : "border-box",
        }}
      >
        <div
          style={{
            flex      : 1,
            height    : "1px",
            background: "linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
          }}
        />
        <span
          style={{
            fontFamily   : fontBody,
            fontSize     : footerFS,
            fontWeight   : 400,
            letterSpacing: isTiny ? "0.16em" : "0.22em",
            textTransform: "uppercase",
            color        : "rgba(13,43,30,0.40)",
            whiteSpace   : "nowrap",
          }}
        >
          {isTiny ? "VIII · Services" : "VIII Specialisations · Architecture & Design"}
        </span>
        <div
          style={{
            flex      : 1,
            height    : "1px",
            background: "linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
          }}
        />
      </footer>
    </section>
  );
}