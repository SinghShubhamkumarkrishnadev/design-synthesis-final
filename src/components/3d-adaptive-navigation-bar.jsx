import React, { useState, useRef, useEffect } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Layers, MessageSquare, Mail } from "lucide-react";

/**
 * 3D Adaptive Navigation Pill
 * Smart navigation with scroll detection, responsive layout sizing, and hover expansion.
 * On mobile (< 640px), expanded state renders Lucide icons instead of text labels
 * to prevent overflow on tight viewports.
 */
export const PillBase = ({ activeSection, setActiveSection, onExpandChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const prevSectionRef = useRef("home");

  // Convenience flag — used throughout for responsive branching
  const isMobile = screenWidth < 640;

  // Navigation items with matched Lucide icon components
  const navItems = [
    { label: "Home",        id: "home",         icon: Home          },
    { label: "About Us",    id: "about",         icon: User          },
    { label: "Our Services",id: "services",      icon: Briefcase     },
    { label: "Our Works",   id: "works",         icon: Layers        },
    { label: "Reviews",     id: "testimonials",  icon: MessageSquare },
    { label: "Contact Us",  id: "contact",       icon: Mail          },
  ];

  // Monitor screen width adjustments seamlessly
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjusted widths:
  // - Mobile icons are much narrower than text labels, so 260px is snug and balanced.
  // - Desktop retains original generous widths for full text labels.
  const getMaxExpandedWidth = () => {
    if (screenWidth < 360) return 260;
    if (screenWidth < 640) return 260;   // ← reduced from 310/350: icons fit tighter
    if (screenWidth < 1024) return 720;
    return 820;
  };

  const maxExpandedWidth = getMaxExpandedWidth();
  const collapsedWidth = isMobile ? 125 : 150;

  // Spring animations for smooth motion
  const pillWidth = useSpring(collapsedWidth, {
    stiffness: 220,
    damping: 25,
    mass: 1,
  });
  const pillShift = useSpring(0, { stiffness: 220, damping: 25, mass: 1 });

  // Keep spring constraints responsive if screen changes live
  useEffect(() => {
    if (!expanded) {
      pillWidth.set(collapsedWidth);
    } else {
      pillWidth.set(maxExpandedWidth);
    }
  }, [screenWidth, expanded, collapsedWidth, maxExpandedWidth, pillWidth]);

  // Handle hover expansion cleanly with complete dependency updates
  useEffect(() => {
    if (hovering) {
      setExpanded(true);
      if (onExpandChange) onExpandChange(true);
      pillWidth.set(maxExpandedWidth);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setExpanded(false);
        if (onExpandChange) onExpandChange(false);
        pillWidth.set(collapsedWidth);
      }, 600);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [hovering, pillWidth, collapsedWidth, maxExpandedWidth, onExpandChange]);

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const handleSectionClick = (sectionId) => {
    setIsTransitioning(true);
    prevSectionRef.current = sectionId;
    setActiveSection(sectionId);

    // Smooth scroll handling to target elements on the page
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setHovering(false);
    setExpanded(false);
    if (onExpandChange) onExpandChange(false);

    setTimeout(() => setIsTransitioning(false), 400);
  };

  const activeItem = navItems.find((item) => item.id === activeSection);

  return (
    <motion.nav
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      className="relative rounded-full"
      style={{
        width: pillWidth,
        height: isMobile ? "46px" : "56px",
        background: `
          linear-gradient(135deg, 
            #fcfcfd 0%, 
            #f8f8fa 15%, 
            #f3f4f6 30%, 
            #eeeff2 45%, 
            #e9eaed 60%, 
            #e4e5e8 75%, 
            #dee0e3 90%, 
            #e2e3e6 100%
          )
        `,
        boxShadow: expanded
          ? `
            0 2px 4px rgba(0, 0, 0, 0.08),
            0 6px 12px rgba(0, 0, 0, 0.12),
            0 12px 24px rgba(0, 0, 0, 0.14),
            0 24px 48px rgba(0, 0, 0, 0.10),
            inset 0 2px 2px rgba(255, 255, 255, 0.8),
            inset 0 -3px 8px rgba(0, 0, 0, 0.12),
            inset 3px 3px 8px rgba(0, 0, 0, 0.10),
            inset -3px 3px 8px rgba(0, 0, 0, 0.09),
            inset 0 -1px 2px rgba(0, 0, 0, 0.08)
          `
          : isTransitioning
            ? `
            0 3px 6px rgba(0, 0, 0, 0.10),
            0 8px 16px rgba(0, 0, 0, 0.08),
            0 16px 32px rgba(0, 0, 0, 0.06),
            0 1px 2px rgba(0, 0, 0, 0.10),
            inset 0 2px 1px rgba(255, 255, 255, 0.85),
            inset 0 -2px 6px rgba(0, 0, 0, 0.08),
            inset 2px 2px 8px rgba(0, 0, 0, 0.06),
            inset -2px 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 0 1px rgba(0, 0, 0, 0.12),
            inset 0 0 20px rgba(255, 255, 255, 0.15)
          `
            : `
            0 3px 6px rgba(0, 0, 0, 0.12),
            0 8px 16px rgba(0, 0, 0, 0.10),
            0 16px 32px rgba(0, 0, 0, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.12),
            inset 0 2px 1px rgba(255, 255, 255, 0.7),
            inset 0 -2px 6px rgba(0, 0, 0, 0.10),
            inset 2px 2px 8px rgba(0, 0, 0, 0.08),
            inset -2px 2px 8px rgba(0, 0, 0, 0.07),
            inset 0 0 1px rgba(0, 0, 0, 0.15)
          `,
        x: pillShift,
        overflow: "hidden",
        transition: "box-shadow 0.3s ease-out, height 0.3s ease-out",
      }}
    >
      {/* Primary top edge ridge - ultra bright */}
      <div
        className="absolute inset-x-0 top-0 rounded-t-full pointer-events-none"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 5%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0.95) 95%, rgba(255, 255, 255, 0) 100%)",
          filter: "blur(0.3px)",
        }}
      />

      {/* Top hemisphere light catch */}
      <div
        className="absolute inset-x-0 top-0 rounded-full pointer-events-none"
        style={{
          height: "55%",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.10) 60%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* Directional light - top left */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.20) 20%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0) 65%)",
        }}
      />

      {/* Premium gloss reflection - main */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: expanded ? "18%" : "15%",
          top: "16%",
          width: expanded
            ? isMobile ? "70px" : "140px"
            : isMobile ? "35px" : "60px",
          height: isMobile ? "8px" : "14px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.35) 40%, rgba(255, 255, 255, 0.10) 70%, rgba(255, 255, 255, 0) 100%)",
          filter: "blur(4px)",
          transform: "rotate(-12deg)",
          transition: "all 0.3s ease",
        }}
      />

      {/* Secondary gloss accent - only show when expanded */}
      {expanded && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            right: "22%",
            top: "20%",
            width: isMobile ? "40px" : "80px",
            height: isMobile ? "6px" : "10px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)",
            filter: "blur(3px)",
            transform: "rotate(8deg)",
          }}
        />
      )}

      {/* Left edge illumination - only show when expanded */}
      {expanded && (
        <div
          className="absolute inset-y-0 left-0 rounded-l-full pointer-events-none"
          style={{
            width: "35%",
            background:
              "linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.10) 40%, rgba(255, 255, 255, 0.03) 70%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
      )}

      {/* Right edge shadow - only show when expanded */}
      {expanded && (
        <div
          className="absolute inset-y-0 right-0 rounded-r-full pointer-events-none"
          style={{
            width: "35%",
            background:
              "linear-gradient(270deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.02) 70%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      )}

      {/* Bottom curvature - deep shadow */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-full pointer-events-none"
        style={{
          height: "50%",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.08) 25%, rgba(0, 0, 0, 0.03) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Bottom edge contact shadow */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-full pointer-events-none"
        style={{
          height: "20%",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(2px)",
        }}
      />

      {/* Inner diffuse glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "inset 0 0 40px rgba(255, 255, 255, 0.22)",
          opacity: 0.7,
        }}
      />

      {/* Micro edge definition */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 0.5px rgba(0, 0, 0, 0.10)",
        }}
      />

      {/* Navigation items container */}
      <div
        className="relative z-10 h-full flex items-center justify-center px-2 sm:px-6"
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "SF Pro", Poppins, sans-serif',
        }}
      >
        {/* ─── COLLAPSED STATE ───────────────────────────────────────────────────
            Always renders the active label as text across all screen sizes,
            so the pill elegantly morphs closed into a readable text tag.       */}
        {!expanded && (
          <div className="flex items-center relative mix-blend-normal">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.span
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.35,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                  style={{
                    fontSize: isMobile ? "13px" : "15.5px",
                    fontWeight: 680,
                    color: "#1a1a1a",
                    letterSpacing: isMobile ? "0.2px" : "0.45px",
                    whiteSpace: "nowrap",
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", Poppins, sans-serif',
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                    textShadow: `
                      0 1px 0 rgba(0, 0, 0, 0.35),
                      0 -1px 0 rgba(255, 255, 255, 0.8),
                      1px 1px 0 rgba(0, 0, 0, 0.18),
                      -1px 1px 0 rgba(0, 0, 0, 0.15)
                    `,
                  }}
                >
                  {activeItem.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ─── EXPANDED STATE ────────────────────────────────────────────────────
            Mobile  (< 640px): renders Lucide icons — compact, no overflow risk.
            Desktop (≥ 640px): renders original full text labels.               */}
        {expanded && (
          <div className="flex items-center justify-evenly w-full gap-0.5 sm:gap-0">
            {navItems.map((item, index) => {
              const isActive = item.id === activeSection;
              const IconComponent = item.icon;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  onClick={() => handleSectionClick(item.id)}
                  className="relative cursor-pointer transition-all duration-200 rounded-full"
                  style={{
                    fontSize: isMobile ? "9px" : isActive ? "14.5px" : "14px",
                    fontWeight: isActive ? 680 : 510,
                    color: isActive ? "#1a1a1a" : "#656565",
                    textDecoration: "none",
                    letterSpacing: isMobile ? "0.01px" : "0.35px",
                    background: "transparent",
                    border: "none",
                    // Mobile: square touch target with equal padding; desktop: original
                    padding: isMobile ? "8px" : "10px 14px",
                    outline: "none",
                    whiteSpace: "nowrap",
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", Poppins, sans-serif',
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                    transform: isActive
                      ? "translateY(-1.5px)"
                      : "translateY(0)",
                    // Text shadow kept on desktop text; applied to icon wrapper on mobile too
                    // for a subtle depth effect consistent with the overall 3D treatment.
                    filter: isMobile
                      ? isActive
                        ? "drop-shadow(0 1px 0 rgba(0,0,0,0.30)) drop-shadow(0 -1px 0 rgba(255,255,255,0.75))"
                        : "drop-shadow(0 1px 0 rgba(0,0,0,0.18)) drop-shadow(0 -1px 0 rgba(255,255,255,0.55))"
                      : "none",
                    textShadow: !isMobile
                      ? isActive
                        ? `
                          0 1px 0 rgba(0, 0, 0, 0.35),
                          0 -1px 0 rgba(255, 255, 255, 0.8),
                          1px 1px 0 rgba(0, 0, 0, 0.18),
                          -1px 1px 0 rgba(0, 0, 0, 0.15)
                        `
                        : `
                          0 1px 0 rgba(0, 0, 0, 0.22),
                          0 -1px 0 rgba(255, 255, 255, 0.65),
                          1px 1px 0 rgba(0, 0, 0, 0.12),
                          -1px 1px 0 rgba(0, 0, 0, 0.10)
                        `
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#3a3a3a";
                      e.currentTarget.style.transform = "translateY(-0.5px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#656565";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {isMobile ? (
                    // ── MOBILE: Lucide icon ──────────────────────────────────
                    // strokeWidth increases when active to mirror the bold
                    // font-weight treatment used in desktop text mode.
                    <IconComponent
                      size={isActive ? 18 : 16}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      color={isActive ? "#1a1a1a" : "#656565"}
                      aria-label={item.label}
                    />
                  ) : (
                    // ── DESKTOP: original text label ─────────────────────────
                    item.label
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </motion.nav>
  );
};