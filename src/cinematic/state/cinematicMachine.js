/**
 * cinematicMachine.js  [Phase 4 — updated]
 * ─────────────────────────────────────────────────────────────────
 * Phase 4 change:
 *   • Adds HANDOFF_READY action and HANDOFF phase.
 *
 * Updated phase flow:
 *   loading ──► intro ──► locked ──► interior ──► handoff ──► completed
 *
 * Why HANDOFF?
 *   The interior slot's exit fade takes 1.2s. During that window the
 *   cinematic overlay is fading to transparent, revealing the website
 *   underneath. HomeSection needs to already be fully ready BEFORE
 *   that fade begins — not after overlay unmounts.
 *
 *   HANDOFF fires as soon as the interior video's near-end threshold
 *   is crossed (the same moment startExit() is called). HomeSection
 *   listens to HANDOFF to know it should be fully composited on-screen.
 *
 *   In practice HomeSection renders interior-final.jpg at full opacity
 *   at all times — it's just hidden under the z-index:100 overlay.
 *   HANDOFF is therefore mostly a semantic signal for future use and
 *   for any entrance typography/content animations.
 *
 *   COMPLETED is still what triggers overlay unmount (return null in
 *   CinematicOrchestrator) and Lenis restoration.
 *
 * All Phase 1-3 transitions are PRESERVED EXACTLY.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Phase constants ──────────────────────────────────────────────
export const PHASE = Object.freeze({
  LOADING:   "loading",
  INTRO:     "intro",
  LOCKED:    "locked",
  INTERIOR:  "interior",
  HANDOFF:   "handoff",   // NEW — interior exit fade in progress
  COMPLETED: "completed",
});

// ── Action types ─────────────────────────────────────────────────
export const ACTION = Object.freeze({
  ASSETS_READY:      "ASSETS_READY",
  INTRO_ENDED:       "INTRO_ENDED",
  LOCK_SOLVED:       "LOCK_SOLVED",
  INTERIOR_ENDED:    "INTERIOR_ENDED",
  HANDOFF_READY:     "HANDOFF_READY",    // NEW — interior near-end reached
  FORCE_COMPLETE:    "FORCE_COMPLETE",
  SET_LOAD_PROGRESS: "SET_LOAD_PROGRESS",
});

// ── Valid transitions ────────────────────────────────────────────
const TRANSITIONS = {
  [PHASE.LOADING]:   [ACTION.ASSETS_READY,   ACTION.FORCE_COMPLETE, ACTION.SET_LOAD_PROGRESS],
  [PHASE.INTRO]:     [ACTION.INTRO_ENDED,    ACTION.FORCE_COMPLETE],
  [PHASE.LOCKED]:    [ACTION.LOCK_SOLVED,    ACTION.FORCE_COMPLETE],
  [PHASE.INTERIOR]:  [ACTION.INTERIOR_ENDED, ACTION.HANDOFF_READY,  ACTION.FORCE_COMPLETE],
  [PHASE.HANDOFF]:   [ACTION.INTERIOR_ENDED, ACTION.FORCE_COMPLETE],
  [PHASE.COMPLETED]: [],
};

// ── Initial state ────────────────────────────────────────────────
export const initialState = {
  phase:        PHASE.LOADING,
  loadProgress: 0,
  meta: {},
};

// ── Reducer ──────────────────────────────────────────────────────
export function cinematicReducer(state, action) {
  const allowed = TRANSITIONS[state.phase] ?? [];

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

    // NEW — interior video near-end: signal handoff before overlay disappears
    case ACTION.HANDOFF_READY:
      return { ...state, phase: PHASE.HANDOFF, meta: {} };

    case ACTION.INTERIOR_ENDED:
      return { ...state, phase: PHASE.COMPLETED, meta: {} };

    case ACTION.FORCE_COMPLETE:
      return { ...state, phase: PHASE.COMPLETED, loadProgress: 100, meta: { forced: true } };

    default:
      return state;
  }
}

// ── Selectors ────────────────────────────────────────────────────
export const selectors = Object.freeze({
  isOverlayVisible: (phase) =>
    phase !== PHASE.COMPLETED,

  shouldScrollBeLocked: (phase) =>
    phase === PHASE.LOADING  ||
    phase === PHASE.INTRO    ||
    phase === PHASE.LOCKED   ||
    phase === PHASE.INTERIOR ||
    phase === PHASE.HANDOFF,

  isVideoPhase: (phase) =>
    phase === PHASE.INTRO || phase === PHASE.INTERIOR || phase === PHASE.HANDOFF,

  // HomeSection uses this — true during HANDOFF + COMPLETED
  isHandoffActive: (phase) =>
    phase === PHASE.HANDOFF || phase === PHASE.COMPLETED,
});