/**
 * PatternLockOverlay.jsx
 * ─────────────────────────────────────────────────────────────────
 * The main assembly for the LOCKED phase.
 *
 * Layer stack (bottom → top):
 *   1. Freeze-frame image (intro-final.jpg) — full bleed background
 *   2. Dark green vignette overlay           — depth & atmosphere
 *   3. Glass panel                           — centred composition
 *   4. PatternGrid (SVG)                     — interactive lock
 *   5. UnlockStatus                          — minimal label
 *
 * Framer Motion AnimatePresence wraps the whole overlay for entrance.
 * The overlay itself uses the variants from usePatternAnimation.
 *
 * Gesture surface:
 *   Pointer events are attached to the SVG via usePatternGesture.
 *   The parent overlay div also handles overflow and prevents
 *   iOS scroll events from leaking through.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef } from "react";
import { motion } from "framer-motion";

import { PatternGrid }          from "./PatternGrid.jsx";
import { UnlockStatus }         from "./UnlockStatus.jsx";
import { usePatternLock }       from "../../hooks/usePatternLock.js";
import { usePatternGesture }    from "../../hooks/usePatternGesture.js";
import { usePatternAnimation }  from "../../hooks/usePatternAnimation.js";
import { COLOR }                from "../../utils/patternConstants.js";

// ── Architectural corner accent ───────────────────────────────────
// Small SVG corner marks — etched glass aesthetic
function CornerAccents() {
  const size   = 18;
  const stroke = "rgba(160, 195, 165, 0.25)";
  const sw     = 1;
  const corners = [
    { style: { top: 0, left: 0 },    rotate: 0   },
    { style: { top: 0, right: 0 },   rotate: 90  },
    { style: { bottom: 0, right: 0 }, rotate: 180 },
    { style: { bottom: 0, left: 0 }, rotate: 270 },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            position:  "absolute",
            ...c.style,
            transform: `rotate(${c.rotate}deg)`,
            pointerEvents: "none",
          }}
        >
          <polyline
            points={`${size},${sw} ${sw},${sw} ${sw},${size}`}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      ))}
    </>
  );
}

// ── Component ─────────────────────────────────────────────────────
export function PatternLockOverlay({ onUnlocked }) {
  const svgRef         = useRef(null);
  const previewLineRef = useRef(null);

  // ── Pattern lock state ───────────────────────────────────────────
  const {
    lockState,
    sequence,
    activateNode,
    commitGesture,
  } = usePatternLock({ onSuccess: onUnlocked });

  // ── Animation state ──────────────────────────────────────────────
  const {
    overlayVariants,
    overlayAnimate,
    isError,
    isSuccess,
  } = usePatternAnimation({ lockState });

  // ── Gesture handlers ─────────────────────────────────────────────
  const { handlers } = usePatternGesture({
    svgRef,
    previewLineRef,
    lockState,
    sequence,
    activateNode,
    commitGesture,
  });

  // ── Render ───────────────────────────────────────────────────────
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate={overlayAnimate}
      style={{
        position:   "fixed",
        inset:       0,
        zIndex:      0,
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        // Prevent iOS scroll bleed
        overflowY:  "hidden",
        touchAction: "none",
        // GPU layer
        transform:  "translateZ(0)",
        willChange: "opacity",
      }}
    >
      {/* ── Layer 1: Freeze-frame background ───────────────────── */}
      <img
        src="/images/intro-final.jpg"
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="sync"
        style={{
          position:       "absolute",
          inset:          0,
          width:          "100%",
          height:         "100%",
          objectFit:      "cover",
          objectPosition: "center center",
          transform:      "translateZ(0)",
          // Very subtle scale-in with the overlay entrance — creates depth
          scale: 1.03,
        }}
      />

      {/* ── Layer 2: Dark vignette ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset:    0,
          background: `
            radial-gradient(
              ellipse 80% 80% at 50% 50%,
              rgba(4, 14, 8, 0.55) 0%,
              rgba(4, 10, 6, 0.82) 100%
            )
          `,
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 3: Glass composition panel ───────────────────── */}
      <div
        style={{
          position:        "relative",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          padding:         "48px 52px 40px",
          // Architectural glass
          background:      "rgba(8, 22, 12, 0.30)",
          border:          "1px solid rgba(160, 195, 165, 0.12)",
          // Restrained blur — safe for Safari
          WebkitBackdropFilter: "blur(12px) saturate(1.1)",
          backdropFilter:  "blur(12px) saturate(1.1)",
          // GPU layer
          transform:       "translateZ(0)",
          willChange:      "transform",
        }}
      >
        {/* Corner accents — etched glass aesthetic */}
        <CornerAccents />

        {/* Studio wordmark — minimal typographic anchor */}
        <div
          style={{
            marginBottom:  "38px",
            textAlign:     "center",
            pointerEvents: "none",
            userSelect:    "none",
          }}
        >
          <span
            style={{
              display:       "block",
              fontFamily:    "'Cormorant Garamond', 'Garamond', Georgia, serif",
              fontSize:      "10px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color:         "rgba(160, 195, 165, 0.45)",
              fontWeight:    300,
              marginBottom:  "6px",
            }}
          >
            Design Synthesis
          </span>
          <div
            style={{
              width:     "32px",
              height:    "1px",
              background: "rgba(160, 195, 165, 0.20)",
              margin:    "0 auto",
            }}
          />
        </div>

        {/* ── Layer 4: Pattern grid ─────────────────────────────── */}
        <PatternGrid
          ref={svgRef}
          sequence={sequence}
          isError={isError}
          isSuccess={isSuccess}
          gestureHandlers={handlers}
          previewLineRef={previewLineRef}
        />

        {/* ── Layer 5: Status label ─────────────────────────────── */}
        <UnlockStatus lockState={lockState} />
      </div>
    </motion.div>
  );
}