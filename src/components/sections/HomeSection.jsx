/**
 * HomeSection.jsx  [Phase 4 — complete redesign]
 * ─────────────────────────────────────────────────────────────────
 * The hero section that the cinematic experience transitions INTO.
 *
 * CRITICAL ARCHITECTURE:
 *   This component renders interior-final.jpg at full opacity at
 *   ALL TIMES — even during the cinematic. It sits underneath
 *   the z-index:100 overlay and is never visible until the overlay's
 *   exit fade reveals it.
 *
 *   This is intentional and essential:
 *   • No fade-in on the image (which would show white → image)
 *   • The cinematic overlay's exit IS the transition
 *   • When the overlay hits opacity:0, the website is already fully
 *     composited — zero flicker, zero jump
 *
 * TYPOGRAPHY ENTRANCE:
 *   The hero text and UI elements animate in when isHandoffActive
 *   becomes true (PHASE.HANDOFF or PHASE.COMPLETED). This aligns
 *   the content reveal with the interior video's exit fade —
 *   the typography fades up during the last 1.2s of the cinematic,
 *   emerging as the overlay dissolves.
 *
 * VISUAL DIRECTION:
 *   Luxury architecture studio — Cormorant Garamond headlines,
 *   architectural spacing, dark green palette over the hero image.
 *   Restrained, museum-grade, nature meets architecture.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCinematic } from "../../cinematic/state/CinematicContext.jsx";
import { selectors }    from "../../cinematic/state/cinematicMachine.js";

// ── Stagger variants ─────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren:   0.15,
    },
  },
};

const lineVariants = {
  hidden:  { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y:       0,
    filter:  "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const subtleVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y:       0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── Thin horizontal rule ─────────────────────────────────────────
function Rule({ delay = 0 }) {
  return (
    <motion.div
      variants={{
        hidden:  { scaleX: 0, opacity: 0 },
        visible: {
          scaleX: 1,
          opacity: 1,
          transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay },
        },
      }}
      style={{
        height:       "1px",
        background:   "rgba(220, 230, 220, 0.25)",
        transformOrigin: "left center",
      }}
    />
  );
}

// ── Scroll indicator ─────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      variants={subtleVariants}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "12px",
        cursor:       "default",
      }}
    >
      <div
        style={{
          width:    "1px",
          height:   "48px",
          background: "rgba(220, 230, 220, 0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position:   "absolute",
            top:        0,
            left:       0,
            width:      "100%",
            background: "rgba(160, 200, 160, 0.8)",
          }}
          animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
        />
      </div>
      <span
        style={{
          fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
          fontSize:      "10px",
          letterSpacing: "0.40em",
          textTransform: "uppercase",
          color:         "rgba(200, 220, 200, 0.50)",
          fontWeight:    300,
          writingMode:   "horizontal-tb",
        }}
      >
        Scroll
      </span>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function HomeSection() {
  const { phase }       = useCinematic();
  const isHandoffActive = selectors.isHandoffActive(phase);

  const sectionRef = useRef(null);

  // Parallax: image moves up slightly as you scroll down
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{
        position:   "relative",
        width:      "100%",
        minHeight:  "100svh",
        overflow:   "hidden",
        background: "#050d07",  // fallback before image loads
      }}
    >
      {/* ── Hero image — always fully visible ─────────────────────
       * Renders at opacity:1 immediately. The cinematic overlay
       * (z-index:100) sits on top; when it fades, this is revealed.
       * NO entrance animation on the image itself.
       */}
      <motion.div
        style={{
          position:  "absolute",
          inset:     "-6% 0",  // extra vertical room for parallax
          y:         imageY,
          willChange: "transform",
        }}
      >
        <img
          src="/images/interior-final.jpg"
          alt="Design Synthesis — architectural interior"
          loading="eager"
          decoding="sync"
          style={{
            width:          "100%",
            height:         "100%",
            objectFit:      "cover",
            objectPosition: "center 40%",
            display:        "block",
            // GPU layer — promoted from the start so the compositor
            // doesn't need to re-composite when the overlay fades
            transform:      "translateZ(0)",
            willChange:     "transform",
          }}
        />
      </motion.div>

      {/* ── Gradient vignettes ────────────────────────────────────── */}
      {/* Bottom-to-top: fade into the sections below */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          background:    `
            linear-gradient(
              to bottom,
              rgba(5, 13, 8, 0.15)  0%,
              rgba(5, 13, 8, 0.0)  30%,
              rgba(5, 13, 8, 0.0)  60%,
              rgba(5, 13, 8, 0.85) 100%
            )
          `,
          pointerEvents: "none",
        }}
      />
      {/* Left edge: dark depth */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          background:    "linear-gradient(to right, rgba(5,13,8,0.45) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content — animates in on HANDOFF ────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isHandoffActive ? "visible" : "hidden"}
        style={{
          position:       "relative",
          zIndex:          2,
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "flex-end",
          minHeight:      "100svh",
          padding:        "clamp(48px, 8vw, 96px)",
          paddingBottom:  "clamp(56px, 9vw, 108px)",
          pointerEvents:  isHandoffActive ? "auto" : "none",
        }}
      >
        {/* ── Eyebrow ──────────────────────────────────────────── */}
        <motion.div
          variants={subtleVariants}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "16px",
            marginBottom:   "clamp(20px, 3vw, 32px)",
          }}
        >
          <div
            style={{
              width:     "28px",
              height:    "1px",
              background: "rgba(160, 200, 160, 0.55)",
            }}
          />
          <span
            style={{
              fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
              fontSize:      "clamp(9px, 1vw, 11px)",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color:         "rgba(160, 200, 160, 0.70)",
              fontWeight:    300,
            }}
          >
            Architecture · Interior Design
          </span>
        </motion.div>

        {/* ── Primary rule ─────────────────────────────────────── */}
        <Rule />

        {/* ── Headline ─────────────────────────────────────────── */}
        <motion.div
          style={{
            marginTop: "clamp(24px, 3.5vw, 40px)",
            overflow:  "hidden",
          }}
        >
          <motion.h1
            variants={lineVariants}
            style={{
              fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
              fontSize:      "clamp(44px, 8.5vw, 116px)",
              fontWeight:    300,
              lineHeight:    0.92,
              letterSpacing: "-0.02em",
              color:         "rgba(240, 245, 240, 0.96)",
              margin:        0,
              // Prevent layout shift from font load
              fontDisplay:   "swap",
            }}
          >
            Where Space
          </motion.h1>
          <motion.h1
            variants={lineVariants}
            style={{
              fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
              fontSize:      "clamp(44px, 8.5vw, 116px)",
              fontWeight:    300,
              lineHeight:    0.92,
              letterSpacing: "-0.02em",
              // Sage-green tinted second line — architectural accent
              color:         "rgba(160, 200, 160, 0.90)",
              margin:        "0 0 0 clamp(20px, 4vw, 64px)",
            }}
          >
            Becomes Story
          </motion.h1>
        </motion.div>

        {/* ── Secondary rule ────────────────────────────────────── */}
        <div style={{ marginTop: "clamp(20px, 3vw, 36px)" }}>
          <Rule delay={0.3} />
        </div>

        {/* ── Bottom row: description + scroll indicator ─────────── */}
        <motion.div
          variants={containerVariants}
          style={{
            display:        "flex",
            alignItems:     "flex-end",
            justifyContent: "space-between",
            marginTop:      "clamp(20px, 3vw, 36px)",
            gap:            "clamp(24px, 4vw, 48px)",
            flexWrap:       "wrap",
          }}
        >
          <motion.div variants={subtleVariants} style={{ maxWidth: "clamp(260px, 35vw, 420px)" }}>
            <p
              style={{
                fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
                fontSize:      "clamp(14px, 1.4vw, 18px)",
                fontWeight:    300,
                lineHeight:    1.7,
                letterSpacing: "0.02em",
                color:         "rgba(200, 220, 200, 0.62)",
                margin:        0,
              }}
            >
              We craft environments that hold memory — spaces designed at the
              intersection of architecture, light, and material truth.
            </p>

            <motion.button
              whileHover={{ gap: "20px" }}
              style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "12px",
                marginTop:     "clamp(20px, 2.5vw, 28px)",
                padding:       "0",
                background:    "transparent",
                border:        "none",
                cursor:        "pointer",
                outline:       "none",
                transition:    "gap 0.4s ease",
              }}
            >
              <span
                style={{
                  fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
                  fontSize:      "clamp(11px, 1.1vw, 13px)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color:         "rgba(200, 235, 200, 0.75)",
                  fontWeight:    400,
                }}
              >
                Explore our work
              </span>
              <svg
                width="32"
                height="1"
                viewBox="0 0 32 1"
                style={{ overflow: "visible" }}
              >
                <line
                  x1="0" y1="0.5" x2="28" y2="0.5"
                  stroke="rgba(160,200,160,0.55)"
                  strokeWidth="0.8"
                />
                <polygon
                  points="28,0.5 24,-2.5 24,3.5"
                  fill="none"
                  stroke="rgba(160,200,160,0.55)"
                  strokeWidth="0.8"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <ScrollIndicator />
        </motion.div>

        {/* ── Location marker — bottom right ──────────────────── */}
        <motion.div
          variants={subtleVariants}
          style={{
            position:    "absolute",
            right:       "clamp(24px, 4vw, 48px)",
            bottom:      "clamp(32px, 5vw, 56px)",
            display:     "flex",
            alignItems:  "center",
            gap:         "8px",
            pointerEvents: "none",
          }}
        >
          <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
            <path
              d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.75C4.03 6.75 3.25 5.97 3.25 5S4.03 3.25 5 3.25 6.75 4.03 6.75 5 5.97 6.75 5 6.75z"
              fill="rgba(160,200,160,0.35)"
            />
          </svg>
          <span
            style={{
              fontFamily:    "'Cormorant Garamond', Garamond, Georgia, serif",
              fontSize:      "10px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color:         "rgba(160, 200, 160, 0.38)",
              fontWeight:    300,
            }}
          >
            Mumbai · Delhi · Singapore
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}