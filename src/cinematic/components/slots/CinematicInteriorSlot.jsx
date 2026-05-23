/**
 * CinematicInteriorSlot.jsx  [Phase 4 — updated]
 * ─────────────────────────────────────────────────────────────────
 * Phase 4 change:
 *   • onNearEnd now dispatches HANDOFF_READY (via prop) so HomeSection
 *     knows the exit fade has started and the website will be revealed.
 *   • onEnded still dispatches INTERIOR_ENDED → COMPLETED.
 *
 * This allows HomeSection typography to begin its own entrance at
 * exactly the moment the interior fade starts — creating a
 * choreographed reveal rather than a hard cut.
 *
 * The slot receives two callbacks instead of one:
 *   onHandoff  — fired at near-end (start of exit fade)
 *   onEnded    — fired after exit fade completes
 *
 * All Phase 2 slot architecture is PRESERVED EXACTLY.
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

  // onNearEnd: dispatch HANDOFF_READY then begin the visual exit fade
  const handleNearEnd = useCallback(() => {
    onHandoff?.();
    startExit();
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
        zIndex:     0,
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
        decoding="sync"
        style={{
          position:       "absolute",
          inset:          0,
          width:          "100%",
          height:         "100%",
          objectFit:      "cover",
          objectPosition: "center center",
          zIndex:         2,
          opacity:        0,
          transform:      "translateZ(0)",
          willChange:     "opacity",
          color:          "transparent",
        }}
      />
    </div>
  );
}