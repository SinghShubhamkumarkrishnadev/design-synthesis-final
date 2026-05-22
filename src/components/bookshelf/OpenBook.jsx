import { useRef, useEffect, forwardRef } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// OpenBook — Phase 2
//
// Receives the selected project and the already-settled closed-book DOM node.
// Performs the GSAP 3D book-opening animation, then reveals editorial content.
//
// Architecture:
//  · Entire component is purely additive over the closed-book state
//  · Does NOT use Framer Motion internally — GSAP owns ALL timeline control
//  · Framer Motion is used only by the parent (BookExperience) for mount/unmount
//  · All 3D transforms: preserve-3d, perspective, rotateY
//  · Content fades in staggered after cover opens
//  · Reverse timeline plays on unmount (parent triggers onReverseComplete)
//
// 3D Architecture:
//   .open-book                          — perspective container
//     .open-book__spine                 — left anchor (hinge axis)
//     .open-book__cover-front           — rotates 0→-180deg around left edge
//     .open-book__pages-left            — left page (image), hidden behind cover
//     .open-book__pages-right           — right page (editorial content)
//     .open-book__fold-shadow           — gradient overlay near spine
//     .open-book__cover-back            — back of cover visible when open
// ─────────────────────────────────────────────────────────────────────────────

export default function OpenBook({ project, onReverseComplete, isMobile, innerRef }) {
  const bookRef = useRef(null);
  // Callback ref so parent can access DOM node methods
  const setRef = (node) => { bookRef.current = node; if (innerRef) innerRef(node); };
  const tlRef  = useRef(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const {
    spineColor,
    spineGradient,
    textColor,
    accentColor,
    pageColor,
    title,
    subtitle,
    category,
    year,
    location,
    description,
    longDescription,
    challenge,
    solution,
    coverImage,
    technologies = [],
    credits,
    tags = [],
  } = project;

  // ── Build and play opening timeline ────────────────────────────────────────
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    const cover    = el.querySelector(".open-book__cover-front");
    const pagesL   = el.querySelector(".open-book__pages-left");
    const pagesR   = el.querySelector(".open-book__pages-right");
    const fold     = el.querySelector(".open-book__fold-shadow");
    const spine    = el.querySelector(".open-book__spine-3d");
    const content  = el.querySelectorAll(".open-book__reveal");

    const reduced = prefersReducedMotion.current;
    const dur     = reduced ? 0 : 1;

    // Initial states
    gsap.set(cover,  { rotateY: 0, transformOrigin: "left center", transformStyle: "preserve-3d" });
    gsap.set(pagesL, { opacity: 0 });
    gsap.set(pagesR, { opacity: 0, x: 24 });
    gsap.set(fold,   { opacity: 0 });
    gsap.set(content, { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
    });

    tlRef.current = tl;

    // 1. Slight pause — let the extraction settle
    tl.to({}, { duration: reduced ? 0 : 0.18 });

    // 2. Spine thickens slightly (book depth awareness)
    if (spine) {
      tl.to(spine, { scaleX: 1.12, duration: dur * 0.3, ease: "power2.out" }, "<");
    }

    // 3. Cover opens — rotates around left edge (hinge)
    tl.to(
      cover,
      {
        rotateY: isMobile ? -150 : -172,
        duration: dur * 0.82,
        ease: "power2.inOut",
      },
      `+=${reduced ? 0 : 0.08}`
    );

    // 4. Left page (image) fades in behind the opening cover
    tl.to(pagesL, { opacity: 1, duration: dur * 0.45, ease: "power2.out" }, "-=0.45");

    // 5. Right page slides and fades in
    tl.to(pagesR, { opacity: 1, x: 0, duration: dur * 0.40, ease: "power2.out" }, "-=0.35");

    // 6. Fold shadow deepens
    tl.to(fold, { opacity: 1, duration: dur * 0.35, ease: "power2.out" }, "-=0.30");

    // 7. Editorial content reveals staggered
    tl.to(
      content,
      {
        opacity: 1,
        y: 0,
        duration: dur * 0.40,
        stagger: reduced ? 0 : 0.07,
        ease: "power2.out",
      },
      "-=0.18"
    );

    return () => {
      tl.kill();
    };
  }, [isMobile]);

  // ── Expose reverse close animation ─────────────────────────────────────────
  // Parent calls this via the ref we expose through the DOM node's dataset
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;

    // Attach reverse trigger to DOM node so parent can call it
    el._reverseOpenBook = () => {
      const tl = tlRef.current;
      if (!tl) {
        onReverseComplete?.();
        return;
      }
      tl.reverse().then(() => {
        onReverseComplete?.();
      });
    };
  }, [onReverseComplete]);

  const bookStyle = {
    "--book-color":   spineColor,
    "--book-text":    textColor,
    "--book-accent":  accentColor,
    "--book-page":    pageColor,
  };

  const spineBackground = spineGradient
    ? `${spineGradient}, ${spineColor}`
    : spineColor;

  return (
    <div
      ref={setRef}
      className={`open-book${isMobile ? " open-book--mobile" : ""}`}
      style={bookStyle}
      aria-label={`Open book: ${title}`}
      role="article"
    >
      {/* ── 3-D Perspective wrapper ──────────────────────────────────── */}
      <div className="open-book__3d-scene">

        {/* ── Spine (hinge column) ─────────────────────────────────── */}
        <div
          className="open-book__spine-3d"
          style={{ background: spineBackground }}
          aria-hidden="true"
        >
          <div className="open-book__spine-sheen" />
          <div className="open-book__spine-title">{title}</div>
        </div>

        {/* ── Back cover (visible after open) ──────────────────────── */}
        <div
          className="open-book__cover-back"
          style={{ background: spineColor }}
          aria-hidden="true"
        >
          <div className="open-book__cover-back-grain" />
          <div className="open-book__cover-back-logo">Design Synthesis</div>
        </div>

        {/* ── Left spread — project image ───────────────────────────── */}
        <div className="open-book__pages-left" aria-hidden="true">
          <div className="open-book__page-paper">
            {/* Paper grain */}
            <div className="open-book__paper-grain" />

            {/* Project image */}
            {coverImage ? (
              <div
                className="open-book__cover-image"
                style={{ backgroundImage: `url(${coverImage})` }}
                role="img"
                aria-label={`${title} project image`}
              />
            ) : (
              <div
                className="open-book__cover-image open-book__cover-image--placeholder"
                style={{ background: `linear-gradient(145deg, ${spineColor}22, ${accentColor}44)` }}
              />
            )}

            {/* Left page caption */}
            <div className="open-book__left-caption">
              <span className="open-book__caption-cat">{category}</span>
              <span className="open-book__caption-loc">
                <PinIcon /> {location}
              </span>
            </div>

            {/* Left page number */}
            <div className="open-book__page-num open-book__page-num--left">I</div>

            {/* Left edge shadow (fold) */}
            <div className="open-book__left-edge-shadow" aria-hidden="true" />
          </div>
        </div>

        {/* ── Right spread — editorial content ─────────────────────── */}
        <div className="open-book__pages-right">
          <div className="open-book__page-paper open-book__page-paper--right">
            {/* Paper grain */}
            <div className="open-book__paper-grain" />

            {/* Content scroll region */}
            <div className="open-book__content-scroll">

              {/* Eyebrow */}
              <div className="open-book__reveal open-book__eyebrow">
                {category} &nbsp;·&nbsp; {year}
              </div>

              {/* Title */}
              <h2 className="open-book__reveal open-book__title">{title}</h2>

              {subtitle && (
                <p className="open-book__reveal open-book__subtitle">{subtitle}</p>
              )}

              <div className="open-book__reveal open-book__rule" aria-hidden="true" />

              {/* Description */}
              <p className="open-book__reveal open-book__body">
                {longDescription || description}
              </p>

              {/* Challenge / Solution */}
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

              {/* Technologies */}
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

              {/* Tags */}
              {tags.length > 0 && (
                <div className="open-book__reveal open-book__tags">
                  {tags.map((tag) => (
                    <span key={tag} className="open-book__tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Credits */}
              {credits && (
                <div className="open-book__reveal open-book__credits">
                  <span className="open-book__credits-label">Credits</span>
                  <span className="open-book__credits-text">{credits}</span>
                </div>
              )}

              {/* Publisher imprint */}
              <div className="open-book__reveal open-book__imprint">
                <span>Design Synthesis</span>
                <span className="open-book__imprint-dot" />
                <span>Archive {year}</span>
              </div>
            </div>

            {/* Right edge shadow */}
            <div className="open-book__right-edge-shadow" aria-hidden="true" />

            {/* Page number */}
            <div className="open-book__page-num open-book__page-num--right">II</div>
          </div>
        </div>

        {/* ── Front cover (rotates open) ────────────────────────────── */}
        <div
          className="open-book__cover-front"
          style={{ background: spineBackground }}
          aria-hidden="true"
        >
          {/* Grain texture */}
          <div className="open-book__cover-grain" />
          {/* Binding bands */}
          <div className="open-book__cover-band open-book__cover-band--top" />
          <div className="open-book__cover-band open-book__cover-band--bottom" />
          {/* Cover sheen */}
          <div className="open-book__cover-sheen" />
          {/* Cover inner face (visible when open) */}
          <div
            className="open-book__cover-inner"
            style={{ background: pageColor || "#EDE4D4" }}
          >
            <div className="open-book__cover-inner-logo">Design Synthesis</div>
            <div className="open-book__cover-inner-year">{year}</div>
          </div>
        </div>

        {/* ── Fold shadow at spine ──────────────────────────────────── */}
        <div className="open-book__fold-shadow" aria-hidden="true" />

        {/* ── Page stack edge ───────────────────────────────────────── */}
        <div className="open-book__page-stack" aria-hidden="true" />
      </div>

      {/* ── Floor shadow beneath open book ───────────────────────────── */}
      <div className="open-book__floor-shadow" aria-hidden="true" />
    </div>
  );
}

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