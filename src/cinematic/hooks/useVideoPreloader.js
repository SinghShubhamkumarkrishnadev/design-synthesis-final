/**
 * useVideoPreloader.js
 * ─────────────────────────────────────────────────────────────────
 * Preloads an array of video sources and reports combined progress.
 *
 * Safari / Mobile compatibility notes:
 *  • Safari requires `playsInline` and `muted` for autoplay.
 *  • We use `preload="auto"` and listen to `progress` events
 *    (not `canplaythrough`) so we get granular byte progress.
 *  • On iOS, video data only loads after a user gesture; we detect
 *    this via `readyState` and fall back to a "ready-enough" flag.
 *  • All video elements live in the DOM via a hidden container ref
 *    passed back to the caller — they must be rendered (even if
 *    invisible) for Safari to buffer them.
 *
 * Returns:
 *   {
 *     progress: number,          // 0–100 combined across all videos
 *     isReady:  boolean,         // true when all videos are ready
 *     videoRefs: Map<string, RefObject<HTMLVideoElement>>
 *   }
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * @param {Array<{ id: string, src: string }>} sources
 * @param {object}  [opts]
 * @param {boolean} [opts.enabled=true]   — set false to skip (e.g. no videos yet)
 */
export function useVideoPreloader(sources = [], { enabled = true } = {}) {
  const videoRefs  = useRef(new Map()); // id → HTMLVideoElement
  const progressMap = useRef({});       // id → 0-100
  const readyMap   = useRef({});        // id → boolean

  const [progress, setProgress] = useState(0);
  const [isReady,  setIsReady ] = useState(false);

  // Recalculate combined progress across all sources
  const recalculate = useCallback(() => {
    const ids   = sources.map((s) => s.id);
    const total = ids.length;
    if (total === 0) return;

    const sum = ids.reduce((acc, id) => acc + (progressMap.current[id] ?? 0), 0);
    const avg = sum / total;
    setProgress(Math.round(avg));

    const allReady = ids.every((id) => readyMap.current[id]);
    if (allReady) setIsReady(true);
  }, [sources]);

  useEffect(() => {
    if (!enabled || sources.length === 0) {
      setProgress(100);
      setIsReady(true);
      return;
    }

    // Initialise progress/ready maps
    sources.forEach(({ id }) => {
      progressMap.current[id] = 0;
      readyMap.current[id]    = false;
    });

    const cleanups = sources.map(({ id, src }) => {
      // Reuse existing element or create a new one
      let video = videoRefs.current.get(id);
      if (!video) {
        video = document.createElement("video");
        video.muted      = true;    // Required for autoplay
        video.playsInline = true;   // Required for iOS
        video.preload    = "auto";
        video.setAttribute("playsinline", "");   // Belt + braces for Safari
        video.setAttribute("webkit-playsinline", "");
        video.style.cssText = "display:none;position:absolute;pointer-events:none;";
        document.body.appendChild(video);
        videoRefs.current.set(id, video);
      }

      // ── Progress via `progress` event ──────────────────────────
      const onProgress = () => {
        if (!video.duration || video.duration === Infinity) return;
        let loaded = 0;
        try {
          const ranges = video.buffered;
          for (let i = 0; i < ranges.length; i++) {
            loaded += ranges.end(i) - ranges.start(i);
          }
        } catch { /* ignore */ }
        progressMap.current[id] = Math.min(100, (loaded / video.duration) * 100);
        recalculate();
      };

      // ── Ready-enough detection ─────────────────────────────────
      // `canplaythrough` is unreliable on iOS — use `readyState >= 3`
      const markReady = () => {
        if (video.readyState >= 3) {
          progressMap.current[id] = 100;
          readyMap.current[id]    = true;
          recalculate();
        }
      };

      const onCanPlay         = () => markReady();
      const onCanPlayThrough  = () => markReady();
      const onLoadedData      = () => markReady();

      // ── Error fallback — don't block the experience ────────────
      const onError = () => {
        console.warn(`[useVideoPreloader] Failed to load "${src}". Marking as ready to unblock flow.`);
        progressMap.current[id] = 100;
        readyMap.current[id]    = true;
        recalculate();
      };

      video.addEventListener("progress",        onProgress);
      video.addEventListener("canplay",         onCanPlay);
      video.addEventListener("canplaythrough",  onCanPlayThrough);
      video.addEventListener("loadeddata",      onLoadedData);
      video.addEventListener("error",           onError);

      // Trigger load
      video.src = src;
      video.load();

      // iOS won't buffer without a gesture — poll readyState as fallback
      const iosPollInterval = setInterval(() => {
        if (video.readyState >= 3) {
          markReady();
          clearInterval(iosPollInterval);
        }
      }, 300);

      return () => {
        video.removeEventListener("progress",       onProgress);
        video.removeEventListener("canplay",        onCanPlay);
        video.removeEventListener("canplaythrough", onCanPlayThrough);
        video.removeEventListener("loadeddata",     onLoadedData);
        video.removeEventListener("error",          onError);
        clearInterval(iosPollInterval);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [enabled, sources, recalculate]);

  // Cleanup video elements on unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        video.pause();
        video.src = "";
        video.remove();
      });
      videoRefs.current.clear();
    };
  }, []);

  return { progress, isReady, videoRefs };
}