// ─────────────────────────────────────────────────────────────────────────────
// ShelfShadow
// Renders the layered shadow that a shelf plank casts downward onto
// the wall surface below it. Two passes: a soft diffuse cast + a
// crisp contact shadow at the plank underside.
// ─────────────────────────────────────────────────────────────────────────────

function ShelfShadow({ intensity = 1 }) {
  return (
    <div
      className="shelf-shadow"
      aria-hidden="true"
      style={{ "--shadow-intensity": intensity }}
    >
      {/* Contact shadow — tight, dark, directly below plank lip */}
      <div className="shelf-shadow__contact" />

      {/* Cast shadow — diffuse, fades downward over ~60px */}
      <div className="shelf-shadow__cast" />
    </div>
  );
}

export default ShelfShadow;