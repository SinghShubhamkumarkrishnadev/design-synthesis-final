import { useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// ─────────────────────────────────────────────────────────────────────────────
// Book
// A single physical book rendered as a realistic 3D-ish spine.
// Desktop/Tablet: hover lift with Framer Motion.
// Mobile: reduced transforms, touch-friendly sizing, no hover label.
// ─────────────────────────────────────────────────────────────────────────────

// ── Breakpoint detection hook ─────────────────────────────────────────────────
function useIsMobile() {
  // SSR-safe: check at render time
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

function useIsTablet() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 641px) and (max-width: 900px)").matches;
}

// ── Framer Motion variants — desktop (full cinematic) ─────────────────────────
const bookVariantsDesktop = {
  rest: {
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    y: -13,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── Framer Motion variants — tablet (subtler lift) ────────────────────────────
const bookVariantsTablet = {
  rest: {
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    y: -8,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── Framer Motion variants — mobile (no lift, minimal motion) ─────────────────
const bookVariantsMobile = {
  rest: { y: 0 },
  hover: { y: 0 },
};

const shadowVariants = {
  rest: {
    scaleX: 1,
    y: 0,
    opacity: 0.38,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    scaleX: 1.3,
    y: 3,
    opacity: 0.6,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const shadowVariantsMobile = {
  rest: { scaleX: 1, y: 0, opacity: 0.25 },
  hover: { scaleX: 1, y: 0, opacity: 0.25 },
};

const labelVariants = {
  rest: { opacity: 0, y: 4, transition: { duration: 0.25 } },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
function Book({ project, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const bookRef = useRef(null);

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const {
    title,
    subtitle,
    category,
    year,
    location,
    spineColor,
    spineGradient,
    textColor,
    accentColor,
    pageColor,
    height,
    thickness,
  } = project;

  // Scale factors for responsive sizing
  const tabletScale = 0.82;
  const mobileHeightScale = 1; // height/width set via CSS vars in SCSS for mobile

  const cssVars = {
    "--book-color":    spineColor,
    "--book-gradient": spineGradient,
    "--book-text":     textColor,
    "--book-accent":   accentColor,
    "--book-page":     pageColor,
    // On tablet: scale book dimensions in JS to ensure proper sizing
    "--book-h": isTablet
      ? `${Math.round(height * tabletScale)}px`
      : isMobile
      ? `${Math.min(height, 170)}px`
      : `${height}px`,
    "--book-w": isTablet
      ? `${Math.round(thickness * tabletScale)}px`
      : isMobile
      ? `${Math.max(Math.round(thickness * 0.78), 30)}px`
      : `${thickness}px`,
  };

  // Select appropriate variants
  const bookVariants = isMobile
    ? bookVariantsMobile
    : isTablet
    ? bookVariantsTablet
    : bookVariantsDesktop;

  const activeShadowVariants = isMobile ? shadowVariantsMobile : shadowVariants;

  // On mobile: no hover interaction — tap is king
  const interactionProps = isMobile
    ? {
        onTouchStart: () => setIsHovered(true),
        onTouchEnd: () => setIsHovered(false),
      }
    : {
        onHoverStart: () => setIsHovered(true),
        onHoverEnd: () => setIsHovered(false),
      };

  return (
    <motion.div
      ref={bookRef}
      className={clsx(
        "book",
        isHovered && "book--hovered",
        isMobile && "book--mobile",
        isTablet && "book--tablet"
      )}
      style={cssVars}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      {...interactionProps}
      onClick={() => onClick?.(project)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${category}, ${year}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(project);
      }}
    >
      {/* ── Hover Label (desktop/tablet only) ────────────────────────── */}
      {!isMobile && (
        <motion.div
          className="book__label"
          variants={labelVariants}
          aria-hidden="true"
        >
          <span className="book__label-title">{title}</span>
          <span className="book__label-meta">
            {category} · {location}
          </span>
        </motion.div>
      )}

      {/* ── Book Wrapper ───────────────────────────────────────────────── */}
      <motion.div className="book__wrapper" variants={bookVariants}>

        {/* Top surface — only on desktop/tablet */}
        {!isMobile && (
          <div className="book__top" aria-hidden="true" />
        )}

        {/* Main Spine */}
        <div className="book__spine" aria-hidden="true">

          <div className="book__binding book__binding--top" />
          <div className="book__binding book__binding--bottom" />

          <div className="book__grain" />

          <div className="book__content">
            <div className="book__text-track">
              <span className="book__title-text">{title}</span>
              <span className="book__divider" aria-hidden="true" />
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

      {/* ── Floor shadow ───────────────────────────────────────────────── */}
      <motion.div
        className="book__floor-shadow"
        variants={activeShadowVariants}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default Book;