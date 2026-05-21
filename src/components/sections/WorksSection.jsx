import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import BookshelfScene from "../bookshelf/BookshelfScene";
import "../../styles/bookshelf.scss";

// ─────────────────────────────────────────────────────────────────────────────
// WorksSection — Redesigned to match Design Synthesis brand identity
//
// Visual references from site:
//  · Soft pale-sage/off-white background (CSS only, no image)
//  · Deep forest green (#0D2B1E) primary color
//  · Glassmorphism pill/card elements
//  · Organic sketch-like decorative SVG lines
//  · Cormorant Garamond + DM Sans typography
//  · Premium minimal aesthetic
//
// Layout:
//  Desktop  → title top-center, shelf left, info right
//  Tablet   → title top-center, info above shelf (column-reverse)
//  Mobile   → fully stacked, title → description → shelf
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.80, ease } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.70, ease } },
};

const ruleVariant = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.85, delay: 0.18, ease } },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function WorksSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const [selectedProject, setSelectedProject] = useState(null);
  const handleBookSelect = useCallback((p) => setSelectedProject(p), []);

  return (
    <section
      className="works-section"
      id="works"
      aria-labelledby="works-heading"
    >
      {/* ── Decorative organic sketch lines (SVG — no image needed) ── */}
      <DecoLines />

      {/* ── Section Header ──────────────────────────────────────────── */}
      <header className="works-section__header" ref={headerRef}>
        <motion.span
          className="works-section__eyebrow"
          variants={fadeIn}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          Design Synthesis · Archive
        </motion.span>

        <motion.h2
          id="works-heading"
          className="works-section__title"
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
        >
          Our <em>Works</em>
        </motion.h2>

        <motion.div
          className="works-section__rule"
          variants={ruleVariant}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{ transformOrigin: "center" }}
        />

        <motion.p
          className="works-section__subtitle"
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.22 }}
        >
          A curated archive of architectural works, landscape studies,
          and interior investigations spanning a decade of practice.
        </motion.p>
      </header>

      {/* ── Body: shelf left + info right ───────────────────────────── */}
      <div className="works-section__body">
        <div className="works-section__shelf-col">
          <BookshelfScene onBookSelect={handleBookSelect} />
        </div>

        <aside
          className="works-section__info-col"
          aria-label="Archive information"
        >
          <InteractionHint />
          <StatBlock />
        </aside>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="works-section__footer" aria-hidden="true">
        <div className="works-section__footer-line" />
        <span className="works-section__footer-text">XII Projects · 2020–2023</span>
        <div className="works-section__footer-line" />
      </footer>

      {/* ── Project detail panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectPanel
            key="panel"
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Organic decorative sketch lines — matches reference image style ────────────
function DecoLines() {
  return (
    <div className="works-section__deco-lines" aria-hidden="true">
      <svg
        viewBox="0 0 420 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
      >
        {/* Organic curved lines echoing the reference image's sketch marks */}
        <path
          d="M420 280 C360 260, 300 290, 260 270 C220 250, 200 230, 160 240 C120 250, 90 240, 40 260"
          stroke="#1B4835" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"
        />
        <path
          d="M420 300 C370 285, 320 310, 275 295 C230 280, 210 265, 170 275 C130 285, 100 270, 50 290"
          stroke="#1B4835" strokeWidth="0.5" strokeLinecap="round" opacity="0.22"
        />
        <path
          d="M380 310 C340 295, 295 316, 250 305 C205 294, 185 278, 145 290"
          stroke="#2D7356" strokeWidth="0.4" strokeLinecap="round" opacity="0.18"
        />
        {/* Dashed small arc — like the reference's curved sketch dashes */}
        <path
          d="M300 268 C310 260, 325 265, 330 275"
          stroke="#1B4835" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="2 4" opacity="0.30"
        />
        <path
          d="M350 290 C362 280, 378 286, 382 298"
          stroke="#1B4835" strokeWidth="0.5" strokeLinecap="round" strokeDasharray="1.5 3.5" opacity="0.25"
        />
        {/* Small accent dots */}
        <circle cx="180" cy="270" r="1.5" fill="#2D7356" opacity="0.28" />
        <circle cx="220" cy="258" r="1"   fill="#2D7356" opacity="0.22" />
        <circle cx="310" cy="280" r="1.2" fill="#1B4835" opacity="0.24" />
      </svg>
    </div>
  );
}

// ── Interaction hint — glassmorphism card ──────────────────────────────────────
function InteractionHint() {
  return (
    <div className="info-hint">
      <div className="info-hint__icon" aria-hidden="true">
        {/* Finger-tap icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9 5.5v4M9 11.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="info-hint__lead">Hover or tap a book to explore</p>
        <p className="info-hint__body">
          Each spine represents a completed project. Select one to reveal its
          category, year, and key details.
        </p>
      </div>
    </div>
  );
}

// ── Stats block ───────────────────────────────────────────────────────────────
function StatBlock() {
  const stats = [
    { number: "12",  label: "Years of Practice"   },
    { number: "84+", label: "Completed Projects"   },
    { number: "3",   label: "Archive Collections"  },
  ];

  return (
    <div className="info-stats">
      {stats.map(({ number, label }) => (
        <div className="info-stat" key={label}>
          <span className="info-stat__number">{number}</span>
          <span className="info-stat__label">{label}</span>
        </div>
      ))}

      <blockquote className="info-quote">
        Every space is a story waiting to be told through light, form, and silence.
      </blockquote>
    </div>
  );
}

// ── Selected project panel — glass card ──────────────────────────────────────
function ProjectPanel({ project, onClose }) {
  return (
    <motion.div
      className="project-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      role="dialog"
      aria-label={`Project: ${project.title}`}
    >
      <button
        className="project-panel__close"
        onClick={onClose}
        aria-label="Close project detail"
      >
        ×
      </button>
      <span className="project-panel__category">{project.category}</span>
      <h3 className="project-panel__title">{project.title}</h3>
      {project.subtitle && (
        <p className="project-panel__subtitle">{project.subtitle}</p>
      )}
      <div className="project-panel__meta">
        <span>{project.year}</span>
        {project.location && <span>{project.location}</span>}
      </div>
    </motion.div>
  );
}