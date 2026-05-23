/**
 * CinematicOrchestrator.jsx  [Phase 4 — updated]
 * ─────────────────────────────────────────────────────────────────
 * Phase 4 changes:
 *   • Passes onHandoff to CinematicInteriorSlot so it can dispatch
 *     ACTION.HANDOFF_READY when the interior near-end is reached.
 *   • PHASE.HANDOFF is still overlayVisible — the slot stays mounted
 *     during the exit fade so we don't hard-cut.
 *   • Overlay removed on PHASE.COMPLETED as before.
 *
 * All Phase 2 orchestration architecture PRESERVED EXACTLY.
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

  // Overlay fully removed when experience is complete
  if (phase === PHASE.COMPLETED) return null;

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

      {/* INTERIOR + HANDOFF: slot stays mounted during exit fade */}
      {(phase === PHASE.INTERIOR || phase === PHASE.HANDOFF) && (
        <CinematicInteriorSlot
          videoRef={interiorVideoRef}
          onHandoff={() => dispatch({ type: ACTION.HANDOFF_READY })}
          onEnded={()  => dispatch({ type: ACTION.INTERIOR_ENDED })}
        />
      )}
    </div>
  );
}