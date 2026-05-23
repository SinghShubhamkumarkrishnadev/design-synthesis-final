/**
 * useCinematicScroll.js  [Phase 4 — updated]
 * ─────────────────────────────────────────────────────────────────
 * Phase 4 change: uses selectors.shouldScrollBeLocked which now
 * includes PHASE.HANDOFF in its lock set.
 *
 * Lenis is started ONCE on COMPLETED and never stopped again by
 * this hook — the scroll position is preserved at 0 because the
 * website was locked throughout the cinematic.
 *
 * This file REPLACES the existing useCinematicScroll.js.
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from "react";
import { useCinematic }  from "../state/CinematicContext.jsx";
import { PHASE, selectors } from "../state/cinematicMachine.js";
import { useLenis }      from "../../context/LenisContext.jsx";

export function useCinematicScroll() {
  const { phase }       = useCinematic();
  const { stop, start } = useLenis();
  const startedRef      = useRef(false);

  useEffect(() => {
    if (selectors.shouldScrollBeLocked(phase)) {
      stop();
      startedRef.current = false;
    } else if (phase === PHASE.COMPLETED && !startedRef.current) {
      // Restore scroll exactly once — no jump, no position loss
      // Small delay so Lenis initializes cleanly after overlay unmounts
      startedRef.current = true;
      const id = setTimeout(() => start(), 80);
      return () => clearTimeout(id);
    }
  }, [phase, stop, start]);
}