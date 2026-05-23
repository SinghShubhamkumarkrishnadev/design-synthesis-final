/**
 * LenisContext.jsx  +  useLenis hook
 * ─────────────────────────────────────────────────────────────────
 * Single Lenis instance shared across the whole app.
 *
 * Exposes:
 *   lenis       — raw Lenis instance (for edge-cases)
 *   scrollTo()  — programmatic scroll
 *   stop()      — freeze scroll (no jump, no layout shift)
 *   start()     — resume scroll (restores exact position)
 *
 * Design decisions:
 *  • Lenis is created ONCE inside the provider — never re-created.
 *  • stop/start are ref-stable (wrapped in useCallback with [] deps).
 *  • The rAF ticker is cleaned up on unmount to prevent memory leaks.
 *  • index.css removes html { scroll-behavior: smooth } to avoid
 *    conflict with Lenis; that comment is included below.
 * ─────────────────────────────────────────────────────────────────
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Lenis from "lenis";

const LenisContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────
export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef   = useRef(null);

  // Initialise Lenis once on mount
  useEffect(() => {
    const lenis = new Lenis({
      duration:   1.2,
      easing:     (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // NOTE: if you use Lenis 2.x the option is `smoothTouch`
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    // rAF ticker
    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Start stopped — CinematicOrchestrator will call start() at the
    // right phase transition so there's zero scroll during loading.
    lenis.stop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Public API (ref-stable) ────────────────────────────────────
  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const scrollTo = useCallback((target, options) => {
    lenisRef.current?.scrollTo(target, options);
  }, []);

  const value = useMemo(
    () => ({ lenis: lenisRef, stop, start, scrollTo }),
    // lenisRef is a ref — stable; stop/start/scrollTo are stable callbacks
    [stop, start, scrollTo]
  );

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────
export function useLenis() {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error("useLenis must be used inside <LenisProvider>.");
  }
  return ctx;
}

/*
 * IMPORTANT — remove `scroll-behavior: smooth` from index.css:
 *
 *   @layer base {
 *     html {
 * -     scroll-behavior: smooth;   ← remove or Lenis conflicts
 *     }
 *   }
 *
 * Lenis handles smooth scrolling itself.
 */