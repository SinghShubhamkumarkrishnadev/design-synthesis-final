/**
 * useVideoPlayback.js
 * ─────────────────────────────────────────────────────────────────
 * Drives playback of an adopted <video> element.
 *
 * Responsibilities:
 *  • Seek to 0 and call .play() once the video is adopted.
 *  • Handle the autoplay promise (Safari may reject).
 *  • Fire onNearEnd when video reaches `duration - threshold` seconds
 *    so the parent can begin its exit transition BEFORE the video ends.
 *  • Fire onEnded after the freeze-frame swap (via useFreezeFrame).
 *
 * This hook does NOT manage the ended → freeze-frame swap —
 * that's useFreezeFrame's job. This hook fires onNearEnd so the
 * parent can start GSAP exit animations at the right moment.
 *
 * @param {object} opts
 * @param {{ current: HTMLVideoElement|null }} opts.videoRef
 * @param {boolean}    opts.shouldPlay       — gate: only play when true
 * @param {() => void} opts.onNearEnd        — fires `threshold` secs before end
 * @param {() => void} opts.onPlaybackError  — autoplay blocked fallback
 * @param {number}     [opts.threshold=0.5]  — seconds before end to fire onNearEnd
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from "react";

export function useVideoPlayback({
  videoRef,
  shouldPlay,
  onNearEnd,
  onPlaybackError,
  threshold = 0.5,
}) {
  const nearEndFiredRef    = useRef(false);
  const onNearEndStable    = useRef(onNearEnd);
  const onErrorStable      = useRef(onPlaybackError);

  useEffect(() => { onNearEndStable.current    = onNearEnd;       }, [onNearEnd]);
  useEffect(() => { onErrorStable.current      = onPlaybackError; }, [onPlaybackError]);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video || !shouldPlay) return;

    nearEndFiredRef.current = false;
    video.currentTime = 0;

    // ── timeupdate — near-end detection ────────────────────────────
    const handleTimeUpdate = () => {
      if (nearEndFiredRef.current)     return;
      if (!video.duration)             return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= threshold) {
        nearEndFiredRef.current = true;
        onNearEndStable.current?.();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    // ── Play with autoplay-safe promise handling ────────────────────
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // NotAllowedError = autoplay policy blocked.
        // AbortError = element removed before play resolved (cleanup).
        if (err.name !== "AbortError") {
          console.warn("[useVideoPlayback] Autoplay blocked:", err.message);
          onErrorStable.current?.();
        }
      });
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      // Do NOT call video.pause() here — useFreezeFrame / the slot
      // owns the pause/remove lifecycle to avoid race conditions.
    };
  }, [videoRef, shouldPlay, threshold]);
}