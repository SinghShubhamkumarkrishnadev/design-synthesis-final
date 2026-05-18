import React, { useState, useRef, useEffect } from "react";
import ServiceCard from "./ServiceCard";

const sectors = [
  {
    id: "res",
    title: "Residential",
    desc: "Bespoke custom homes, luxury villas, and private apartments designed around individual personas while maintaining structural harmony with environmental context.",
  },
  {
    id: "com",
    title: "Commercial & Corporate",
    desc: "High-efficiency dynamic offices, corporate headquarters, and retail spaces engineered to accelerate productivity, branding alignment, and spatial fluidity.",
  },
  {
    id: "hea",
    title: "Healthcare",
    desc: "Intentional wellness environments, clinics, and care centers optimized for operational ergonomics, patient comfort, and sterile flow architectures.",
  },
  {
    id: "ins",
    title: "Institutional",
    desc: "Educational facilities, public structures, and community hubs drafted to encourage collaboration, durability, and open research engagement.",
  },
  {
    id: "hos",
    title: "Hospitality & Leisure",
    desc: "Immersive boutique hotels, premium resorts, lounges, and sports environments crafted to cultivate high-tier experiential guest journeys.",
  },
];

const TOKEN = {
  bgLight: "#eff2f0",
  textDark: "#1b1b1b",
  brandDeep: "#1c2e24",
  brandSage: "#2c4a3b",
  tagBg: "#dee5e1",
};

export default function ServicesSection() {
  const [activeSector, setActiveSector] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const containerRef = useRef(null);
  const startX = useRef(0);
  const currentRotationStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef(null);

  // Dynamic dimension calculations for responsive 3D space tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Adapt structural blueprint bounds dynamically across devices
  const cardWidth = isMobile ? 260 : isTablet ? 290 : 320;
  const cardHeight = isMobile ? "340px" : "390px";
  const totalCards = sectors.length;

  // Calculate perspective depth bounds
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / totalCards)) + (isMobile ? 30 : 60);

  // --- Ambient Auto-Rotation and Inertia Kinetic System ---
  useEffect(() => {
    const updatePhysics = () => {
      if (!isDragging) {
        let speed = 0.10; // Idle speed drift configuration

        if (Math.abs(velocity.current) > 0.01) {
          speed += velocity.current;
          velocity.current *= 0.93; // Kinetic friction system decay
        } else {
          velocity.current = 0;
        }

        setRotation((prev) => prev + speed);
      }
      animationFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameId.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isDragging]);

  // --- Interface Input System Event Matrices ---
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    lastX.current = clientX;
    lastTime.current = performance.now();
    currentRotationStart.current = rotation;
    velocity.current = 0;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX.current;

    // Smooth responsive mapping translation variables
    const sensitivity = isMobile ? 0.45 : 0.35;
    setRotation(currentRotationStart.current + deltaX * sensitivity);

    const now = performance.now();
    const timeDelta = now - lastTime.current;
    if (timeDelta > 0) {
      velocity.current = ((clientX - lastX.current) / timeDelta) * 2.2;
    }
    lastX.current = clientX;
    lastTime.current = now;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="services"
      className="min-h-screen w-full flex flex-col items-center justify-between py-16 md:py-24 lg:py-28 px-4 font-sans antialiased overflow-hidden select-none relative"
      style={{ backgroundColor: TOKEN.bgLight }}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Top ambient luxury vignette layer */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(44,74,59,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-4xl text-center mb-4 mt-2 z-20 px-2">
        <div
          className="inline-flex items-center gap-2.5 text-[10px] md:text-[11px] font-semibold uppercase px-3.5 py-1.5 rounded-full mb-4 md:mb-6 border transition-all"
          style={{
            color: TOKEN.brandDeep,
            background: TOKEN.tagBg,
            borderColor: "rgba(0, 0, 0, 0.05)",
            letterSpacing: "0.2em",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: TOKEN.brandSage }}
          />
          Our Specializations
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6 text-[#1b1b1b] leading-tight">
          Conceived, Achieved & <span className="text-[#2c4a3b] font-serif italic font-normal">Delivered</span>
        </h2>

        <p className="text-zinc-600 text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-xl md:max-w-2xl mx-auto px-2">
          We work collaboratively with clients, communities, and end-users to design architecture, interior space solutions, and landscapes.
        </p>
      </div>

      {/* 3D Viewport Horizon Stage Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl h-[420px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing my-auto"
        style={{ perspective: isMobile ? "1000px" : "1500px" }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Spatial Rotational Matrix Structure */}
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
              activeSector={activeSector}
              setActiveSector={setActiveSector}
            />
          ))}
        </div>
      </div>

      {/* Linear Track Navigation Bar */}
      <div className="flex gap-2 md:gap-2.5 z-20 mt-4 max-w-full overflow-x-auto py-2 px-4">
        {sectors.map((sector, index) => {
          const baseAngle = index * (360 / totalCards);
          const currentAngle = (baseAngle + rotation) % 360;
          const normalizedAngle = currentAngle < 0 ? currentAngle + 360 : currentAngle;
          const isClosest = Math.abs(normalizedAngle - 180) < (180 / totalCards);

          return (
            <div
              key={sector.id}
              className="h-[2px] transition-all duration-500 ease-out rounded-full shrink-0"
              style={{
                width: isClosest ? (isMobile ? "20px" : "28px") : "8px",
                backgroundColor: isClosest ? TOKEN.brandSage : "rgba(44, 74, 59, 0.25)",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}