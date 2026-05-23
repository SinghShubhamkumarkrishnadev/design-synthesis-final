/**
 * PatternPath.jsx
 * ─────────────────────────────────────────────────────────────────
 * Renders two SVG layers:
 *
 * 1. COMMITTED LINES — a <polyline> connecting all selected nodes.
 *    Re-renders only when `sequence` changes (discrete, cheap).
 *
 * 2. PREVIEW LINE — a <line> from the last selected node to the
 *    current pointer position. Driven ENTIRELY via a ref that the
 *    gesture hook updates through direct DOM mutation + rAF.
 *    ZERO React re-renders during drag.
 *
 * The preview line's ref is forwarded from the parent so the
 * gesture hook can write to it without going through React.
 * ─────────────────────────────────────────────────────────────────
 */
import { memo, forwardRef } from "react";
import { buildPolylinePoints } from "../../utils/patternMath.js";
import { COLOR, STROKE }       from "../../utils/patternConstants.js";

/**
 * @param {object} props
 * @param {number[]} props.sequence  — selected node indices
 * @param {boolean}  props.isError
 * @param {boolean}  props.isSuccess
 * @param {React.Ref} ref            — forwarded ref to the preview <line>
 */
const PatternPathComponent = forwardRef(function PatternPath(
  { sequence, isError, isSuccess },
  previewLineRef
) {
  const lineColor = isError   ? COLOR.LINE_ERROR
                  : isSuccess ? COLOR.LINE_ACTIVE
                  :             COLOR.LINE_ACTIVE;

  const committedPoints = sequence.length >= 2
    ? buildPolylinePoints(sequence)
    : "";

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Committed connection polyline */}
      {sequence.length >= 2 && (
        <polyline
          points={committedPoints}
          fill="none"
          stroke={lineColor}
          strokeWidth={STROKE.COMMITTED_LINE}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "stroke 0.3s ease",
          }}
        />
      )}

      {/*
       * Live preview line — starts hidden (opacity: 0).
       * The gesture hook writes x1/y1/x2/y2/opacity directly
       * via the forwarded ref. React never touches this element
       * during drag — zero reconciler overhead.
       */}
      <line
        ref={previewLineRef}
        x1="0" y1="0" x2="0" y2="0"
        stroke={COLOR.LINE_PREVIEW}
        strokeWidth={STROKE.PREVIEW_LINE}
        strokeLinecap="round"
        strokeDasharray="3 5"
        opacity="0"
        style={{ transition: "stroke 0.3s ease" }}
      />
    </g>
  );
});

export const PatternPath = memo(PatternPathComponent);