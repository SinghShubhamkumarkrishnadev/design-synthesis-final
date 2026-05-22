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

    const createParticle = () => {
      const maxOpacity = Math.random() * 0.5 + 0.15;
      return {
        x: Math.random() * width,
        y: Math.random() * 20,
        radius: Math.random() * 2.2 + 0.6,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: (Math.random() - 0.3) * 0.5,
        opacity: 0,
        maxOpacity,
        fadeSpeed: Math.random() * 0.02 + 0.01,
      };
    };

    const maxParticles = 85;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (particles.length < maxParticles && Math.random() < 0.4) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 60) {
          p.opacity = Math.min(p.maxOpacity, p.opacity + p.fadeSpeed);
        } else {
          p.opacity = Math.max(0, p.opacity - p.fadeSpeed * 0.4);
        }

        if (p.y > height || p.opacity <= 0 || p.x < 0 || p.x > width) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
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

  // Data Array for the new Interactive 3D Social Handles
  const socialHandles = [
    {
      Icon: Instagram,
      name: 'Instagram',
      username: '@design_synthesis',
      stats: '12K+ Followers',
      avatarTxt: 'In',
      url: '#',
      colorClass: 'text-emerald-400 border-emerald-400/50',
      shadowColor: 'rgba(52,211,153,0.4)',
      bgGradient: 'linear-gradient(45deg, #047857 0%, #10b981 50%, #34d399 100%)'
    },
    {
      Icon: Linkedin,
      name: 'LinkedIn',
      username: '@design-synthesis',
      stats: '5K+ Connections',
      avatarTxt: 'Ln',
      url: '#',
      colorClass: 'text-teal-400 border-teal-400/50',
      shadowColor: 'rgba(45,212,191,0.4)',
      bgGradient: 'linear-gradient(45deg, #0f766e 0%, #14b8a6 50%, #2dd4bf 100%)'
    },
    {
      Icon: Facebook,
      name: 'Facebook',
      username: '@designsynthesis',
      stats: '3K+ Likes',
      avatarTxt: 'Fb',
      url: '#',
      colorClass: 'text-cyan-400 border-cyan-400/50',
      shadowColor: 'rgba(34,211,238,0.4)',
      bgGradient: 'linear-gradient(45deg, #0e7490 0%, #06b6d4 50%, #22d3ee 100%)'
    }
  ];

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
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 lg:gap-12"
          variants={containerVariants}
          {...animateProps}
        >
          {/* Brand block */}
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

          {/* Contact block & Advanced Social Deck */}
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

              {/* UIVERSE STYLED 3D HOVER HANDLES CONTAINER */}
              <div className="flex items-center gap-6 pt-5 h-16 select-none">
                {socialHandles.map((social) => (
                  <div 
                    key={social.name} 
                    className="group relative cursor-pointer"
                  >
                    {/* Floating Profile Tooltip */}
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 p-2.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out min-w-[170px] z-50">
                      <div className="bg-[#111c17] rounded-xl p-3 border border-emerald-900/40 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]">
                        <div className="flex gap-2.5 items-center">
                          {/* Profile Letter Block */}
                          <div className={`w-9 h-9 text-xs font-bold border rounded-lg flex items-center justify-center bg-white/5 ${social.colorClass}`}>
                            {social.avatarTxt}
                          </div>
                          {/* User Details */}
                          <div className="flex flex-col text-left">
                            <span className={`text-xs font-bold ${social.colorClass}`}>{social.name}</span>
                            <span className="text-[10px] text-white/50">{social.username}</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-white/70 pt-2 border-t border-white/5 mt-2 font-medium">
                          {social.stats}
                        </div>
                      </div>
                    </div>

                    {/* 3D Isometric Deck trigger anchor */}
                    <a 
                      href={social.url} 
                      className="relative block w-10 h-10 group"
                      aria-label={social.name}
                    >
                      {/* Stacked background sheets handling skew transformations */}
                      {[0, 1, 2, 3].map((index) => (
                        <span
                          key={index}
                          className={`absolute inset-0 border rounded-lg transition-all duration-300 ease-out opacity-20 group-hover:opacity-40`}
                          style={{
                            borderColor: 'currentColor',
                            transform: `group-hover:rotate(-35deg) group-hover:skewX(20deg) translate(${index * 4}px, -${index * 4}px)`,
                            transitionDelay: `${index * 30}ms`
                          }}
                        />
                      ))}

                      {/* Top Active Layer holding the Vector SVG Icon */}
                      <span 
                        className="absolute inset-0 rounded-lg border border-white/30 flex items-center justify-center transition-all duration-300 ease-out group-hover:text-white"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          transform: 'group-hover:rotate(-35deg) group-hover:skewX(20deg) translate(16px, -16px)'
                        }}
                        ref={(el) => {
                          if (el) {
                            el.onmouseenter = () => {
                              el.style.background = social.bgGradient;
                              el.style.borderColor = 'transparent';
                              el.style.boxShadow = `-2px 2px 12px ${social.shadowColor}`;
                            };
                            el.onmouseleave = () => {
                              el.style.background = 'rgba(255,255,255,0.03)';
                              el.style.borderColor = 'rgba(255,255,255,0.3)';
                              el.style.boxShadow = 'none';
                            };
                          }
                        }}
                      >
                        <social.Icon size={18} className="transition-transform duration-300" />
                      </span>

                      {/* Hidden Text Label fading in right underneath on active hover */}
                      <div className="absolute left-1/2 -bottom-2 opacity-0 font-medium text-[10px] tracking-wider text-emerald-300/80 -translate-x-1/2 transition-all duration-300 group-hover:-bottom-6 group-hover:opacity-100 whitespace-nowrap">
                        {social.name}
                      </div>
                    </a>
                  </div>
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