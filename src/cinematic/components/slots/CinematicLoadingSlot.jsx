/**
 * CinematicLoadingSlot.jsx  [Flash Fix]
 * ─────────────────────────────────────────────────────────────────
 * Flash fix applied here:
 *
 * FIX — Black underlayer during loading exit slide
 *   The LoadingScreen exits via `yPercent: -100` (slides up).
 *   As it slides up, it reveals the slot container below it.
 *   Previously the slot container was just the LoadingScreen — once
 *   it slides out, the CinematicOrchestrator div (black background
 *   is not explicitly set on it) or the website below could show.
 *
 *   This slot now renders an explicit full-black background that
 *   sits below the LoadingScreen. As the screen slides up, the
 *   black background is revealed — not the website, not the next
 *   slot (which hasn't mounted yet since we're still in LOADING phase).
 *
 *   The transition from LOADING → INTRO mounts CinematicIntroSlot
 *   which fades in from black — matching this black background
 *   perfectly for a seamless cut.
 *
 * All Phase 2 LoadingScreen integration preserved.
 * ─────────────────────────────────────────────────────────────────
 */
import LoadingScreen from "../../../components/LoadingScreen.jsx";

export function CinematicLoadingSlot({ progress, onComplete }) {
  return (
    <>
      {/*
       * Black underlayer — fills the fixed overlay while LoadingScreen
       * slides away. This is what the user sees during the ~0.2s gap
       * between the LoadingScreen exit completing and the IntroSlot's
       * enter fade reaching full opacity.
       *
       * position:absolute fills the parent fixed overlay (position:fixed
       * inset:0 zIndex:100 in CinematicOrchestrator).
       */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          background: "#000",
          zIndex:     0,    // below LoadingScreen (zIndex:1 below)
        }}
      />

      {/*
       * LoadingScreen — slides up on completion.
       * zIndex:1 keeps it above the black underlayer.
       */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <LoadingScreen
          progress={progress}
          onComplete={onComplete}
        />
      </div>
    </>
  );
}