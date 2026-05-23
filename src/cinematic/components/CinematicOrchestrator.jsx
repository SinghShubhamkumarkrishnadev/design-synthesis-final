/**
 * CinematicOrchestrator.jsx  [Phase 2 — updated]
 * ─────────────────────────────────────────────────────────────────
 * Phase 1 architecture is preserved exactly.
 * Phase 2 changes:
 *   • Fixes the loading→intro handoff: the LoadingScreen animation
 *     and video preloading are now properly coordinated via two refs
 *     (`loadingAnimationDone`, `videosReady`) so ASSETS_READY only
 *     fires when BOTH conditions are satisfied — no race condition.
 *   • Passes the real videoRefs Map to the slot components so
 *     useAdoptVideo can move the live elements.
 *   • CinematicLoadingSlot, CinematicLockedSlot unchanged.
 *   • CinematicIntroSlot, CinematicInteriorSlot replaced by Phase 2
 *     implementations.
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

// ── Video source registry ────────────────────────────────────────
const VIDEO_SOURCES = [
  { id: "intro",    src: "/videos/intro.mp4"    },
  { id: "interior", src: "/videos/interior.mp4" },
];

// ── Orchestrator ─────────────────────────────────────────────────
export default function CinematicOrchestrator() {
  const { phase, loadProgress, dispatch } = useCinematic();

  useCinematicScroll();

  const { progress, isReady, videoRefs } = useVideoPreloader(
    VIDEO_SOURCES,
    { enabled: phase !== PHASE.COMPLETED }
  );

  // ── Handoff coordination ─────────────────────────────────────────
  // Both conditions must be true before ASSETS_READY fires:
  //   loadingAnimDone — LoadingScreen exit animation completed
  //   videosReady     — preloader has buffered enough to play
  const loadingAnimDone = useRef(false);
  const videosReady     = useRef(false);

  const tryAdvance = useCallback(() => {
    if (loadingAnimDone.current && videosReady.current) {
      dispatch({ type: ACTION.ASSETS_READY });
    }
  }, [dispatch]);

  // Watch isReady from preloader
  useEffect(() => {
    if (isReady && phase === PHASE.LOADING) {
      videosReady.current = true;
      tryAdvance();
    }
  }, [isReady, phase, tryAdvance]);

  // Dispatch progress updates
  useEffect(() => {
    if (phase === PHASE.LOADING) {
      dispatch({ type: ACTION.SET_LOAD_PROGRESS, payload: progress });
    }
  }, [progress, phase, dispatch]);

  // Called by CinematicLoadingSlot when its exit animation ends
  const handleLoadingComplete = useCallback(() => {
    loadingAnimDone.current = true;
    tryAdvance();
  }, [tryAdvance]);

  // Overlay removed when experience is complete
  if (phase === PHASE.COMPLETED) return null;

  // ── Build stable videoRef objects for slot consumption ───────────
  // These objects are stable per render — the Map itself is a ref.
  // Slots access videoRefs.current.get(id) inside their own effects.
  const introVideoRef    = { current: videoRefs.current?.get("intro")    ?? null };
  const interiorVideoRef = { current: videoRefs.current?.get("interior") ?? null };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset:    0,
        zIndex:   100,
        overflow: "hidden",
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

      {phase === PHASE.INTERIOR && (
        <CinematicInteriorSlot
          videoRef={interiorVideoRef}
          onEnded={() => dispatch({ type: ACTION.INTERIOR_ENDED })}
        />
      )}
    </div>
  );
}