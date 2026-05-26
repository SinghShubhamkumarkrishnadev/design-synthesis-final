/**
 * PatternLockOverlay.jsx  [Flash Fix]
 * ─────────────────────────────────────────────────────────────────
 * Flash fixes applied here:
 *
 * FIX 1 — Freeze-frame background image: decoding="async"
 *   The intro-final.jpg background in the lock overlay was using
 *   decoding="sync" which blocks the main thread. Changed to async.
 *
 * FIX 2 — Image scale removed from inline style
 *   The previous code had `scale: 1.03` directly on the img style
 *   as a Framer Motion value. This is valid but creates an implicit
 *   transform which promotes the layer. Moved to a wrapper div
 *   instead, keeping the img itself transform-free.
 *
 * FIX 3 — Overlay entrance only fades from dark, never transparent
 *   The motion.div overlay starts at opacity:0 which is fine because
 *   it sits INSIDE the fixed overlay parent (z-index:100). The
 *   parent is always fully opaque black during LOCKED phase entry
 *   (CinematicLockedSlot has its own enter fade from black).
 *   This layering is correct — no changes needed to the fade itself.
 *
 * All Phase 3 pattern lock architecture preserved.
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

function CornerAccents() {
  const size   = 18;
  const stroke = "rgba(160, 195, 165, 0.25)";
  const sw     = 1;
  const corners = [
    { style: { top: 0, left: 0 },     rotate: 0   },
    { style: { top: 0, right: 0 },    rotate: 90  },
    { style: { bottom: 0, right: 0 }, rotate: 180 },
    { style: { bottom: 0, left: 0 },  rotate: 270 },
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
            position:      "absolute",
            ...c.style,
            transform:     `rotate(${c.rotate}deg)`,
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

export function PatternLockOverlay({ onUnlocked }) {
  const svgRef         = useRef(null);
  const previewLineRef = useRef(null);

  const {
    lockState,
    sequence,
    activateNode,
    commitGesture,
  } = usePatternLock({ onSuccess: onUnlocked });

  const {
    overlayVariants,
    overlayAnimate,
    isError,
    isSuccess,
  } = usePatternAnimation({ lockState });

  const { handlers } = usePatternGesture({
    svgRef,
    previewLineRef,
    lockState,
    sequence,
    activateNode,
    commitGesture,
  });

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate={overlayAnimate}
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          0,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        overflowY:       "hidden",
        touchAction:     "none",
        transform:       "translateZ(0)",
        willChange:      "opacity",
      }}
    >
      {/* ── Layer 1: Freeze-frame background ──────────────────── */}
      {/*
       * FIX: Wrap the image in a plain div for the scale effect
       * instead of applying scale directly on the img element.
       * This keeps the img itself transform-free.
       */}
      <div
        style={{
          position:  "absolute",
          inset:     0,
          transform: "scale(1.03)",
          // No willChange here — this is inside the overlay (z-index:100)
          // so GPU promotion risk is contained within the overlay context.
        }}
      >
        <img
          src="/images/intro-final.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          // FIX: async decoding
          decoding="async"
          style={{
            width:          "100%",
            height:         "100%",
            objectFit:      "cover",
            objectPosition: "center center",
          }}
        />
      </div>

      {/* ── Layer 2: Dark vignette ─────────────────────────────── */}
      <div
        aria-hidden="true"
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

      {/* ── Layer 3: Glass composition panel ──────────────────── */}
      <div
        style={{
          position:        "relative",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          padding:         "48px 52px 40px",
          background:      "rgba(8, 22, 12, 0.30)",
          border:          "1px solid rgba(160, 195, 165, 0.12)",
          WebkitBackdropFilter: "blur(12px) saturate(1.1)",
          backdropFilter:  "blur(12px) saturate(1.1)",
          transform:       "translateZ(0)",
          willChange:      "transform",
        }}
      >
        <CornerAccents />

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
              width:      "32px",
              height:     "1px",
              background: "rgba(160, 195, 165, 0.20)",
              margin:     "0 auto",
            }}
          />
        </div>

        <PatternGrid
          ref={svgRef}
          sequence={sequence}
          isError={isError}
          isSuccess={isSuccess}
          gestureHandlers={handlers}
          previewLineRef={previewLineRef}
        />

        <UnlockStatus lockState={lockState} />
      </div>
    </motion.div>
  );
}