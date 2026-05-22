import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// ─────────────────────────────────────────────────────────────────────────────
// Book — Phase 1 Update
//
// Changes from original:
//  · Added layoutId={`book-${project.id}`} on the spine wrapper
//  · Added `isSelected` prop for extraction state awareness
//  · When isSelected: suppress hover state, reduce opacity for "ghost"
//  · Preserved all existing hover/touch/keyboard interactions
//  · Preserved all variants and responsive breakpoints
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1];

// Reactive breakpoint hook (unchanged from original)
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

// ── Motion config (unchanged) ─────────────────────────────────────────────────
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
export default function Book({ project, onClick, isSelected = false }) {
  const [isActive, setIsActive] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const tier = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  const {
    id,
    title, category, year,
    spineColor, spineGradient, textColor, accentColor, pageColor,
    height, thickness,
  } = project;

  // When this book is selected/extracted, suppress its hover interaction
  const effectiveActive = isSelected ? false : isActive;

  // Responsive dimensions (unchanged)
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

  // Desktop/tablet: framer-motion hover events (unchanged)
  const motionProps = isMobile
    ? {}
    : {
        onHoverStart: () => !isSelected && setIsActive(true),
        onHoverEnd:   () => setIsActive(false),
      };

  const touchProps = isMobile
    ? {
        onTouchStart:  () => !isSelected && setIsActive(true),
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
      className={clsx(
        "book",
        isMobile && "book--mobile",
        isTablet && "book--tablet",
        isSelected && "book--selected"
      )}
      style={cssVars}
      initial="rest"
      animate={effectiveActive ? "hover" : "rest"}
      onClick={() => !isSelected && onClick?.(project)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${category}, ${year}`}
      aria-pressed={isSelected}
      onKeyDown={handleKeyDown}
      {...motionProps}
      {...touchProps}
    >
      {/* ── Hover/active label card ──────────────────────────────────── */}
      <motion.div
        className="book__label"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={
          effectiveActive
            ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease } }
            : { opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }
        }
        aria-hidden="true"
      >
        <span className="book__label-title">{title}</span>
        <span className="book__label-divider" />
        <span className="book__label-meta">{category} · {year}</span>
      </motion.div>

      {/* ── Lift animation wrapper ───────────────────────────────────── */}
      <motion.div
        className="book__wrapper"
        variants={liftVariants[tier]}
        // When selected: ghost the shelf copy subtly so user knows it's "gone"
        animate={isSelected ? { opacity: 0.28, y: 0 } : effectiveActive ? "hover" : "rest"}
        transition={isSelected ? { duration: 0.45, ease } : undefined}
      >
        {/* Top surface 3-D — desktop/tablet */}
        {!isMobile && <div className="book__top" aria-hidden="true" />}

        {/* ── Main spine — THIS is the shared layout anchor ─────────────
            layoutId connects this to the extracted book in BookExperience.
            Framer Motion will animate between these two positions.
        ──────────────────────────────────────────────────────────────── */}
        <motion.div
          layoutId={`book-${id}`}
          className="book__spine"
          aria-hidden="true"
          layout
          transition={{
            layout: { duration: 0.72, ease: [0.32, 0.08, 0.16, 1.0] },
          }}
          style={{
            // Preserve spine's intrinsic CSS variable sizing when on shelf
            width: "var(--book-w, 30px)",
            height: "var(--book-h, 100px)",
            background: spineGradient
              ? `${spineGradient}, ${spineColor}`
              : spineColor,
          }}
        >
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
        </motion.div>

        {/* Page edges */}
        <div className="book__pages" aria-hidden="true" />
      </motion.div>

      {/* Floor shadow */}
      <motion.div
        className="book__floor-shadow"
        variants={shadowVariants[tier]}
        animate={isSelected ? { opacity: 0, scaleX: 1 } : effectiveActive ? "hover" : "rest"}
        aria-hidden="true"
      />
    </motion.div>
  );
}