"use client";
import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";

const TOKEN = {
  forestPath: "#1e3329",
};

const VIEWBOX_W = 696;
const PATH_COUNT = 36;

const FloatingPaths = memo(function FloatingPaths({ position }) {
  const paths = useMemo(
    () =>
      Array.from({ length: PATH_COUNT }, (_, i) => {
        const ox = (p) => 380 - i * 5 * p;

        const sx  = VIEWBOX_W + ox(position);          
        const mx  = VIEWBOX_W - (152 - i * 5 * position); 
        const ex  = VIEWBOX_W - (684 - i * 5 * position); 

        const sy1 = -(189 + i * 6);
        const cy1 = 216 - i * 6;
        const cy2 = 470 - i * 6;
        const cy3 = 875 - i * 6;

        return {
          id:    i,
          // Fixed string layout with proper SVG commas to support Framer Motion layout transformations
          d:     `M ${sx},${sy1} C ${sx},${sy1} ${VIEWBOX_W - (312 - i * 5 * position)},${cy1} ${mx},${343 - i * 6} C ${ex},${cy2} ${ex},${cy3} ${ex},${cy3}`,
          width: 0.6 + i * 0.03,
        };
      }),
    [position],
  );

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${VIEWBOX_W} 316`}
        fill="none"
        style={{ color: TOKEN.forestPath }}
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d ?? "M 0,0 Z"}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.006}
            initial={{ pathLength: 0.3, opacity: 0.7 }}
            animate={{
              pathLength:  1,
              opacity:     [0.4, 0.7, 0.4],
              pathOffset:  [0, 1, 0],
            }}
            transition={{
              duration: 22 + (path.id % 10),
              repeat:   Infinity,
              ease:     "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
});

export default FloatingPaths;