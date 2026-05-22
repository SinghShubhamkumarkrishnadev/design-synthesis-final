import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

/* =========================
   TOKENS (kept as JS constants
   only for values that cannot
   be expressed as static Tailwind
   classes, e.g. brand hex colours
   used in dynamic inline styles)
========================= */
const TOKEN = {
  brandDeep: "#1c2e24",
  brandSage: "#2c4a3b",
};

/* =========================
   DATA
========================= */
const sectors = [
  { id: "res", imageSrc: "/resident.webp",      alt: "Residential"        },
  { id: "com", imageSrc: "/commercial.webp",    alt: "Commercial & Corporate" },
  { id: "hea", imageSrc: "/healthcare.webp",    alt: "Healthcare"         },
  { id: "ins", imageSrc: "/institutional.webp", alt: "Institutional"      },
  { id: "hos", imageSrc: "/hospitality.webp",   alt: "Hospitality & Leisure" },
  { id: "int", imageSrc: "/interior.webp",      alt: "Interior Design"    },
  { id: "lan", imageSrc: "/landscape.webp",     alt: "Landscape"          },
  { id: "spo", imageSrc: "/sports.webp",        alt: "Sports & Recreation"},
];

/* =========================
   SERVICE CARD
========================= */
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
        position : "absolute",
        width    : `${cardWidth}px`,
        height   : cardHeight,
        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
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

      {/* TITLE GRADIENT + LABEL */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-b-[24px] pointer-events-none text-white font-semibold tracking-wide"
        style={{
          padding   : isMobile ? "50px 16px 18px" : "70px 22px 24px",
          background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 45%, transparent 100%)",
          fontSize  : isMobile ? "14px" : "17px",
          letterSpacing: "0.03em",
          opacity   : isFront ? 1 : 0,
          transform : isFront ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
      >
        {sector.alt}
      </div>
    </div>
  );
});

/* =========================
   MAIN COMPONENT
========================= */
export default function ServicesSection() {
  const [rotation,    setRotation   ] = useState(0);
  const [isDragging,  setIsDragging ] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const startX               = useRef(0);
  const currentRotationStart = useRef(0);
  const velocity             = useRef(0);
  const lastX                = useRef(0);
  const lastTime             = useRef(0);
  const animationFrameId     = useRef(null);
  const rotationRef          = useRef(0);
  const isDraggingRef        = useRef(false);

  useEffect(() => { rotationRef.current  = rotation;  }, [rotation]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile  = windowWidth < 640;
  const isTablet  = windowWidth >= 640 && windowWidth < 1024;

  /* Responsive card sizing */
  const cardWidth  = isMobile ? 170 : isTablet ? 210 : 260;
  const cardHeight = isMobile ? "260px" : isTablet ? "320px" : "420px";

  const totalCards = sectors.length;
  const radius =
    Math.round((cardWidth / 2) / Math.tan(Math.PI / totalCards)) +
    (isMobile ? 45 : isTablet ? 80 : 120);

  /* Auto-rotation + momentum */
  useEffect(() => {
    const loop = () => {
      if (!isDraggingRef.current) {
        let speed = 0.05;
        if (Math.abs(velocity.current) > 0.01) {
          speed += velocity.current;
          velocity.current *= 0.94;
        } else {
          velocity.current = 0;
        }
        setRotation((prev) => prev + speed);
      }
      animationFrameId.current = requestAnimationFrame(loop);
    };
    animationFrameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  /* Drag handlers */
  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const cx = getClientX(e);
    startX.current               = cx;
    lastX.current                = cx;
    lastTime.current             = performance.now();
    currentRotationStart.current = rotationRef.current;
    velocity.current             = 0;
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (!isDraggingRef.current) return;
      const cx  = getClientX(e);
      const now = performance.now();
      const dt  = now - lastTime.current;
      if (dt > 0) velocity.current = ((cx - lastX.current) / dt) * 2;
      lastX.current    = cx;
      lastTime.current = now;
      const sensitivity = isMobile ? 0.42 : 0.28;
      setRotation(currentRotationStart.current + (cx - startX.current) * sensitivity);
    },
    [isMobile]
  );

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  /* Front-facing card index for dot indicator */
  const frontIndex = (() => {
    let maxF = -Infinity, idx = 0;
    for (let i = 0; i < totalCards; i++) {
      const base = i * (360 / totalCards);
      const cur  = ((base + rotation) % 360 + 360) % 360;
      const rad  = (cur - 180) * (Math.PI / 180);
      const f    = (Math.cos(rad) + 1) / 2;
      if (f > maxF) { maxF = f; idx = i; }
    }
    return idx;
  })();

  /* Carousel container height & perspective are responsive — kept inline */
  const carouselHeight      = isMobile ? "340px" : isTablet ? "430px" : "540px";
  const carouselPerspective = isMobile ? "1200px" : "1800px";

  return (
    <section
      id="services"
      className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-16 md:py-20"
      style={{ backgroundColor: "#eff2f0" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(44,74,59,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Main wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">

        {/* ── HEADER ── */}
        <div className="w-full flex flex-col items-center text-center mb-10 md:mb-14">

          {/* Tag pill */}
          <div
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase px-4 py-2 rounded-full mb-5 border"
            style={{
              color      : TOKEN.brandDeep,
              background : "#dee5e1",
              borderColor: "rgba(0,0,0,0.04)",
              letterSpacing: "0.2em",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: TOKEN.brandSage }}
            />
            Our Specializations
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#1b1b1b] leading-tight max-w-4xl">
            Conceived, Achieved &{" "}
            <span className="text-[#2c4a3b] font-serif italic font-normal">
              Delivered
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-600 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            We work collaboratively with clients, communities, and end-users to
            design architecture, interior space solutions, and landscapes.
          </p>
        </div>

        {/* ── CAROUSEL ── */}
        <div className="w-full flex flex-col items-center">

          {/* 3-D stage */}
          <div
            className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ height: carouselHeight, perspective: carouselPerspective }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotation}deg)`,
              }}
            >
              {sectors.map((sector, index) => (
                <ServiceCard
                  key={sector.id}
                  sector={sector}
                  index={index}
                  totalCards={totalCards}
                  rotation={rotation}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  radius={radius}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>

          {/* Dot indicator */}
          <div className="flex flex-col items-center gap-3 mt-6">
            <div className="flex gap-2">
              {sectors.map((sector, index) => (
                <div
                  key={sector.id}
                  className="h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: index === frontIndex
                      ? (isMobile ? "22px" : "34px")
                      : "8px",
                    backgroundColor: index === frontIndex
                      ? TOKEN.brandSage
                      : "rgba(44,74,59,0.2)",
                  }}
                />
              ))}
            </div>

            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(44,74,59,0.5)" }}
            >
              ↔ drag to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}