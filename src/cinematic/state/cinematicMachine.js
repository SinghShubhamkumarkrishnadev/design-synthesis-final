/**
 * cinematicMachine.js
 * ─────────────────────────────────────────────────────────────────
 * Pure state machine (no React deps) for the cinematic experience.
 *
 * Phase flow:
 *   loading ──► intro ──► locked ──► interior ──► completed
 *
 * Rules:
 *  • Only valid transitions are allowed (invalid ones are no-ops).
 *  • Every state carries a `meta` bag for phase-specific metadata.
 *  • The reducer is a plain function — easy to unit-test.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Phase constants ──────────────────────────────────────────────
export const PHASE = Object.freeze({
  LOADING:   "loading",
  INTRO:     "intro",
  LOCKED:    "locked",
  INTERIOR:  "interior",
  COMPLETED: "completed",
});

// ── Action types ─────────────────────────────────────────────────
export const ACTION = Object.freeze({
  ASSETS_READY:      "ASSETS_READY",       // videos preloaded → loading → intro
  INTRO_ENDED:       "INTRO_ENDED",        // intro video ended → intro → locked
  LOCK_SOLVED:       "LOCK_SOLVED",        // pattern lock solved → locked → interior
  INTERIOR_ENDED:    "INTERIOR_ENDED",     // interior video ended → interior → completed
  FORCE_COMPLETE:    "FORCE_COMPLETE",     // escape hatch (skip / dev) → completed
  SET_LOAD_PROGRESS: "SET_LOAD_PROGRESS",  // update preload %
});

// ── Valid transitions ────────────────────────────────────────────
const TRANSITIONS = {
  [PHASE.LOADING]:   [ACTION.ASSETS_READY,   ACTION.FORCE_COMPLETE, ACTION.SET_LOAD_PROGRESS],
  [PHASE.INTRO]:     [ACTION.INTRO_ENDED,    ACTION.FORCE_COMPLETE],
  [PHASE.LOCKED]:    [ACTION.LOCK_SOLVED,    ACTION.FORCE_COMPLETE],
  [PHASE.INTERIOR]:  [ACTION.INTERIOR_ENDED, ACTION.FORCE_COMPLETE],
  [PHASE.COMPLETED]: [], // terminal — no transitions
};

// ── Initial state ────────────────────────────────────────────────
export const initialState = {
  phase:        PHASE.LOADING,
  loadProgress: 0,       // 0–100
  meta: {},
};

// ── Reducer ──────────────────────────────────────────────────────
export function cinematicReducer(state, action) {
  const allowed = TRANSITIONS[state.phase] ?? [];

  // Guard: reject invalid transitions silently in production
  if (!allowed.includes(action.type)) {
    if (import.meta.env.DEV) {
      console.warn(
        `[CinematicMachine] Ignored action "${action.type}" in phase "${state.phase}".`
      );
    }
    return state;
  }

  switch (action.type) {
    case ACTION.SET_LOAD_PROGRESS:
      return {
        ...state,
        loadProgress: Math.min(100, Math.max(0, action.payload ?? 0)),
      };

    case ACTION.ASSETS_READY:
      return { ...state, phase: PHASE.INTRO, loadProgress: 100, meta: {} };

    case ACTION.INTRO_ENDED:
      return { ...state, phase: PHASE.LOCKED, meta: {} };

    case ACTION.LOCK_SOLVED:
      return { ...state, phase: PHASE.INTERIOR, meta: {} };

    case ACTION.INTERIOR_ENDED:
      return { ...state, phase: PHASE.COMPLETED, meta: {} };

    case ACTION.FORCE_COMPLETE:
      return { ...state, phase: PHASE.COMPLETED, loadProgress: 100, meta: { forced: true } };

    default:
      return state;
  }
}

// ── Selectors ────────────────────────────────────────────────────
export const selectors = {
  isOverlayVisible: (phase) =>
    phase !== PHASE.COMPLETED,

  shouldScrollBeLocked: (phase) =>
    phase === PHASE.LOADING ||
    phase === PHASE.INTRO    ||
    phase === PHASE.LOCKED   ||
    phase === PHASE.INTERIOR,

  isVideoPhase: (phase) =>
    phase === PHASE.INTRO || phase === PHASE.INTERIOR,
};