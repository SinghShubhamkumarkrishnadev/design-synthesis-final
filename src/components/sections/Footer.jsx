/**
 * Footer.jsx — Design Synthesis
 * Repeatable cinematic scroll choreography.
 * Every entrance replays on re-enter. No once:true anywhere.
 * Scroll progress drives all reveal values continuously.
 * Ambient / kinetic / cursor systems run independently of scroll state.
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useAnimation,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];
const EASE_OUT = [0.33, 1, 0.68, 1];
const SPRING_SMOOTH = { stiffness: 55, damping: 22, mass: 1 };
const SPRING_MAGNETIC = { stiffness: 120, damping: 18, mass: 0.6 };

/* ─────────────────────────────────────────────────────────────────
   NOISE — generated once, never changes
───────────────────────────────────────────────────────────────── */
const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/>
    <feColorMatrix type='saturate' values='0'/>
  </filter>
  <rect width='220' height='220' filter='url(#n)' opacity='1'/>
</svg>`;
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

/* ─────────────────────────────────────────────────────────────────
   HOOK — prefers-reduced-motion
───────────────────────────────────────────────────────────────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

/* ─────────────────────────────────────────────────────────────────
   HOOK — RAF-throttled mouse position, motion-value only (no state)
───────────────────────────────────────────────────────────────── */
function useMousePosition(elRef, disabled) {
  const rawX    = useMotionValue(0.5);
  const rawY    = useMotionValue(0.5);
  const cursorX = useMotionValue(-800);
  const cursorY = useMotionValue(-800);

  useEffect(() => {
    if (disabled) return;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const el = elRef.current;
        if (!el) { raf = null; return; }
        const r = el.getBoundingClientRect();
        rawX.set((e.clientX - r.left) / r.width);
        rawY.set((e.clientY - r.top)  / r.height);
        cursorX.set(e.clientX - r.left);
        cursorY.set(e.clientY - r.top);
        raf = null;
      });
    };
    const el = elRef.current;
    el?.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      el?.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [disabled, elRef, rawX, rawY, cursorX, cursorY]);

  return { rawX, rawY, cursorX, cursorY };
}

/* ─────────────────────────────────────────────────────────────────
   AMBIENT LAYER — infinite atmospheric drift, scroll-independent
───────────────────────────────────────────────────────────────── */
function AmbientLayer({ disabled }) {
  if (disabled) return null;
  return (
    <>
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}
        animate={{ background: [
          'radial-gradient(ellipse 58% 40% at 25% 28%, rgba(100,192,172,0.07) 0%, transparent 70%)',
          'radial-gradient(ellipse 58% 40% at 76% 70%, rgba(100,192,172,0.07) 0%, transparent 70%)',
          'radial-gradient(ellipse 58% 40% at 25% 28%, rgba(100,192,172,0.07) 0%, transparent 70%)',
        ]}}
        transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}
        animate={{ background: [
          'radial-gradient(ellipse 44% 30% at 82% 18%, rgba(55,95,128,0.06) 0%, transparent 65%)',
          'radial-gradient(ellipse 44% 30% at 18% 82%, rgba(55,95,128,0.06) 0%, transparent 65%)',
          'radial-gradient(ellipse 44% 30% at 82% 18%, rgba(55,95,128,0.06) 0%, transparent 65%)',
        ]}}
        transition={{ duration: 38, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}
        animate={{ background: [
          'radial-gradient(ellipse 28% 20% at 50% 88%, rgba(205,188,162,0.04) 0%, transparent 58%)',
          'radial-gradient(ellipse 28% 20% at 50% 94%, rgba(205,188,162,0.04) 0%, transparent 58%)',
          'radial-gradient(ellipse 28% 20% at 50% 88%, rgba(205,188,162,0.04) 0%, transparent 58%)',
        ]}}
        transition={{ duration: 24, ease: 'easeInOut', repeat: Infinity, delay: 6 }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CURSOR SPOTLIGHT — always active on desktop
───────────────────────────────────────────────────────────────── */
function Spotlight({ cursorX, cursorY, disabled }) {
  const sX = useSpring(cursorX, SPRING_SMOOTH);
  const sY = useSpring(cursorY, SPRING_SMOOTH);
  if (disabled) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        zIndex: 5,
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,222,212,0.072) 0%, transparent 68%)',
        filter: 'blur(36px)',
        mixBlendMode: 'soft-light',
        x: sX, y: sY,
        translateX: '-50%', translateY: '-50%',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   NOISE OVERLAY — constant texture, scroll-independent
───────────────────────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
      zIndex: 6,
      backgroundImage: NOISE_URL,
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px',
      opacity: 0.027,
      mixBlendMode: 'overlay',
    }} />
  );
}

/* ─────────────────────────────────────────────────────────────────
   BRAND TITLE
   — Letters controlled by useAnimation
   — useMotionValueEvent on scrollYProgress drives reset + replay
   — Breathing loop runs independently once revealed
───────────────────────────────────────────────────────────────── */
function BrandTitle({ scrollYProgress, reducedMotion }) {
  const controls  = useAnimation();
  const breathe   = useAnimation();
  const word1     = useMemo(() => 'Design'.split(''),    []);
  const word2     = useMemo(() => 'Synthesis'.split(''), []);
  const revealed  = useRef(false);

  const letterVariants = {
    hidden:  { opacity: 0, y: -36, filter: 'blur(7px)' },
    visible: (i) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 1.4, ease: EASE, delay: i * 0.055 },
    }),
  };

  const runReveal = useCallback(async () => {
    revealed.current = false;
    await controls.start('hidden');
    breathe.stop();
    await controls.start('visible');
    revealed.current = true;
    if (!reducedMotion) {
      breathe.start({
        y: [0, -2.5, 0],
        rotate: [0, 0.28, 0],
        transition: { duration: 6.5, ease: 'easeInOut', repeat: Infinity },
      });
    }
  }, [controls, breathe, reducedMotion]);

  // Watch scroll progress — replay whenever footer enters viewport
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.05 && !revealed.current) {
      runReveal();
    }
    if (v <= 0.01 && revealed.current) {
      revealed.current = false;
      controls.start('hidden');
      breathe.stop();
    }
  });

  return (
    <motion.div className="overflow-visible" animate={breathe}>
      <div className="flex flex-nowrap overflow-hidden" aria-label="Design Synthesis">
        {word1.map((char, i) => (
          <motion.span
            key={`d-${i}`}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate={controls}
            className="inline-block font-['Cormorant_Garamond',Garamond,Georgia,serif] font-light italic
              text-[clamp(22px,4.8vw,52px)] tracking-[0.08em] text-[#e6f8f4]/92 leading-none whitespace-nowrap shrink-0"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className="flex flex-nowrap overflow-hidden mt-[-2px]">
        {word2.map((char, i) => (
          <motion.span
            key={`s-${i}`}
            custom={i + word1.length + 2}
            variants={letterVariants}
            initial="hidden"
            animate={controls}
            className="inline-block font-['Cormorant_Garamond',Garamond,Georgia,serif] font-semibold not-italic
              text-[clamp(22px,4.8vw,52px)] tracking-[0.26em] text-white leading-none uppercase whitespace-nowrap shrink-0"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL-DRIVEN REVEAL ITEM
   Wraps any child. Replays reveal whenever threshold is crossed.
   delay = stagger offset in seconds.
───────────────────────────────────────────────────────────────── */
function RevealItem({ children, scrollYProgress, threshold = 0.08, delay = 0, className = '', style = {} }) {
  const controls = useAnimation();
  const revealed = useRef(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > threshold && !revealed.current) {
      revealed.current = true;
      controls.start({
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 1.05, ease: EASE, delay },
      });
    }
    if (v <= 0.01 && revealed.current) {
      revealed.current = false;
      controls.start({ opacity: 0, y: 24, filter: 'blur(4px)', transition: { duration: 0.18 } });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      animate={controls}
      className={className}
      style={{ willChange: 'transform, opacity, filter', ...style }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   NAV LINK — light-beam hover, repeatable reveal via parent RevealItem
───────────────────────────────────────────────────────────────── */
function NavLink({ href, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center text-[clamp(12.5px,2.1vw,15.5px)] font-medium
        text-[#d2f0eb]/78 no-underline tracking-[0.06em] hover:text-white pb-[3px]"
      style={{ minHeight: 44, transition: 'color 0.3s ease' }}
    >
      <motion.span
        animate={{ x: hovered ? 5 : 0 }}
        transition={{ duration: 0.42, ease: EASE }}
        className="inline-block"
      >
        {children}
      </motion.span>
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#b4dcd2]/12" />
      <motion.span
        className="absolute bottom-0 left-0 h-[1px] bg-[#b4dcd2]/68 origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.52, ease: EASE }}
        style={{ width: '100%' }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute bottom-0 left-0 h-[1px] w-7"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(200,242,232,0.88),transparent)', filter: 'blur(1px)' }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '560%', opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.68, ease: EASE_OUT, delay: 0.1 }}
          />
        )}
      </AnimatePresence>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SECTION LABEL — wrapped by RevealItem in place
───────────────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <h4 className="font-mono uppercase text-[clamp(9.5px,1.35vw,12px)] text-[#b4dcd2]/46 tracking-[0.3em] mb-[14px]">
      {children}
    </h4>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SERVICE ITEM — slide micro-interaction
───────────────────────────────────────────────────────────────── */
function ServiceItem({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      className="cursor-default text-[clamp(12px,2vw,15px)] text-[#d2f0eb]/66 tracking-[0.03em]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="inline-block"
        animate={{ x: hovered ? 4 : 0, color: hovered ? '#ffffff' : 'rgba(210,240,235,0.66)' }}
        transition={{ duration: 0.36, ease: EASE }}
      >
        {label}
      </motion.span>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CONTACT ROW — slide micro-interaction
───────────────────────────────────────────────────────────────── */
function ContactRow({ href, icon, label, iconRotate = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 font-mono text-[clamp(11px,1.6vw,13.5px)]
        text-[#d2f0eb]/70 no-underline tracking-[0.04em] hover:text-white"
      style={{ minHeight: 44, transition: 'color 0.3s ease' }}
    >
      <motion.span
        className="text-[#b4dcd2]/36 shrink-0"
        animate={{ rotate: hovered && iconRotate ? 16 : 0, scale: hovered ? 1.14 : 1 }}
        transition={{ duration: 0.34, ease: EASE }}
      >
        {icon}
      </motion.span>
      <motion.span
        className="break-all"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.38, ease: EASE }}
      >
        {label}
      </motion.span>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAGNETIC ICON — cursor attraction + glow sweep
───────────────────────────────────────────────────────────────── */
function MagneticIcon({ icon, url, label, disabled }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sX = useSpring(x, SPRING_MAGNETIC);
  const sY = useSpring(y, SPRING_MAGNETIC);

  const onMove = useCallback((e) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    x.set((e.clientX - cx) * 0.28);
    y.set((e.clientY - cy) * 0.28);
  }, [disabled, x, y]);

  const onLeave = useCallback(() => {
    x.set(0); y.set(0); setHovered(false);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={url}
      aria-label={label}
      tabIndex={0}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full
        border border-[#b4dcd2]/18 bg-white/[0.04] text-[#d2f0eb]/60 no-underline shrink-0
        overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-[#b4dcd2]/55"
      style={{ x: sX, y: sY, willChange: 'transform' }}
      animate={{
        scale: hovered ? 1.13 : 1,
        borderColor:     hovered ? 'rgba(180,220,210,0.52)' : 'rgba(180,220,210,0.18)',
        backgroundColor: hovered ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)',
        color:           hovered ? 'rgba(255,255,255,1)'    : 'rgba(210,240,235,0.60)',
        boxShadow:       hovered
          ? '0 0 14px 3px rgba(140,202,187,0.2), 0 0 30px 8px rgba(100,180,162,0.08)'
          : '0 0 0px 0px rgba(140,202,187,0)',
      }}
      transition={{ duration: 0.34, ease: EASE }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(108deg, transparent 30%, rgba(200,242,232,0.17) 50%, transparent 68%)', backgroundSize: '260% 100%' }}
            initial={{ backgroundPosition: '-100% 0' }}
            animate={{ backgroundPosition: '260% 0' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.62, ease: EASE_OUT }}
          />
        )}
      </AnimatePresence>
      <motion.span
        animate={{ rotate: hovered ? 8 : 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        className="relative z-10"
      >
        {icon}
      </motion.span>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FOOTER — main
───────────────────────────────────────────────────────────────── */
export default function Footer() {
  const currentYear  = new Date().getFullYear();
  const footerRef    = useRef(null);
  const reducedMotion = useReducedMotion();

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const disableHeavy = reducedMotion || isTouch;

  /* ── Mouse tracking (motion-value only, no state) ── */
  const { rawX, rawY, cursorX, cursorY } = useMousePosition(footerRef, disableHeavy);

  /* ── Background parallax — driven by mouse, always alive ── */
  const bgX = useSpring(useTransform(rawX, [0, 1], ['-1%', '1%']),  SPRING_SMOOTH);
  const bgY = useSpring(useTransform(rawY, [0, 1], ['-0.8%', '0.8%']), SPRING_SMOOTH);

  /* ── Foreground parallax ── */
  const fgX = useSpring(useTransform(rawX, [0, 1], ['-5px', '5px']), SPRING_SMOOTH);

  /* ── Scroll progress — full enter/exit range for repeatable logic ── */
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end start'],
  });

  /* ── Global content reveal — scroll-driven, repeatable ── */
  // When footer scrolls in (0→0.18) → reveal; scrolls out (→1) → still visible
  // When user scrolls back up past footer (v≤0.01) → hidden again for next entry
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.18, 0.85, 1],
    [0, 0, 1, 1, 0.7]
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.18],
    [38, 0]
  );
  const contentBlur = useTransform(
    scrollYProgress,
    [0, 0.14],
    [7, 0]
  );
  const contentFilter = useTransform(contentBlur, (v) => `blur(${v}px)`);

  // Background vertical parallax from scroll (slow drift)
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  const finalOpacity = reducedMotion ? 1  : contentOpacity;
  const finalY       = reducedMotion ? 0  : contentY;
  const finalFilter  = reducedMotion ? 'blur(0px)' : contentFilter;

  /* ── Per-section stagger thresholds ── */
  // Each section has its own threshold so they reveal sequentially
  const T = {
    divider:   0.09,
    brand:     0.10,  // BrandTitle has its own controls
    caption:   0.13,
    quote:     0.16,
    navLabel:  0.13,
    navItems:  0.15,
    svcLabel:  0.15,
    svcItems:  0.17,
    ctcLabel:  0.16,
    ctcAddr:   0.18,
    ctcPhone:  0.20,
    ctcEmail:  0.21,
    socials:   0.23,
    copyright: 0.25,
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      aria-label="Site footer"
    >
      {/* ══ LAYER 0: Background image — mouse + scroll parallax ══ */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full bg-no-repeat bg-bottom bg-cover bg-[url('/footer.png')]"
        style={disableHeavy
          ? { y: bgScrollY }
          : { x: bgX, y: bgY, scale: 1.05, willChange: 'transform' }
        }
      />

      {/* ══ LAYER 1: Dark gradient ══ */}
      <div aria-hidden="true" className="absolute inset-0 w-full h-full" style={{
        background: 'linear-gradient(to top,rgba(2,18,18,1) 0px,rgba(2,18,18,1) 110px,rgba(3,24,24,0.97) 210px,rgba(4,30,30,0.93) 320px,rgba(5,36,36,0.82) 440px,rgba(6,40,40,0.52) 580px,rgba(6,42,42,0.18) 720px,transparent 900px)',
        zIndex: 1,
      }} />

      {/* ══ LAYER 2: Sky tint ══ */}
      <div aria-hidden="true" className="absolute inset-0 w-full h-full" style={{
        background: 'linear-gradient(to bottom, rgba(180,210,205,0.05) 0%, transparent 35%)',
        zIndex: 1,
      }} />

      {/* ══ LAYER 3: Ambient atmospheric drift — scroll-independent ══ */}
      <AmbientLayer disabled={disableHeavy} />

      {/* ══ LAYER 4: Noise ══ */}
      <NoiseOverlay />

      {/* ══ LAYER 5: Cursor spotlight ══ */}
      <Spotlight cursorX={cursorX} cursorY={cursorY} disabled={disableHeavy} />

      {/* ══ LAYER 6: All content — scroll-opacity envelope ══ */}
      <motion.div
        className="relative flex flex-col justify-end
          min-h-[560px] sm:min-h-[660px] md:min-h-[820px] lg:min-h-[960px] xl:min-h-[1060px] 2xl:min-h-[1160px]"
        style={{
          zIndex: 10,
          opacity: finalOpacity,
          y: finalY,
          filter: finalFilter,
          ...(disableHeavy ? {} : { x: fgX }),
          willChange: 'transform, opacity, filter',
        }}
      >
        <div className="px-5 sm:px-8 md:px-14 lg:px-18 xl:px-24 pb-4 sm:pb-6 md:pb-8 lg:pb-10 pt-6 md:pt-10">

          {/* ── Hairline divider — first to appear ── */}
          <RevealItem scrollYProgress={scrollYProgress} threshold={T.divider} delay={0}
            className="w-full mb-6 md:mb-10"
          >
            <div className="h-[1px] bg-white/10 w-full" />
          </RevealItem>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6
            gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-20 xl:gap-x-24
            gap-y-7 sm:gap-y-9 md:gap-y-12 mb-8 md:mb-12">

            {/* ── BRAND ── col-span-2 on mobile, 2 on lg+ ── */}
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1 lg:col-span-2">

              {/* BrandTitle — has its own scroll-reactive controls */}
              <BrandTitle scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />

              <RevealItem scrollYProgress={scrollYProgress} threshold={T.caption} delay={0.1}>
                <p className="font-mono uppercase text-[clamp(9.5px,1.4vw,12.5px)] text-[#b4dcd2]/56
                  tracking-[0.14em] leading-[1.95] mt-[6px]">
                  Research Driven Architecture<br />
                  &amp; Interior Design, Surat.
                </p>
              </RevealItem>

              <RevealItem scrollYProgress={scrollYProgress} threshold={T.quote} delay={0.18}
                className="hidden sm:block"
              >
                <p className="italic text-[clamp(11px,1.4vw,13.5px)] text-[#b4dcd2]/40
                  leading-[1.9] border-l border-[#b4dcd2]/14 pl-[13px]
                  font-['Cormorant_Garamond',Georgia,serif]">
                  "Designing spaces that balance<br className="hidden lg:inline" /> research, emotion, functionality, and nature."
                </p>
              </RevealItem>
            </div>

            {/* ── NAVIGATE ── */}
            <div className="flex flex-col">
              <RevealItem scrollYProgress={scrollYProgress} threshold={T.navLabel} delay={0}>
                <SectionLabel>Navigate</SectionLabel>
              </RevealItem>
              <ul className="flex flex-col gap-1">
                {['About', 'Services', 'Works', 'Testimonials', 'Contact'].map((item, i) => (
                  <RevealItem
                    key={item}
                    scrollYProgress={scrollYProgress}
                    threshold={T.navItems}
                    delay={i * 0.06}
                    className="block"
                  >
                    <NavLink href={`#${item.toLowerCase()}`}>{item}</NavLink>
                  </RevealItem>
                ))}
              </ul>
            </div>

            {/* ── SERVICES + SECTORS ── */}
            <div className="flex flex-col">
              <RevealItem scrollYProgress={scrollYProgress} threshold={T.svcLabel} delay={0}>
                <SectionLabel>Services</SectionLabel>
              </RevealItem>
              <ul className="flex flex-col gap-2 sm:gap-2.5 mb-5 sm:mb-7">
                {['Architecture', 'Interior Design', 'Landscape Design'].map((item, i) => (
                  <RevealItem
                    key={item}
                    scrollYProgress={scrollYProgress}
                    threshold={T.svcItems}
                    delay={i * 0.07}
                  >
                    <ServiceItem label={item} />
                  </RevealItem>
                ))}
              </ul>

              <RevealItem scrollYProgress={scrollYProgress} threshold={T.svcLabel} delay={0.15}>
                <SectionLabel>Sectors</SectionLabel>
              </RevealItem>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {['Residential / Commercial', 'Hospitality / Healthcare'].map((item, i) => (
                  <RevealItem
                    key={item}
                    scrollYProgress={scrollYProgress}
                    threshold={T.svcItems + 0.04}
                    delay={i * 0.07}
                  >
                    <ServiceItem label={item} />
                  </RevealItem>
                ))}
              </ul>
            </div>

            {/* ── CONTACT ── */}
            <div className="flex flex-col col-span-2 md:col-span-1">
              <RevealItem scrollYProgress={scrollYProgress} threshold={T.ctcLabel} delay={0}>
                <SectionLabel>Contact</SectionLabel>
              </RevealItem>

              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                <RevealItem scrollYProgress={scrollYProgress} threshold={T.ctcAddr} delay={0}>
                  <address className="not-italic flex gap-2.5 items-start
                    text-[clamp(11.5px,1.7vw,14.5px)] text-[#d2f0eb]/63 leading-[1.9]">
                    <MapPin size={13} className="mt-[4px] shrink-0 text-[#b4dcd2]/38" />
                    <span>
                      A-302, SNS ATRIA<br />
                      Maharana Pratap Road, Vesu<br />
                      Surat – 395007, GJ, India
                    </span>
                  </address>
                </RevealItem>

                <RevealItem scrollYProgress={scrollYProgress} threshold={T.ctcPhone} delay={0}>
                  <ContactRow
                    href="tel:+919924774664"
                    icon={<Phone size={12} />}
                    label="+91 9924774664"
                    iconRotate
                  />
                </RevealItem>

                <RevealItem scrollYProgress={scrollYProgress} threshold={T.ctcEmail} delay={0}>
                  <ContactRow
                    href="mailto:studio@designsynthesis.in"
                    icon={<Mail size={12} />}
                    label="studio@designsynthesis.in"
                  />
                </RevealItem>

                {/* Social icons — staggered reveal */}
                <RevealItem scrollYProgress={scrollYProgress} threshold={T.socials} delay={0}>
                  <div className="flex items-center gap-2.5 mt-1">
                    {[
                      { icon: <Instagram size={14} />, url: '#', label: 'Instagram' },
                      { icon: <Linkedin  size={14} />, url: '#', label: 'LinkedIn'  },
                      { icon: <Facebook  size={14} />, url: '#', label: 'Facebook'  },
                    ].map((s, i) => (
                      /* Wrap each icon in its own RevealItem for stagger */
                      <RevealItem
                        key={s.label}
                        scrollYProgress={scrollYProgress}
                        threshold={T.socials}
                        delay={i * 0.09}
                      >
                        <MagneticIcon
                          icon={s.icon}
                          url={s.url}
                          label={s.label}
                          disabled={disableHeavy}
                        />
                      </RevealItem>
                    ))}
                  </div>
                </RevealItem>
              </div>
            </div>

          </div>{/* end main grid */}

          {/* ── Bottom bar — latest to appear ── */}
          <RevealItem scrollYProgress={scrollYProgress} threshold={T.copyright} delay={0}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2
              pt-4 sm:pt-5 border-t border-white/[0.055]">
              <p className="font-mono text-center sm:text-left text-[clamp(9.5px,1.2vw,12px)]
                text-[#b4dcd2]/34 tracking-[0.15em]">
                © {currentYear} Design Synthesis. Crafted for permanence.
              </p>
              <p className="font-mono text-center sm:text-right text-[clamp(9.5px,1.2vw,12px)]
                text-[#b4dcd2]/24 tracking-[0.1em]">
                A service based in Surat, India.
              </p>
            </div>
          </RevealItem>

        </div>
      </motion.div>
    </footer>
  );
}