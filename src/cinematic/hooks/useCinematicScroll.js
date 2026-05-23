/**
 * useCinematicScroll.js
 * ─────────────────────────────────────────────────────────────────
 * Watches phase changes and calls lenis.stop() / lenis.start()
 * at exactly the right moment — preventing any scroll activity
 * during the cinematic experience, then releasing cleanly.
 *
 * This hook is mounted ONCE inside CinematicOrchestrator.
 * It must live below both LenisProvider and CinematicProvider.
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from "react";
import { useLenis }     from "../../context/LenisContext.jsx";
import { useCinematic } from "../state/CinematicContext.jsx";
import { selectors }    from "../state/cinematicMachine.js";

export function useCinematicScroll() {
  const { stop, start } = useLenis();
  const { phase }       = useCinematic();

  // Track previous phase to detect the exact completed transition
  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    const shouldLock = selectors.shouldScrollBeLocked(phase);

    if (shouldLock) {
      stop();
    } else {
      // Arriving at `completed` — ensure window is at the very top
      // before re-enabling so there's no jump to a random offset.
      if (prevPhaseRef.current !== phase) {
        // Use native scroll reset here (not lenis.scrollTo) to avoid
        // the animated scroll conflicting with the unlock.
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      start();
    }

    prevPhaseRef.current = phase;
  }, [phase, stop, start]);
}