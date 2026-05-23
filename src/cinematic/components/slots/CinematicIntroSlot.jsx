/**
 * CinematicIntroSlot.jsx  [Phase 2]
 * ─────────────────────────────────────────────────────────────────
 * Replaces the Phase 1 stub entirely.
 *
 * Render tree:
 *   <container>                     ← GSAP scope, position:fixed inset:0
 *     <img freeze-frame />          ← opacity:0, pre-composited on GPU
 *     (video element moved here by useAdoptVideo)
 *   </container>
 *
 * Timeline:
 *   1. Mount          → container fades in from black (0.6s)
 *   2. Video adopted  → play() via useVideoPlayback
 *   3. nearEnd fires  → startExit() begins container fade-to-black
 *   4. video `ended`  → freeze-frame atomic swap (useFreezeFrame)
 *      (the freeze swap is masked under the exit fade — belt+braces)
 *   5. onFrozen       → onEnded() dispatches INTRO_ENDED to machine
 *
 * Why fade the container and not the video?
 *   Fading the container covers both the video AND the freeze-frame
 *   image in one tween. When LOCKED phase mounts, its own enter fade
 *   creates a seamless black → content crossfade with no gap.
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef, useCallback, useMemo } from "react";
import gsap from "gsap";

import { useAdoptVideo }    from "../../hooks/useAdoptVideo.js";
import { useVideoPlayback } from "../../hooks/useVideoPlayback.js";
import { useFreezeFrame }   from "../../hooks/useFreezeFrame.js";
import { useSlotTimeline }  from "../../hooks/useSlotTimeline.js";

// ── Constants ────────────────────────────────────────────────────
const FREEZE_IMG_SRC  = "/images/intro-final.jpg";
const ENTER_DURATION  = 0.6;   // seconds
const EXIT_DURATION   = 0.8;   // seconds
// How many seconds before video end to start the exit fade
const EXIT_LEAD_TIME  = 0.5;

// ── Component ────────────────────────────────────────────────────
export function CinematicIntroSlot({ videoRef, onEnded }) {
  const containerRef = useRef(null);
  const imageRef     = useRef(null);

  // ── 1. Adopt the preloaded video into our container ─────────────
  useAdoptVideo(videoRef, containerRef);

  // ── 2. GSAP enter / exit timelines ──────────────────────────────
  const buildEnter = useCallback((container) => {
    return gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity:  1,
        duration: ENTER_DURATION,
        ease:     "power2.out",
        // Once the container is visible, reveal the video layer
        onComplete: () => {
          const video = videoRef?.current;
          if (video) {
            gsap.to(video, { opacity: 1, duration: 0.3, ease: "none" });
          }
        },
      }
    );
  }, [videoRef]);

  const buildExit = useCallback((container) => {
    return gsap.to(container, {
      opacity:  0,
      duration: EXIT_DURATION,
      ease:     "power2.inOut",
    });
  }, []);

  const { startExit } = useSlotTimeline({
    containerRef,
    buildEnter,
    buildExit,
    onExitComplete: onEnded,   // dispatch INTRO_ENDED after fade finishes
  });

  // ── 3. Video playback ────────────────────────────────────────────
  useVideoPlayback({
    videoRef,
    shouldPlay:      true,
    onNearEnd:       startExit,       // begin exit EXIT_LEAD_TIME secs before end
    onPlaybackError: onEnded,         // unblock flow if autoplay fails
    threshold:       EXIT_LEAD_TIME,
  });

  // ── 4. Freeze-frame atomic swap ──────────────────────────────────
  // useFreezeFrame listens for `ended` and swaps image/video opacity
  // in a single rAF — zero flicker. onFrozen is intentionally a no-op
  // here: the state machine advances via onExitComplete (step 2).
  // The freeze-frame just ensures visual continuity under the exit fade.
  useFreezeFrame({
    containerRef,
    videoRef,
    imageRef,
    onFrozen: () => {/* visual continuity only — dispatch handled by exit tl */},
  });

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     0,         // within the overlay (parent is z-index:100)
        background: "#000",
        overflow:   "hidden",
        // GPU layer promotion
        transform:       "translateZ(0)",
        willChange:      "opacity",
        // Start invisible — buildEnter fades this in
        opacity:         0,
      }}
    >
      {/*
       * Freeze-frame image
       * ──────────────────
       * Rendered at opacity:0 so it is already composited on the GPU.
       * useFreezeFrame will set opacity:1 atomically when video ends.
       * The `loading="eager"` ensures it is decoded before it's needed.
       */}
      <img
        ref={imageRef}
        src={FREEZE_IMG_SRC}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="sync"
        style={{
          position:   "absolute",
          inset:      0,
          width:      "100%",
          height:     "100%",
          objectFit:  "cover",
          objectPosition: "center center",
          zIndex:     2,        // above the video (z-index:1)
          opacity:    0,
          // GPU layer
          transform:  "translateZ(0)",
          willChange: "opacity",
          // Prevent any flash of alt text / broken-image icon
          color:      "transparent",
        }}
      />
      {/*
       * The <video> element is injected here by useAdoptVideo.
       * It lives at z-index:1, below the freeze-frame image.
       * No JSX video element needed — the preloader's DOM node is moved.
       */}
    </div>
  );
}