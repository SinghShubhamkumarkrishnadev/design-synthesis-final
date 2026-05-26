/**
 * App.jsx  [Flash Fix]
 * ─────────────────────────────────────────────────────────────────
 * ROOT CAUSE FIXES applied here:
 *
 * FIX 1 — visibility:hidden on website container during cinematic
 *   The website div previously had position:relative + zIndex:0, which
 *   creates a stacking context. Any child with opacity<1 or transform
 *   inside that context can bleed through the overlay in Safari and
 *   on low-power GPU compositing paths.
 *
 *   Solution: visibility:hidden removes the entire subtree from the
 *   paint/composite pipeline completely — not just transparent but
 *   never rasterized. No stacking context leaks possible.
 *   Flipped to visibility:visible on COMPLETED (synchronously) since
 *   the overlay is already at opacity:0 by then.
 *
 * FIX 2 — motion.main opacity was 0.8 during cinematic (NOT zero)
 *   The previous code used initial={{ y:60, opacity:0.8 }} which
 *   meant the entire website was rendered at 80% opacity throughout
 *   the cinematic. opacity<1 creates a stacking context — ANY gap
 *   in the overlay (transition edge, Safari compositing) would show
 *   the semi-transparent content underneath.
 *
 *   Solution: Removed the motion wrapper entirely for the cinematic
 *   period. The website container is visibility:hidden — no animation
 *   needed on it. The sections below HomeSection get their own
 *   entrance after COMPLETED.
 *
 * FIX 3 — zIndex:0 on website div removed
 *   position:relative without an explicit z-index does NOT create a
 *   stacking context (in most cases). Removing zIndex:0 eliminates
 *   the explicit stacking context that was competing with the overlay.
 *
 * All other architecture preserved exactly.
 * ─────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import { LenisProvider }        from "./context/LenisContext.jsx";
import { CinematicProvider, useCinematic } from "./cinematic/state/CinematicContext.jsx";
import CinematicOrchestrator    from "./cinematic/components/CinematicOrchestrator.jsx";
import { PHASE, selectors }     from "./cinematic/state/cinematicMachine.js";

import { PillBase }             from "./components/3d-adaptive-navigation-bar";
import FloatingConsultButton    from "./components/FloatingConsultButton";

import HomeSection        from "./components/sections/HomeSection";
import AboutSection       from "./components/sections/AboutSection";
import ServicesSection    from "./components/sections/ServicesSection";
import WorksSection       from "./components/sections/WorksSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ContactSection     from "./components/sections/ContactSection";
import Footer             from "./components/sections/Footer";

// ── Scroll Progress Bar ──────────────────────────────────────────
const ScrollProgressBar = ({ progress }) => (
  <div className="fixed top-0 left-0 right-0 z-[9999] h-[6px] bg-transparent">
    <motion.div
      className="h-full origin-left"
      style={{
        width     : `${progress}%`,
        background: "linear-gradient(90deg, #14532d 0%, #166534 40%, #15803d 70%, #22c55e 100%)",
        boxShadow : "0 0 8px rgba(34,197,94,0.5), 0 0 2px rgba(21,128,61,0.8)",
      }}
      transition={{ ease: "linear", duration: 0.05 }}
    />
  </div>
);

function AppInner() {
  const { phase } = useCinematic();

  const isExperienceComplete = phase === PHASE.COMPLETED;
  const isHandoffActive      = selectors.isHandoffActive(phase);

  const [activeSection,  setActiveSection ] = useState("home");
  const [isNavExpanded,  setIsNavExpanded ] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!isExperienceComplete) return;
    const sectionIds = ["home","about","services","works","testimonials","contact"];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { root: null, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isExperienceComplete]);

  useEffect(() => {
    if (!isExperienceComplete) return;
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) setScrollProgress((window.scrollY / totalScroll) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExperienceComplete]);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* ── Cinematic Overlay ─────────────────────────────────────
       * position:fixed, zIndex:100.
       * Returned as null by CinematicOrchestrator on COMPLETED.
       */}
      <CinematicOrchestrator />

      {/*
       * ── Website container ─────────────────────────────────────
       *
       * FIX: visibility:hidden until COMPLETED.
       *
       * WHY THIS WORKS:
       *   visibility:hidden removes the entire subtree from the paint
       *   and composite pipeline. Unlike opacity:0, it does NOT create
       *   a stacking context and does NOT get rasterized into any GPU
       *   layer. There is literally nothing for the compositor to show.
       *
       * WHY NOT opacity:0:
       *   opacity:0 still creates a stacking context and still causes
       *   GPU layer promotion for any descendant with will-change or
       *   transform. Those layers can surface in Safari's compositor.
       *
       * WHY NOT display:none:
       *   display:none causes layout recalculation when toggled, which
       *   could cause a reflow flash at the moment of reveal. We want
       *   zero reflow — visibility:hidden preserves layout.
       *
       * WHY NO TRANSITION ON VISIBILITY:
       *   The overlay handles the visual transition. When the overlay
       *   hits opacity:0 and the machine reaches COMPLETED, the website
       *   is already fully positioned. Flipping visibility is instant
       *   and invisible because there's nothing to see underneath
       *   until the overlay is gone anyway.
       *
       * IMPORTANT: No position:relative + zIndex here.
       * Removing the explicit z-index eliminates the stacking context
       * that was competing with the overlay. Without a z-index, this
       * div is in the root stacking context at paint order 0, always
       * behind the position:fixed overlay.
       */}
      <div
        className="relative min-h-screen bg-[#050d07] text-neutral-900 font-sans overflow-x-hidden antialiased selection:bg-emerald-500/20"
        style={{
          // FIX: visibility hidden until cinematic completes
          // This is the primary flash prevention mechanism.
          visibility: isExperienceComplete ? "visible" : "hidden",
          // NO zIndex here — removing the explicit stacking context
          // that could compete with the overlay.
          // NO opacity < 1 anywhere on this container or its motion wrappers.
        }}
      >
        <ScrollProgressBar progress={scrollProgress} />

        {/* ── HEADER ──────────────────────────────────────────── */}
        <header
          className="fixed top-4 sm:top-8 inset-x-0 w-full pointer-events-none"
          style={{ zIndex: 50 }}
        >
          <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto w-full px-4 sm:px-6 md:px-16 xl:px-24 flex flex-row items-center justify-between gap-4 relative">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isExperienceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center gap-2 sm:gap-3 pointer-events-auto select-none group cursor-pointer"
              onClick={() => {
                document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
                setActiveSection("home");
              }}
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex flex-shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200 shadow-sm group-hover:border-emerald-500/50 transition-all duration-500 ease-out">
                <div className="grid grid-cols-3 gap-0 group-hover:gap-0.5 transition-all duration-500 ease-[0.16,1,0.3,1] rotate-45">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] h-[3px] rounded-full bg-neutral-800 group-hover:bg-emerald-600 transition-colors duration-500 ease-out"
                    />
                  ))}
                </div>
                <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
              </div>

              <span
                className={`text-[10px] sm:text-sm tracking-[0.25em] uppercase font-light text-neutral-500 group-hover:text-neutral-900 font-mono whitespace-nowrap transition-all duration-500 ease-out ${
                  isNavExpanded
                    ? "max-sm:opacity-0 max-sm:w-0 max-sm:scale-95 overflow-hidden"
                    : "opacity-100 w-auto scale-100"
                }`}
              >
                Design{" "}
                <span className="font-bold text-neutral-900 tracking-[0.2em] bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent">
                  Synthesis
                </span>
              </span>
            </motion.div>

            <motion.div
              className="pointer-events-auto flex-shrink-0 z-10"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={isExperienceComplete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <PillBase
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onExpandChange={setIsNavExpanded}
              />
            </motion.div>
          </div>
        </header>

        {/* ── MAIN CONTENT ─────────────────────────────────────── */}
        {/*
         * FIX: No motion wrapper with opacity<1 on main.
         *
         * The previous code had:
         *   <motion.main initial={{ y:60, opacity:0.8 }}>
         * opacity:0.8 during the cinematic was creating a stacking
         * context on the entire content tree at 80% opacity — visible
         * through any gap in the overlay compositing.
         *
         * Now: HomeSection manages its own entrance (it's already
         * visibility:hidden via the parent until COMPLETED).
         * Lower sections get a clean entrance animation that only
         * starts after COMPLETED — no opacity<1 during cinematic.
         */}
        <main className="w-full">
          {/* HomeSection — directly inside main, no wrapper animation */}
          <section id="home">
            <HomeSection />
          </section>

          {/*
           * Remaining sections animate in AFTER completion.
           * Using initial opacity:0 (not 0.8) — but since the parent
           * is visibility:hidden until COMPLETED, this animation only
           * runs after the visibility flip, so there's zero risk of
           * these being seen during the cinematic.
           */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isExperienceComplete ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <section id="about">        <AboutSection />         </section>
            <section id="services">    <ServicesSection />      </section>
            <section id="works">       <WorksSection />         </section>
            <section id="testimonials"><TestimonialsSection />  </section>
            <section id="contact">     <ContactSection />       </section>
            <Footer />
          </motion.div>
        </main>

        {isExperienceComplete && (
          <FloatingConsultButton
            position={{ bottom: "1.25rem", left: "1.25rem" }}
            revolvingText="FREE 30 MINUTES • CONSULT • "
            popupHeading="30-minutes call"
            popupBadgeText="Free"
            ctaButtonText="Book a call"
          />
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <LenisProvider>
      <CinematicProvider>
        <AppInner />
      </CinematicProvider>
    </LenisProvider>
  );
}