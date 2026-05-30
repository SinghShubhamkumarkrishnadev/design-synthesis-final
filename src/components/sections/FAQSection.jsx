// components/sections/FAQSection.jsx
// v6 — ALL styles inline (no CSS injection), guarantees correct rendering
//  ✓ Rule: gradient transparent→#2D7356→transparent, opacity 0.45, animates scaleX + opacity
//  ✓ Footer lines: flex:1, mirrored gradients matching ServicesSection exactly
//  ✓ Open card: position:absolute, z-index:30, slot reserves closed height
//  ✓ Extra padding: precise measurement, no blanket value
//  ✓ Fully responsive across all breakpoints

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import LottieComponent from "lottie-react";

import logoAnimationData from "../../assets/frequent.json";
const logoAnimation = logoAnimationData.default || logoAnimationData;
const Lottie = LottieComponent.default || LottieComponent;

// ─── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:       "#EEF1EE",
  deep:     "#0D2B1E",
  forest:   "#2D7356",
  muted:    "rgba(13,43,30,0.52)",
  card:     "#E8ECE8",
  cardOpen: "#f5f7f5",
  shadow:   "rgba(13,43,30,0.10)",
};
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";
const EASE  = [0.25, 0.1, 0.25, 1];
const TILTS = [1.4, -1.1, 1.8, -0.9, 1.2, -1.6];

// ─── Motion presets ─────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.80, ease: EASE } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.65, ease: EASE } },
};

// ─── Google Fonts loader ────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const id = "faq-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── FAQ data ───────────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: 1,
    q: "How are Bob Snail snacks different from others?",
    a: "Bob Snail snacks are made purely from fruit without any added sugar, preservatives, or colorants. We use a low-temperature baking process to preserve all the natural vitamins and nutrients.",
  },
  {
    id: 2,
    q: "What ingredients are used in Bob Snail products?",
    a: "Only 100% real fruits and berries! No hidden additives, no thickeners, and absolutely no artificial flavorings. Just pure nature in every bite.",
  },
  {
    id: 3,
    q: "Are Bob Snail products gluten-free?",
    a: "Yes, all Bob Snail snacks are naturally gluten-free and processed in facilities that prevent cross-contamination, making them completely safe for celiac diets.",
  },
  {
    id: 4,
    q: "Are the products suitable for vegans and vegetarians?",
    a: "Absolutely! Our snacks contain 100% plant-based ingredients with zero animal-derived components, making them ideal for both vegans and vegetarians.",
  },
  {
    id: 5,
    q: "What does 'no added sugar' mean?",
    a: "It means we never add granulated sugar, syrups, or artificial sweeteners. Any sweetness you taste comes entirely from the natural sugars present within the fruits.",
  },
  {
    id: 6,
    q: "Are Bob Snail products kosher?",
    a: "Yes, our manufacturing processes and ingredients are certified kosher. Please check individual packaging for specific certification stamps.",
  },
];

// ─── Responsive hook ────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ─── Deco lines ─────────────────────────────────────────────────────────────────
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

// ─── FAQCard ────────────────────────────────────────────────────────────────────
function FAQCard({ faq, index, isOpen, onToggle, onMeasureHeight }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || isOpen) return;
    const measure = () => {
      if (ref.current)
        onMeasureHeight(index, ref.current.getBoundingClientRect().height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [isOpen, index, onMeasureHeight]);

  const tilt = TILTS[index % TILTS.length];

  return (
    <motion.div
      ref={ref}
      layout
      onClick={onToggle}
      initial={false}
      animate={
        isOpen
          ? { rotate: 0, boxShadow: "0 16px 48px rgba(13,43,30,0.18), 0 4px 14px rgba(13,43,30,0.10)" }
          : { rotate: tilt,  boxShadow: `0 4px 18px ${C.shadow}` }
      }
      transition={{ duration: 0.40, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!isOpen ? { scale: 1.012 } : {}}
      style={{
        width          : "100%",
        borderRadius   : isOpen ? "24px" : "36px 26px 36px 26px",
        background     : isOpen ? C.cardOpen : C.card,
        padding        : "18px 22px",
        cursor         : "pointer",
        boxSizing      : "border-box",
        border         : "1.5px solid rgba(45,115,86,0.10)",
        willChange     : "transform",
        // open card floats above; closed card is in-flow
        position       : isOpen ? "absolute" : "relative",
        top            : isOpen ? 0 : undefined,
        left           : isOpen ? 0 : undefined,
        right          : isOpen ? 0 : undefined,
        zIndex         : isOpen ? 30 : 1,
      }}
    >
      {/* Question row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "12px",
      }}>
        <span style={{
          fontFamily   : SANS,
          fontSize     : "clamp(.82rem, 1.6vw, .96rem)",
          fontWeight   : 700,
          color        : C.deep,
          lineHeight   : 1.32,
          flex         : 1,
          letterSpacing: "-.01em",
        }}>
          {faq.q}
        </span>

        <div style={{
          flexShrink   : 0,
          width        : 30, height: 30,
          borderRadius : "50%",
          background   : isOpen ? "rgba(45,115,86,0.22)" : "rgba(45,115,86,0.12)",
          display      : "flex",
          alignItems   : "center",
          justifyContent: "center",
          transition   : "background .25s",
        }}>
          <motion.svg
            width="11" height="7" viewBox="0 0 11 7" fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <path
              d="M1 1L5.5 6L10 1"
              stroke={C.deep} strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="ans"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop    : "1px solid rgba(13,43,30,0.11)",
              paddingTop   : "11px",
              marginTop    : "11px",
              fontFamily   : SANS,
              fontSize     : "clamp(.76rem, 1.2vw, .875rem)",
              fontWeight   : 400,
              lineHeight   : 1.80,
              color        : "rgba(13,43,30,.68)",
            }}>
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────
export default function FAQSection() {
  useFonts();

  const ww = useWindowWidth();
  const isDesktop = ww >= 1024;
  const isMobile  = ww < 640;

  const [openId,       setOpenId      ] = useState(null);
  const [slotHeights,  setSlotHeights ] = useState({});
  const [openCardH,    setOpenCardH   ] = useState(0);
  const openCardRef = useRef(null);

  const toggle = useCallback(
    (id) => setOpenId((p) => (p === id ? null : id)),
    []
  );

  const handleMeasureHeight = useCallback((index, h) => {
    setSlotHeights((prev) =>
      prev[index] === h ? prev : { ...prev, [index]: h }
    );
  }, []);

  useEffect(() => {
    if (openId === null) { setOpenCardH(0); return; }
    const raf = requestAnimationFrame(() => {
      if (openCardRef.current)
        setOpenCardH(openCardRef.current.getBoundingClientRect().height);
    });
    return () => cancelAnimationFrame(raf);
  }, [openId]);

  const openIndex    = FAQS.findIndex((f) => f.id === openId);
  const slotH        = openIndex >= 0 ? (slotHeights[openIndex] ?? 0) : 0;
  const extraPadding = openId !== null ? Math.max(0, openCardH - slotH + 16) : 0;

  const headerRef = useRef(null);
  const inView    = useInView(headerRef, { once: true, margin: "-50px" });

  // ── Responsive sizing ──
  const wrapPad = isMobile
    ? "3.5rem 1.25rem 2rem"
    : isDesktop ? "6rem 4rem 4rem" : "5rem 2.5rem 3rem";

  const footerPadH = isMobile ? "1.25rem" : isDesktop ? "4rem" : "2.5rem";

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      style={{
        position       : "relative",
        width          : "100%",
        boxSizing      : "border-box",
        backgroundColor: C.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.50) 40%, transparent 72%),
          radial-gradient(ellipse 55% 75% at 100% 45%, rgba(45,115,86,0.04) 0%, transparent 65%),
          linear-gradient(180deg, #F4F6F4 0%, #EEF1EE 38%, #E8ECE8 72%, #E3E8E4 100%)
        `,
      }}
    >
      <DecoLines />

      {/* ── Content wrap ── */}
      <div style={{
        maxWidth  : 1440,
        margin    : "0 auto",
        padding   : wrapPad,
        position  : "relative",
        zIndex    : 1,
        boxSizing : "border-box",
      }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <header
          ref={headerRef}
          aria-labelledby="faq-heading"
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          {/* Eyebrow */}
          <motion.span
            variants={fadeIn} initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{
              display      : "inline-flex",
              alignItems   : "center",
              gap          : ".55rem",
              fontFamily   : SANS,
              fontSize     : "clamp(.60rem, 1.1vw, .72rem)",
              fontWeight   : 400,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color        : C.forest,
              marginBottom : ".65rem",
            }}
          >
            <span style={{ display:"block", width:24, height:1, background:C.forest, opacity:.5 }} />
            Common Queries
            <span style={{ display:"block", width:24, height:1, background:C.forest, opacity:.5 }} />
          </motion.span>

          {/* Title */}
          <motion.h2
            id="faq-heading"
            variants={fadeUp} initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.08 }}
            style={{
              fontFamily   : SERIF,
              fontWeight   : 300,
              lineHeight   : 1.08,
              fontSize     : "clamp(2.2rem, 5.5vw, 3.8rem)",
              color        : C.deep,
              margin       : "0 0 .4rem",
              letterSpacing: ".01em",
            }}
          >
            You have{" "}
            <em style={{ fontStyle:"italic", color:C.forest, fontWeight:300 }}>
              questions?
            </em>
          </motion.h2>

          {/*
            Rule — matches ServicesSection ruleVariant exactly:
            • background: linear-gradient(to right, transparent, #2D7356, transparent)
            • animates BOTH scaleX (0→1) AND opacity (0→0.45)
            • transformOrigin: "center"
            • height: 1px, width: 40px
          */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              inView
                ? { scaleX: 1, opacity: 0.45, transition: { duration: 0.80, delay: 0.16, ease: EASE } }
                : { scaleX: 0, opacity: 0 }
            }
            style={{
              width          : "70px",
              height         : "2px",
              background     : "linear-gradient(to right, transparent, #2D7356, transparent)",
              margin         : ".85rem auto 1rem",
              transformOrigin: "center",
            }}
          />

          {/* Subtitle */}
          <motion.p
            variants={fadeUp} initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.22 }}
            style={{
              fontFamily : SERIF,
              fontStyle  : "italic",
              fontSize   : "clamp(.85rem, 1.5vw, 1.02rem)",
              fontWeight : 300,
              color      : C.muted,
              lineHeight : 1.80,
              maxWidth   : "520px",
              margin     : "0 auto",
            }}
          >
            Everything you need to know about our natural snacks —
            answered simply and honestly.
          </motion.p>
        </header>

        {/* ── Body: Lottie · Accordion ──────────────────────────── */}
        <div style={{
          display            : isDesktop ? "grid" : "flex",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : undefined,
          flexDirection      : isDesktop ? undefined : "column",
          gap                : isDesktop ? "4rem" : "2rem",
          alignItems         : "start",
        }}>

          {/* Lottie col */}
          <motion.div
            variants={fadeIn} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{
              width          : "100%",
              display        : "flex",
              justifyContent : "center",
              alignItems     : "center",
              position       : isDesktop ? "sticky" : "relative",
              top            : isDesktop ? "3rem" : undefined,
            }}
          >
            <div style={{
              width      : isMobile ? "min(100%, 340px)" : isDesktop ? "100%" : "min(100%, 460px)",
              maxWidth   : isDesktop ? "600px" : undefined,
              aspectRatio: "1",
              mixBlendMode: "multiply",
            }}>
              {Lottie && (typeof Lottie === "function" || typeof Lottie === "object") ? (
                <Lottie
                  animationData={logoAnimation}
                  loop autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <div style={{ fontFamily: SANS, fontSize: ".72rem", color: "rgba(13,43,30,.38)" }}>
                  Loading…
                </div>
              )}
            </div>
          </motion.div>

          {/* Accordion col */}
          <div style={{ width: "100%", position: "relative", zIndex: 2 }}>
            <div
              style={{
                display       : "flex",
                flexDirection : "column",
                gap           : ".9rem",
                position      : "relative",
                paddingBottom : extraPadding > 0 ? `${extraPadding}px` : undefined,
                transition    : "padding-bottom 0.38s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {FAQS.map((faq, i) => {
                const isOpen = openId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    variants={fadeUp} initial="hidden"
                    whileInView="visible" viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: i * 0.07 }}
                    style={{ width: "100%" }}
                  >
                    {/* Slot — reserves closed-card height so stack stays stable */}
                    <div style={{
                      position  : "relative",
                      minHeight : slotHeights[i] ? `${slotHeights[i]}px` : undefined,
                    }}>
                      <div
                        ref={isOpen ? openCardRef : null}
                        style={{ width: "100%" }}
                      >
                        <FAQCard
                          faq={faq}
                          index={i}
                          isOpen={isOpen}
                          onToggle={() => toggle(faq.id)}
                          onMeasureHeight={handleMeasureHeight}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      {/*
        Footer lines — match ServicesSection footer lines exactly:
        Left:  linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)
        Right: linear-gradient(to left,  rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)
        Both: flex:1, height:1px — no CSS class
      */}
      <footer
        aria-hidden="true"
        style={{
          position      : "relative",
          zIndex        : 3,
          display       : "flex",
          alignItems    : "center",
          gap           : "1.1rem",
          padding       : `1.2rem ${footerPadH} 2.5rem`,
          boxSizing     : "border-box",
          width         : "100%",
        }}
      >
        <div style={{
          flex      : 1,
          height    : "1px",
          background: "linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
        }} />
        <span style={{
          fontFamily   : SANS,
          fontSize     : ".52rem",
          fontWeight   : 400,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color        : "rgba(13,43,30,.40)",
          whiteSpace   : "nowrap",
        }}>
          Frequently Asked · Natural Snacks
        </span>
        <div style={{
          flex      : 1,
          height    : "1px",
          background: "linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
        }} />
      </footer>
    </section>
  );
}