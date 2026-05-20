import React, { memo } from "react";

const ServiceCard = memo(function ServiceCard({
  sector,
  index,
  totalCards,
  rotation,
  cardWidth,
  cardHeight,
  radius,
  isMobile,
}) {
  const baseAngle = index * (360 / totalCards);
  const cur       = ((baseAngle + rotation) % 360 + 360) % 360;
  const rad       = (cur - 180) * (Math.PI / 180);
  const facing    = (Math.cos(rad) + 1) / 2;
  const dimAlpha  = Math.pow(1 - facing, 2) * 0.14;
  const isFront   = facing > (isMobile ? 0.34 : 0.44);
  const zIndex    = Math.round(facing * 100);

  return (
    <div
      style={{
        position         : "absolute",
        width            : `${cardWidth}px`,
        height           : cardHeight,
        transform        : `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
        transformStyle   : "preserve-3d",
        pointerEvents    : isFront ? "auto" : "none",
        zIndex,
        backfaceVisibility: "hidden",
        willChange       : "transform",
      }}
    >
      {/* IMAGE */}
      <img
        src={sector.imageSrc}
        alt={sector.alt}
        draggable="false"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover block rounded-[24px] pointer-events-none"
        style={{
          boxShadow : isFront
            ? "0 18px 45px rgba(0,0,0,0.12)"
            : "0 8px 20px rgba(0,0,0,0.06)",
          filter    : isFront
            ? "brightness(1.08) contrast(1.02)"
            : "brightness(0.95)",
          transform : isFront ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease, box-shadow 0.5s ease",
          willChange: "transform, filter",
        }}
        onMouseEnter={(e) => {
          if (isFront) e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          if (isFront) e.currentTarget.style.transform = "scale(1.02)";
        }}
      />

      {/* DIM OVERLAY */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none transition-[background] duration-400"
        style={{ background: `rgba(0,0,0,${dimAlpha})` }}
      />

      {/* TITLE */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-b-[24px] pointer-events-none text-white font-semibold"
        style={{
          padding      : isMobile ? "50px 16px 18px" : "70px 22px 24px",
          background   : "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 45%, transparent 100%)",
          fontSize     : isMobile ? "14px" : "17px",
          letterSpacing: "0.03em",
          opacity      : isFront ? 1 : 0,
          transform    : isFront ? "translateY(0)" : "translateY(10px)",
          transition   : "opacity 0.45s ease, transform 0.45s ease",
        }}
      >
        {sector.alt}
      </div>
    </div>
  );
});

export default ServiceCard;