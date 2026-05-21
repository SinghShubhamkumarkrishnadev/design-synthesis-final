import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";
import Book from "./Book";
import ShelfShadow from "./ShelfShadow";

// ─────────────────────────────────────────────────────────────────────────────
// Shelf
// A single horizontal shelf row: back wall → books → plank → shadow.
// Desktop: full cinematic 3D shelf with stagger animation.
// Tablet: same structure, reduced spacing and perspective.
// Mobile: horizontal scroll archive row with simplified plank.
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const bookEnterVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Mobile: fade in without vertical movement (already flat layout)
const bookEnterVariantsMobile = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ── Breakpoint detection ───────────────────────────────────────────────────────
function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

// ── Shelf Decorative Bookend (desktop + tablet only) ─────────────────────────
function Bookend({ side = "left" }) {
  return (
    <div
      className={clsx("bookend", `bookend--${side}`)}
      aria-hidden="true"
      style={{
        width: "14px",
        flexShrink: 0,
        alignSelf: "stretch",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          width: "14px",
          height: "68px",
          background:
            side === "left"
              ? "linear-gradient(to right, #1A1208, #2C1E0E)"
              : "linear-gradient(to left, #1A1208, #2C1E0E)",
          boxShadow:
            side === "left"
              ? "inset -1px 0 2px rgba(255,255,255,0.04), 2px 0 6px rgba(0,0,0,0.5)"
              : "inset 1px 0 2px rgba(255,255,255,0.04), -2px 0 6px rgba(0,0,0,0.5)",
          borderRadius: side === "left" ? "1px 0 0 1px" : "0 1px 1px 0",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -3,
            left: side === "left" ? 0 : "auto",
            right: side === "right" ? 0 : "auto",
            width: "22px",
            height: "5px",
            background: "#1A1208",
            borderRadius: "1px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function Shelf({ projects = [], shelfIndex = 0, onBookClick }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const isMobile = getIsMobile();

  if (!projects.length) return null;

  // Mobile: shelf label shows which "archive" row this is
  const shelfLabels = ["Archive I", "Archive II", "Archive III"];
  const shelfLabel = shelfLabels[shelfIndex] || `Archive ${shelfIndex + 1}`;

  return (
    <div
      ref={ref}
      className={clsx("shelf-row", `shelf-row--${shelfIndex}`)}
      data-shelf={shelfIndex}
    >
      {/* Mobile: shelf label header */}
      {isMobile && (
        <div
          aria-hidden="true"
          style={{
            padding: "1.5rem 1.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-spine)",
              fontSize: "0.6rem",
              fontWeight: 400,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--bs-text-accent)",
              opacity: 0.65,
              flexShrink: 0,
            }}
          >
            {shelfLabel}
          </span>
          <span
            style={{
              flex: 1,
              height: "1px",
              background: "linear-gradient(to right, rgba(176,130,70,0.2), transparent)",
            }}
          />
        </div>
      )}

      {/* Top inner shadow (desktop/tablet only) */}
      {!isMobile && (
        <div className="shelf-inner-shadow" aria-hidden="true" />
      )}

      {/* Books Container */}
      <motion.div
        className="shelf-books"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Left bookend — desktop/tablet only */}
        {!isMobile && <Bookend side="left" />}

        {/* Book entries */}
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={isMobile ? bookEnterVariantsMobile : bookEnterVariants}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Book project={project} onClick={onBookClick} />
          </motion.div>
        ))}

        {/* Right bookend — desktop/tablet only */}
        {!isMobile && <Bookend side="right" />}
      </motion.div>

      {/* Shelf Plank */}
      <div className="shelf-plank" role="presentation" />

      {/* Shadow — desktop/tablet only */}
      {!isMobile && (
        <div className="shelf-shadow-below" aria-hidden="true">
          <ShelfShadow intensity={shelfIndex === 0 ? 1 : 0.75} />
        </div>
      )}
    </div>
  );
}

export default Shelf;