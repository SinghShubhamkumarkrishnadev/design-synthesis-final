/**
 * patternMath.js
 * ─────────────────────────────────────────────────────────────────
 * Pure math utilities for the pattern lock system.
 * No React, no side-effects, fully tree-shakeable.
 * ─────────────────────────────────────────────────────────────────
 */
import {
  VIEW_SIZE,
  GRID_PADDING,
  GRID_STEP,
  GRID_COLS,
  NODE_COUNT,
  NODE_HIT_RADIUS,
} from "./patternConstants.js";

/**
 * Pre-computed array of SVG node positions.
 * Index matches grid position (0 = top-left, 8 = bottom-right).
 *
 * @returns {Array<{ x: number, y: number }>}
 */
export function buildNodePositions() {
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    return {
      x: GRID_PADDING + col * GRID_STEP,
      y: GRID_PADDING + row * GRID_STEP,
    };
  });
}

// Stable reference — positions never change
export const NODE_POSITIONS = buildNodePositions();

/**
 * Convert a DOM pointer event to SVG user-space coordinates.
 *
 * Uses the SVG element's getScreenCTM() which is the correct
 * Safari-safe approach (avoids getBoundingClientRect scaling issues).
 *
 * @param {PointerEvent|TouchEvent} event
 * @param {SVGSVGElement} svgEl
 * @returns {{ x: number, y: number } | null}
 */
export function pointerToSVGCoords(event, svgEl) {
  if (!svgEl) return null;

  const ctm = svgEl.getScreenCTM();
  if (!ctm) return null;

  // Support both pointer events and touch events
  const clientX = event.clientX ?? event.touches?.[0]?.clientX;
  const clientY = event.clientY ?? event.touches?.[0]?.clientY;

  if (clientX == null || clientY == null) return null;

  // Create an SVGPoint and apply the inverse CTM
  const pt = svgEl.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgPt = pt.matrixTransform(ctm.inverse());

  return { x: svgPt.x, y: svgPt.y };
}

/**
 * Find the nearest node within hit-radius of the given SVG point.
 * Returns the node index or -1 if none.
 *
 * @param {{ x: number, y: number }} svgPoint
 * @param {number[]} excludeIndices — already-selected nodes to skip
 * @returns {number}
 */
export function findHitNode(svgPoint, excludeIndices = []) {
  let closest     = -1;
  let closestDist = NODE_HIT_RADIUS;   // threshold

  for (let i = 0; i < NODE_COUNT; i++) {
    if (excludeIndices.includes(i)) continue;
    const pos  = NODE_POSITIONS[i];
    const dx   = svgPoint.x - pos.x;
    const dy   = svgPoint.y - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < closestDist) {
      closestDist = dist;
      closest     = i;
    }
  }

  return closest;
}

/**
 * Build an SVG polyline `points` attribute string from an array of
 * node indices.
 *
 * @param {number[]} nodeIndices
 * @returns {string}  e.g. "300,120 120,120 120,300"
 */
export function buildPolylinePoints(nodeIndices) {
  return nodeIndices
    .map((i) => `${NODE_POSITIONS[i].x},${NODE_POSITIONS[i].y}`)
    .join(" ");
}

/**
 * Euclidean distance between two SVG points.
 */
export function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}