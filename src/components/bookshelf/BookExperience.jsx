import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import OpenBook from "./OpenBook";

// ─────────────────────────────────────────────────────────────────────────────
// BookExperience — Phase 2 + UX Fixes
//
// Fix #1 — Backdrop-click close:
//   The outer overlay div handles onClick → handleClose().
//   The inner book container calls e.stopPropagation() so clicks inside
//   never bubble up to the overlay. The overlay itself has pointer-events: auto
//   so it is always clickable.
//
// Fix #2 — Clipping by WorksSection (MOST IMPORTANT):
//   Root cause: WorksSection has overflow:hidden AND contains transformed
//   children (bookshelf-cabinet uses perspective/transform), which creates
//   a new stacking context. Any child with position:fixed inside a transformed
//   ancestor is positioned relative to that ancestor, NOT the viewport.
//   Fix: React Portal (createPortal) renders the backdrop + overlay directly
//   into document.body, completely escaping the WorksSection subtree.
//   This guarantees truly fullscreen, unclipped overlay at all times.
//
// Fix #3 — Scroll lock (no jump):
//   Uses overflow:hidden on <html> + scrollbar-width compensation only.
//   The document's native scrollTop is never disturbed. No window.scrollTo().
//
// Fix #4 — Desktop image:
//   The left-page image container is given explicit position:relative so
//   the absolute-positioned cover-image fills it correctly. The image div
//   itself gets position:absolute inset:0 with object-fit:cover semantics
//   via background-size:cover background-position:center.
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.32, 0.08, 0.16, 1.0];

// ── Backdrop variants ─────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.40, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 },
  },
};

// ── Experience container ─────────────────────────────────────────────────────
const experienceVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.30, ease: [0.25, 0.1, 0.25, 1], delay: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
};

// ── Close button ─────────────────────────────────────────────────────────────
const closeVariants = {
  hidden:  { opacity: 0, scale: 0.80 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1], delay: 1.4 } },
  exit:    { opacity: 0, scale: 0.80, transition: { duration: 0.18 } },
};

// ── Open book container ───────────────────────────────────────────────────────
const openBookVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const h = (e) => setM(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);
  return m;
}

// ── Measure scrollbar width once ─────────────────────────────────────────────
function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BookExperience({ project, onClose }) {
  const openBookRef  = useRef(null);
  const isMobile     = useIsMobile();

  const [bookOpen,  setBookOpen]  = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ── Scroll lock — NO position:fixed, NO scrollTo() ──────────────────────
  useEffect(() => {
    if (!project) return;

    const html = document.documentElement;
    const sbWidth = getScrollbarWidth();

    const prevOverflow      = html.style.overflow;
    const prevPaddingRight  = html.style.paddingRight;

    html.style.overflow     = "hidden";
    if (sbWidth > 0) {
      html.style.paddingRight = `${sbWidth}px`;
    }
    html.setAttribute("data-scroll-locked", "1");

    return () => {
      html.style.overflow     = prevOverflow;
      html.style.paddingRight = prevPaddingRight;
      html.removeAttribute("data-scroll-locked");
      // ⚠ NO window.scrollTo() — scroll position was never disturbed
    };
  }, [project]);

  // ── ESC close ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!project) return;
    const handler = (e) => {
      if (e.key === "Escape" && !isClosing) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isClosing]);

  // ── After extraction settles, open the book ─────────────────────────────
  useEffect(() => {
    if (!project) return;
    const timer = setTimeout(() => setBookOpen(true), 820);
    return () => clearTimeout(timer);
  }, [project]);

  // ── Two-phase close ─────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const el = openBookRef.current;
    if (el && el._reverseOpenBook) {
      el._reverseOpenBook();
    } else {
      onClose?.();
    }
  }, [isClosing, onClose]);

  // Called by OpenBook when GSAP reverse finishes
  const handleReverseComplete = useCallback(() => {
    setBookOpen(false);
    onClose?.();
  }, [onClose]);

  // ── Overlay click — Fix #1 ───────────────────────────────────────────────
  // The overlay div covers the entire viewport. Clicking anywhere on it
  // (i.e., outside the book stage) fires handleClose.
  // The book stage calls stopPropagation so inner clicks never reach here.
  const handleOverlayClick = useCallback(() => {
    if (!isClosing) handleClose();
  }, [isClosing, handleClose]);

  // Prevent clicks inside the book stage from bubbling to the overlay
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!project) return null;

  const {
    spineColor,
    spineGradient,
    textColor,
    accentColor,
    pageColor,
    title,
    year,
  } = project;

  const closedBookVars = {
    "--book-color":    spineColor,
    "--book-gradient": spineGradient,
    "--book-text":     textColor,
    "--book-accent":   accentColor,
    "--book-page":     pageColor,
    "--book-h":        "var(--extracted-book-h, 380px)",
    "--book-w":        "var(--extracted-book-w, 72px)",
  };

  // ── Portal content — renders into document.body ─────────────────────────
  // Fix #2: By portaling into document.body we completely escape
  // WorksSection's overflow:hidden and any transformed ancestors.
  // position:fixed on the portal children is now relative to the true
  // viewport, guaranteeing fullscreen coverage with no clipping.
  const portalContent = (
    <AnimatePresence mode="wait">
      {project && (
        <>
          {/* ── Cinematic Backdrop ─────────────────────────────────────── */}
          <motion.div
            key={`backdrop-${project.id}`}
            className="book-experience__backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-hidden="true"
          />

          {/* ── Overlay — fullscreen click target ────────────────────────
              pointer-events: auto so overlay is always clickable.
              Clicking anywhere on the overlay (outside the stage) closes.
              The stage calls stopPropagation to prevent accidental close.
          ──────────────────────────────────────────────────────────────── */}
          <motion.div
            key={`experience-${project.id}`}
            className={`book-experience${bookOpen ? " book-experience--open" : ""}`}
            style={{ pointerEvents: "auto" }}
            variants={experienceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={`Project: ${title}`}
            onClick={handleOverlayClick}
          >
            {/* ── Close Button ───────────────────────────────────────────── */}
            <motion.button
              className="book-experience__close"
              variants={closeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              aria-label="Close project view"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <CloseIcon />
            </motion.button>

            {/* ── Stage — stopPropagation prevents overlay close ───────── */}
            <div
              className={`book-experience__stage${bookOpen ? " book-experience__stage--open" : ""}`}
              onClick={stopPropagation}
            >
              {/* ── Closed Book (shared layout target) ─────────────────────
                  Kept in DOM (invisible when open) so layoutId can animate
                  back to the shelf on close.
              ──────────────────────────────────────────────────────────── */}
              <motion.div
                layoutId={`book-${project.id}`}
                className="book-experience__extracted"
                style={{
                  ...closedBookVars,
                  position:      bookOpen ? "absolute" : "relative",
                  opacity:       bookOpen ? 0 : 1,
                  pointerEvents: "none",
                  zIndex:        bookOpen ? -1 : 0,
                }}
                layout
                transition={{ layout: { duration: 0.72, ease } }}
              >
                <motion.div
                  className="book-experience__glow-ring"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={bookOpen ? { opacity: 0 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.40, ease }}
                  aria-hidden="true"
                />

                <div className="book-experience__spine" aria-hidden="true">
                  <div className="book-experience__binding book-experience__binding--top" />
                  <div className="book-experience__binding book-experience__binding--bottom" />
                  <div className="book-experience__grain" />
                  <div className="book-experience__text-track">
                    <span className="book-experience__title-text">{title}</span>
                    <span className="book-experience__divider" />
                    <span className="book-experience__year-text">{year}</span>
                  </div>
                  <div className="book-experience__publisher" aria-hidden="true">
                    Design Synthesis
                  </div>
                  <div className="book-experience__sheen" aria-hidden="true" />
                </div>

                <div className="book-experience__pages" aria-hidden="true" />
                <div className="book-experience__extraction-shadow" aria-hidden="true" />
              </motion.div>

              {/* ── OpenBook — mounts after extraction settles ─────────── */}
              <AnimatePresence>
                {bookOpen && (
                  <motion.div
                    key="open-book-wrapper"
                    className="book-experience__open-wrapper"
                    variants={openBookVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <OpenBook
                      project={project}
                      onReverseComplete={handleReverseComplete}
                      isMobile={isMobile}
                      innerRef={(node) => { openBookRef.current = node; }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Floor reflection ─────────────────────────────────────── */}
            <div
              className="book-experience__floor"
              aria-hidden="true"
              onClick={stopPropagation}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Portal into document.body — escapes WorksSection's stacking context
  return createPortal(portalContent, document.body);
}

// ── Close Icon ────────────────────────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 2l12 12M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}