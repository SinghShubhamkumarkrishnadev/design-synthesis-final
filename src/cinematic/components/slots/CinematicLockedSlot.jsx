/**
 * CinematicLockedSlot.jsx  [Phase 3]
 * ─────────────────────────────────────────────────────────────────
 * Phase: LOCKED
 *
 * Phase 3 replaces the stub entirely.
 *
 * What this slot owns:
 *   • GSAP enter fade (consistent with other slots)
 *   • PatternLockOverlay mounting
 *   • onSolved callback routing (dispatches LOCK_SOLVED via orchestrator)
 *
 * What PatternLockOverlay owns:
 *   • Freeze-frame image rendering
 *   • Glass panel
 *   • Interactive SVG pattern grid
 *   • Framer Motion entrance / success exit
 *   • Status label
 *
 * The slot container is intentionally transparent — the overlay
 * renders the background itself to maintain visual control.
 *
 * DEV skip button is preserved in development builds.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { PatternLockOverlay } from "../lock/PatternLockOverlay";
import "../../styles/pattern-lock.css";

export function CinematicLockedSlot({ onSolved }) {
  const containerRef = useRef(null);

  // ── Enter fade — matches Phase 2 slot convention ──────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position:   "fixed",
        inset:       0,
        zIndex:      0,
        opacity:     0,
        transform:  "translateZ(0)",
        willChange: "opacity",
        // No background here — PatternLockOverlay owns the visual stack
      }}
    >
      {/* ── Pattern lock system ─────────────────────────────────── */}
      <PatternLockOverlay onUnlocked={onSolved} />

      {/* ── DEV skip ───────────────────────────────────────────── */}
      {import.meta.env.DEV && (
        <button
          onClick={onSolved}
          style={{
            position:     "fixed",
            bottom:       "24px",
            right:        "24px",
            padding:      "5px 14px",
            background:   "rgba(255,255,255,0.06)",
            border:       "1px solid rgba(255,255,255,0.12)",
            borderRadius: "3px",
            color:        "rgba(255,255,255,0.4)",
            cursor:       "pointer",
            fontFamily:   "monospace",
            fontSize:     "10px",
            letterSpacing: "0.1em",
            zIndex:        9999,
          }}
        >
          skip →
        </button>
      )}
    </div>
  );
}