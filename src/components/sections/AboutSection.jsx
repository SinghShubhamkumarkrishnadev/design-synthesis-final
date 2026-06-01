// components/sections/AboutSection.jsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TeamCarousel from "../team/TeamCarousel";

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:       "#EEF1EE",
  deep:     "#0D2B1E",
  forest:   "#2D7356",
  muted:    "rgba(13,43,30,0.52)",
};
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";
const EASE  = [0.25, 0.1, 0.25, 1];

// ─── Motion Presets ─────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.70, ease: EASE } },
};

// ─── Decorative Graphic Lines ───────────────────────────────────────────────────
function DecoLines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", zIndex: 0, overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 420 320" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
        style={{
          position: "absolute", bottom: 0, right: 0,
          width: "45%", maxWidth: 380, opacity: 0.06,
        }}
      >
        <path
          d="M420 280 C360 260,300 290,260 270 C220 250,200 230,160 240 C120 250,90 240,40 260"
          stroke="#1B4835" strokeWidth=".8" strokeLinecap="round"
        />
        <path
          d="M420 300 C370 285,320 310,275 295 C230 280,210 265,170 275 C130 285,100 270,50 290"
          stroke="#1B4835" strokeWidth=".5" strokeLinecap="round"
        />
        <circle cx="180" cy="270" r="1.5" fill="#2D7356" />
        <circle cx="310" cy="280" r="1.2" fill="#1B4835" />
      </svg>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function AboutSection() {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const footerInView = useInView(footerRef, { once: true });

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: C.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.50) 40%, transparent 72%),
          radial-gradient(ellipse 55% 75% at 100% 45%, rgba(45,115,86,0.04) 0%, transparent 65%),
          linear-gradient(180deg, #F4F6F4 0%, #EEF1EE 38%, #E8ECE8 72%, #E3E8E4 100%)
        `,
      }}
    >
      <DecoLines />

      {/* ── Editorial Header ── */}
      <header
        ref={headerRef}
        style={{
          textAlign: "center",
          padding: "clamp(4rem, 8vw, 6.5rem) 1.5rem 0",
          maxWidth: "1440px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        {/* Eyebrow Tag */}
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".65rem",
            fontFamily: SANS,
            fontSize: "clamp(.60rem, 1.1vw, .72rem)",
            fontWeight: 500,
            letterSpacing: ".26em",
            textTransform: "uppercase",
            color: C.forest,
            marginBottom: ".9rem",
          }}
        >
          <span style={{ display: "block", width: 24, height: 1, background: C.forest, opacity: .4 }} />
          Design Synthesis · Our DNA
          <span style={{ display: "block", width: 24, height: 1, background: C.forest, opacity: .4 }} />
        </motion.span>

        {/* Main Serif Title Statement */}
        <motion.h2
          id="about-heading"
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            lineHeight: 1.1,
            fontSize: "clamp(2.3rem, 5.2vw, 4rem)",
            color: C.deep,
            margin: "0 0 .6rem",
            letterSpacing: "-.01em",
          }}
        >
          Imagined,{" "}
          <em style={{ fontStyle: "italic", color: C.forest, fontWeight: 300 }}>
            Crafted
          </em>{" "}
          & Experienced
        </motion.h2>
        
        {/* Delicate Center Separator Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            headerInView
              ? { scaleX: 1, opacity: 0.45, transition: { duration: 0.85, delay: 0.18, ease: EASE } }
              : { scaleX: 0, opacity: 0 }
          }
          style={{
            width: "65px",
            height: "1.5px",
            background: "linear-gradient(to right, transparent, #2D7356, transparent)",
            margin: "1.1rem auto 1.4rem",
            transformOrigin: "center",
          }}
        />

        {/* Subtitle Statement Block */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          transition={{ delay: 0.24 }}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(.88rem, 1.6vw, 1.05rem)",
            fontWeight: 300,
            color: C.muted,
            lineHeight: 1.85,
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          We work collaboratively with clients, communities, and end-users to design architecture,
          interior space solutions, and landscapes.
        </motion.p>
      </header>

      {/* ── Main Core Interactive 3D Canvas Row ── */}
      <div style={{ position: "relative", zIndex: 1, marginTop: "clamp(-2rem, -2vw, 0rem)" }}>
        <TeamCarousel />
      </div>

      {/* ── Mirrored Footer Rule Component ── */}
      <footer
        ref={footerRef}
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: "1.1rem",
          padding: "1.2rem clamp(1.25rem, 5vw, 4rem) 2.5rem",
          boxSizing: "border-box",
          width: "100%",
          marginTop: "clamp(0.5rem, 2vw, 4rem)", 
        }}
      >
        <div style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
        }} />
        <span style={{
          fontFamily: SANS,
          fontSize: ".52rem",
          fontWeight: 400,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "rgba(13,43,30,.40)",
          whiteSpace: "nowrap",
        }}>
          Our Collective · Creative Mind
        </span>
        <div style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
        }} />
      </footer>
    </section>
  );
}