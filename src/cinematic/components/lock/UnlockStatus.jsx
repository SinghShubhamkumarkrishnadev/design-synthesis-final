/**
 * UnlockStatus.jsx
 * ─────────────────────────────────────────────────────────────────
 * A restrained status label below the pattern grid.
 * Communicates state without cartoonish feedback.
 *
 * States:
 *   idle     → subtle hint text
 *   drawing  → empty (don't distract)
 *   error    → quiet "try again" in muted terracotta
 *   success  → quiet "unlocked" in sage green
 * ─────────────────────────────────────────────────────────────────
 */
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCK_STATE } from "../../utils/patternHelpers.js";
import { COLOR }      from "../../utils/patternConstants.js";

const MESSAGES = {
  [LOCK_STATE.IDLE]:    { text: "draw to unlock", color: COLOR.HINT_TEXT },
  [LOCK_STATE.DRAWING]: { text: "",               color: "transparent" },
  [LOCK_STATE.ERROR]:   { text: "try again",      color: "rgba(200, 155, 135, 0.55)" },
  [LOCK_STATE.SUCCESS]: { text: "unlocked",       color: "rgba(160, 200, 155, 0.70)" },
};

const labelVariants = {
  hidden:  { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.25, ease: "easeIn" } },
};

function UnlockStatusComponent({ lockState }) {
  const { text, color } = MESSAGES[lockState] ?? MESSAGES[LOCK_STATE.IDLE];

  return (
    <div
      style={{
        height:          "20px",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        marginTop:       "28px",
      }}
    >
      <AnimatePresence mode="wait">
        {text && (
          <motion.span
            key={lockState}
            variants={labelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              fontFamily:    "'Cormorant Garamond', 'Garamond', Georgia, serif",
              fontSize:      "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color,
              userSelect:    "none",
              WebkitUserSelect: "none",
              fontWeight:    300,
            }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export const UnlockStatus = memo(UnlockStatusComponent);