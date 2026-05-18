import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { PhoneCall } from "lucide-react";

// UI Elements
import LoadingScreen from "./components/LoadingScreen";
import { PillBase } from "./components/3d-adaptive-navigation-bar";

// Sections
import HomeSection from "./components/sections/HomeSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import WorksSection from "./components/sections/WorksSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

const ScrollProgressBar = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[6px] bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #14532d 0%, #166534 40%, #15803d 70%, #22c55e 100%)",
          boxShadow: "0 0 8px rgba(34, 197, 94, 0.5), 0 0 2px rgba(21, 128, 61, 0.8)",
        }}
        transition={{ ease: "linear", duration: 0.05 }}
      />
    </div>
  );
};

// ─── Floating Consult Button ──────────────────────────────────────────────────

const FloatingConsultButton = ({
  revolvingText = "FREE 30 MINUTES • CONSULT • ",
  revolvingSpeed = 12,
  popupHeading = "30-minutes call",
  popupDescription =
    "This will be a brief, free call with one of our design and development producers to discuss your project and determine if we're a good fit.",
  popupBadgeText = "Free",
  ctaButtonText = "Book a call",
  ctaButtonAction = () => {
    // Graceful direct-dial protocol connection
    window.location.href = "tel:+919924774664";
  },
  position = { bottom: "1.25rem", left: "1.25rem" },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-md w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-4rem)]"
            style={{
              bottom: "calc(5.5rem + 16px)",
              left: "1.25rem",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 left-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="10" y1="10" x2="30" y2="30" />
                <line x1="30" y1="10" x2="10" y2="30" />
              </svg>
            </button>

            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight">
                  {popupHeading}
                </h3>
                <span className="shrink-0 text-black px-3 py-1 sm:px-4 sm:py-2 border-2 border-black rounded-full text-xs sm:text-sm font-medium">
                  {popupBadgeText}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                {popupDescription}
              </p>

              {/* CTA Button linked directly to tel link */}
              <button
                className="w-full bg-neutral-900 hover:bg-emerald-800 active:scale-95 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-900/20"
                onClick={() => {
                  ctaButtonAction();
                  setIsOpen(false);
                }}
              >
                {ctaButtonText}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      <div className="fixed z-50" style={position}>
        <motion.button
          className="relative flex items-center justify-center
                     w-14 h-14 sm:w-20 md:w-24 md:h-24 sm:h-20
                     rounded-full bg-white border border-neutral-200/80
                     text-neutral-500 hover:text-neutral-900
                     shadow-xl hover:shadow-2xl
                     transition-all group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open consultation booking"
        >
          {/* ── Revolving text ring ── */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: revolvingSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <path
                  id="circlePath"
                  d="M 100,100 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
                />
              </defs>
              <text
                style={{
                  fill: "#15803d",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                }}
                className="text-[26px] sm:text-[24px] md:text-[23.5px]"
              >
                <textPath href="#circlePath" startOffset="0%">
                  {revolvingText}
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* ── Icon ── */}
          <PhoneCall
            className="relative z-10 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 transform group-hover:scale-110 group-hover:text-emerald-700 transition-all duration-300"
            strokeWidth={1.75}
          />
        </motion.button>
      </div>
    </>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (isLoading) return;
    const sectionIds = [
      "home",
      "about",
      "philosophy",
      "services",
      "works",
      "testimonials",
      "contact",
    ];
    const options = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    };
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(callback, options);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isLoading]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
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

          {/* ── Scroll Progress Bar (top of screen) ───────────────────── */}
          <ScrollProgressBar progress={scrollProgress} />

          {/* ── Global Header ─────────────────────────────────────────── */}
          <header className="fixed top-4 sm:top-8 inset-x-0 z-50 w-full pointer-events-none">
            <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto w-full px-4 sm:px-6 md:px-16 xl:px-24 flex flex-row items-center justify-between gap-4 relative">

              {/* Logo / Brand */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 sm:gap-3 pointer-events-auto select-none group cursor-pointer"
                onClick={() => {
                  document
                    .getElementById("home")
                    .scrollIntoView({ behavior: "smooth" });
                  setActiveSection("home");
                }}
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex flex-shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200 shadow-sm group-hover:border-emerald-500/50 transition-all duration-300">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-800 group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300 rotate-45" />
                  <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                </div>

                <span
                  className={`text-[10px] sm:text-sm tracking-[0.25em] uppercase font-light text-neutral-500 group-hover:text-neutral-900 font-mono whitespace-nowrap transition-all duration-500 ease-out
                    ${
                      isNavExpanded
                        ? "max-sm:opacity-0 max-sm:w-0 max-sm:scale-95 overflow-hidden"
                        : "opacity-100 w-auto scale-100"
                    }
                  `}
                >
                  Design{" "}
                  <span className="font-bold text-neutral-900 tracking-[0.2em] bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent">
                    Synthesis
                  </span>
                </span>
              </motion.div>

              {/* Navbar */}
              <div className="pointer-events-auto flex-shrink-0 z-10">
                <PillBase
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onExpandChange={setIsNavExpanded}
                />
              </div>
            </div>
          </header>

          {/* ── Main Content ──────────────────────────────────────────── */}
          <main className="w-full">
            <section id="home"><HomeSection /></section>
            <section id="about"><AboutSection /></section>
            <section id="services"><ServicesSection /></section>
            <section id="works"><WorksSection /></section>
            <section id="testimonials"><TestimonialsSection /></section>
            <section id="contact"><ContactSection /></section>
            <Footer />
          </main>

          {/* ── Floating Consult Button (bottom-left) ─────────────────── */}
          <FloatingConsultButton
            position={{ bottom: "1.25rem", left: "1.25rem" }}
            revolvingText="FREE 30 MINUTES • CONSULT • "
            popupHeading="30-minutes call"
            popupDescription="This will be a brief, free call with one of Design Synthesis's producers to discuss your project and determine if we're a good fit."
            popupBadgeText="Free"
            ctaButtonText="Book a call"
          />

        </div>
      )}
    </>
  );
}

export default App;