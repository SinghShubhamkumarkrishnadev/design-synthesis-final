import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// ─────────────────────────────────────────────────────────────────────────────
// Book — Redesigned
//
// Key fixes:
// · Hover label now shows as a white elevated card with clear text
// · Mobile: tap activates isActive state (no broken hover)
// · Proper touch cancel/end cleanup
// · Breakpoint hook is now reactive (matchMedia listener)
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1];

// Reactive breakpoint hook
function useBreakpoint() {
  const getState = () => {
    if (typeof window === "undefined") return { isMobile: false, isTablet: false };
    return {
      isMobile: window.matchMedia("(max-width: 640px)").matches,
      isTablet: window.matchMedia("(min-width: 641px) and (max-width: 900px)").matches,
    };
  };

  const [state, setState] = useState(getState);

  useEffect(() => {
    const mqlMobile = window.matchMedia("(max-width: 640px)");
    const mqlTablet = window.matchMedia("(min-width: 641px) and (max-width: 900px)");
    const update = () => setState(getState());
    mqlMobile.addEventListener("change", update);
    mqlTablet.addEventListener("change", update);
    return () => {
      mqlMobile.removeEventListener("change", update);
      mqlTablet.removeEventListener("change", update);
    };
  }, []);

  return state;
}

// ── Motion config ─────────────────────────────────────────────────────────────
const liftVariants = {
  desktop: {
    rest:  { y: 0,   transition: { duration: 0.55, ease } },
    hover: { y: -16, transition: { duration: 0.40, ease } },
  },
  tablet: {
    rest:  { y: 0,  transition: { duration: 0.45, ease } },
    hover: { y: -10, transition: { duration: 0.35, ease } },
  },
  mobile: {
    rest:  { y: 0,  transition: { duration: 0.3, ease } },
    hover: { y: -6, transition: { duration: 0.25, ease } },
  },
};

const shadowVariants = {
  desktop: {
    rest:  { scaleX: 1,    opacity: 0.22, y: 0, transition: { duration: 0.55, ease } },
    hover: { scaleX: 1.35, opacity: 0.40, y: 4, transition: { duration: 0.40, ease } },
  },
  tablet: {
    rest:  { scaleX: 1,    opacity: 0.18, y: 0, transition: { duration: 0.45, ease } },
    hover: { scaleX: 1.20, opacity: 0.34, y: 2, transition: { duration: 0.35, ease } },
  },
  mobile: {
    rest:  { scaleX: 1,    opacity: 0.16, y: 0, transition: { duration: 0.3, ease } },
    hover: { scaleX: 1.15, opacity: 0.30, y: 2, transition: { duration: 0.25, ease } },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Book({ project, onClick }) {
  const [isActive, setIsActive] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const tier = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  const {
    title, category, year,
    spineColor, spineGradient, textColor, accentColor, pageColor,
    height, thickness,
  } = project;

  // Responsive dimensions
  const scaledHeight = isTablet
    ? Math.round(height * 0.82)
    : isMobile
    ? Math.min(height, 155)
    : height;

  const scaledWidth = isTablet
    ? Math.round(thickness * 0.82)
    : isMobile
    ? Math.max(Math.round(thickness * 0.78), 26)
    : thickness;

  const cssVars = {
    "--book-color":    spineColor,
    "--book-gradient": spineGradient,
    "--book-text":     textColor,
    "--book-accent":   accentColor,
    "--book-page":     pageColor,
    "--book-h":        `${scaledHeight}px`,
    "--book-w":        `${scaledWidth}px`,
  };

  // Desktop/tablet: use framer-motion hover events
  // Mobile: use touch events to toggle isActive
  const motionProps = isMobile
    ? {}
    : {
        onHoverStart: () => setIsActive(true),
        onHoverEnd:   () => setIsActive(false),
      };

  const touchProps = isMobile
    ? {
        onTouchStart:  () => setIsActive(true),
        onTouchEnd:    () => setTimeout(() => setIsActive(false), 600),
        onTouchCancel: () => setIsActive(false),
      }
    : {};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(project);
    }
  };

  return (
    <motion.div
      className={clsx("book", isMobile && "book--mobile", isTablet && "book--tablet")}
      style={cssVars}
      initial="rest"
      animate={isActive ? "hover" : "rest"}
      onClick={() => onClick?.(project)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${category}, ${year}`}
      onKeyDown={handleKeyDown}
      {...motionProps}
      {...touchProps}
    >
      {/* ── Hover/active label card — white elevated card ─────────── */}
      <motion.div
        className="book__label"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={
          isActive
            ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease } }
            : { opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }
        }
        aria-hidden="true"
      >
        <span className="book__label-title">{title}</span>
        <span className="book__label-divider" />
        <span className="book__label-meta">{category} · {year}</span>
      </motion.div>

      {/* ── Lift animation wrapper ───────────────────────────────── */}
      <motion.div className="book__wrapper" variants={liftVariants[tier]}>
        {/* Top surface — desktop/tablet 3-D illusion */}
        {!isMobile && <div className="book__top" aria-hidden="true" />}

        {/* Main spine */}
        <div className="book__spine" aria-hidden="true">
          <div className="book__binding book__binding--top" />
          <div className="book__binding book__binding--bottom" />
          <div className="book__grain" />

          <div className="book__content">
            <div className="book__text-track">
              <span className="book__title-text">{title}</span>
              <span className="book__divider" />
              <span className="book__year-text">{year}</span>
            </div>
          </div>

          <div className="book__publisher" aria-hidden="true">
            Design Synthesis
          </div>
        </div>

        {/* Page edges */}
        <div className="book__pages" aria-hidden="true" />
      </motion.div>

      {/* Floor shadow */}
      <motion.div
        className="book__floor-shadow"
        variants={shadowVariants[tier]}
        aria-hidden="true"
      />
    </motion.div>
  );
}