import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";
import Book from "./Book";
import ShelfShadow from "./ShelfShadow";

// ─────────────────────────────────────────────────────────────────────────────
// Shelf — Phase 1 Update
//
// Changes from original:
//  · Accepts `selectedProject` prop
//  · Passes `isSelected={project.id === selectedProject?.id}` to each Book
//  · All layout, animation, responsive behavior unchanged
// ─────────────────────────────────────────────────────────────────────────────

const SHELF_LABELS = ["Archive I", "Archive II", "Archive III"];
const EASE = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const bookEnterDesktop = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const bookEnterMobile = {
  hidden:  { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.48, ease: EASE } },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

// ── Bookend (unchanged) ───────────────────────────────────────────────────────
function Bookend({ side = "left" }) {
  return (
    <div className={clsx("bookend", `bookend--${side}`)} aria-hidden="true">
      <div className="bookend__block">
        <div className="bookend__foot" />
      </div>
    </div>
  );
}

// ── Shelf ─────────────────────────────────────────────────────────────────────
export default function Shelf({
  projects = [],
  shelfIndex = 0,
  onBookClick,
  selectedProject = null,
}) {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  if (!projects.length) return null;

  const label = SHELF_LABELS[shelfIndex] ?? `Archive ${shelfIndex + 1}`;
  const bookVariants = isMobile ? bookEnterMobile : bookEnterDesktop;
  const shadowIntensity = shelfIndex === 0 ? 1 : 0.65;

  return (
    <div
      ref={ref}
      className={clsx("shelf-row", `shelf-row--${shelfIndex}`)}
      data-shelf={shelfIndex}
    >
      {isMobile && (
        <div className="shelf-label-mobile" aria-hidden="true">
          <span className="shelf-label__text">{label}</span>
          <span className="shelf-label__line" />
        </div>
      )}

      {!isMobile && <div className="shelf-inner-shadow" aria-hidden="true" />}

      <motion.div
        className="shelf-books"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        aria-label={`${label} — ${projects.length} project${projects.length !== 1 ? "s" : ""}`}
      >
        {!isMobile && <Bookend side="left" />}

        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={bookVariants}
            style={{ display: "flex", alignItems: "flex-end", flexShrink: 0 }}
          >
            <Book
              project={project}
              onClick={onBookClick}
              isSelected={selectedProject?.id === project.id}
            />
          </motion.div>
        ))}

        {!isMobile && <Bookend side="right" />}
      </motion.div>

      <div className="shelf-plank" role="presentation" />

      {!isMobile && (
        <div className="shelf-shadow-below" aria-hidden="true">
          <ShelfShadow intensity={shadowIntensity} />
        </div>
      )}
    </div>
  );
}