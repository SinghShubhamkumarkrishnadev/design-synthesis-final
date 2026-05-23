/**
 * patternConstants.js
 * ─────────────────────────────────────────────────────────────────
 * All magic numbers and configuration for the pattern lock system.
 * Single source of truth — no values scattered across components.
 * ─────────────────────────────────────────────────────────────────
 */

// ── SVG coordinate system ────────────────────────────────────────
// All geometry is expressed in SVG user units, then scaled by viewBox.
// viewBox is square — aspect is enforced by preserveAspectRatio.
export const VIEW_SIZE     = 600;   // viewBox "0 0 600 600"
export const GRID_COLS     = 3;
export const GRID_ROWS     = 3;
export const NODE_COUNT    = GRID_COLS * GRID_ROWS;   // 9

// Grid occupies a centred region within the viewBox
export const GRID_PADDING  = 120;   // inset from viewBox edge to first node
export const GRID_STEP     = (VIEW_SIZE - GRID_PADDING * 2) / (GRID_COLS - 1);
// → GRID_STEP = (600 - 240) / 2 = 180

// ── Node geometry ────────────────────────────────────────────────
export const NODE_RADIUS         = 10;    // outer ring
export const NODE_CORE_RADIUS    = 3.5;  // filled centre dot
export const NODE_HIT_RADIUS     = 42;   // invisible pointer-capture zone
export const NODE_GLOW_RADIUS    = 22;   // radial gradient glow spread

// ── Correct unlock sequence ──────────────────────────────────────
// Grid indices (0-indexed, row-major):
//   0 1 2
//   3 4 5
//   6 7 8
// Reverse-Z: 2 → 1 → 0 → 3 → 4 → 8 → 7 → 6
export const CORRECT_PATTERN = [2, 1, 0, 4, 8, 7, 6];

// ── Visual palette ───────────────────────────────────────────────
export const COLOR = Object.freeze({
  // Background overlay
  OVERLAY_BG:           "rgba(4, 12, 8, 0.72)",   // very dark green-tinted black

  // Node states
  NODE_IDLE_RING:       "rgba(180, 200, 185, 0.18)",
  NODE_IDLE_CORE:       "rgba(180, 200, 185, 0.35)",
  NODE_ACTIVE_RING:     "rgba(160, 195, 165, 0.70)",
  NODE_ACTIVE_CORE:     "#a8c8a0",
  NODE_ERROR_RING:      "rgba(200, 160, 140, 0.55)",
  NODE_ERROR_CORE:      "rgba(200, 160, 140, 0.80)",

  // Connection lines
  LINE_IDLE:            "rgba(160, 195, 165, 0.40)",
  LINE_ACTIVE:          "rgba(160, 195, 165, 0.60)",
  LINE_PREVIEW:         "rgba(160, 195, 165, 0.25)",  // drag-in-progress line
  LINE_ERROR:           "rgba(200, 160, 140, 0.40)",

  // Glow filter colours (used in SVG filter defs)
  GLOW_GREEN:           "#7ab87a",
  GLOW_ERROR:           "#c8a08c",

  // Text / label
  LABEL_TEXT:           "rgba(180, 200, 185, 0.45)",
  HINT_TEXT:            "rgba(180, 200, 185, 0.28)",
});

// ── Animation timing ─────────────────────────────────────────────
export const TIMING = Object.freeze({
  OVERLAY_ENTER_DURATION:    0.9,   // s — overlay fade in
  OVERLAY_ENTER_EASE:        "power2.out",

  NODE_ACTIVATE_DURATION:    0.25,  // s — node activation spring
  ERROR_HOLD_MS:             700,   // ms — hold error state before reset
  ERROR_FADE_MS:             400,   // ms — reset fade duration
  SUCCESS_PULSE_MS:          600,   // ms — success pulse before exit
  SUCCESS_EXIT_MS:           800,   // ms — overlay exit after success
});

// ── Line stroke widths ───────────────────────────────────────────
export const STROKE = Object.freeze({
  COMMITTED_LINE:  1.5,
  PREVIEW_LINE:    1.0,
});