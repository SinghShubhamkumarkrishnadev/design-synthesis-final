import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DustParticles
// Generates lightweight CSS-animated dust motes floating through the scene.
// Pure div elements + CSS keyframe animations — no canvas, no libraries.
// Very low opacity, very slow movement. Cinematic atmosphere only.
// ─────────────────────────────────────────────────────────────────────────────

const ANIMATION_NAMES = [
  "dust-float-a",
  "dust-float-b",
  "dust-float-c",
  "dust-float-d",
];

// Seeded pseudo-random for stable SSR-compatible values
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const r = (offset) => seededRandom(i * 17 + offset);

    const size    = r(0) * 1.6 + 0.6;          // 0.6–2.2px
    const opacity = r(1) * 0.18 + 0.06;         // 0.06–0.24
    const left    = r(2) * 90 + 5;              // 5–95%
    const top     = r(3) * 85 + 8;              // 8–93%
    const delay   = r(4) * -24;                 // stagger starts
    const dur     = r(5) * 14 + 18;             // 18–32s
    const anim    = ANIMATION_NAMES[Math.floor(r(6) * ANIMATION_NAMES.length)];
    const blur    = r(7) > 0.7 ? "0.4px" : "0"; // occasional soft blur

    return { id: i, size, opacity, left, top, delay, dur, anim, blur };
  });
}

function DustParticles({ count = 22 }) {
  const particles = useMemo(() => buildParticles(count), [count]);

  return (
    <div className="dust-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            width:           `${p.size}px`,
            height:          `${p.size}px`,
            left:            `${p.left}%`,
            top:             `${p.top}%`,
            opacity:         p.opacity,
            filter:          p.blur ? `blur(${p.blur})` : undefined,
            animationName:   p.anim,
            animationDuration: `${p.dur}s`,
            animationDelay:  `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default DustParticles;