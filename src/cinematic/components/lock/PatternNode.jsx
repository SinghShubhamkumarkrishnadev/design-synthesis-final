/**
 * PatternNode.jsx
 * ─────────────────────────────────────────────────────────────────
 * Renders a single grid node as an SVG group.
 *
 * Visual anatomy (z-order, bottom to top):
 *   1. Hit zone   — large transparent circle for easy touch targeting
 *   2. Glow halo  — animated radial bloom (opacity-driven, GPU-friendly)
 *   3. Outer ring — thin architectural circle
 *   4. Core dot   — filled centre
 *
 * Uses motion.g from Framer Motion for the activation scale spring.
 * The hit zone uses `pointer-events: all` so nodes can be snapped to.
 * ─────────────────────────────────────────────────────────────────
 */
import { memo } from "react";
import { motion } from "framer-motion";
import {
  NODE_RADIUS,
  NODE_CORE_RADIUS,
  NODE_HIT_RADIUS,
  NODE_GLOW_RADIUS,
  COLOR,
} from "../../utils/patternConstants.js";

// Framer Motion variants for the node group
const nodeVariants = {
  idle: {
    scale:   1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  active: {
    scale:   1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 22 },
  },
  error: {
    scale:   1,
    opacity: 0.85,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  success: {
    scale:   1.08,
    opacity: 1,
    transition: { type: "spring", stiffness: 280, damping: 20 },
  },
};

// Glow halo variants
const glowVariants = {
  idle: {
    opacity: 0,
    scale:   0.6,
    transition: { duration: 0.3 },
  },
  active: {
    opacity: 1,
    scale:   1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  error: {
    opacity: 0.6,
    scale:   1,
    transition: { duration: 0.2 },
  },
  success: {
    opacity: 1,
    scale:   1.2,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
};

/**
 * @param {object} props
 * @param {number}  props.index     — node index (0-8)
 * @param {number}  props.cx        — SVG x centre
 * @param {number}  props.cy        — SVG y centre
 * @param {boolean} props.isActive  — node is in current sequence
 * @param {boolean} props.isError   — global error state
 * @param {boolean} props.isSuccess — global success state
 */
function PatternNodeComponent({ index, cx, cy, isActive, isError, isSuccess }) {
  const animState = isError   ? "error"
                  : isSuccess && isActive ? "success"
                  : isActive  ? "active"
                  :             "idle";

  const ringColor = isError   ? COLOR.NODE_ERROR_RING
                  : isActive  ? COLOR.NODE_ACTIVE_RING
                  :             COLOR.NODE_IDLE_RING;

  const coreColor = isError   ? COLOR.NODE_ERROR_CORE
                  : isActive  ? COLOR.NODE_ACTIVE_CORE
                  :             COLOR.NODE_IDLE_CORE;

  const glowColor = isError   ? COLOR.GLOW_ERROR : COLOR.GLOW_GREEN;

  return (
    <motion.g
      key={index}
      data-node={index}
      variants={nodeVariants}
      animate={animState}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* 1. Hit zone — invisible, large target for pointer events */}
      <circle
        cx={cx}
        cy={cy}
        r={NODE_HIT_RADIUS}
        fill="transparent"
        // data attributes used by gesture hook to read position
        data-cx={cx}
        data-cy={cy}
        style={{ pointerEvents: "all", cursor: "crosshair" }}
      />

      {/* 2. Glow halo */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={NODE_GLOW_RADIUS}
        fill={glowColor}
        variants={glowVariants}
        animate={animState}
        style={{
          filter:         "blur(8px)",
          transformOrigin: `${cx}px ${cy}px`,
          pointerEvents:  "none",
        }}
      />

      {/* 3. Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={NODE_RADIUS}
        fill="none"
        stroke={ringColor}
        strokeWidth={isActive ? 1.5 : 1}
        style={{
          pointerEvents: "none",
          transition: "stroke 0.2s ease, stroke-width 0.2s ease",
        }}
      />

      {/* 4. Core dot */}
      <circle
        cx={cx}
        cy={cy}
        r={NODE_CORE_RADIUS}
        fill={coreColor}
        style={{
          pointerEvents: "none",
          transition: "fill 0.2s ease",
        }}
      />
    </motion.g>
  );
}

export const PatternNode = memo(PatternNodeComponent);