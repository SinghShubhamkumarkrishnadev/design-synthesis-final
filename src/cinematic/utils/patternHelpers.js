/**
 * patternHelpers.js
 * ─────────────────────────────────────────────────────────────────
 * Higher-level helpers that operate on pattern sequences.
 * No DOM, no React, pure functions.
 * ─────────────────────────────────────────────────────────────────
 */
import { CORRECT_PATTERN } from "./patternConstants.js";

/**
 * Check if the given sequence matches the correct unlock pattern.
 *
 * @param {number[]} sequence
 * @returns {boolean}
 */
export function isCorrectPattern(sequence) {
  if (sequence.length !== CORRECT_PATTERN.length) return false;
  return sequence.every((v, i) => v === CORRECT_PATTERN[i]);
}

/**
 * Is this sequence a valid prefix of the correct pattern?
 * Used to provide early feedback (not currently used in V1 but
 * available for future progressive validation).
 *
 * @param {number[]} sequence
 * @returns {boolean}
 */
export function isValidPrefix(sequence) {
  return sequence.every((v, i) => v === CORRECT_PATTERN[i]);
}

/**
 * Pattern lock interaction states.
 */
export const LOCK_STATE = Object.freeze({
  IDLE:    "idle",    // no interaction started
  DRAWING: "drawing", // user is actively dragging
  SUCCESS: "success", // correct pattern entered
  ERROR:   "error",   // incorrect pattern, resetting
});