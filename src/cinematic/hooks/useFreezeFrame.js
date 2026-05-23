/**
 * useFreezeFrame.js
 * ─────────────────────────────────────────────────────────────────
 * Manages the atomic swap from a live video to a static freeze-frame
 * image at the exact moment the video ends.
 *
 * THE FLICKER PROBLEM
 * ────────────────────
 * Naïve approach: hide video on `ended`, show <img>.
 * Problem: there is a browser-compositing gap between hiding one
 * GPU layer and showing another. On Safari this gap is 1-3 frames
 * of solid black — visible to the user.
 *
 * THE SOLUTION
 * ─────────────
 * 1. Pre-load the freeze-frame <img> with `opacity:0` BEFORE the
 *    video ends, so it is already composited onto the GPU layer.
 * 2. On video `ended`, within a single requestAnimationFrame:
 *    a. Set image opacity → 1
 *    b. Set video opacity → 0
 *    Both happen in the same compositor frame — zero gap.
 * 3. After a brief timeout (2 rAFs), remove the video from the
 *    container (it's already invisible; removal is safe).
 * 4. Signal `isFreezed: true` so parent can fire onEnded callback.
 *
 * WHY NOT CANVAS?
 * ────────────────
 * drawImage() to canvas works but forces a CPU readback on Safari
 * and produces a noticeable stutter on high-res displays. A
 * pre-loaded static JPEG on the GPU is instantaneous.
 *
 * @param {object} opts
 * @param {{ current: HTMLElement }}        opts.containerRef  — the slot wrapper
 * @param {{ current: HTMLVideoElement }}   opts.videoRef      — adopted video
 * @param {{ current: HTMLImageElement }}   opts.imageRef      — freeze-frame <img>
 * @param {() => void}                      opts.onFrozen      — fires when swap is complete
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from "react";

export function useFreezeFrame({ containerRef, videoRef, imageRef, onFrozen }) {
  const frozenRef       = useRef(false);
  const rafRef          = useRef(null);
  const onFrozenStable  = useRef(onFrozen);

  useEffect(() => { onFrozenStable.current = onFrozen; }, [onFrozen]);

  useEffect(() => {
    const video = videoRef?.current;
    const image = imageRef?.current;
    if (!video || !image) return;

    // ── Pre-position the image under the video ──────────────────────
    // Image is already rendered in JSX with opacity:0 — just confirm
    // it is GPU-composited by forcing a style read.
    void image.offsetHeight; // trigger layout

    const handleEnded = () => {
      if (frozenRef.current) return;
      frozenRef.current = true;

      // Atomic opacity swap in one rAF
      rafRef.current = requestAnimationFrame(() => {
        if (image)  image.style.opacity  = "1";
        if (video)  video.style.opacity  = "0";

        // After 2 more frames, safely detach the video element
        // (it's invisible; detaching frees the decoder pipeline)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              if (video.parentNode === containerRef?.current) {
                containerRef.current.removeChild(video);
              }
            } catch { /* ignore if already removed */ }

            onFrozenStable.current?.();
          });
        });
      });
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef, imageRef, containerRef]);
}