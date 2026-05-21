import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DustParticles
// Lightweight CSS-animated dust motes floating through the cabinet interior.
// Pure div elements with keyframe animations — no canvas, no WebGL.
// Seeded pseudo-random values for stable SSR-compatible output (no hydration flash).
// Skipped on mobile for performance.
// ─────────────────────────────────────────────────────────────────────────────

const ANIM_NAMES = ["dust-float-a", "dust-float-b", "dust-float-c", "dust-float-d"];

// Seeded pseudo-random — deterministic across renders
function seeded(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const r = (offset) => seeded(i * 19 + offset);
    return {
      id:      i,
      size:    r(0) * 1.8 + 0.5,                              // 0.5–2.3px
      opacity: r(1) * 0.18 + 0.05,                            // 0.05–0.23
      left:    r(2) * 88 + 6,                                  // 6–94%
      top:     r(3) * 82 + 8,                                  // 8–90%
      delay:   r(4) * -28,                                     // stagger start
      dur:     r(5) * 14 + 18,                                 // 18–32s
      anim:    ANIM_NAMES[Math.floor(r(6) * ANIM_NAMES.length)],
      blur:    r(7) > 0.68 ? "0.4px" : "0",
    };
  });
}

function DustParticles({ count = 18 }) {
  const particles = useMemo(() => buildParticles(count), [count]);

  return (
    <div className="dust-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            left:              `${p.left}%`,
            top:               `${p.top}%`,
            opacity:           p.opacity,
            filter:            p.blur ? `blur(${p.blur})` : undefined,
            animationName:     p.anim,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default DustParticles;