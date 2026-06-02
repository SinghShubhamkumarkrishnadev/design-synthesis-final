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

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Keep stop/start in the API so App.jsx doesn't need to change,
  // but they're now no-ops — the CSS class does the real work.
  const stop     = useCallback(() => {}, []);
  const start    = useCallback(() => {}, []);
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

export function useLenis() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error("useLenis must be used inside <LenisProvider>.");
  return ctx;
}