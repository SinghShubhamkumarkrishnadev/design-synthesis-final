import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import AmbientLighting from "./AmbientLighting";
import DustParticles from "./DustParticles";
import Shelf from "./Shelf";
import { getProjectsByShelf, SHELF_COUNT } from "../../data/projects";

// ─────────────────────────────────────────────────────────────────────────────
// BookshelfScene
// The complete bookshelf environment.
// Desktop/Tablet: cinematic 3D perspective, ambient lighting, dust.
// Mobile: simplified atmospheric lighting, no dust particles (perf).
// ─────────────────────────────────────────────────────────────────────────────

const SHELF_GLOW_POSITIONS = ["38%", "74%"];

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

function BookshelfScene({ onBookSelect }) {
  const sceneRef = useRef(null);

  const isMobile = getIsMobile();

  const shelves = Array.from({ length: SHELF_COUNT }, (_, i) => ({
    index: i,
    projects: getProjectsByShelf(i),
  }));

  const handleBookClick = useCallback(
    (project) => {
      onBookSelect?.(project);
    },
    [onBookSelect]
  );

  return (
    <div className="bookshelf-scene" ref={sceneRef}>
      {/* ── Atmospheric Layers ─────────────────────────────────────────── */}
      <AmbientLighting
        shelfCount={SHELF_COUNT}
        shelfPositions={SHELF_GLOW_POSITIONS}
      />

      {/* Dust motes — skip on mobile for performance */}
      {!isMobile && <DustParticles count={20} />}

      {/* ── Scene Frame ────────────────────────────────────────────────── */}
      <div className="bookshelf-scene__inner">

        {/* Top frame ornament */}
        <SceneTopFrame isMobile={isMobile} />

        {/* ── Shelf Rows ─────────────────────────────────────────────── */}
        {shelves.map(({ index, projects }) => (
          <Shelf
            key={index}
            shelfIndex={index}
            projects={projects}
            onBookClick={handleBookClick}
          />
        ))}

        {/* Bottom rail */}
        <SceneBottomRail isMobile={isMobile} />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SceneTopFrame({ isMobile }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "16px" : "24px",
        marginBottom: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "10px" : "16px",
        flexShrink: 0,
        padding: isMobile ? "0 1.5rem" : "0",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(160,120,60,0.2), rgba(160,120,60,0.35), rgba(160,120,60,0.2), transparent)",
        }}
      />
      <div
        style={{
          width: isMobile ? "4px" : "5px",
          height: isMobile ? "4px" : "5px",
          border: "1px solid rgba(160,120,60,0.35)",
          transform: "rotate(45deg)",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          height: "1px",
          background:
            "linear-gradient(to left, transparent, rgba(160,120,60,0.2), rgba(160,120,60,0.35), rgba(160,120,60,0.2), transparent)",
        }}
      />
    </div>
  );
}

function SceneBottomRail({ isMobile }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "16px" : "28px",
        marginTop: isMobile ? "2px" : "4px",
        background: "linear-gradient(to bottom, #1E1208 0%, #140E06 60%, #0C0804 100%)",
        borderTop: "1px solid rgba(80, 50, 20, 0.5)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: isMobile ? "5px" : "8px",
          left: "8%",
          right: "8%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(180,140,60,0.2), rgba(180,140,60,0.35), rgba(180,140,60,0.2), transparent)",
        }}
      />
    </div>
  );
}

export default BookshelfScene;