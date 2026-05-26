/**
 * CinematicOrchestrator.jsx  [Flash Fix]
 * ─────────────────────────────────────────────────────────────────
 * Flash fixes applied here:
 *
 * FIX 1 — Explicit black background on the overlay container
 *   The position:fixed overlay div previously had no background.
 *   Any gap between slot transitions (e.g. during React reconciler
 *   flush between unmounting one slot and mounting the next) would
 *   show a transparent fixed div — revealing the website below.
 *
 *   Solution: background:#000 on the overlay container. Every slot
 *   fades in FROM this black. Every slot fades out TO this black.
 *   There is never a transparent moment.
 *
 * FIX 2 — pointerEvents:none removed during active phases
 *   The overlay should capture all pointer events during cinematic
 *   to prevent any interaction with the website below.
 *
 * FIX 3 — Explicit overflow:hidden
 *   Prevents any child overflow from appearing outside the overlay
 *   bounds during transforms.
 *
 * All Phase 4 orchestration architecture preserved.
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useCallback } from "react";
import { useCinematic }         from "../state/CinematicContext.jsx";
import { ACTION, PHASE }        from "../state/cinematicMachine.js";
import { useVideoPreloader }    from "../hooks/useVideoPreloader.js";
import { useCinematicScroll }   from "../hooks/useCinematicScroll.js";

import { CinematicLoadingSlot }  from "./slots/CinematicLoadingSlot.jsx";
import { CinematicIntroSlot }    from "./slots/CinematicIntroSlot.jsx";
import { CinematicLockedSlot }   from "./slots/CinematicLockedSlot.jsx";
import { CinematicInteriorSlot } from "./slots/CinematicInteriorSlot.jsx";

const VIDEO_SOURCES = [
  { id: "intro",    src: "/videos/intro.mp4"    },
  { id: "interior", src: "/videos/interior.mp4" },
];

export default function CinematicOrchestrator() {
  const { phase, loadProgress, dispatch } = useCinematic();

  useCinematicScroll();

  const { progress, isReady, videoRefs } = useVideoPreloader(
    VIDEO_SOURCES,
    { enabled: phase !== PHASE.COMPLETED }
  );

  const loadingAnimDone = useRef(false);
  const videosReady     = useRef(false);

  const tryAdvance = useCallback(() => {
    if (loadingAnimDone.current && videosReady.current) {
      dispatch({ type: ACTION.ASSETS_READY });
    }
  }, [dispatch]);

  useEffect(() => {
    if (isReady && phase === PHASE.LOADING) {
      videosReady.current = true;
      tryAdvance();
    }
  }, [isReady, phase, tryAdvance]);

  useEffect(() => {
    if (phase === PHASE.LOADING) {
      dispatch({ type: ACTION.SET_LOAD_PROGRESS, payload: progress });
    }
  }, [progress, phase, dispatch]);

  const handleLoadingComplete = useCallback(() => {
    loadingAnimDone.current = true;
    tryAdvance();
  }, [tryAdvance]);

  // Overlay fully unmounts on COMPLETED — returns null.
  // At this point the website's visibility:hidden has already been
  // flipped to visible (via App.jsx phase check) and the website
  // is fully rendered underneath. Unmounting the overlay is a
  // simple React reconciler operation with no visual consequence.
  if (phase === PHASE.COMPLETED) return null;

  const introVideoRef    = { current: videoRefs.current?.get("intro")    ?? null };
  const interiorVideoRef = { current: videoRefs.current?.get("interior") ?? null };

  return (
    /*
     * FIX: Explicit background:#000 on the overlay root.
     *
     * This is the single most important structural fix.
     * All slot enter/exit animations fade between this black and
     * their content. There is NEVER a transparent window in this
     * overlay during the cinematic experience.
     *
     * The overlay is position:fixed, inset:0, zIndex:100.
     * With background:#000, even if ALL slot children were opacity:0
     * simultaneously (which shouldn't happen but could during a
     * React reconciler flush), the user sees black — not the website.
     */
    <div
      aria-hidden="true"
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     100,
        overflow:   "hidden",
        background: "#000",    // FIX: always opaque black
      }}
    >
      {phase === PHASE.LOADING && (
        <CinematicLoadingSlot
          progress={loadProgress}
          onComplete={handleLoadingComplete}
        />
      )}

      {phase === PHASE.INTRO && (
        <CinematicIntroSlot
          videoRef={introVideoRef}
          onEnded={() => dispatch({ type: ACTION.INTRO_ENDED })}
        />
      )}

      {phase === PHASE.LOCKED && (
        <CinematicLockedSlot
          onSolved={() => dispatch({ type: ACTION.LOCK_SOLVED })}
        />
      )}

      {(phase === PHASE.INTERIOR || phase === PHASE.HANDOFF) && (
        <CinematicInteriorSlot
          videoRef={interiorVideoRef}
          onHandoff={() => dispatch({ type: ACTION.HANDOFF_READY })}
          onEnded={()   => dispatch({ type: ACTION.INTERIOR_ENDED })}
        />
      )}
    </div>
  );
}