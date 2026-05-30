import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import BookshelfScene from "../bookshelf/BookshelfScene";
import BookExperience from "../bookshelf/BookExperience";
import "../../styles/bookshelf.scss";

const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
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

const FEATURED = [
  { id: "fp1", index: "01", title: "Residenza Silente",  category: "Residential · Milan",   year: "2023" },
  { id: "fp2", index: "02", title: "Maison Brûlée",      category: "Cultural · Lyon",        year: "2022" },
  { id: "fp3", index: "03", title: "Harbour Terminus",   category: "Public · Porto",         year: "2022" },
  { id: "fp4", index: "04", title: "Garden of Absence",  category: "Landscape · Kyoto",      year: "2021" },
];

export default function WorksSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredCard, setHoveredCard]         = useState(null);

  const handleBookSelect = useCallback((p) => setSelectedProject(p), []);
  const handleClose      = useCallback(() => setSelectedProject(null), []);

  return (
    <section className="works-section" id="works" aria-labelledby="works-heading">
      <StyleBlock />

      {/* ── Centered Header ───────────────────────────────────────────── */}
      <header className="ws-header" ref={headerRef}>
        <motion.span
          className="ws-eyebrow"
          variants={fadeIn} initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <span className="ws-eyebrow__rule" />
          Design Synthesis · Archive
          <span className="ws-eyebrow__rule" />
        </motion.span>

        <motion.h2
          id="works-heading" className="ws-title"
          variants={fadeUp} initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
        >
          Our <em>Works</em>
        </motion.h2>

        <motion.div
          className="ws-rule"
          variants={ruleVariant} initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{ transformOrigin: "center" }}
        />

        <motion.p
          className="ws-subtitle"
          variants={fadeUp} initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.22 }}
        >
          A curated archive of architectural works, landscape studies,
          and interior investigations spanning a decade of practice.
        </motion.p>
      </header>

      {/* ── Body: Shelf left · Info right ─────────────────────────────── */}
      <div className="ws-body">
        <div className="ws-shelf-col">
          <BookshelfScene
            onBookSelect={handleBookSelect}
            selectedProject={selectedProject}
          />
        </div>

        <aside className="ws-info-col" aria-label="Archive information">
          <StatBlock />
          <MiniPreviewStack
            featured={FEATURED}
            hovered={hoveredCard}
            setHovered={setHoveredCard}
          />
        </aside>
      </div>

      {/* ── Footer: line · text · line ─────────────────────────────────── */}
      <footer
        aria-hidden="true"
        style={{
          display   : "flex",
          alignItems: "center",
          gap       : "1.1rem",
          padding   : `1.5rem clamp(1.25rem,6vw,6rem) 3rem`,
          position  : "relative",
          zIndex    : 1,
          boxSizing : "border-box",
          width     : "100%",
        }}
      >
        <div
          style={{
            flex      : 1,
            height    : "1px",
            background: "linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
          }}
        />
        <span
          style={{
            fontFamily   : "'DM Sans', system-ui, sans-serif",
            fontSize     : "0.54rem",
            fontWeight   : 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color        : "rgba(13,43,30,0.35)",
            whiteSpace   : "nowrap",
          }}
        >
          XII Projects · 2020–2023
        </span>
        <div
          style={{
            flex      : 1,
            height    : "1px",
            background: "linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
          }}
        />
      </footer>

      {/* ── Book Experience overlay (React Portal) ────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <BookExperience
            key={`experience-${selectedProject.id}`}
            project={selectedProject}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Stats Block ───────────────────────────────────────────────────────────────
function StatBlock() {
  const stats = [
    { number: "12",  label: "Years of Practice"  },
    { number: "84+", label: "Completed Projects"  },
    { number: "3",   label: "Archive Collections" },
  ];
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref} className="ws-stats"
      initial="hidden" animate={inView ? "visible" : "hidden"}
    >
      <div className="ws-stats__row">
        {stats.map(({ number, label }, i) => (
          <motion.div key={label} className="ws-stat" variants={fadeUp} transition={{ delay: i * 0.10 }}>
            <span className="ws-stat__number">{number}</span>
            <span className="ws-stat__label">{label}</span>
          </motion.div>
        ))}
      </div>
      <motion.blockquote className="ws-quote" variants={fadeIn} transition={{ delay: 0.35 }}>
        Every space is a story waiting to be told through light, form, and silence.
      </motion.blockquote>
    </motion.div>
  );
}

// ── Mini Preview List ─────────────────────────────────────────────────────────
function MiniPreviewStack({ featured, hovered, setHovered }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref} className="ws-mini-stack"
      initial="hidden" animate={inView ? "visible" : "hidden"}
    >
      <motion.p className="ws-mini-stack__label" variants={fadeIn} transition={{ delay: 0.1 }}>
        Featured works
      </motion.p>

      {featured.map((p, i) => (
        <motion.div
          key={p.id}
          className={`ws-mini-row${hovered === p.id ? " ws-mini-row--active" : ""}`}
          variants={fadeUp} transition={{ delay: 0.15 + i * 0.08 }}
          onMouseEnter={() => setHovered(p.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="ws-mini-row__index">{p.index}</span>
          <div className="ws-mini-row__info">
            <span className="ws-mini-row__title">{p.title}</span>
            <span className="ws-mini-row__cat">{p.category}</span>
          </div>
          <span className="ws-mini-row__year">{p.year}</span>

          <motion.div
            className="ws-mini-row__bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: hovered === p.id ? 1 : 0 }}
            transition={{ duration: 0.32, ease }}
            style={{ originX: 0 }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}


// ── All styles ────────────────────────────────────────────────────────────────
function StyleBlock() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;700;800&display=swap');

      .works-section {
        --c-bg:     #EEF1EE;
        --c-deep:   #0D2B1E;
        --c-forest: #2D7356;
        --c-sage:   #1B4835;
        --c-muted:  rgba(13,43,30,0.52);
        --c-border: rgba(45,115,86,0.13);
        --serif:    'Cormorant Garamond', Georgia, serif;
        --sans:     'DM Sans', system-ui, sans-serif;

        position: relative !important;
        width: 100% !important;
        overflow-x: hidden !important;
        background-color: var(--c-bg) !important;
        background-image:
          radial-gradient(ellipse 80% 50% at 50% -8%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.45) 40%, transparent 70%),
          radial-gradient(ellipse 55% 70% at 100% 40%, rgba(45,115,86,0.04) 0%, transparent 60%),
          linear-gradient(180deg,#F4F6F4 0%,#EEF1EE 35%,#E8ECE8 70%,#E3E8E4 100%) !important;
        box-sizing: border-box !important;
      }

      .works-section .ws-deco {
        position: absolute; bottom: 0; right: 0;
        width: 55%; max-width: 420px;
        pointer-events: none; z-index: 0; opacity: 0.5;
      }

      .works-section .ws-header {
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        padding: clamp(3rem,6vw,6rem) clamp(1.25rem,6vw,6rem) clamp(2rem,4vw,3.5rem) !important;
        position: relative; z-index: 1;
        width: 100%; box-sizing: border-box;
      }
      .works-section .ws-eyebrow {
        display: inline-flex !important; align-items: center; gap: .6rem;
        font-family: var(--sans) !important;
        font-size: clamp(.56rem,.85vw,.68rem) !important;
        font-weight: 400 !important; letter-spacing: .30em !important;
        text-transform: uppercase !important;
        color: var(--c-forest) !important; opacity: .85;
        margin-bottom: .6rem;
      }
      .works-section .ws-eyebrow__rule {
        display: block; width: 26px; height: 1px;
        background: var(--c-forest); opacity: .45;
      }
      .works-section .ws-title {
        font-family: var(--serif) !important; font-weight: 300 !important;
        line-height: 1.08 !important;
        font-size: clamp(2.6rem,6vw,4.2rem) !important;
        color: var(--c-deep) !important;
        margin: 0 0 .3rem !important; letter-spacing: .01em !important;
        text-align: center !important;
      }
      .works-section .ws-title em { font-style: italic; color: var(--c-forest); font-weight: 400; }
      .works-section .ws-rule {
        width: 52px !important; height: 1px !important;
        margin: .5rem auto .9rem !important;
        background: linear-gradient(to right, transparent, var(--c-forest), transparent) !important;
        opacity: .45;
      }
      .works-section .ws-subtitle {
        font-family: var(--serif) !important; font-style: italic !important;
        font-size: clamp(.82rem,1.3vw,.98rem) !important; font-weight: 300 !important;
        color: var(--c-muted) !important; line-height: 1.82 !important;
        max-width: 520px; margin: 0 auto !important;
        text-align: center !important;
      }

      .works-section .ws-body {
        display: flex !important;
        flex-direction: column !important;
        gap: 2.5rem;
        padding: 0 clamp(1.25rem,4vw,4rem);
        position: relative; z-index: 1;
        max-width: 1440px; margin: 0 auto;
        box-sizing: border-box;
      }
      @media (min-width: 1024px) {
        .works-section .ws-body {
          display: grid !important;
          grid-template-columns: 55fr 45fr !important;
          gap: 3.5rem !important;
          align-items: start !important;
        }
      }

      .works-section .ws-shelf-col { width: 100%; }

      .works-section .ws-info-col {
        display: flex !important; flex-direction: column !important;
        gap: 2.5rem; padding-top: .5rem;
      }

      .works-section .ws-stats { display: flex; flex-direction: column; gap: 1.2rem; }
      .works-section .ws-stats__row {
        display: flex; gap: clamp(1.2rem,4vw,2.5rem); flex-wrap: wrap;
      }
      .works-section .ws-stat { display: flex; flex-direction: column; gap: .2rem; }
      .works-section .ws-stat__number {
        font-family: var(--serif); font-weight: 300;
        font-size: clamp(1.9rem,4vw,2.8rem); color: var(--c-deep); line-height: 1;
      }
      .works-section .ws-stat__label {
        font-family: var(--sans);
        font-size: clamp(.52rem,.75vw,.62rem);
        font-weight: 400; letter-spacing: .22em; text-transform: uppercase;
        color: var(--c-muted);
      }
      .works-section .ws-quote {
        font-family: var(--serif); font-style: italic; font-weight: 300;
        font-size: clamp(.80rem,1.2vw,.92rem); color: var(--c-muted);
        line-height: 1.80; margin: 0; padding-left: 1rem;
        border-left: 1.5px solid rgba(45,115,86,0.28);
        max-width: 300px;
      }

      .works-section .ws-mini-stack { display: flex; flex-direction: column; gap: .5rem; }
      .works-section .ws-mini-stack__label {
        font-family: var(--sans); font-size: .58rem; font-weight: 400;
        letter-spacing: .22em; text-transform: uppercase;
        color: var(--c-forest); opacity: .75; margin-bottom: .3rem;
      }
      .works-section .ws-mini-row {
        position: relative;
        display: flex !important; align-items: center; gap: .9rem;
        padding: .65rem .5rem; cursor: pointer; overflow: hidden;
        border-bottom: 1px solid var(--c-border);
        transition: background .25s ease;
      }
      .works-section .ws-mini-row:hover,
      .works-section .ws-mini-row--active { background: rgba(45,115,86,0.05); }
      .works-section .ws-mini-row__index {
        font-family: var(--serif); font-size: .75rem; font-weight: 300;
        color: var(--c-forest); opacity: .6; min-width: 22px;
      }
      .works-section .ws-mini-row__info {
        flex: 1; display: flex; flex-direction: column; gap: .1rem;
      }
      .works-section .ws-mini-row__title {
        font-family: var(--sans); font-size: .83rem; font-weight: 700;
        color: var(--c-deep); letter-spacing: -.01em;
      }
      .works-section .ws-mini-row__cat {
        font-family: var(--sans); font-size: .62rem; font-weight: 400;
        color: var(--c-muted); letter-spacing: .04em;
      }
      .works-section .ws-mini-row__year {
        font-family: var(--serif); font-size: .72rem; font-weight: 300;
        color: var(--c-muted);
      }
      .works-section .ws-mini-row__bar {
        position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
        background: var(--c-forest); transform-origin: left;
      }
    `}</style>
  );
}