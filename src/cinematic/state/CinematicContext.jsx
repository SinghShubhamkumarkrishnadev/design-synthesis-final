/**
 * CinematicContext.jsx
 * ─────────────────────────────────────────────────────────────────
 * Provides the cinematic state machine to the entire React tree.
 *
 * Usage:
 *   const { phase, loadProgress, dispatch } = useCinematic();
 *   dispatch({ type: ACTION.ASSETS_READY });
 * ─────────────────────────────────────────────────────────────────
 */
import { createContext, useContext, useReducer, useMemo } from "react";
import { cinematicReducer, initialState } from "./cinematicMachine.js";

// ── Context ──────────────────────────────────────────────────────
const CinematicContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────
export function CinematicProvider({ children }) {
  const [state, dispatch] = useReducer(cinematicReducer, initialState);

  // Memoize the context value so consumers only re-render when
  // state actually changes (not on every parent render).
  const value = useMemo(
    () => ({ phase: state.phase, loadProgress: state.loadProgress, meta: state.meta, dispatch }),
    [state.phase, state.loadProgress, state.meta]
    // dispatch is stable across renders — no need to include it
  );

  return (
    <CinematicContext.Provider value={value}>
      {children}
    </CinematicContext.Provider>
  );
}

// ── Consumer hook ────────────────────────────────────────────────
export function useCinematic() {
  const ctx = useContext(CinematicContext);
  if (!ctx) {
    throw new Error("useCinematic must be used inside <CinematicProvider>.");
  }
  return ctx;
}