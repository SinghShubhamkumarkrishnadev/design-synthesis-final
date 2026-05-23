/**
 * PatternGrid.jsx
 * ─────────────────────────────────────────────────────────────────
 * The single SVG root that contains:
 *   • <defs> — filter definitions (subtle glow, no heavy blur stacks)
 *   • <PatternPath> — committed lines + preview line
 *   • <PatternNode> × 9 — grid nodes
 *
 * Geometry is expressed entirely in SVG user space (viewBox 0 0 600 600).
 * The SVG scales fluidly via width/height 100%, CSS aspect-ratio 1/1.
 *
 * The gesture surface is the SVG element itself — pointer events are
 * attached here so the entire SVG area is interactive.
 *
 * The forwarded previewLineRef allows usePatternGesture to write
 * directly to the DOM without going through React.
 * ─────────────────────────────────────────────────────────────────
 */
import { forwardRef, memo } from "react";
import { PatternNode } from "./PatternNode.jsx";
import { PatternPath } from "./PatternPath.jsx";
import { NODE_POSITIONS }  from "../../utils/patternMath.js";
import { VIEW_SIZE }       from "../../utils/patternConstants.js";

/**
 * @param {object} props
 * @param {number[]}  props.sequence
 * @param {boolean}   props.isError
 * @param {boolean}   props.isSuccess
 * @param {object}    props.gestureHandlers  — pointer event callbacks
 * @param {React.Ref} props.previewLineRef   — forwarded to PatternPath
 * @param {React.Ref} ref                    — forwarded to the <svg> element
 */
const PatternGridComponent = forwardRef(function PatternGrid(
  { sequence, isError, isSuccess, gestureHandlers, previewLineRef },
  svgRef
) {
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width:        "clamp(260px, 60vmin, 480px)",
        aspectRatio:  "1 / 1",
        display:      "block",
        overflow:     "visible",
        // Touch — prevent scroll interference
        touchAction:  "none",
        userSelect:   "none",
        WebkitUserSelect: "none",
        // GPU composite layer
        transform:    "translateZ(0)",
        willChange:   "transform",
        cursor:       "crosshair",
      }}
      {...gestureHandlers}
    >
      {/* ── Filter defs ─────────────────────────────────────────────
       * Kept intentionally lightweight for Safari performance.
       * One feGaussianBlur with small stdDeviation.
       * NOT applied as a filter prop — applied per-element where needed.
       */}
      <defs>
        <filter id="pl-glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtler version for idle nodes */}
        <filter id="pl-glow-idle" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Connection lines (below nodes) ──────────────────────── */}
      <PatternPath
        ref={previewLineRef}
        sequence={sequence}
        isError={isError}
        isSuccess={isSuccess}
      />

      {/* ── Grid nodes ──────────────────────────────────────────── */}
      {NODE_POSITIONS.map((pos, i) => (
        <PatternNode
          key={i}
          index={i}
          cx={pos.x}
          cy={pos.y}
          isActive={sequence.includes(i)}
          isError={isError}
          isSuccess={isSuccess}
        />
      ))}
    </svg>
  );
});

export const PatternGrid = memo(PatternGridComponent);