/**
 * usePatternLock.js
 * ─────────────────────────────────────────────────────────────────
 * Manages the DISCRETE state of the pattern lock:
 *   • Which nodes have been selected (committed sequence)
 *   • Current lock state (idle / drawing / success / error)
 *
 * PERFORMANCE CONTRACT:
 *   This hook uses React state ONLY for discrete events:
 *     - node activated (new node in sequence)
 *     - gesture ended (success / error / idle)
 *     - reset completed
 *
 *   HIGH-FREQUENCY pointer movement is NOT managed here.
 *   The gesture hook owns pointer coordinates via refs.
 *
 * ─────────────────────────────────────────────────────────────────
 */
import { useState, useCallback, useRef } from "react";
import { LOCK_STATE }           from "../utils/patternHelpers.js";
import { usePatternValidation } from "./usePatternValidation.js";
import { TIMING }               from "../utils/patternConstants.js";

/**
 * @param {object} opts
 * @param {() => void} opts.onSuccess — called after success animation window
 * @returns {object}
 */
export function usePatternLock({ onSuccess }) {
  const [lockState, setLockState] = useState(LOCK_STATE.IDLE);
  const [sequence,  setSequence]  = useState([]);   // selected node indices

  const { validate } = usePatternValidation();

  // Prevent double-firing during animation windows
  const resolvedRef = useRef(false);
  const onSuccessStable = useRef(onSuccess);
  onSuccessStable.current = onSuccess;

  // ── Activate a node ───────────────────────────────────────────────
  const activateNode = useCallback((nodeIndex) => {
    setSequence((prev) => {
      // Prevent duplicate / re-entry
      if (prev.includes(nodeIndex)) return prev;
      return [...prev, nodeIndex];
    });
    setLockState(LOCK_STATE.DRAWING);
  }, []);

  // ── Commit gesture (pointer up / cancel) ─────────────────────────
  const commitGesture = useCallback((finalSequence) => {
    if (resolvedRef.current) return;

    if (finalSequence.length < 2) {
      // Too short — silent reset, not an error
      setLockState(LOCK_STATE.IDLE);
      setSequence([]);
      return;
    }

    if (validate(finalSequence)) {
      resolvedRef.current = true;
      setLockState(LOCK_STATE.SUCCESS);
      // Give the success animation time to play
      setTimeout(() => {
        onSuccessStable.current?.();
      }, TIMING.SUCCESS_PULSE_MS + TIMING.SUCCESS_EXIT_MS);
    } else {
      setLockState(LOCK_STATE.ERROR);
      // Hold error state, then reset
      setTimeout(() => {
        setLockState(LOCK_STATE.IDLE);
        setSequence([]);
        resolvedRef.current = false;
      }, TIMING.ERROR_HOLD_MS + TIMING.ERROR_FADE_MS);
    }
  }, [validate]);

  // ── External reset (e.g. after mount) ────────────────────────────
  const reset = useCallback(() => {
    setLockState(LOCK_STATE.IDLE);
    setSequence([]);
    resolvedRef.current = false;
  }, []);

  return {
    lockState,
    sequence,
    activateNode,
    commitGesture,
    reset,
  };
}