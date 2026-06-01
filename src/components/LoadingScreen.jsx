// LoadingScreen.jsx

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const BALL_GRID = [
  "gray", "gray", "gray",
  "blue", "gray", "blue",
  "green", "green", "green",
];

const BALL_STYLES = {
  gray: {
    coreBg: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.65) 0%, rgba(184,187,193,0.25) 45%, rgba(100,103,110,0.5) 100%)",
    bodyBg: "radial-gradient(circle at 35% 30%, rgba(210,213,218,0.85) 0%, rgba(165,168,174,0.9) 70%, rgba(120,123,130,1) 100%)",
    shadows: `inset 0 12px 16px rgba(255,255,255,0.9), inset 0 -20px 28px rgba(70,72,77,0.45), inset -6px 0 12px rgba(255,255,255,0.4), 0 22px 45px rgba(40,42,45,0.18)`,
    innerGlow: "rgba(255,255,255,0.6)",
    groundShadow: "rgba(60,62,66,0.2)",
    caustic: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(184,187,193,0.3) 50%, transparent 70%)",
  },
  blue: {
    coreBg: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7) 0%, rgba(96,118,128,0.3) 40%, rgba(35,48,54,0.65) 100%)",
    bodyBg: "radial-gradient(circle at 35% 30%, rgba(130,153,163,0.85) 0%, rgba(85,105,115,0.95) 70%, rgba(50,65,73,1) 100%)",
    shadows: `inset 0 12px 16px rgba(255,255,255,0.85), inset 0 -20px 28px rgba(25,36,41,0.55), inset -6px 0 12px rgba(175,200,212,0.4), 0 22px 45px rgba(25,36,41,0.22)`,
    innerGlow: "rgba(180,210,225,0.7)",
    groundShadow: "rgba(20,30,35,0.25)",
    caustic: "radial-gradient(circle at 50% 50%, rgba(180,215,230,0.85) 0%, rgba(85,105,115,0.4) 50%, transparent 70%)",
  },
  green: {
    coreBg: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7) 0%, rgba(118,147,98,0.3) 40%, rgba(46,61,36,0.65) 100%)",
    bodyBg: "radial-gradient(circle at 35% 30%, rgba(153,181,134,0.85) 0%, rgba(105,133,86,0.95) 70%, rgba(65,84,52,1) 100%)",
    shadows: `inset 0 12px 16px rgba(255,255,255,0.85), inset 0 -20px 28px rgba(35,48,25,0.55), inset -6px 0 12px rgba(195,222,178,0.4), 0 22px 45px rgba(35,48,25,0.2)`,
    innerGlow: "rgba(200,240,180,0.7)",
    groundShadow: "rgba(30,40,22,0.22)",
    caustic: "radial-gradient(circle at 50% 50%, rgba(210,245,190,0.85) 0%, rgba(105,133,86,0.4) 50%, transparent 70%)",
  },
};

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const singleBallRef = useRef(null);
  const gridRef = useRef(null);
  const textRef = useRef(null);
  const ballRefs = useRef([]);
  const pathRef = useRef(null);

  const [pointsString, setPointsString] = useState("");

  // ── 1. Calculate layout dimensions and SVG path points ──────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const ballSize = Math.round(Math.max(48, Math.min(100, Math.min(vw, vh) * 0.12)));
      const gap = Math.round(Math.max(10, Math.min(20, ballSize * 0.2)));

      container.style.setProperty("--ball-size", `${ballSize}px`);
      container.style.setProperty("--gap", `${gap}px`);

      const getBallCenter = (idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const x = col * (ballSize + gap) + ballSize / 2;
        const y = row * (ballSize + gap) + ballSize / 2;
        return `${x},${y}`;
      };

      // Trace path: top-right → top-left sweep, then down-left column
      const traceSequence = [2, 1, 0, 4, 8, 7, 6];
      setPointsString(traceSequence.map(getBallCenter).join(" "));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── 2. Run GSAP animation timeline once layout is ready ─────────
  useEffect(() => {
    if (!pointsString) return;

    const container = containerRef.current;
    if (!container) return;

    const ballSize = parseFloat(container.style.getPropertyValue("--ball-size")) || 60;
    const gap = parseFloat(container.style.getPropertyValue("--gap")) || 12;
    const totalGridSize = 3 * ballSize + 2 * gap;

    // Per-ball offset from grid center (used for the scatter-in animation)
    const ballOffsets = BALL_GRID.map((_, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const cx = col * (ballSize + gap) + ballSize / 2;
      const cy = row * (ballSize + gap) + ballSize / 2;
      const gridCenter = totalGridSize / 2;
      return { dx: cx - gridCenter, dy: cy - gridCenter };
    });

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(container, { yPercent: 0, opacity: 1 });
      gsap.set(singleBallRef.current, { x: 0, y: 0, scale: 0, opacity: 0, display: "block" });
      gsap.set(gridRef.current, { opacity: 0 });
      gsap.set(textRef.current, { opacity: 0, y: 20 });
      ballRefs.current.forEach((b) => {
        if (b) gsap.set(b, { scale: 0, opacity: 0, x: 0, y: 0 });
      });
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 1 });
      }

      const singleBallShadows = singleBallRef.current?.querySelectorAll(".ball-shadow-group");
      if (singleBallShadows) gsap.set(singleBallShadows, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // Phase 1: Single ball appears
      tl.to(singleBallRef.current, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)" });

      // Phase 2: Three bounces with decreasing height
      const bounceHeights = [ballSize * 0.85, ballSize * 0.45, ballSize * 0.2];
      bounceHeights.forEach((height, idx) => {
        tl.to(singleBallRef.current, {
          y: -height,
          duration: 0.38,
          ease: "power1.out",
          onStart: () => {
            if (idx === 0 && singleBallShadows) {
              gsap.to(singleBallShadows, { opacity: 1, duration: 0.2 });
            }
          },
        });
        tl.to(singleBallRef.current, { y: 0, duration: 0.32, ease: "power1.in" });
      });

      // Phase 3: Squash on final land, then vanish
      tl.to(singleBallRef.current, { scaleX: 1.15, scaleY: 0.85, duration: 0.16, ease: "power2.in" });
      tl.to(singleBallRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.1,
        ease: "power4.in",
        onComplete: () => gsap.set(singleBallRef.current, { display: "none" }),
      });

      // Phase 4: 3×3 grid scatters in from center
      tl.set(gridRef.current, { opacity: 1 });
      ballRefs.current.forEach((ball, i) => {
        if (!ball) return;
        const { dx, dy } = ballOffsets[i];
        tl.fromTo(
          ball,
          { x: -dx, y: -dy, scale: 0, opacity: 0 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
          i === 0 ? "-=0.0" : "-=0.48",
        );
      });

      // Phase 5: Grid settle squash → elastic bounce
      tl.to(ballRefs.current, { scaleY: 0.86, scaleX: 1.08, duration: 0.12, ease: "power2.in", stagger: { amount: 0.06 } });
      tl.to(ballRefs.current, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1, 0.4)", stagger: { amount: 0.1 } });

      // Phase 6: SVG path traces over the grid
      if (pathRef.current) {
        tl.to(pathRef.current, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }, "-=0.2");
      }

      // Phase 7: Studio name fades in
      tl.to(textRef.current, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, "-=0.5");

      // Phase 8: Entire screen slides up to reveal the site
      tl.to(container, {
        yPercent: -100,
        duration: 1.4,
        ease: "power4.inOut",
        onComplete,
      }, "+=0.3");
    }, container);

    return () => ctx.revert();
  }, [pointsString, onComplete]);

  // ── Glass ball renderer ─────────────────────────────────────────
  const renderGlassBall = (type) => {
    const s = BALL_STYLES[type];
    return (
      <div style={{ position: "relative", width: "var(--ball-size)", height: "var(--ball-size)" }}>
        {/* Body */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: s.bodyBg, boxShadow: s.shadows,
          backdropFilter: "blur(8px) saturate(1.4) brightness(0.95)",
          WebkitBackdropFilter: "blur(8px) saturate(1.4) brightness(0.95)",
          border: "1px solid rgba(255,255,255,0.6)",
        }} />

        {/* Core overlay + inner glow */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: s.coreBg, mixBlendMode: "overlay" }}>
          <div style={{
            position: "absolute", bottom: "12%", right: "14%", width: "55%", height: "45%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${s.innerGlow} 0%, transparent 80%)`,
            transform: "rotate(20deg)", filter: "blur(0.5px)",
          }} />
        </div>

        {/* Specular highlights */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "transparent", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "5%", left: "10%", width: "45%", height: "32%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 75%)",
            transform: "rotate(-12deg)",
          }} />
          <div style={{
            position: "absolute", top: "14%", left: "20%",
            width: "calc(var(--ball-size) * 0.08)", height: "calc(var(--ball-size) * 0.08)",
            maxHeight: "8px", maxWidth: "8px", borderRadius: "50%",
            background: "#ffffff", boxShadow: "0 0 8px 2px rgba(255,255,255,1)",
          }} />
          <div style={{
            position: "absolute", inset: "1px", borderRadius: "50%",
            boxShadow: "inset 0 -5px 10px rgba(255,255,255,0.4), inset -2px 0 5px rgba(255,255,255,0.2)",
            mixBlendMode: "overlay",
          }} />
        </div>

        {/* Ground shadow + caustic */}
        <div className="ball-shadow-group" style={{ position: "absolute", bottom: "-20%", left: "4%", right: "4%", height: "20%", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse, ${s.groundShadow} 0%, transparent 75%)`,
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", inset: "1px 4px", background: s.caustic,
            borderRadius: "50%", mixBlendMode: "color-dodge", filter: "blur(2px)", opacity: 0.85,
          }} />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "1rem", overflow: "hidden",
        background: "#d2d6db",
        willChange: "transform",
      }}
    >
      {/* Radial light vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(190,196,204,0.15) 60%, transparent 100%)",
      }} />

      {/* Single bouncing ball (pre-grid phase) */}
      <div
        ref={singleBallRef}
        style={{
          position: "absolute",
          left: "calc(50% - var(--ball-size) / 2)",
          top: "calc(50% - var(--ball-size) / 2)",
          width: "var(--ball-size)", height: "var(--ball-size)",
          opacity: 0, zIndex: 3,
        }}
      >
        {renderGlassBall("gray")}
      </div>

      {/* Grid + trace path + studio name */}
      <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "100%", maxHeight: "100%", gap: "clamp(1rem, 3vh, 2rem)" }}>

        {/* 3×3 ball grid with SVG trace overlay */}
        <div
          ref={gridRef}
          style={{
            position: "relative", opacity: 0,
            width: "calc(3 * var(--ball-size) + 2 * var(--gap))",
            height: "calc(3 * var(--ball-size) + 2 * var(--gap))",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, var(--ball-size))", gap: "var(--gap)", width: "100%", height: "100%" }}>
            {BALL_GRID.map((type, i) => (
              <div
                key={i}
                ref={(el) => { ballRefs.current[i] = el; }}
                style={{ transformOrigin: "center center" }}
              >
                {renderGlassBall(type)}
              </div>
            ))}
          </div>

          {pointsString && (
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, width: "100%", height: "100%" }}>
              <polyline
                ref={pathRef}
                points={pointsString}
                fill="none"
                stroke="#ffffff"
                strokeWidth="max(2px, min(4px, 1vw))"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}
              />
            </svg>
          )}
        </div>

        {/* Studio name */}
        <div
          ref={textRef}
          style={{ opacity: 0, textAlign: "center", width: "100%", paddingLeft: "1rem", paddingRight: "1rem", userSelect: "none" }}
        >
          <h1 style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(1.25rem, 5vw, 2.25rem)",
            fontWeight: 600, letterSpacing: "0.08em",
            color: "#1a1d22", margin: 0, lineHeight: 1.2,
          }}>
            Design Synthesis
          </h1>
          <p style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "clamp(0.6rem, 2vw, 0.75rem)",
            letterSpacing: "0.45em", color: "#555a61",
            textTransform: "uppercase", margin: "8px 0 0", textIndent: "0.45em",
          }}>
            Studio
          </p>
        </div>
      </div>
    </div>
  );
}