/**
 * usePatternAnimation.js
 * ─────────────────────────────────────────────────────────────────
 * Returns animation props / variants derived from lock state.
 * Keeps animation logic out of render components.
 *
 * Two layers of animation:
 *
 * 1. Framer Motion (discrete state changes)
 *    • Overlay entrance / exit
 *    • Node activation pulse
 *    • Success / error state transitions
 *
 * 2. Direct SVG attribute writes (continuous / high-frequency)
 *    • Preview line position (handled by usePatternGesture via rAF)
 *    • This hook does NOT touch those — separation of concerns.
 *
 * ─────────────────────────────────────────────────────────────────
 */
import { useMemo } from "react";
import { LOCK_STATE } from "../utils/patternHelpers.js";
import { TIMING, COLOR } from "../utils/patternConstants.js";

/**
 * @param {{ lockState: string }} opts
 * @returns {{
 *   overlayVariants: object,
 *   overlayAnimate: string,
 *   lineColor: string,
 *   isError: boolean,
 *   isSuccess: boolean,
 * }}
 */
export function usePatternAnimation({ lockState }) {
  const isError   = lockState === LOCK_STATE.ERROR;
  const isSuccess = lockState === LOCK_STATE.SUCCESS;

  // ── Overlay Framer Motion variants ───────────────────────────────
  const overlayVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)",
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(6px)",
      transition: {
        duration: TIMING.OVERLAY_ENTER_DURATION,
        ease:     [0.25, 0.1, 0.25, 1.0],
      },
    },
    exit: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: TIMING.SUCCESS_EXIT_MS / 1000,
        ease:     [0.76, 0, 0.24, 1],
      },
    },
  }), []);

  const overlayAnimate = isSuccess ? "exit" : "visible";

  // ── Line colour interpolated by state ────────────────────────────
  const lineColor = isError   ? COLOR.LINE_ERROR
                  : isSuccess ? COLOR.LINE_ACTIVE
                  :             COLOR.LINE_ACTIVE;

  return {
    overlayVariants,
    overlayAnimate,
    lineColor,
    isError,
    isSuccess,
  };
}