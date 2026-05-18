import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceCard({
  sector,
  index,
  totalCards,
  rotation,
  cardWidth,
  cardHeight,
  radius,
  isMobile,
  activeSector,
  setActiveSector,
}) {
  const baseAngle = index * (360 / totalCards);
  const currentAngle = (baseAngle + rotation) % 360;
  const normalizedAngle = currentAngle < 0 ? currentAngle + 360 : currentAngle;

  // Optical intersection focus calculation maps
  const radians = (normalizedAngle - 180) * (Math.PI / 180);
  const facingFactor = (Math.cos(radians) + 1) / 2;

  // Adaptive viewport masking layers
  const opacity = facingFactor < 0.15 ? 0.08 : facingFactor;
  const isFrontSide = facingFactor > (isMobile ? 0.40 : 0.48);
  const isOpen = activeSector === sector.id;

  return (
    <div
      className="absolute rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden backface-hidden transition-all duration-300 group"
      style={{
        width: `${cardWidth}px`,
        height: cardHeight,
        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",

        // FIXED: Replaced white-wash with deep pure green alphas to avoid fog stacking
        background: isFrontSide
          ? "linear-gradient(135deg, rgba(20, 46, 32, 0.94) 0%, rgba(14, 33, 23, 0.98) 100%)"
          : "rgba(14, 33, 23, 0.25)",
        
        // Balanced blur to keep glass depth crisp without turning milky
        backdropFilter: isFrontSide ? `blur(${isMobile ? 10 : 16}px) saturate(130%)` : "none",
        WebkitBackdropFilter: isFrontSide ? `blur(${isMobile ? 10 : 16}px) saturate(130%)` : "none",

        // Crystal perimeter outline
        borderColor: isFrontSide ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.02)",
        borderWidth: "1px",
        borderStyle: "solid",

        // Heavy luxury shadow anchor points
        boxShadow: isFrontSide
          ? "0 30px 60px -15px rgba(10, 24, 17, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
          : "none",

        opacity: opacity,
        pointerEvents: isFrontSide ? "auto" : "none",
        zIndex: Math.round(facingFactor * 100),
      }}
    >
      {/* Specular Diagonal Sheen Accent Match */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />
      
      {/* Structural Top Perimeter Rim-Light Flare */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Header Metrics */}
      <div className="relative z-10">
        <span className="text-[10px] font-mono tracking-widest block mb-3 text-white/40 font-bold uppercase">
          // MATRIX_0{index + 1}
        </span>
        <h4 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight antialiased">
          {sector.title}
        </h4>
      </div>

      {/* Dynamic Content / CTA Chassis */}
      <div className="h-full flex flex-col justify-end mt-4 relative z-10">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-white/15 pt-4"
            >
              <p className="text-xs md:text-[13px] text-white/80 font-normal leading-relaxed font-sans max-h-[140px] overflow-y-auto pr-1">
                {sector.desc}
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="cta"
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSector(sector.id);
              }}
              className="w-full text-center py-3.5 rounded-2xl border border-white/15 bg-white/5 text-[10px] md:text-xs font-bold font-mono tracking-widest uppercase transition-all duration-300 text-white cursor-pointer shadow-inner"
            >
              Explore Details
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Close Button Panel Mapping */}
      {isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveSector(null);
          }}
          className="absolute top-6 right-6 text-[9px] font-bold font-mono text-white/70 hover:text-white border border-white/20 rounded-md px-2 py-0.5 bg-black/30 hover:bg-black/50 transition-all cursor-pointer z-30"
        >
          CLOSE
        </button>
      )}
    </div>
  );
}