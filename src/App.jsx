import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

// UI Components
import LoadingScreen from "./components/LoadingScreen";
import { PillBase } from "./components/3d-adaptive-navigation-bar";
import FloatingConsultButton from "./components/FloatingConsultButton";

// Layout Sections
import HomeSection        from "./components/sections/HomeSection";
import AboutSection       from "./components/sections/AboutSection";
import ServicesSection    from "./components/sections/ServicesSection";
import WorksSection       from "./components/sections/WorksSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ContactSection     from "./components/sections/ContactSection";
import Footer             from "./components/sections/Footer";

/* =========================
   SCROLL PROGRESS BAR
   — gradient & glow cannot be
   expressed as static Tailwind
   classes, kept as inline style
========================= */
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

/* =========================
   APP
========================= */
export default function App() {
  const [isLoading,      setIsLoading     ] = useState(true);
  const [activeSection,  setActiveSection ] = useState("home");
  const [isNavExpanded,  setIsNavExpanded ] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Section observer */
  useEffect(() => {
    if (isLoading) return;
    const sectionIds = ["home","about","philosophy","services","works","testimonials","contact"];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { root: null, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isLoading]);

  /* Scroll progress */
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) setScrollProgress((window.scrollY / totalScroll) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#f8f9fa] text-neutral-900 font-sans overflow-x-hidden antialiased selection:bg-emerald-500/20">

          <ScrollProgressBar progress={scrollProgress} />

          {/* ── HEADER ── */}
          <header className="fixed top-4 sm:top-8 inset-x-0 z-50 w-full pointer-events-none">
            <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto w-full px-4 sm:px-6 md:px-16 xl:px-24 flex flex-row items-center justify-between gap-4 relative">

              {/* Branding */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 sm:gap-3 pointer-events-auto select-none group cursor-pointer"
                onClick={() => {
                  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
                  setActiveSection("home");
                }}
              >
                {/* Logo mark */}
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

                {/* Brand name */}
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

              {/* Navigation */}
              <div className="pointer-events-auto flex-shrink-0 z-10">
                <PillBase
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onExpandChange={setIsNavExpanded}
                />
              </div>
            </div>
          </header>

          {/* ── MAIN CONTENT ── */}
          <main className="w-full">
            <section id="home">        <HomeSection />         </section>
            <section id="about">       <AboutSection />        </section>
            <section id="services">    <ServicesSection />     </section>
            <section id="works">       <WorksSection />        </section>
            <section id="testimonials"><TestimonialsSection /> </section>
            <section id="contact">     <ContactSection />      </section>
            <Footer />
          </main>

          <FloatingConsultButton
            position={{ bottom: "1.25rem", left: "1.25rem" }}
            revolvingText="FREE 30 MINUTES • CONSULT • "
            popupHeading="30-minutes call"
            popupBadgeText="Free"
            ctaButtonText="Book a call"
          />
        </div>
      )}
    </>
  );
}