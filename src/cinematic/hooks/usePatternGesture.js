/**
 * usePatternGesture.js
 * ─────────────────────────────────────────────────────────────────
 * Owns all high-frequency pointer interaction:
 *   • Pointer capture (mouse + touch)
 *   • SVG coordinate mapping
 *   • Node snap detection
 *   • Live preview line updates (direct SVG attribute mutation)
 *   • Calls activateNode / commitGesture at the right moments
 *
 * PERFORMANCE CONTRACT:
 *   pointermove NEVER triggers a React re-render.
 *   All hot-path work happens via:
 *     - refs
 *     - requestAnimationFrame
 *     - direct SVG element attribute mutation
 *
 * Safari notes:
 *   • We use pointer events throughout (Safari 13+ support is fine).
 *   • touch-action: none on the SVG prevents scroll-cancellation.
 *   • We do NOT use setPointerCapture on the SVG element itself —
 *     we capture on the overlay div to avoid Safari SVG capture bugs.
 * ─────────────────────────────────────────────────────────────────
 */
import { useCallback, useRef, useEffect } from "react";
import { pointerToSVGCoords, findHitNode, NODE_POSITIONS } from "../utils/patternMath.js";
import { LOCK_STATE }                                       from "../utils/patternHelpers.js";

/**
 * @param {object} opts
 * @param {{ current: SVGSVGElement|null }}   opts.svgRef
 * @param {{ current: SVGLineElement|null }}  opts.previewLineRef  — the drag-preview <line>
 * @param {string}   opts.lockState
 * @param {number[]} opts.sequence
 * @param {(nodeIndex: number) => void}  opts.activateNode
 * @param {(finalSeq: number[]) => void} opts.commitGesture
 * @returns {{ handlers: object }}
 */
export function usePatternGesture({
  svgRef,
  previewLineRef,
  lockState,
  sequence,
  activateNode,
  commitGesture,
}) {
  const isDrawingRef    = useRef(false);
  const sequenceRef     = useRef(sequence);   // mirror for hot path
  const rafRef          = useRef(null);
  const pendingPtRef    = useRef(null);       // latest pointer position

  // Keep sequenceRef in sync with React state (cheap assignment)
  useEffect(() => { sequenceRef.current = sequence; }, [sequence]);

  // ── Hide preview line ─────────────────────────────────────────────
  const hidePreviewLine = useCallback(() => {
    const line = previewLineRef?.current;
    if (!line) return;
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", "0");
    line.setAttribute("y2", "0");
    line.setAttribute("opacity", "0");
  }, [previewLineRef]);

  // ── rAF loop — update preview line ───────────────────────────────
  const updatePreviewLine = useCallback(() => {
    rafRef.current = null;
    const pt   = pendingPtRef.current;
    const line = previewLineRef?.current;
    const seq  = sequenceRef.current;

    if (!pt || !line || seq.length === 0) return;

    // Read last node position directly from pre-computed positions —
    // faster and more reliable than DOM querying.
    const lastPos = NODE_POSITIONS[seq[seq.length - 1]];
    if (!lastPos) return;

    line.setAttribute("x1", String(lastPos.x));
    line.setAttribute("y1", String(lastPos.y));
    line.setAttribute("x2", String(pt.x));
    line.setAttribute("y2", String(pt.y));
    line.setAttribute("opacity", "1");
  }, [previewLineRef]);

  const scheduleRAF = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(updatePreviewLine);
  }, [updatePreviewLine]);

  // ── pointerdown ───────────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    // Only left mouse / primary touch
    if (e.button > 0) return;
    // Block during non-interactive states
    if (lockState === LOCK_STATE.SUCCESS || lockState === LOCK_STATE.ERROR) return;

    const svgEl = svgRef?.current;
    if (!svgEl) return;

    const pt = pointerToSVGCoords(e, svgEl);
    if (!pt) return;

    // Capture pointer on the overlay element for Safari safety
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}

    isDrawingRef.current = true;
    pendingPtRef.current = pt;

    // Check if pointer landed on a node
    const hit = findHitNode(pt, sequenceRef.current);
    if (hit !== -1) activateNode(hit);
  }, [svgRef, lockState, activateNode]);

  // ── pointermove ───────────────────────────────────────────────────
  const onPointerMove = useCallback((e) => {
    if (!isDrawingRef.current) return;

    const svgEl = svgRef?.current;
    if (!svgEl) return;

    const pt = pointerToSVGCoords(e, svgEl);
    if (!pt) return;

    pendingPtRef.current = pt;
    scheduleRAF();

    // Node snap — only if we have at least one node selected
    if (sequenceRef.current.length === 0) return;

    const hit = findHitNode(pt, sequenceRef.current);
    if (hit !== -1) activateNode(hit);
  }, [svgRef, scheduleRAF, activateNode]);

  // ── pointerup / pointercancel ────────────────────────────────────
  const endGesture = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    // Cancel any pending rAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    hidePreviewLine();

    // Commit with a snapshot of the current sequence
    commitGesture(sequenceRef.current);
  }, [hidePreviewLine, commitGesture]);

  // ── Cleanup on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp:     endGesture,
      onPointerCancel: endGesture,
      onPointerLeave:  endGesture,   // safety net for fast drag-off
    },
  };
}