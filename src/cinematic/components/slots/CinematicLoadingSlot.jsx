/**
 * CinematicLoadingSlot.jsx  [Phase 2 — updated]
 * ─────────────────────────────────────────────────────────────────
 * The LoadingScreen's `onComplete` prop fires when its GSAP exit
 * animation completes and the component slides off screen.
 *
 * In Phase 2 we pass that signal directly through to the orchestrator
 * without modification — the orchestrator coordinates it with video
 * readiness via the `loadingAnimDone` + `videosReady` ref pair.
 *
 * No changes to LoadingScreen.jsx itself.
 * ─────────────────────────────────────────────────────────────────
 */
import LoadingScreen from "../../../components/LoadingScreen";

export function CinematicLoadingSlot({ progress, onComplete }) {
  void progress; // available for future progress-bar overlay

  return (
    <LoadingScreen onComplete={onComplete} />
  );
}