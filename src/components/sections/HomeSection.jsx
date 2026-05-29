/**
 * HomeSection.jsx  [Flash Fix]
 * ─────────────────────────────────────────────────────────────────
 * ROOT CAUSE FIXES applied here:
 *
 * FIX 1 — Image hidden until COMPLETED phase
 *   Previously: image rendered at opacity:1 always, "just hidden
 *   under the overlay". In practice, will-change:transform and
 *   Safari's GPU compositing caused this layer to surface above the
 *   overlay at various transition moments.
 *
 *   Solution: Image has opacity:0 until isExperienceComplete.
 *   The overlay's own exit fade IS the visual transition — we don't
 *   need the image pre-visible. The instant the overlay reaches
 *   opacity:0 and COMPLETED fires, we flip to opacity:1.
 *   Since the overlay is already transparent at that moment,
 *   this flip is imperceptible.
 *
 * FIX 2 — willChange removed during pre-active phases
 *   willChange:"transform" on the parallax container was promoting
 *   it to a GPU compositor layer during ALL phases. That layer
 *   could surface above the fixed overlay in Safari.
 *
 *   Solution: willChange is only set when the section is active.
 *   During cinematic: no promotion, no GPU layer, nothing to surface.
 *
 * FIX 3 — Parallax scroll only initialised post-completion
 *   useScroll ran on every render including during the cinematic.
 *   The imageY transform (even at 0%) was enough to create a
 *   stacking context via transform on the image container.
 *
 *   Solution: imageY is only applied when isExperienceComplete.
 *   During cinematic the container has no transform at all.
 *
 * FIX 4 — No stacking context on section root
 *   The section element has no position, no z-index, no transform,
 *   no opacity<1 during cinematic. It is a plain block element.
 *   Nothing can promote it or its children above the overlay.
 *
 * Typography entrance preserved — still triggers on isHandoffActive.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCinematic } from "../../cinematic/state/CinematicContext.jsx";
import { PHASE, selectors } from "../../cinematic/state/cinematicMachine.js";

// ── Animation variants ────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const lineVariants = {
  hidden:  { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const subtleVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function Rule({ delay = 0 }) {
  return (
    <motion.div
      variants={{
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
          scaleX: 1, opacity: 1,
          transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay },
        },
      }}
      style={{
        height:          "1px",
        background:      "rgba(220, 230, 220, 0.25)",
        transformOrigin: "left center",
      }}
    />
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      variants={subtleVariants}
      style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "default" }}
    >
      <div
        style={{
          width: "1px", height: "48px",
          background: "rgba(220, 230, 220, 0.35)",
          position: "relative", overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute", top: 0, left: 0, width: "100%",
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
        }}
      >
        Scroll
      </span>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function HomeSection() {
  const { phase }            = useCinematic();
  const isExperienceComplete = phase === PHASE.COMPLETED;
  const isHandoffActive      = selectors.isHandoffActive(phase);

  const sectionRef = useRef(null);

  // FIX: useScroll runs always (hooks can't be conditional) but the
  // transform is only APPLIED to the DOM when isExperienceComplete.
  // During cinematic: no style with imageY is set → no transform →
  // no stacking context promotion on the image container.
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
        position:  "relative",
        width:     "100%",
        minHeight: "100svh",
        overflow:  "hidden",
        // Dark background shows during the instant before/after — matches overlay
        background: "#050d07",
        // FIX: NO transform, NO zIndex, NO willChange on the section root.
        // This element must not create a stacking context during cinematic.
      }}
    >
      {/*
       * ── Hero image container ──────────────────────────────────
       *
       * FIX: No willChange or transform applied during cinematic.
       *
       * During cinematic (isExperienceComplete = false):
       *   - No style prop with transforms → no stacking context
       *   - No GPU layer promotion
       *   - Nothing to surface above the overlay
       *
       * After COMPLETED:
       *   - Parallax y transform applied
       *   - willChange:transform added for smooth parallax
       *   - By this point the overlay is gone so promotion is safe
       */}
      <motion.div
        style={isExperienceComplete ? {
          position:   "absolute",
          inset:      "-6% 0",
          y:          imageY,
          willChange: "transform",
        } : {
          // FIX: Plain positioning, zero transforms, zero GPU promotion
          position: "absolute",
          inset:    "0",
        }}
      >
        {/*
         * ── Hero image ─────────────────────────────────────────
         *
         * FIX: opacity:0 until COMPLETED.
         *
         * The previous design kept this at opacity:1 always, relying
         * on the overlay's z-index to hide it. This failed because:
         *   1. Safari compositor can surface GPU layers unexpectedly
         *   2. Any gap in the overlay (Framer Motion AnimatePresence,
         *      GSAP fade edges) would show this image
         *   3. The parent visibility:hidden in App.jsx now prevents
         *      this from being painted at all during cinematic, making
         *      this opacity:0 belt-and-suspenders redundant but kept
         *      for safety in case HomeSection is ever used standalone.
         *
         * TRANSITION: instantaneous flip on COMPLETED.
         * No CSS transition on the opacity — the overlay's exit fade
         * IS the visual transition. This image becoming visible at
         * the moment the overlay reaches opacity:0 is seamless.
         */}
        <img
          src="/images/interior-final.webp"
          alt="Design Synthesis — architectural interior"
          loading="eager"
          decoding="async"
          style={{
            width:          "100%",
            height:         "100%",
            objectFit:      "cover",
            objectPosition: "center 40%",
            display:        "block",
            // FIX: opacity:0 until COMPLETED — no transition
            opacity:        isExperienceComplete ? 1 : 0,
            // FIX: No willChange, no transform on the img itself
            // (the container handles transform post-completion)
          }}
        />
      </motion.div>

      {/* ── Gradient vignettes ─────────────────────────────────── */}
      <div
        aria-hidden="true"
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
          // FIX: No zIndex, no position:absolute with z-index
          // (already position:absolute, which is fine without z-index)
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          inset:         0,
          background:    "linear-gradient(to right, rgba(5,13,8,0.45) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Hero content — animates in on HANDOFF ────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isHandoffActive ? "visible" : "hidden"}
        style={{
          position:       "relative",
          // FIX: zIndex:2 only when active — during cinematic this
          // element is invisible via parent visibility:hidden anyway,
          // but being explicit prevents any accidental promotion.
          zIndex:         isHandoffActive ? 2 : 0,
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "flex-end",
          minHeight:      "100svh",
          padding:        "clamp(48px, 8vw, 96px)",
          paddingBottom:  "clamp(56px, 9vw, 108px)",
          pointerEvents:  isHandoffActive ? "auto" : "none",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          variants={subtleVariants}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "16px",
            marginBottom: "clamp(20px, 3vw, 32px)",
          }}
        >
          <div style={{ width: "28px", height: "1px", background: "rgba(160, 200, 160, 0.55)" }} />
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

        <Rule />

        {/* Headline */}
        <motion.div
          style={{ marginTop: "clamp(24px, 3.5vw, 40px)", overflow: "hidden" }}
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
              color:         "rgba(160, 200, 160, 0.90)",
              margin:        "0 0 0 clamp(20px, 4vw, 64px)",
            }}
          >
            Becomes Story
          </motion.h1>
        </motion.div>

        <div style={{ marginTop: "clamp(20px, 3vw, 36px)" }}>
          <Rule delay={0.3} />
        </div>

        {/* Bottom row */}
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
                display:    "inline-flex",
                alignItems: "center",
                gap:        "12px",
                marginTop:  "clamp(20px, 2.5vw, 28px)",
                padding:    "0",
                background: "transparent",
                border:     "none",
                cursor:     "pointer",
                outline:    "none",
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
              <svg width="32" height="1" viewBox="0 0 32 1" style={{ overflow: "visible" }}>
                <line x1="0" y1="0.5" x2="28" y2="0.5" stroke="rgba(160,200,160,0.55)" strokeWidth="0.8" />
                <polygon points="28,0.5 24,-2.5 24,3.5" fill="none" stroke="rgba(160,200,160,0.55)" strokeWidth="0.8" />
              </svg>
            </motion.button>
          </motion.div>

          <ScrollIndicator />
        </motion.div>

        {/* Location marker */}
        <motion.div
          variants={subtleVariants}
          style={{
            position:      "absolute",
            right:         "clamp(24px, 4vw, 48px)",
            bottom:        "clamp(32px, 5vw, 56px)",
            display:       "flex",
            alignItems:    "center",
            gap:           "8px",
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