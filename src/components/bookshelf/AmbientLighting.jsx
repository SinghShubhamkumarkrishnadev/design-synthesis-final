import { useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AmbientLighting
// Layered warm/cool glow passes simulating architectural spot lighting.
// Rendered as pure CSS gradient divs — zero GPU overdraw concern.
// ─────────────────────────────────────────────────────────────────────────────

function AmbientLighting({ shelfCount = 2, shelfPositions = [] }) {
  const containerRef = useRef(null);

  // Build shelf-level warm glow strip positions
  const shelfGlows = useMemo(() => {
    return shelfPositions.map((top, i) => ({
      id: i,
      top,
      intensity: i === 0 ? 1 : 0.7, // top shelf brighter
    }));
  }, [shelfPositions]);

  return (
    <div className="ambient-lighting" ref={containerRef} aria-hidden="true">

      {/* Primary warm overhead glow */}
      <div className="ambient-lighting__top-glow" />

      {/* Lateral fall-off fills */}
      <div className="ambient-lighting__left-fill" />
      <div className="ambient-lighting__right-fill" />

      {/* Cinematic vignette edges */}
      <div className="ambient-lighting__vignette" />

      {/* Per-shelf warm accent strips */}
      {shelfGlows.map((glow) => (
        <div
          key={glow.id}
          className="ambient-lighting__shelf-glow"
          style={{
            top: glow.top,
            opacity: glow.intensity,
          }}
        />
      ))}

      {/* Inline SVG filter definition for subtle grain (referenced by Book component) */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="ds-grain"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="linearRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              seed="8"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="grayNoise"
            />
            <feComposite
              in="SourceGraphic"
              in2="grayNoise"
              operator="in"
              result="masked"
            />
            <feBlend
              in="SourceGraphic"
              in2="masked"
              mode="luminosity"
              result="blended"
            />
            <feComponentTransfer>
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>

          {/* Warm top-light filter for spine highlights */}
          <filter id="ds-warm-light" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1.1 0.1 0   0 0.04
                      0   0.9 0.05 0 0.01
                      0   0   0.8  0 -0.01
                      0   0   0    1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default AmbientLighting;