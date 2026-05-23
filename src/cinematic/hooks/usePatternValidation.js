/**
 * usePatternValidation.js
 * ─────────────────────────────────────────────────────────────────
 * Validates a completed pattern sequence against the correct answer.
 * Returns result immediately — no async, no side-effects.
 *
 * Kept as a hook (not a plain function) so it can be extended with
 * server-side validation or rate-limiting in the future.
 * ─────────────────────────────────────────────────────────────────
 */
import { useCallback } from "react";
import { isCorrectPattern } from "../utils/patternHelpers.js";

/**
 * @returns {{ validate: (sequence: number[]) => boolean }}
 */
export function usePatternValidation() {
  const validate = useCallback((sequence) => {
    return isCorrectPattern(sequence);
  }, []);

  return { validate };
}