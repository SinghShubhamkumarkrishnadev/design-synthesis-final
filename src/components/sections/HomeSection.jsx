import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function HomeSection() {
  return (
    <section 
      id="home" 
      className="min-h-screen w-full flex flex-col items-center justify-center relative px-4 bg-[#f8f9fa]"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm mb-6 shadow-sm">
          <Rocket size={16} />
          <span className="font-medium">Design Synthesis Core</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text text-transparent">
          Next-Gen Systems
        </h1>
        <p className="text-neutral-500 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          Hover above right to expand the glass adaptive navigation deck. Click items to jump through modules.
        </p>
      </motion.div>
    </section>
  );
}