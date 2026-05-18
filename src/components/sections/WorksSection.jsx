import React from "react";

export default function WorksSection() {
  return (
    <section 
      id="works" 
      className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] py-20 px-4"
    >
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Our Works
        </h2>
        <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          A curated portfolio showcase of our latest design frameworks, architectural builds, and deployments.
        </p>
      </div>
    </section>
  );
}