import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Compass, ShieldCheck, HelpCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="w-full bg-[#f1f3f5] text-neutral-900 font-sans antialiased">
      
      {/* ================= HERO SECTION ================= */}
      <section id="about" className="min-h-[70vh] w-full flex flex-col items-center justify-center py-16 px-6 border-b border-neutral-200">
        <div className="max-w-4xl text-center space-y-4">
          <span className="hero-reveal inline-block text-xs font-semibold tracking-widest uppercase text-neutral-400">
            Multidisciplinary Design Firm
          </span>
          <h2 className="hero-reveal text-5xl md:text-6xl font-light tracking-tight text-neutral-950">
            DESIGN <span className="font-medium">SYNTHESIS</span>
          </h2>
          <div className="hero-reveal h-[1px] w-16 bg-neutral-400 mx-auto my-4" />
          <p className="hero-reveal text-neutral-600 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            A place where innovations and research cycles continue all the time—where your thinking, making, and testing come real.
          </p>
        </div>
      </section>
    </div>
  );
}