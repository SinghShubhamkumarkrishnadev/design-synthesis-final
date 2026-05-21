import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Handle Canvas Sprinklers (Ambient Glowing Particles)
  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let particles = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particle properties (tuned for faster, more dense movement)
    const createParticle = () => {
      const maxOpacity = Math.random() * 0.5 + 0.15;
      return {
        x: Math.random() * width,
        y: Math.random() * 20, // Spawn tightly at the top glow line
        radius: Math.random() * 2.2 + 0.6,
        speedY: Math.random() * 0.8 + 0.4, // Boosted vertical speed
        speedX: (Math.random() - 0.3) * 0.5, // Added slight rightward drift/wind
        opacity: 0,
        maxOpacity,
        fadeSpeed: Math.random() * 0.02 + 0.01,
      };
    };

    // Increased max particles from 45 to 85 for a rich sprinkler effect
    const maxParticles = 85;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Higher spawn rate to keep up with the faster decay
      if (particles.length < maxParticles && Math.random() < 0.4) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Life cycle handling: Fade in at top, fade out as it descends
        if (p.y < 60) {
          p.opacity = Math.min(p.maxOpacity, p.opacity + p.fadeSpeed);
        } else {
          p.opacity = Math.max(0, p.opacity - p.fadeSpeed * 0.4);
        }

        // Clean up out of bounds or dead elements
        if (p.y > height || p.opacity <= 0 || p.x < 0 || p.x > width) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Brand Emerald/Mint palette execution
        ctx.fillStyle = `rgba(110, 231, 183, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.7)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  // Framer Motion layout orchestration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const animateProps = shouldReduceMotion
    ? { initial: "visible", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-40px" } };

  return (
    <footer
      className="relative w-full bg-[#09140f] text-white border-t border-white/10 overflow-hidden"
      aria-label="Site footer"
    >
      {/* FOREST GLOW HERO LIGHTBAR */}
      <div className="absolute top-0 w-full h-[240px] flex justify-center pointer-events-none z-20">
        <div className="absolute top-0 w-full h-[4px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-md opacity-80" />
        <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-90" />
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_40px_10px_rgba(34,197,94,0.6)]" />
        <div
          className="absolute top-0 w-full h-[180px]"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.05) 50%, transparent 100%)',
            filter: 'blur(28px)',
          }}
        />
      </div>

      {/* SPRINKLERS INTERACTIVE CANVAS */}
      {!shouldReduceMotion && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-[320px] pointer-events-none mix-blend-screen z-10"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 relative z-30">
        
        {/* Responsive Grid System: grid-cols-2 locks layouts side-by-side even on tiny phone layouts */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 lg:gap-12"
          variants={containerVariants}
          {...animateProps}
        >
          {/* Brand block spans full width on mobile to maintain clean hierarchy */}
          <motion.div variants={itemVariants} className="col-span-2 lg:col-span-1">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide mb-3 text-emerald-50">
              Design Synthesis
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-6 sm:leading-7">
              Research Driven Architecture & Interior Design, Surat.
            </p>
            <p className="text-xs text-emerald-200/40 leading-5 sm:leading-6 mt-3 italic">
              Designing spaces that balance research, emotion, functionality, and nature.
            </p>
          </motion.div>

          {/* Navigation links block */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-xs uppercase tracking-[0.15em] text-emerald-300/50 mb-4 font-medium">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {['About', 'Services', 'Works', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-xs sm:text-sm text-white/70 hover:text-emerald-300 transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services block */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-xs uppercase tracking-[0.15em] text-emerald-300/50 mb-4 font-medium">
              Services
            </h3>
            <ul className="space-y-2 mb-6 text-xs sm:text-sm text-white/70">
              <li>Architecture</li>
              <li>Interior Design</li>
              <li>Landscape Design</li>
            </ul>

            <h3 className="text-xs uppercase tracking-[0.15em] text-emerald-300/50 mb-3 font-medium">
              Sectors
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-white/60">
              <li>Residential & Commercial</li>
              <li>Hospitality & Healthcare</li>
            </ul>
          </motion.div>

          {/* Contact block wraps comfortably onto its own lines */}
          <motion.div variants={itemVariants} className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="text-xs uppercase tracking-[0.15em] text-emerald-300/50 mb-4 font-medium">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 text-white/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-emerald-400/80" />
                <div className="leading-6 text-xs sm:text-sm">
                  <p className="font-medium text-white/90">A-302, SNS ATRIA</p>
                  <p>Maharana Pratap Road, Vesu</p>
                  <p>Surat – 395007, GJ, India</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href="tel:+919924774664"
                  className="flex items-center gap-2.5 text-white/70 hover:text-emerald-300 text-xs sm:text-sm transition-colors duration-200"
                >
                  <Phone size={14} className="flex-shrink-0 text-emerald-400/80" />
                  <span>+91 9924774664</span>
                </a>

                <a
                  href="mailto:studio@designsynthesis.in"
                  className="flex items-center gap-2.5 text-white/70 hover:text-emerald-300 text-xs sm:text-sm break-all transition-colors duration-200"
                >
                  <Mail size={14} className="flex-shrink-0 text-emerald-400/80" />
                  <span>studio@designsynthesis.in</span>
                </a>
              </div>

              {/* Enhanced Social Triggers */}
              <div className="flex items-center gap-4 pt-3">
                {[
                  { Icon: Instagram, label: 'Instagram', url: '#' },
                  { Icon: Linkedin, label: 'LinkedIn', url: '#' },
                  { Icon: Facebook, label: 'Facebook', url: '#' }
                ].map(({ Icon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    aria-label={label}
                    className="p-1.5 rounded-md bg-white/5 text-white/70 hover:text-white hover:bg-emerald-500/20 hover:scale-105 transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Global Metadata / Legal Bottom Bar */}
        <motion.div 
          className="border-t border-white/10 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-[11px] sm:text-xs text-white/40 tracking-wide text-center sm:text-left">
            © {currentYear} Design Synthesis. All rights reserved.
          </p>
          <p className="text-[11px] sm:text-xs text-white/30 tracking-wide text-center sm:text-right">
            Based in Surat, India.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}