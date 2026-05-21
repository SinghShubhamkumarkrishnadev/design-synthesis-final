import { useRef, useCallback, useState } from "react";
import { motion, useInView } from "framer-motion";
import BookshelfScene from "../bookshelf/BookshelfScene";
import "../../styles/bookshelf.scss";

// ─────────────────────────────────────────────────────────────────────────────
// WorksSection
// Top-level section component for the "Our Works" archive.
// Handles: section header, bookshelf scene, footer detail strip.
// Responsive: header padding, subtitle length, footer spacing adapt per breakpoint.
// ─────────────────────────────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const eyebrowVariants = {
  hidden: { opacity: 0, letterSpacing: "0.55em" },
  visible: {
    opacity: 0.8,
    letterSpacing: "0.32em",
    transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const ruleVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 0.6,
    transition: { duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
function WorksSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-60px" });

  const [selectedProject, setSelectedProject] = useState(null);

  const handleBookSelect = useCallback((project) => {
    setSelectedProject(project);
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.info("[WorksSection] Book selected:", project.title);
    }
  }, []);

  return (
    <section
      className="works-section"
      id="works"
      aria-labelledby="works-heading"
    >
      {/* ── Section Header ────────────────────────────────────────────── */}
      <header className="works-section__header" ref={headerRef}>
        <motion.span
          className="works-section__eyebrow"
          variants={eyebrowVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          Design Synthesis · Archive
        </motion.span>

        <motion.h2
          id="works-heading"
          className="works-section__title"
          variants={headerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{ transitionDelay: "0.1s" }}
        >
          Our <em>Works</em>
        </motion.h2>

        <motion.div
          className="works-section__rule"
          variants={ruleVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{ transformOrigin: "center" }}
        />

        <motion.p
          className="works-section__subtitle"
          variants={headerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{ transitionDelay: "0.25s" }}
        >
          A curated archive of architectural works, landscape studies,
          and interior investigations.
        </motion.p>
      </header>

      {/* ── Bookshelf Scene ──────────────────────────────────────────── */}
      <BookshelfScene onBookSelect={handleBookSelect} />

      {/* ── Section Footer ────────────────────────────────────────────── */}
      <footer className="works-section__footer" aria-hidden="true">
        <div className="works-section__footer-line" />
        <span className="works-section__footer-text">
          XII Projects · 2020–2023
        </span>
        <div className="works-section__footer-line" />
      </footer>
    </section>
  );
}

export default WorksSection;