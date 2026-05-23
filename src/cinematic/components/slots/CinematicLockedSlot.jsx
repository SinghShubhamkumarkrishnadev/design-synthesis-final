/**
 * CinematicLockedSlot.jsx  [Phase 2 — updated]
 * ─────────────────────────────────────────────────────────────────
 * Phase: LOCKED
 *
 * Phase 2 adds:
 *   • Black background that fades in cleanly after the intro exits.
 *   • The GSAP enter uses the same fade-from-black pattern as the
 *     video slots so all transitions feel consistent.
 *   • Pattern lock UI is NOT implemented yet (Phase 3).
 *   • DEV skip button preserved for iteration.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef, useEffect } from "react";
import gsap from "gsap";

export function CinematicLockedSlot({ onSolved }) {
  const containerRef = useRef(null);

  // Simple enter fade — no exit needed (pattern lock will handle exit)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position:        "fixed",
        inset:           0,
        background:      "#000",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        opacity:         0,
        transform:       "translateZ(0)",
        willChange:      "opacity",
      }}
    >
      {/*
       * Phase 3 will mount the pattern lock component here.
       * The container layout is intentionally minimal so Phase 3
       * can take full creative control of its contents.
       */}

      {import.meta.env.DEV && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <span style={{
            color:       "rgba(255,255,255,0.25)",
            fontFamily:  "monospace",
            fontSize:    "11px",
            letterSpacing: "0.15em",
          }}>
            [ LOCKED SLOT — PHASE 3 PATTERN LOCK ]
          </span>
          <button
            onClick={onSolved}
            style={{
              padding:      "6px 16px",
              background:   "rgba(255,255,255,0.08)",
              border:       "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              color:        "rgba(255,255,255,0.6)",
              cursor:       "pointer",
              fontFamily:   "monospace",
              fontSize:     "11px",
              letterSpacing: "0.1em",
            }}
          >
            skip → interior
          </button>
        </div>
      )}
    </div>
  );
}