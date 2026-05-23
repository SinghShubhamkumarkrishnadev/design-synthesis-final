/**
 * useAdoptVideo.js
 * ─────────────────────────────────────────────────────────────────
 * Moves a preloaded <video> element from its hidden position in
 * document.body into a visible container, then returns it on cleanup.
 *
 * WHY NOT CLONE?
 *   Cloning a video element resets the decoder — Safari and Chrome
 *   both require a full re-decode, causing a black flash and replay
 *   latency. Moving (appendChild) transfers the existing decoder
 *   state: the video is already buffered, seeking is instant,
 *   and no decode gap exists.
 *
 * WHY NOT JUST SHOW THE HIDDEN ELEMENT?
 *   The preloader sets `display:none` and `position:absolute` on the
 *   element. We need it to be `position:absolute; inset:0; width:100%;
 *   height:100%; object-fit:cover` inside our container. Mutating
 *   inline styles directly is safe because we restore them on cleanup.
 *
 * Usage:
 *   const containerRef = useRef(null);
 *   const video = useAdoptVideo(videoRef, containerRef);
 *   // `video` is the live HTMLVideoElement once adopted, null before.
 *
 * @param {{ current: HTMLVideoElement|null }} videoRef   — from preloader
 * @param {{ current: HTMLElement|null }}      containerRef — target container
 * @returns {HTMLVideoElement|null}
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from "react";

export function useAdoptVideo(videoRef, containerRef) {
  // Cache the adopted element so callers can reference it stably
  const adoptedRef = useRef(null);

  useEffect(() => {
    const video     = videoRef?.current;
    const container = containerRef?.current;
    if (!video || !container) return;

    // ── Snapshot original styles so we can restore them on cleanup ──
    const originalStyles = {
      display:   video.style.display,
      position:  video.style.position,
      cssText:   video.style.cssText,
    };
    const originalParent  = video.parentNode;
    const originalNextSib = video.nextSibling;

    // ── Apply cinematic styles ──────────────────────────────────────
    video.style.cssText = [
      "position: absolute",
      "inset: 0",
      "width: 100%",
      "height: 100%",
      "object-fit: cover",
      "object-position: center center",
      // GPU acceleration hints
      "transform: translateZ(0)",
      "will-change: transform",
      // Ensure correct layer order inside container
      "z-index: 1",
      // Start invisible — GSAP fade-in will reveal
      "opacity: 0",
      // Prevent iOS tap highlight / controls bleed-through
      "-webkit-tap-highlight-color: transparent",
      "pointer-events: none",
    ].join(";");

    // ── Move into container ─────────────────────────────────────────
    container.appendChild(video);
    adoptedRef.current = video;

    // ── Cleanup: return video to original position ──────────────────
    return () => {
      // Restore inline styles
      video.style.cssText = originalStyles.cssText;

      // Re-insert into original DOM position to avoid orphan nodes
      if (originalParent) {
        if (originalNextSib) {
          originalParent.insertBefore(video, originalNextSib);
        } else {
          originalParent.appendChild(video);
        }
      }

      adoptedRef.current = null;
    };
  }, [videoRef, containerRef]);
  // NOTE: deps are refs — they never change identity, so this effect
  // runs once on mount and once on unmount. That's exactly correct.

  return adoptedRef.current;
}