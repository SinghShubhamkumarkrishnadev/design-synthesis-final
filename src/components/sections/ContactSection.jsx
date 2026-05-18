import React from "react";

export default function ContactSection() {
  return (
    <section 
      id="contact" 
      className="min-h-screen w-full flex items-center justify-center bg-[#eff2f0] py-20 px-4"
    >
      <div className="max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
          Contact Us
        </h2>
        <p className="text-zinc-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Have a vision you want synthesized? Let's build something exceptional.
        </p>
        <button className="px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-sm cursor-pointer">
          Get in Touch
        </button>
      </div>
    </section>
  );
}