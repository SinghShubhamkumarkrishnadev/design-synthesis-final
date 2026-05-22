import { useRef, useCallback, useEffect, useState } from "react";
import AmbientLighting from "./AmbientLighting";
import DustParticles from "./DustParticles";
import Shelf from "./Shelf";
import { getProjectsByShelf, SHELF_COUNT } from "../../data/projects";

// ─────────────────────────────────────────────────────────────────────────────
// BookshelfScene — Phase 1 Update
//
// Changes from original:
//  · Accepts `selectedProject` prop
//  · Passes it down to Shelf so books can receive isSelected state
//  · All cabinet styling, animation, layout unchanged
// ─────────────────────────────────────────────────────────────────────────────

const SHELF_GLOW_POSITIONS = ["33%", "67%", "100%"];

function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.innerWidth <= 640) return "mobile";
    if (window.innerWidth <= 900) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 640) setBp("mobile");
      else if (window.innerWidth <= 900) setBp("tablet");
      else setBp("desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BookshelfScene({ onBookSelect, selectedProject = null }) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";

  const shelves = Array.from({ length: SHELF_COUNT }, (_, i) => ({
    index: i,
    projects: getProjectsByShelf(i),
  }));

  const handleBookClick = useCallback(
    (project) => onBookSelect?.(project),
    [onBookSelect]
  );

  return (
    <div className="works-scene" role="region" aria-label="Project Archive">

      {/* ── Bookshelf Cabinet ──────────────────────────────────────── */}
      <div
        className="bookshelf-cabinet"
        role="region"
        aria-label="Project Archive Bookshelf"
      >
        {/* Crown molding */}
        <div className="cabinet__crown" aria-hidden="true" />

        {/* Cabinet body */}
        <div className="cabinet__body">
          <div className="cabinet__panel cabinet__panel--left" aria-hidden="true" />

          {/* Recessed inner cavity */}
          <div className="cabinet__inner">
            <AmbientLighting
              shelfCount={SHELF_COUNT}
              shelfPositions={SHELF_GLOW_POSITIONS}
            />
            {!isMobile && <DustParticles count={10} />}

            <div className="bookshelf-scene">
              <div className="bookshelf-scene__inner">
                <SceneTopFrame isMobile={isMobile} />

                {shelves.map(({ index, projects }) => (
                  <Shelf
                    key={index}
                    shelfIndex={index}
                    projects={projects}
                    onBookClick={handleBookClick}
                    selectedProject={selectedProject}
                  />
                ))}

                <SceneBottomRail />
              </div>
            </div>
          </div>

          <div className="cabinet__panel cabinet__panel--right" aria-hidden="true" />
        </div>

        {/* Base plinth */}
        <div className="cabinet__base" aria-hidden="true" />

        {/* SVG grain filter */}
        <SvgFilterDefs />
      </div>
    </div>
  );
}

function SceneTopFrame({ isMobile }) {
  return (
    <div className="scene-top-frame" aria-hidden="true">
      <div className="frame-line" />
      {!isMobile && <div className="frame-gem" />}
      <div className="frame-line" />
    </div>
  );
}

function SceneBottomRail() {
  return <div className="scene-bottom-rail" aria-hidden="true" />;
}

function SvgFilterDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="ds-grain"
          x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            seed="12"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
          <feComposite in="SourceGraphic" in2="grayNoise" operator="in" result="masked" />
          <feBlend in="SourceGraphic" in2="masked" mode="luminosity" result="blended" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}