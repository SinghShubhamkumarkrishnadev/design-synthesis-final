import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

// UI Elements
import LoadingScreen from "./components/LoadingScreen";
import { PillBase } from "./components/3d-adaptive-navigation-bar";

// Sections
import HomeSection from "./components/sections/HomeSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import WorksSection from "./components/sections/WorksSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Intersection Observer
  useEffect(() => {
    if (isLoading) return;
    const sectionIds = ["home", "about", "philosophy", "services", "works", "contact"];
    const options = { root: null, rootMargin: "-30% 0px -60% 0px", threshold: 0 };
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

  // Scroll Handling
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#f8f9fa] text-neutral-900 font-sans overflow-x-hidden antialiased selection:bg-indigo-500/20">
          
          {/* --- Global Header --- */}
          <header className="fixed top-4 sm:top-8 inset-x-0 z-50 w-full pointer-events-none">
            {/* यहाँ बदलाव किए हैं: 
                - max-w-[1600px] ताकि ये बड़े स्क्रीन्स पर ज्यादा फैल सके।
                - px-8 md:px-16 xl:px-24 ताकि ये किनारों के करीब पहुँच जाए।
            */}
            <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto w-full px-6 md:px-16 xl:px-24 flex flex-row items-center justify-between gap-4 relative">
              
              {/* Logo Brand (Left Side) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 pointer-events-auto select-none group cursor-pointer"
                onClick={() => {
                  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
                  setActiveSection("home");
                }}
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex flex-shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200 shadow-sm group-hover:border-indigo-500/50 transition-all duration-300">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-800 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 rotate-45" />
                  <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                </div>

                <span 
                  className={`text-[11px] sm:text-sm tracking-[0.25em] uppercase font-light text-neutral-500 group-hover:text-neutral-900 font-mono whitespace-nowrap transition-all duration-500 ease-out
                    ${isNavExpanded ? 'max-sm:opacity-0 max-sm:w-0 max-sm:scale-95' : 'opacity-100 w-auto scale-100'}
                  `}
                >
                  Design{" "}
                  <span className="font-bold text-neutral-900 tracking-[0.2em] bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent">
                    Synthesis
                  </span>
                </span>
              </motion.div>

              {/* Navbar (Right Side) */}
              <div className="pointer-events-auto flex-shrink-0 z-10">
                <PillBase
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onExpandChange={setIsNavExpanded}
                />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full">
            <section id="home"><HomeSection /></section>
            <section id="about"><AboutSection /></section>
            <section id="services"><ServicesSection /></section>
            <section id="works"><WorksSection /></section>
            <section id="contact"><ContactSection /></section>
            <Footer />
          </main>

          {/* --- Floating Back To Top Button --- */}
          <AnimatePresence>
            {showTopBtn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={scrollToTop}
                // डेस्कटॉप के लिए बटन का साइज और बड़ा (w-16 h-16) कर दिया है
                className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-neutral-200/80 text-neutral-500 hover:text-neutral-900 transition-all group shadow-xl hover:shadow-2xl cursor-pointer"
                aria-label="Back to top"
              >
                <svg className="absolute w-full h-full -rotate-90 p-0.5" viewBox="0 0 44 44">
                  <circle
                    cx="22" cy="22" r={radius}
                    className="stroke-neutral-100 fill-none"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="22" cy="22" r={radius}
                    className="stroke-neutral-300 group-hover:stroke-indigo-500 transition-colors duration-300 fill-none"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                {/* एरो को भी थोड़ा बड़ा किया है */}
                <span className="text-sm md:text-xl transform group-hover:-translate-y-1 transition-transform duration-300 font-mono">
                  ↑
                </span>
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      )}
    </>
  );
}

export default App;