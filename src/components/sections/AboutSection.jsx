import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Compass, ShieldCheck, HelpCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const philosophyRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const philosophy = philosophyRef.current;

    // Initial Hero Entrance
    gsap.fromTo(
      container.querySelectorAll(".hero-reveal"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
    );

    // Scroll-Triggered Text Mask Reveal
    const maskElements = philosophy.querySelectorAll(".mask-text");
    gsap.fromTo(
      maskElements,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: philosophy,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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

      {/* ================= CORE PHILOSOPHY ================= */}
      <section ref={philosophyRef} className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-4 sticky top-24">
          <div className="overflow-hidden">
            <span className="mask-text block text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">
              Our Vision
            </span>
          </div>
          <div className="overflow-hidden">
            <h3 className="mask-text text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
              Where Nature <br /> Meets Design
            </h3>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
          <div className="overflow-hidden">
            <p className="mask-text">
              Our prior belief is that <strong className="font-medium text-neutral-900">Nature</strong> is what has been given by the creator and should not get neglected while building up any kind of structure. We bridge natural synergy with clients' required comforts.
            </p>
          </div>

          <div className="overflow-hidden">
            <p className="mask-text">
              We arm ourselves with data, research, design patterns, and a clear understanding of our users so our decisions are made out of <strong className="font-medium text-neutral-900">real, actionable information</strong>. It is our responsibility to maintain an ironclad rationale to support our choices.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-neutral-200">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-neutral-700 mt-1 shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900 text-sm uppercase tracking-wider">Ecological Respect</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Synthesis layouts that carefully honor natural surroundings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-neutral-700 mt-1 shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900 text-sm uppercase tracking-wider">Ironclad Rationale</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Every layout line drawn is anchored by deep environmental research.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-neutral-700 mt-1 shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900 text-sm uppercase tracking-wider">Client Baseline</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Our studio rule stands absolute: "Client should not suffer."</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-neutral-700 mt-1 shrink-0" />
              <div>
                <h4 className="font-medium text-neutral-900 text-sm uppercase tracking-wider">Never Settle</h4>
                <p className="text-xs text-neutral-500 mt-0.5">We continuously iterate and refine until good becomes best.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}