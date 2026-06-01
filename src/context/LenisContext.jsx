/**
 * LenisContext.jsx  +  useLenis hook
 * ─────────────────────────────────────────────────────────────────
 * Single Lenis instance shared across the whole app.
 *
 * Exposes:
 *   lenis       — raw Lenis instance ref (for edge-cases)
 *   scrollTo()  — programmatic scroll
 *   stop()      — freeze scroll (no jump, no layout shift)
 *   start()     — resume scroll (restores exact position)
 *
 * FIX: Previously lenis.stop() was called on init and start() was
 * never called after the loading screen finished — this completely
 * blocked all scrolling. Now Lenis starts running immediately; App
 * calls stop() during loading and start() once isLoaded is true.
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
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    // rAF ticker — keep Lenis running every frame
    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Do NOT call lenis.stop() here.
    // App.jsx will call stop() immediately and start() once loaded.

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