/**
 * useSlotTimeline.js
 * ─────────────────────────────────────────────────────────────────
 * Creates and manages GSAP timelines for a cinematic slot's
 * enter and exit animations.
 *
 * Design rules:
 *  • All GSAP work lives inside a gsap.context() scoped to the
 *    slot's container ref — no global selectors, no leaks.
 *  • The context is .revert()'ed on cleanup, which kills all
 *    tweens and restores inline styles.
 *  • Enter timeline plays automatically on mount.
 *  • Exit timeline is triggered imperatively via startExit().
 *  • onExitComplete fires after the exit tl finishes so the
 *    parent can dispatch the state machine action.
 *
 * Usage:
 *   const { startExit } = useSlotTimeline({
 *     containerRef,
 *     buildEnter: (container) => gsap.fromTo(container, ...),
 *     buildExit:  (container) => gsap.to(container, ...),
 *     onExitComplete,
 *   });
 *
 * @param {object} opts
 * @param {{ current: HTMLElement }}  opts.containerRef
 * @param {(el: HTMLElement) => gsap.core.Timeline} opts.buildEnter
 * @param {(el: HTMLElement) => gsap.core.Timeline} opts.buildExit
 * @param {() => void}               opts.onExitComplete
 * @returns {{ startExit: () => void }}
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export function useSlotTimeline({
  containerRef,
  buildEnter,
  buildExit,
  onExitComplete,
}) {
  const ctxRef            = useRef(null);
  const exitTlRef         = useRef(null);
  const exitFiredRef      = useRef(false);
  const onExitStable      = useRef(onExitComplete);

  useEffect(() => { onExitStable.current = onExitComplete; }, [onExitComplete]);

  // ── Mount: build enter timeline inside GSAP context ─────────────
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    // Each slot gets its own isolated GSAP context
    const ctx = gsap.context(() => {
      const enterTl = buildEnter?.(container);
      // Store exit builder reference for later
      exitTlRef.current = null; // reset; will be built on startExit()
    }, container);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      ctxRef.current   = null;
      exitTlRef.current = null;
      exitFiredRef.current = false;
    };
  // buildEnter intentionally excluded — it's defined outside and stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  // ── Imperative exit trigger ──────────────────────────────────────
  const startExit = useCallback(() => {
    const container = containerRef?.current;
    if (!container || exitFiredRef.current) return;
    exitFiredRef.current = true;

    // Build exit timeline inside the existing context so it's
    // properly cleaned up if the component unmounts mid-animation.
    if (ctxRef.current) {
      ctxRef.current.add(() => {
        const tl = buildExit?.(container);
        if (tl) {
          tl.eventCallback("onComplete", () => {
            onExitStable.current?.();
          });
        } else {
          // No exit timeline — complete immediately
          onExitStable.current?.();
        }
        exitTlRef.current = tl;
      });
    } else {
      onExitStable.current?.();
    }
  }, [containerRef, buildExit]);

  return { startExit };
}