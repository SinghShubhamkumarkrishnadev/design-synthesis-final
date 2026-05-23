import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// OpenBook — Phase 3: Multi-Spread Cinematic Publication
//
// Architecture:
//  · Extends Phase 2 with a full multi-spread page-turn system
//  · Spread 0: coverImage (left) + intro editorial (right)
//  · Spreads 1–N: gallery images (left) + contextual content (right)
//  · Page turning uses a dedicated animated LAYER that rotates via GSAP
//  · Content swaps at the midpoint of the animation (rotateY: -90°)
//  · The turning layer casts a dynamic shadow during its arc
//  · All 3D: rotateY, preserve-3d, transformOrigin: "left center"
//  · Navigation: ArrowLeft / ArrowRight keyboard + nav buttons
//  · Interaction lock prevents overlap / double-fire
//  · Reverse close system fully preserved
//
// Layer Stack (z-index order, low → high):
//   .open-book__cover-back          z:1
//   .open-book__pages-left          z:2  (static, shows current spread left)
//   .open-book__pages-right         z:3  (static, shows current spread right)
//   .open-book__turning-page        z:4  (animated layer)
//   .open-book__turning-shadow      z:5  (shadow cast during turn)
//   .open-book__fold-shadow         z:15 (static spine fold)
//   .open-book__cover-front         z:20 (cover, rotates open on mount)
//
// Spread pipeline (derived, backward-compatible):
//   spread[0] = { leftImage: coverImage, rightType: "intro" }
//   spread[n] = { leftImage: gallery[n-1], rightType: "gallery", galleryIndex: n-1 }
// ─────────────────────────────────────────────────────────────────────────────

// ── Spread content renderers ──────────────────────────────────────────────────

function SpreadRight_Intro({ project }) {
  const {
    category, year, title, subtitle, longDescription, description,
    challenge, solution, technologies = [], credits, tags = [],
  } = project;

  return (
    <div className="open-book__content-scroll">
      <div className="open-book__reveal open-book__eyebrow">
        {category} &nbsp;·&nbsp; {year}
      </div>
      <h2 className="open-book__reveal open-book__title">{title}</h2>
      {subtitle && (
        <p className="open-book__reveal open-book__subtitle">{subtitle}</p>
      )}
      <div className="open-book__reveal open-book__rule" aria-hidden="true" />
      <p className="open-book__reveal open-book__body">
        {longDescription || description}
      </p>
      {challenge && (
        <div className="open-book__reveal open-book__callout-block">
          <div className="open-book__callout-label">Challenge</div>
          <p className="open-book__callout-text">{challenge}</p>
        </div>
      )}
      {solution && (
        <div className="open-book__reveal open-book__callout-block">
          <div className="open-book__callout-label">Solution</div>
          <p className="open-book__callout-text">{solution}</p>
        </div>
      )}
      {technologies.length > 0 && (
        <div className="open-book__reveal open-book__tech-block">
          <div className="open-book__tech-label">Materials &amp; Methods</div>
          <div className="open-book__tech-tags">
            {technologies.map((t) => (
              <span key={t} className="open-book__tech-tag">{t}</span>
            ))}
          </div>
        </div>
      )}
      {tags.length > 0 && (
        <div className="open-book__reveal open-book__tags">
          {tags.map((tag) => (
            <span key={tag} className="open-book__tag">{tag}</span>
          ))}
        </div>
      )}
      {credits && (
        <div className="open-book__reveal open-book__credits">
          <span className="open-book__credits-label">Credits</span>
          <span className="open-book__credits-text">{credits}</span>
        </div>
      )}
      <div className="open-book__reveal open-book__imprint">
        <span>Design Synthesis</span>
        <span className="open-book__imprint-dot" />
        <span>Archive {year}</span>
      </div>
    </div>
  );
}

function SpreadRight_Gallery({ project, galleryIndex }) {
  const { category, year, title, technologies = [], credits, spreads } = project;

  // If the project has rich spread data, use it; otherwise derive labels
  const spread = spreads?.[galleryIndex + 1]; // +1 because spread[0] = intro
  const label  = spread?.rightLabel  ?? GALLERY_LABELS[galleryIndex % GALLERY_LABELS.length];
  const body   = spread?.rightBody   ?? spread?.body ?? project.description;
  const heading = spread?.rightHeading ?? label;

  return (
    <div className="open-book__content-scroll">
      <div className="open-book__reveal open-book__eyebrow">
        {category} &nbsp;·&nbsp; {year}
      </div>
      <h2 className="open-book__reveal open-book__title open-book__title--spread">
        {heading}
      </h2>
      <div className="open-book__reveal open-book__rule" aria-hidden="true" />
      <p className="open-book__reveal open-book__body">{body}</p>
      {technologies.length > 0 && (
        <div className="open-book__reveal open-book__tech-block">
          <div className="open-book__tech-label">Material System</div>
          <div className="open-book__tech-tags">
            {technologies.map((t) => (
              <span key={t} className="open-book__tech-tag">{t}</span>
            ))}
          </div>
        </div>
      )}
      {credits && (
        <div className="open-book__reveal open-book__credits">
          <span className="open-book__credits-label">Credits</span>
          <span className="open-book__credits-text">{credits}</span>
        </div>
      )}
      <div className="open-book__reveal open-book__imprint">
        <span>Design Synthesis</span>
        <span className="open-book__imprint-dot" />
        <span>Archive {year}</span>
      </div>
    </div>
  );
}

const GALLERY_LABELS = [
  "Spatial Concept",
  "Material System",
  "Detail Study",
  "Technical Resolution",
  "Atmospheric Study",
  "Programme Logic",
];

// ── Spread Left — image panel ─────────────────────────────────────────────────

function SpreadLeft({ project, imageSrc, pageNum }) {
  const { category, location, title } = project;
  return (
    <div className="open-book__page-paper">
      <div className="open-book__paper-grain" />
      {imageSrc ? (
        <div
          className="open-book__cover-image"
          style={{ backgroundImage: `url(${imageSrc})` }}
          role="img"
          aria-label={`${title} — spread image`}
        />
      ) : (
        <div
          className="open-book__cover-image open-book__cover-image--placeholder"
          style={{
            background: `linear-gradient(145deg, ${project.spineColor}22, ${project.accentColor}44)`,
          }}
        />
      )}
      <div className="open-book__left-caption">
        <span className="open-book__caption-cat">{category}</span>
        <span className="open-book__caption-loc">
          <PinIcon /> {location}
        </span>
      </div>
      <div className="open-book__page-num open-book__page-num--left">{pageNum}</div>
      <div className="open-book__left-edge-shadow" aria-hidden="true" />
    </div>
  );
}

// ── Derive spreads from project data (backward-compatible) ────────────────────

function buildSpreads(project) {
  const { coverImage, gallery = [], spreads: richSpreads } = project;

  // If the project already has rich spread data, use it
  if (richSpreads && richSpreads.length > 0) {
    return richSpreads;
  }

  // Otherwise derive from coverImage + gallery[]
  const derived = [
    {
      leftImage: coverImage,
      rightType: "intro",
      pageNumLeft: "I",
      pageNumRight: "II",
    },
    ...gallery.map((img, i) => ({
      leftImage: img,
      rightType: "gallery",
      galleryIndex: i,
      pageNumLeft: toRoman((i + 1) * 2 + 1),
      pageNumRight: toRoman((i + 1) * 2 + 2),
    })),
  ];

  return derived;
}

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let out = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { out += syms[i]; n -= vals[i]; }
  }
  return out;
}

const ROMAN_NUMERALS = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function OpenBook({ project, onReverseComplete, isMobile, innerRef }) {
  const bookRef        = useRef(null);
  const tlRef          = useRef(null);       // opening timeline
  const pageTlRef      = useRef(null);       // page-turn timeline
  const turningPageRef = useRef(null);
  const turningShadRef = useRef(null);
  const pagesLRef      = useRef(null);
  const pagesRRef      = useRef(null);

  const [spreadIndex,   setSpreadIndex]   = useState(0);
  const [isTurning,     setIsTurning]     = useState(false);
  const [renderIndex,   setRenderIndex]   = useState(0); // what's currently rendered

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // ── Ref callback ────────────────────────────────────────────────────────
  const setRef = (node) => {
    bookRef.current = node;
    if (innerRef) innerRef(node);
  };

  // ── Derived spread list ─────────────────────────────────────────────────
  const spreads = useMemo(() => buildSpreads(project), [project]);
  const totalSpreads = spreads.length;

  const {
    spineColor, spineGradient, textColor, accentColor, pageColor, title, year,
  } = project;

  const spineBackground = spineGradient
    ? `${spineGradient}, ${spineColor}`
    : spineColor;

  const bookStyle = {
    "--book-color":  spineColor,
    "--book-text":   textColor,
    "--book-accent": accentColor,
    "--book-page":   pageColor,
  };

  // ── Opening timeline (cover opens) ──────────────────────────────────────
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    const cover   = el.querySelector(".open-book__cover-front");
    const pagesL  = el.querySelector(".open-book__pages-left");
    const pagesR  = el.querySelector(".open-book__pages-right");
    const fold    = el.querySelector(".open-book__fold-shadow");
    const spine   = el.querySelector(".open-book__spine-3d");
    const content = el.querySelectorAll(".open-book__reveal");
    const navBar  = el.querySelector(".open-book__nav");

    // Store refs for page-turn access
    pagesLRef.current = pagesL;
    pagesRRef.current = pagesR;

    const reduced = prefersReducedMotion.current;
    const dur     = reduced ? 0 : 1;

    gsap.set(cover,  { rotateY: 0, transformOrigin: "left center", transformStyle: "preserve-3d" });
    gsap.set(pagesL, { opacity: 0 });
    gsap.set(pagesR, { opacity: 0, x: 24 });
    gsap.set(fold,   { opacity: 0 });
    gsap.set(content, { opacity: 0, y: 16 });
    if (navBar) gsap.set(navBar, { opacity: 0, y: 8 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tlRef.current = tl;

    tl.to({}, { duration: reduced ? 0 : 0.18 });

    if (spine) {
      tl.to(spine, { scaleX: 1.12, duration: dur * 0.3, ease: "power2.out" }, "<");
    }

    tl.to(cover, {
      rotateY: isMobile ? -150 : -172,
      duration: dur * 0.82,
      ease: "power2.inOut",
    }, `+=${reduced ? 0 : 0.08}`);

    tl.to(pagesL, { opacity: 1, duration: dur * 0.45, ease: "power2.out" }, "-=0.45");
    tl.to(pagesR, { opacity: 1, x: 0, duration: dur * 0.40, ease: "power2.out" }, "-=0.35");
    tl.to(fold,   { opacity: 1, duration: dur * 0.35, ease: "power2.out" }, "-=0.30");

    tl.to(content, {
      opacity: 1, y: 0,
      duration: dur * 0.40,
      stagger: reduced ? 0 : 0.07,
      ease: "power2.out",
    }, "-=0.18");

    if (navBar) {
      tl.to(navBar, { opacity: 1, y: 0, duration: dur * 0.32, ease: "power2.out" }, "-=0.15");
    }

    return () => { tl.kill(); };
  }, [isMobile]);

  // ── Reverse close (preserved from Phase 2) ──────────────────────────────
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    el._reverseOpenBook = () => {
      const tl = tlRef.current;
      if (!tl) { onReverseComplete?.(); return; }
      tl.reverse().then(() => { onReverseComplete?.(); });
    };
  }, [onReverseComplete]);

  // ── Re-reveal content after spread swap ─────────────────────────────────
  const revealNewContent = useCallback(() => {
    const el = bookRef.current;
    if (!el) return;
    const content = el.querySelectorAll(".open-book__reveal");
    const reduced = prefersReducedMotion.current;
    gsap.fromTo(
      content,
      { opacity: 0, y: 10 },
      {
        opacity: 1, y: 0,
        duration: reduced ? 0 : 0.38,
        stagger: reduced ? 0 : 0.055,
        ease: "power2.out",
      }
    );
  }, []);

  // ── Page turn engine ────────────────────────────────────────────────────
  //
  // Visual illusion:
  //   1. The turning page layer sits on top of the static pages at z:4
  //   2. It starts at rotateY(0) — looking like the current right page
  //   3. It rotates to -90°  (edge-on, invisible) — we swap content here
  //   4. It continues to -180° — now shows the back face (new left page)
  //      overlaid on the static left page which has already updated
  //   5. At completion: turning layer fades/snaps away, static pages are visible
  //
  // For a FORWARD turn (next):
  //   turning page starts as a copy of the current right page, sweeps left
  //   to reveal the new spread.
  //
  // For a BACKWARD turn (prev):
  //   turning page starts as a copy of the current left page, sweeps right.
  //
  const executeTurn = useCallback((direction) => {
    if (isTurning) return;

    const nextIndex = spreadIndex + direction;
    if (nextIndex < 0 || nextIndex >= totalSpreads) return;

    setIsTurning(true);

    const el       = bookRef.current;
    const turning  = turningPageRef.current;
    const shadow   = turningShadRef.current;
    if (!el || !turning || !shadow) { setIsTurning(false); return; }

    const reduced = prefersReducedMotion.current;
    const dur     = reduced ? 0 : 1;

    // Kill any running page turn
    if (pageTlRef.current) { pageTlRef.current.kill(); }

    const isForward = direction > 0;

    // SETUP: turning page appears as a continuation of the current spread
    // For forward: it starts looking like the current right page (right half)
    // For backward: it starts looking like the current left page (left half)
    gsap.set(turning, {
      opacity: 1,
      rotateY: isForward ? 0 : -180,
      transformOrigin: isForward ? "left center" : "right center",
      transformStyle: "preserve-3d",
      // Position over the appropriate page half
      left: isForward ? "50%" : "0%",
      width: "50%",
    });

    gsap.set(shadow, {
      opacity: 0,
      left: isForward ? "50%" : "0%",
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        // Hide turning layer, update state
        gsap.set(turning, { opacity: 0 });
        gsap.set(shadow,  { opacity: 0 });
        setIsTurning(false);
        setSpreadIndex(nextIndex);
        setRenderIndex(nextIndex);
        // Re-reveal typography
        requestAnimationFrame(() => revealNewContent());
      },
    });

    pageTlRef.current = tl;

    const midAngle  = isForward ? -90  : -90;  // edge-on
    const endAngle  = isForward ? -180 : 0;

    // ── Phase 1: sweep to edge ───────────────────────────────────────────
    tl.to(turning, {
      rotateY: midAngle,
      duration: dur * 0.48,
      ease: "power2.in",
    });

    // Shadow rises as page turns
    tl.to(shadow, {
      opacity: 0.28,
      duration: dur * 0.22,
      ease: "power2.out",
    }, 0);

    // ── Midpoint: swap rendered content ─────────────────────────────────
    tl.call(() => {
      setRenderIndex(nextIndex);
    });

    // ── Phase 2: complete the arc ────────────────────────────────────────
    tl.to(turning, {
      rotateY: endAngle,
      duration: dur * 0.48,
      ease: "power2.out",
    });

    // Shadow fades as page lands
    tl.to(shadow, {
      opacity: 0,
      duration: dur * 0.22,
      ease: "power2.in",
    }, `-=${dur * 0.22}`);

    // Slight flex of the pages on landing
    if (!reduced) {
      const pL = pagesLRef.current;
      const pR = pagesRRef.current;
      if (pL) {
        tl.to(pL, { scaleY: 1.005, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, `-=${dur * 0.18}`);
      }
      if (pR) {
        tl.to(pR, { scaleY: 1.005, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, `-=${dur * 0.18}`);
      }
    }
  }, [isTurning, spreadIndex, totalSpreads, revealNewContent]);

  const goNext = useCallback(() => executeTurn(1),  [executeTurn]);
  const goPrev = useCallback(() => executeTurn(-1), [executeTurn]);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  // ── Current spread ──────────────────────────────────────────────────────
  const currentSpread = spreads[renderIndex] ?? spreads[0];
  const hasNext = spreadIndex < totalSpreads - 1;
  const hasPrev = spreadIndex > 0;

  const leftPageNum  = currentSpread.pageNumLeft  ?? ROMAN_NUMERALS[(renderIndex * 2)     % ROMAN_NUMERALS.length];
  const rightPageNum = currentSpread.pageNumRight ?? ROMAN_NUMERALS[(renderIndex * 2 + 1) % ROMAN_NUMERALS.length];

  // ── Turning page face content ───────────────────────────────────────────
  // The turning page displays a visual "skin" of the page it's replacing.
  // For forward: it looks like the right page initially.
  // We just render a blank page-colored surface — the animation is so fast
  // the content swap at midpoint is imperceptible.

  return (
    <div
      ref={setRef}
      className={`open-book${isMobile ? " open-book--mobile" : ""}`}
      style={bookStyle}
      aria-label={`Open book: ${title} — spread ${spreadIndex + 1} of ${totalSpreads}`}
      role="article"
    >
      {/* ── 3-D Perspective wrapper ──────────────────────────────── */}
      <div className="open-book__3d-scene">

        {/* ── Spine (hinge column) ─────────────────────────────── */}
        <div
          className="open-book__spine-3d"
          style={{ background: spineBackground }}
          aria-hidden="true"
        >
          <div className="open-book__spine-sheen" />
          <div className="open-book__spine-title">{title}</div>
        </div>

        {/* ── Back cover ────────────────────────────────────────── */}
        <div
          className="open-book__cover-back"
          style={{ background: spineColor }}
          aria-hidden="true"
        >
          <div className="open-book__cover-back-grain" />
          <div className="open-book__cover-back-logo">Design Synthesis</div>
        </div>

        {/* ── Static Left page ──────────────────────────────────── */}
        <div
          className="open-book__pages-left"
          ref={pagesLRef}
          aria-hidden="true"
        >
          <SpreadLeft
            project={project}
            imageSrc={currentSpread.leftImage}
            pageNum={leftPageNum}
          />
        </div>

        {/* ── Static Right page ─────────────────────────────────── */}
        <div className="open-book__pages-right" ref={pagesRRef}>
          <div className="open-book__page-paper open-book__page-paper--right">
            <div className="open-book__paper-grain" />
            <div className="open-book__right-edge-shadow" aria-hidden="true" />
            <div className="open-book__page-num open-book__page-num--right">{rightPageNum}</div>

            {currentSpread.rightType === "intro" ? (
              <SpreadRight_Intro project={project} />
            ) : (
              <SpreadRight_Gallery
                project={project}
                galleryIndex={currentSpread.galleryIndex ?? 0}
              />
            )}
          </div>
        </div>

        {/* ── Turning Page Layer ─────────────────────────────────── */}
        {/* This is the animated layer that creates the 3D page-turn illusion */}
        <div
          ref={turningPageRef}
          className="open-book__turning-page"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          {/* Front face — matches page being turned from */}
          <div className="open-book__turning-page__face open-book__turning-page__face--front">
            <div className="open-book__page-paper">
              <div className="open-book__paper-grain" />
            </div>
          </div>
          {/* Back face — matches page being turned to */}
          <div className="open-book__turning-page__face open-book__turning-page__face--back">
            <div className="open-book__page-paper">
              <div className="open-book__paper-grain" />
            </div>
          </div>
        </div>

        {/* ── Page Turn Shadow ──────────────────────────────────── */}
        <div
          ref={turningShadRef}
          className="open-book__turning-shadow"
          aria-hidden="true"
          style={{ opacity: 0 }}
        />

        {/* ── Front cover (rotates open on mount) ───────────────── */}
        <div
          className="open-book__cover-front"
          style={{ background: spineBackground }}
          aria-hidden="true"
        >
          <div className="open-book__cover-grain" />
          <div className="open-book__cover-band open-book__cover-band--top" />
          <div className="open-book__cover-band open-book__cover-band--bottom" />
          <div className="open-book__cover-sheen" />
          <div
            className="open-book__cover-inner"
            style={{ background: pageColor || "#EDE4D4" }}
          >
            <div className="open-book__cover-inner-logo">Design Synthesis</div>
            <div className="open-book__cover-inner-year">{year}</div>
          </div>
        </div>

        {/* ── Fold shadow at spine ──────────────────────────────── */}
        <div className="open-book__fold-shadow" aria-hidden="true" />

        {/* ── Page stack edge ───────────────────────────────────── */}
        <div className="open-book__page-stack" aria-hidden="true" />
      </div>

      {/* ── Navigation Bar ────────────────────────────────────────── */}
      {totalSpreads > 1 && (
        <nav
          className="open-book__nav"
          aria-label="Navigate spreads"
        >
          {/* Previous */}
          <button
            className={`open-book__nav-btn open-book__nav-btn--prev${!hasPrev ? " open-book__nav-btn--disabled" : ""}`}
            onClick={goPrev}
            disabled={!hasPrev || isTurning}
            aria-label="Previous spread"
            aria-disabled={!hasPrev}
          >
            <ChevronLeft />
          </button>

          {/* Spread indicator — typographic, no dots */}
          <div className="open-book__nav-indicator" aria-live="polite" aria-atomic="true">
            <span className="open-book__nav-current">
              {toRoman(spreadIndex + 1)}
            </span>
            <span className="open-book__nav-sep" aria-hidden="true" />
            <span className="open-book__nav-total">
              {toRoman(totalSpreads)}
            </span>
          </div>

          {/* Next */}
          <button
            className={`open-book__nav-btn open-book__nav-btn--next${!hasNext ? " open-book__nav-btn--disabled" : ""}`}
            onClick={goNext}
            disabled={!hasNext || isTurning}
            aria-label="Next spread"
            aria-disabled={!hasNext}
          >
            <ChevronRight />
          </button>
        </nav>
      )}

      {/* ── Floor shadow beneath open book ───────────────────────── */}
      <div className="open-book__floor-shadow" aria-hidden="true" />
    </div>
  );
}

// ── Icon primitives ───────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg
      width="9" height="9" viewBox="0 0 10 10" fill="none"
      aria-hidden="true" style={{ display: "inline", verticalAlign: "middle" }}
    >
      <circle cx="5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M5 1C3.34 1 2 2.34 2 4c0 2.5 3 5 3 5s3-2.5 3-5c0-1.66-1.34-3-3-3z"
        stroke="currentColor" strokeWidth="1" strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}