// ─────────────────────────────────────────────────────────────────────────────
// ShelfShadow
// Two-pass shadow cast by each shelf plank onto the wall below:
// 1. Contact shadow  — tight, dark, directly at the plank underside.
// 2. Cast shadow     — diffuse gradient that softens over ~40px downward.
// intensity: 0–1 scalar, top shelf uses 1, lower shelves use 0.72.
// ─────────────────────────────────────────────────────────────────────────────

function ShelfShadow({ intensity = 1 }) {
  return (
    <div
      className="shelf-shadow"
      aria-hidden="true"
      style={{ "--shadow-intensity": intensity }}
    >
      <div className="shelf-shadow__contact" />
      <div className="shelf-shadow__cast" />
    </div>
  );
}

export default ShelfShadow;