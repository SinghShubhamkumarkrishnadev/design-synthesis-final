import React from "react";

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="min-h-screen w-full flex items-center justify-center bg-[#f1f3f5] py-20 px-4"
    >
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
          About Us
        </h2>
        <p className="text-neutral-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Discover our story, our team, and our commitment to bringing meaningful digital designs to life.
        </p>
      </div>
    </section>
  );
}