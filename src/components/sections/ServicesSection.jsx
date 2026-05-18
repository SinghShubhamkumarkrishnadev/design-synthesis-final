import React from "react";

export default function ServicesSection() {
  return (
    <section 
      id="services" 
      className="min-h-screen w-full flex items-center justify-center bg-[#f5f5f4] py-20 px-4"
    >
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-b from-stone-900 to-stone-600 bg-clip-text text-transparent">
          Our Services
        </h2>
        <p className="text-stone-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          From UX/UI architecture to high-performance development, explore what we can craft together.
        </p>
      </div>
    </section>
  );
}