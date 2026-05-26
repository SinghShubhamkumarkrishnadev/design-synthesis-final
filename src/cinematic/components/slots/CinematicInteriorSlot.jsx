/**
 * CinematicInteriorSlot.jsx  [Flash Fix]
 * ─────────────────────────────────────────────────────────────────
 * Flash fixes applied here:
 *
 * FIX 1 — Image decoding changed to "sync" → "async"
 *   decoding="sync" blocks the main thread while decoding.
 *   During this block, React may have already painted a frame with
 *   the img element in the DOM but before the overlay is fully opaque.
 *   decoding="async" lets the browser decode off-thread so the image
 *   appears atomically once ready.
 *   NOTE: This is the overlay's copy of interior-final.jpg (for the
 *   freeze-frame effect inside the cinematic). It's separate from
 *   HomeSection's copy, which is guarded by visibility:hidden.
 *
 * FIX 2 — Container background is explicit #000 throughout
 *   During the enter fade (opacity: 0 → 1), the container must be
 *   opaque black — not transparent. Any transparent moment would
 *   reveal whatever is below the overlay.
 *
 * FIX 3 — onHandoff fires BEFORE startExit (preserved from Phase 4)
 *   This is correct — HANDOFF_READY dispatches first so the state
 *   machine is in HANDOFF before the exit fade begins.
 *
 * All Phase 4 architecture preserved.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef, useCallback } from "react";
import gsap from "gsap";

import { useAdoptVideo }    from "../../hooks/useAdoptVideo.js";
import { useVideoPlayback } from "../../hooks/useVideoPlayback.js";
import { useFreezeFrame }   from "../../hooks/useFreezeFrame.js";
import { useSlotTimeline }  from "../../hooks/useSlotTimeline.js";

const FREEZE_IMG_SRC = "/images/interior-final.jpg";
const ENTER_DURATION = 0.5;
const EXIT_DURATION  = 1.2;
const EXIT_LEAD_TIME = 0.8;

export function CinematicInteriorSlot({ videoRef, onHandoff, onEnded }) {
  const containerRef = useRef(null);
  const imageRef     = useRef(null);

  useAdoptVideo(videoRef, containerRef);

  const buildEnter = useCallback((container) => {
    return gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity:  1,
        duration: ENTER_DURATION,
        ease:     "power2.out",
        onComplete: () => {
          const video = videoRef?.current;
          if (video) {
            gsap.to(video, { opacity: 1, duration: 0.25, ease: "none" });
          }
        },
      }
    );
  }, [videoRef]);

  const buildExit = useCallback((container) => {
    return gsap.to(container, {
      opacity:  0,
      duration: EXIT_DURATION,
      ease:     "power3.inOut",
    });
  }, []);

  const { startExit } = useSlotTimeline({
    containerRef,
    buildEnter,
    buildExit,
    onExitComplete: onEnded,
  });

  const handleNearEnd = useCallback(() => {
    onHandoff?.();   // dispatch HANDOFF_READY first
    startExit();     // then begin visual exit
  }, [onHandoff, startExit]);

  useVideoPlayback({
    videoRef,
    shouldPlay:      true,
    onNearEnd:       handleNearEnd,
    onPlaybackError: onEnded,
    threshold:       EXIT_LEAD_TIME,
  });

  useFreezeFrame({
    containerRef,
    videoRef,
    imageRef,
    onFrozen: () => {},
  });

  return (
    <div
      ref={containerRef}
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     0,       // within the overlay parent (z-index:100)
        // FIX: Explicit black background — never transparent.
        // During enter fade the container goes from opacity:0 → 1.
        // The black background ensures nothing bleeds through while
        // the fade is in progress.
        background: "#000",
        overflow:   "hidden",
        transform:       "translateZ(0)",
        willChange:      "opacity",
        opacity:         0,
      }}
    >
      <img
        ref={imageRef}
        src={FREEZE_IMG_SRC}
        alt=""
        aria-hidden="true"
        loading="eager"
        // FIX: async decoding — don't block main thread paint
        decoding="async"
        style={{
          position:       "absolute",
          inset:          0,
          width:          "100%",
          height:         "100%",
          objectFit:      "cover",
          objectPosition: "center center",
          zIndex:         2,
          opacity:        0,  // controlled by useFreezeFrame
          transform:      "translateZ(0)",
          willChange:     "opacity",
          color:          "transparent",
        }}
      />
    </div>
  );
}