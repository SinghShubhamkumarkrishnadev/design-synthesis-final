/**
 * usePhaseTransition.js
 * ─────────────────────────────────────────────────────────────────
 * Fires `onEnter` exactly once when `phase === targetPhase`.
 * Fires `onLeave`  exactly once when leaving that phase.
 *
 * Usage:
 *   usePhaseTransition(PHASE.INTRO, {
 *     onEnter: () => playIntroVideo(),
 *     onLeave: () => pauseIntroVideo(),
 *   });
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from "react";
import { useCinematic } from "../state/CinematicContext.jsx";

/**
 * @param {string}   targetPhase
 * @param {{ onEnter?: () => void, onLeave?: () => void }} callbacks
 */
export function usePhaseTransition(targetPhase, { onEnter, onLeave } = {}) {
  const { phase } = useCinematic();
  const wasActive = useRef(false);

  // Stable refs so callers don't need to memoize callbacks
  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);
  useEffect(() => { onEnterRef.current = onEnter; }, [onEnter]);
  useEffect(() => { onLeaveRef.current = onLeave; }, [onLeave]);

  useEffect(() => {
    const isActive = phase === targetPhase;

    if (isActive && !wasActive.current) {
      wasActive.current = true;
      onEnterRef.current?.();
    }

    if (!isActive && wasActive.current) {
      wasActive.current = false;
      onLeaveRef.current?.();
    }
  }, [phase, targetPhase]);
}