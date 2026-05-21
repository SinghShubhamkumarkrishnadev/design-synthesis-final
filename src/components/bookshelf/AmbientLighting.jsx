import { useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AmbientLighting
// Pure CSS gradient divs simulating architectural spot lighting inside the cabinet.
// Layers: overhead warm glow, lateral fills, vignette, per-shelf LED strips.
// Zero canvas, zero GPU overdraw concern.
// ─────────────────────────────────────────────────────────────────────────────

function AmbientLighting({ shelfCount = 3, shelfPositions = [] }) {
  const containerRef = useRef(null);

  const shelfGlows = useMemo(
    () =>
      shelfPositions.map((top, i) => ({
        id: i,
        top,
        // Top shelf gets strongest glow, diminishes downward
        opacity: i === 0 ? 1 : 1 - i * 0.15,
      })),
    [shelfPositions]
  );

  return (
    <div className="ambient-lighting" ref={containerRef} aria-hidden="true">
      {/* Primary warm overhead glow — simulates ceiling light */}
      <div className="ambient-lighting__top-glow" />

      {/* Side fill lights — subtle warmth from left/right */}
      <div className="ambient-lighting__left-fill" />
      <div className="ambient-lighting__right-fill" />

      {/* Cinematic vignette — darkens cabinet corners */}
      <div className="ambient-lighting__vignette" />

      {/* Per-shelf LED strip glows */}
      {shelfGlows.map((glow) => (
        <div
          key={glow.id}
          className="ambient-lighting__shelf-glow"
          style={{ top: glow.top, opacity: glow.opacity }}
        />
      ))}
    </div>
  );
}

export default AmbientLighting;