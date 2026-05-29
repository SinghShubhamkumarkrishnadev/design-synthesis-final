// components/sections/FAQSection.jsx
// Updated: single-column stacked accordion with vibrant pill cards + organic tilts

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieComponent from "lottie-react";

import logoAnimationData from "../../assets/frequent.json";
const logoAnimation = logoAnimationData.default || logoAnimationData;
const Lottie = LottieComponent.default || LottieComponent;

// ─── Easing ──────────────────────────────────────────────────────────────────
const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
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

// ─── FAQ DATA ─────────────────────────────────────────────────────────────────
// cardBg: solid pastel block color | iconBg: darker shade for chevron wrapper
const faqs = [
  {
    id: 1,
    question: "How are Bob Snail snacks different from others?",
    answer:
      "Bob Snail snacks are made purely from fruit without any added sugar, preservatives, or colorants. We use a low-temperature baking process to preserve all the natural vitamins and nutrients.",
    cardBg: "#edf1ec",
    iconBg: "#edf1ec",
  },
  {
    id: 2,
    question: "What ingredients are used in Bob Snail products?",
    answer:
      "Only 100% real fruits and berries! No hidden additives, no thickeners, and absolutely no artificial flavorings. Just pure nature in every bite.",
    cardBg: "#edf1ec",
    iconBg: "#edf1ec",
  },
  {
    id: 3,
    question: "Are Bob Snail products gluten-free?",
    answer:
      "Yes, all Bob Snail snacks are naturally gluten-free and processed in facilities that prevent cross-contamination, making them completely safe for celiac diets.",
    cardBg: "#edf1ec",
    iconBg: "#edf1ec",
  },
  {
    id: 4,
    question: "Are the products suitable for vegans and vegetarians?",
    answer:
      "Absolutely! Our snacks contain 100% plant-based ingredients with zero animal-derived components, making them ideal for both vegans and vegetarians.",
    cardBg: "#edf1ec",
    iconBg: "#edf1ec",
  },
  {
    id: 5,
    question: "What does \u201cno added sugar\u201d mean?",
    answer:
      "It means we never add granulated sugar, syrups, or artificial sweeteners. Any sweetness you taste comes entirely from the natural sugars naturally present within the fruits.",
    cardBg: "#edf1ec",
    iconBg: "#edf1ec",
  },
  {
    id: 6,
    question: "Are Bob Snail products kosher?",
    answer:
      "Yes, our manufacturing processes and ingredients are certified kosher. Please check individual packaging for specific certification stamps.",
    cardBg: "#edf1ec",
    iconBg: "#edf1ec",
  },
];

// Permanent tilt angles per row index (0-based), mirroring the organic stagger in the reference
const TILT_ANGLES = [1.2, -0.8, -1.5, 1.0, 0.7, -1.2];

// ─── Theme ────────────────────────────────────────────────────────────────────
const fontDisplay = "'Cormorant Garamond', Georgia, serif";
const fontBody    = "'DM Sans', system-ui, sans-serif";

const colors = {
  bg:        "#EEF1EE",
  deep:      "#0D2B1E",
  forest:    "#2D7356",
  textMuted: "rgba(13,43,30,0.55)",
};

// ─── Decorative Lines ─────────────────────────────────────────────────────────
function DecoLines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        zIndex: 0, overflow: "hidden", opacity: 0.07,
      }}
    >
      <svg
        viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
        style={{ position: "absolute", bottom: 0, right: 0, width: "55%", maxWidth: "420px" }}
      >
        <path d="M420 280 C360 260, 300 290, 260 270 C220 250, 200 230, 160 240 C120 250, 90 240, 40 260"
          stroke="#1B4835" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />
        <path d="M420 300 C370 285, 320 310, 275 295 C230 280, 210 265, 170 275 C130 285, 100 270, 50 290"
          stroke="#1B4835" strokeWidth="0.5" strokeLinecap="round" opacity="0.22" />
        <circle cx="180" cy="270" r="1.5" fill="#2D7356" opacity="0.28" />
        <circle cx="310" cy="280" r="1.2" fill="#1B4835" opacity="0.24" />
      </svg>
    </div>
  );
}

// ─── Inject responsive CSS once ───────────────────────────────────────────────
function useResponsiveStyles() {
  React.useEffect(() => {
    if (document.getElementById("faq-section-styles")) return;
    const style = document.createElement("style");
    style.id = "faq-section-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;700;800&display=swap');

      .faq-section-pad { padding: 3.5rem 1.25rem 2.5rem; }
      @media (min-width: 640px)  { .faq-section-pad { padding: 5rem 2.5rem 3.5rem; } }
      @media (min-width: 1024px) { .faq-section-pad { padding: 6rem 4rem 4.5rem; } }
      @media (min-width: 1280px) { .faq-section-pad { padding: 7rem 6rem 5.5rem; } }

      /* Two-column layout: left sticky panel + right accordion */
      .faq-layout { display: flex; flex-direction: column; gap: 2.5rem; align-items: start; }
      @media (min-width: 1024px) {
        .faq-layout { display: grid; grid-template-columns: 5fr 7fr; gap: 4rem; }
      }

      .faq-left { text-align: center; align-items: center; display: flex; flex-direction: column; }
      @media (min-width: 1024px) {
        .faq-left { position: sticky; top: 2rem; text-align: left; align-items: flex-start; }
      }

      .faq-title { font-size: clamp(2rem, 8vw, 2.8rem); }
      @media (min-width: 640px)  { .faq-title { font-size: clamp(2.2rem, 5.5vw, 3.2rem); } }
      @media (min-width: 1024px) { .faq-title { font-size: clamp(2.6rem, 3.8vw, 3.8rem); } }

      .faq-lottie { width: 150px; height: 150px; mix-blend-mode: multiply; }
      @media (min-width: 640px)  { .faq-lottie { width: 190px; height: 190px; } }
      @media (min-width: 1024px) { .faq-lottie { width: 220px; height: 220px; } }

      /* ── SINGLE-COLUMN accordion stack ───────────────────────── */
      .faq-grid {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        max-width: 720px;
        width: 100%;
      }

      /* Permanent organic tilts per row */
      .faq-row-0 { transform: rotate(1.2deg);  }
      .faq-row-1 { transform: rotate(-0.8deg); }
      .faq-row-2 { transform: rotate(-1.5deg); }
      .faq-row-3 { transform: rotate(1.0deg);  }
      .faq-row-4 { transform: rotate(0.7deg);  }
      .faq-row-5 { transform: rotate(-1.2deg); }

      /* Flatten tilt when open for readability */
      .faq-row-open { transform: rotate(0deg) !important; transition: transform 0.38s cubic-bezier(0.16,1,0.3,1); }

      .faq-footer-rule { padding: 0.9rem clamp(1.25rem, 6vw, 6rem) 2.5rem; }
      @media (min-width: 1024px) { .faq-footer-rule { padding: 1.1rem clamp(1.25rem, 6vw, 6rem) 3.5rem; } }
    `;
    document.head.appendChild(style);
  }, []);
}

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <div
      className={`faq-row-${index}${isOpen ? " faq-row-open" : ""}`}
      onClick={onToggle}
      style={{
        width:         "100%",
        borderRadius:  "45px 35px 45px 35px",
        background:    faq.cardBg,
        // No glassmorphism — solid, vibrant color block
        border:        "none",
        boxShadow:     isOpen
          ? "0 10px 36px rgba(13,43,30,0.14), 0 3px 10px rgba(13,43,30,0.08)"
          : "0 4px 18px rgba(13,43,30,0.08), 0 1px 4px rgba(13,43,30,0.05)",
        padding:       "20px 26px",
        cursor:        "pointer",
        position:      "relative",
        overflow:      "hidden",
        transition:    "box-shadow 0.35s ease, transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        boxSizing:     "border-box",
      }}
    >
      {/* Question row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "14px",
      }}>
        <span style={{
          fontFamily:    fontBody,
          fontSize:      "clamp(0.92rem, 2vw, 1.05rem)",
          fontWeight:    800,
          letterSpacing: "-0.01em",
          color:         colors.deep,
          lineHeight:    1.30,
          flex:          1,
        }}>
          {faq.question}
        </span>

        {/* Chevron icon wrapper — uses faq.iconBg */}
        <div style={{
          flexShrink:     0,
          width:          "34px",
          height:         "34px",
          borderRadius:   "50%",
          background:     faq.iconBg,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          transition:     "background 0.30s ease",
          marginTop:      "1px",
        }}>
          <motion.svg
            width="12" height="8" viewBox="0 0 12 8" fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke={colors.deep}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 14 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.40, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop:    `1.5px solid rgba(13,43,30,0.12)`,
              paddingTop:   "14px",
              fontFamily:   fontBody,
              fontSize:     "clamp(0.80rem, 1.4vw, 0.90rem)",
              fontWeight:   400,
              lineHeight:   1.78,
              color:        "rgba(13,43,30,0.70)",
              letterSpacing: "0.005em",
            }}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FAQSection() {
  useResponsiveStyles();
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 38%, transparent 72%),
          radial-gradient(ellipse 55% 75% at 100% 45%, rgba(45,115,86,0.045) 0%, transparent 65%),
          radial-gradient(ellipse 45% 55% at 0% 100%, rgba(13,43,30,0.035) 0%, transparent 60%),
          linear-gradient(180deg, #F4F6F4 0%, #EEF1EE 38%, #E8ECE8 72%, #E3E8E4 100%)
        `,
        boxSizing: "border-box",
      }}
    >
      <DecoLines />

      <div
        className="faq-section-pad"
        style={{ maxWidth: "1440px", margin: "0 auto", position: "relative", zIndex: 1, boxSizing: "border-box" }}
      >
        <div className="faq-layout">

          {/* ── Left Column ──────────────────────────────────────── */}
          <div className="faq-left">

            <motion.span
              variants={fadeIn} initial="hidden"
              whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.55rem",
                fontFamily:    fontBody,
                fontSize:      "clamp(0.58rem, 0.90vw, 0.70rem)",
                fontWeight:    400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         colors.forest,
                opacity:       0.85,
                marginBottom:  "0.5rem",
              }}
            >
              <span style={{ display: "block", width: "16px", height: "1px", background: colors.forest, opacity: 0.45 }} />
              Common Queries
              <span style={{ display: "block", width: "16px", height: "1px", background: colors.forest, opacity: 0.45 }} />
            </motion.span>

            <motion.h2
              id="faq-heading"
              className="faq-title"
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.08 }}
              style={{
                fontFamily:    fontDisplay,
                fontWeight:    300,
                lineHeight:    1.10,
                color:         colors.deep,
                margin:        "0 0 0.45rem",
                letterSpacing: "0.01em",
              }}
            >
              You have{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: colors.forest }}>questions?</em>
              <br />
              Wait —{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "#235E44" }}>we'll figure</em>
              <br />
              it out.
            </motion.h2>

            <motion.div
              variants={ruleVariant} initial="hidden"
              whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              style={{
                width:           "36px",
                height:          "1px",
                background:      `linear-gradient(to right, transparent, ${colors.forest}, transparent)`,
                opacity:         0.45,
                margin:          "0.35rem 0 0.75rem",
                transformOrigin: "center",
              }}
            />

            <motion.p
              variants={fadeUp} initial="hidden"
              whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.22 }}
              style={{
                fontFamily:  fontDisplay,
                fontSize:    "clamp(0.82rem, 1.2vw, 0.95rem)",
                fontWeight:  300,
                fontStyle:   "italic",
                color:       colors.textMuted,
                lineHeight:  1.82,
                maxWidth:    "300px",
                margin:      "0 0 1.5rem",
              }}
            >
              Everything you need to know about our natural snacks — answered simply and honestly.
            </motion.p>

            <motion.div
              className="faq-lottie"
              variants={fadeIn} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.30 }}
            >
              {Lottie && (typeof Lottie === "function" || typeof Lottie === "object") ? (
                <Lottie animationData={logoAnimation} loop autoplay />
              ) : (
                <div style={{ fontFamily: fontBody, fontSize: "0.72rem", color: "rgba(13,43,30,0.38)" }}>Loading…</div>
              )}
            </motion.div>
          </div>

          {/* ── Right Column — single-column accordion ────────────── */}
          <div>
            <div className="faq-grid">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  variants={fadeUp} initial="hidden"
                  whileInView="visible" viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.07 }}
                  style={{ transformOrigin: "center", width: "100%" }}
                >
                  <FAQItem
                    faq={faq}
                    index={i}
                    isOpen={openId === faq.id}
                    onToggle={() => toggle(faq.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer Rule ───────────────────────────────────────────── */}
      <footer
        aria-hidden="true"
        className="faq-footer-rule"
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "1.1rem",
          width:      "100%",
          position:   "relative",
          zIndex:     1,
          boxSizing:  "border-box",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)" }} />
        <span style={{
          fontFamily:    fontBody,
          fontSize:      "0.54rem",
          fontWeight:    400,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color:         "rgba(13,43,30,0.38)",
          whiteSpace:    "nowrap",
        }}>
          Frequently Asked · Natural Snacks
        </span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)" }} />
      </footer>
    </section>
  );
}