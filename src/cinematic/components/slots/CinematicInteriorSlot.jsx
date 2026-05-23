/**
 * CinematicInteriorSlot.jsx  [Phase 2]
 * ─────────────────────────────────────────────────────────────────
 * Replaces the Phase 1 stub entirely.
 *
 * Differences from IntroSlot:
 *  • Uses interior-final.jpg as the freeze-frame
 *  • The exit fade transitions INTO the completed state:
 *    the overlay unmounts (CinematicOrchestrator returns null) and
 *    the website is revealed underneath.
 *  • The exit animation fades to transparent (not black) so the
 *    website content bleeds through as the overlay disappears.
 *
 * Render tree:
 *   <container>                        ← fixed, inset 0
 *     <img interior-final.jpg />       ← opacity:0, pre-composited
 *     (video element moved here by useAdoptVideo)
 *   </container>
 *
 * Timeline:
 *   1. Mount          → fade in from black (0.5s)
 *   2. Video plays    → autoplay via useVideoPlayback
 *   3. nearEnd        → startExit() begins fade-to-transparent
 *   4. video ended    → freeze-frame swap (atomic, under exit fade)
 *   5. onExitComplete → onEnded() dispatches INTERIOR_ENDED
 *      → CinematicOrchestrator returns null → overlay removed
 * ─────────────────────────────────────────────────────────────────
 */
import { useRef, useCallback } from "react";
import gsap from "gsap";

import { useAdoptVideo }    from "../../hooks/useAdoptVideo.js";
import { useVideoPlayback } from "../../hooks/useVideoPlayback.js";
import { useFreezeFrame }   from "../../hooks/useFreezeFrame.js";
import { useSlotTimeline }  from "../../hooks/useSlotTimeline.js";

// ── Constants ────────────────────────────────────────────────────
const FREEZE_IMG_SRC = "/images/interior-final.jpg";
const ENTER_DURATION = 0.5;
const EXIT_DURATION  = 1.2;    // Longer — this is the grand reveal
const EXIT_LEAD_TIME = 0.8;    // Start exit earlier for a long fade

// ── Component ────────────────────────────────────────────────────
export function CinematicInteriorSlot({ videoRef, onEnded }) {
  const containerRef = useRef(null);
  const imageRef     = useRef(null);

  // ── 1. Adopt preloaded video ─────────────────────────────────────
  useAdoptVideo(videoRef, containerRef);

  // ── 2. Timelines ─────────────────────────────────────────────────
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

  // Exit fades to opacity:0 — revealing the website below the overlay.
  // This creates the "world opening up" feel as the cinematic ends.
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
    onExitComplete: onEnded,   // dispatch INTERIOR_ENDED
  });

  // ── 3. Playback ──────────────────────────────────────────────────
  useVideoPlayback({
    videoRef,
    shouldPlay:      true,
    onNearEnd:       startExit,
    onPlaybackError: onEnded,
    threshold:       EXIT_LEAD_TIME,
  });

  // ── 4. Freeze-frame swap ─────────────────────────────────────────
  useFreezeFrame({
    containerRef,
    videoRef,
    imageRef,
    onFrozen: () => {/* exit fade covers the swap — no extra action needed */},
  });

  // ── Render ───────────────────────────────────────────────────────
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
      {/* Freeze-frame — pre-composited at opacity:0 */}
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
      {/* <video> injected here by useAdoptVideo at z-index:1 */}
    </div>
  );
}