"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Lottie from "lottie-react";
import toast, { Toaster } from "react-hot-toast";
import { Send, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";

// ─── External assets (unchanged paths) ───────────────────────────────────────
import contactAnimation from "../../assets/blue phone.json";
import successAnimation from "../../assets/sendmail.json";
import phoneBg          from "../../assets/phonebg.png";
import FloatingPaths    from "./FloatingPaths";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — exact tokens from ServicesSection / TestimonialsSection
// ─────────────────────────────────────────────────────────────────────────────
const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

const C = {
  bg:          "#EEF1EE",
  bgGrad: `
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 38%, transparent 72%),
    radial-gradient(ellipse 55% 75% at 100% 45%, rgba(45,115,86,0.045) 0%, transparent 65%),
    radial-gradient(ellipse 45% 55% at 0% 100%, rgba(13,43,30,0.035) 0%, transparent 60%),
    linear-gradient(180deg, #F4F6F4 0%, #EEF1EE 38%, #E8ECE8 72%, #E3E8E4 100%)
  `,
  forest:       "#0D2B1E",
  accent:       "#2D7356",
  accentLight:  "#235E44",
  accentBg:     "#daeae2",
  border:       "rgba(45,115,86,0.18)",
  borderSolid:  "#c8ddd4",
  text:         "rgba(13,43,30,0.72)",
  textMuted:    "rgba(13,43,30,0.42)",
  inputBg:      "rgba(255,255,255,0.58)",
  inputFocus:   "rgba(45,115,86,0.55)",
};

// ─── Motion presets — identical to ServicesSection ────────────────────────────
const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.65, ease } },
};

const ruleVariant = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.80, delay: 0.16, ease } },
};

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.10 } },
};

// ─── Breakpoint helper — identical to ServicesSection ────────────────────────
function getBreakpoint(w) {
  if (w < 360)  return "xxs";
  if (w < 480)  return "xs";
  if (w < 640)  return "sm";
  if (w < 768)  return "md";
  if (w < 1024) return "lg";
  if (w < 1280) return "xl";
  return "2xl";
}

function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ─────────────────────────────────────────────────────────────────────────────
// DecoLines — exact SVG from ServicesSection
// ─────────────────────────────────────────────────────────────────────────────
function DecoLines({ isTiny }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        pointerEvents: "none",
        zIndex:        0,
        overflow:      "hidden",
        opacity:       isTiny ? 0.05 : 0.08,
      }}
    >
      <svg
        viewBox="0 0 420 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
        style={{
          position: "absolute",
          bottom:   0,
          right:    0,
          width:    isTiny ? "70%" : "55%",
          maxWidth: "420px",
        }}
      >
        <path
          d="M420 280 C360 260, 300 290, 260 270 C220 250, 200 230, 160 240 C120 250, 90 240, 40 260"
          stroke="#1B4835" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"
        />
        <path
          d="M420 300 C370 285, 320 310, 275 295 C230 280, 210 265, 170 275 C130 285, 100 270, 50 290"
          stroke="#1B4835" strokeWidth="0.5" strokeLinecap="round" opacity="0.22"
        />
        <path
          d="M380 310 C340 295, 295 316, 250 305 C205 294, 185 278, 145 290"
          stroke="#2D7356" strokeWidth="0.4" strokeLinecap="round" opacity="0.18"
        />
        <circle cx="180" cy="270" r="1.5" fill="#2D7356" opacity="0.28" />
        <circle cx="220" cy="258" r="1"   fill="#2D7356" opacity="0.22" />
        <circle cx="310" cy="280" r="1.2" fill="#1B4835" opacity="0.24" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GlassButton — refined forest-green liquid fill, matches brand palette
// ─────────────────────────────────────────────────────────────────────────────
const GlassButton = memo(function GlassButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  fillDuration = 1.8,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      style={{
        position:      "relative",
        overflow:      "hidden",
        display:       "inline-flex",
        alignItems:    "center",
        justifyContent: "center",
        gap:           "10px",
        width:         fullWidth ? "100%" : "auto",
        padding:       "14px 32px",
        borderRadius:  "12px",
        border:        `1px solid ${C.borderSolid}`,
        background:    "rgba(255,255,255,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor:        disabled ? "not-allowed" : "pointer",
        opacity:       disabled ? 0.65 : 1,
        fontFamily:    FONT_BODY,
        fontSize:      "0.65rem",
        fontWeight:    600,
        letterSpacing: "0.20em",
        textTransform: "uppercase",
        color:         hovered ? "#fff" : C.forest,
        transition:    "color 0.3s ease",
        boxShadow:     "0 2px 14px rgba(13,43,30,0.08)",
        userSelect:    "none",
        boxSizing:     "border-box",
      }}
    >
      {/* Liquid fill layer */}
      <motion.div
        animate={{ x: hovered ? "0%" : "-105%" }}
        transition={{
          duration: hovered ? fillDuration : 0.55,
          ease:     hovered ? "linear" : [0.16, 1, 0.3, 1],
        }}
        style={{
          position:    "absolute",
          inset:       0,
          background:  C.forest,
          clipPath:    "polygon(0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%)",
          zIndex:      0,
          pointerEvents: "none",
        }}
      />
      {/* Glass border sheen */}
      <div
        style={{
          position:     "absolute",
          inset:        0,
          borderRadius: "12px",
          border:       "1px solid rgba(255,255,255,0.22)",
          pointerEvents: "none",
          zIndex:       1,
        }}
      />
      {/* Content */}
      <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 9 }}>
        {children}
      </span>
    </motion.button>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// FormField — styled input / textarea matching the brand
// ─────────────────────────────────────────────────────────────────────────────
const FormField = memo(function FormField({
  label, name, type = "text", value, onChange,
  placeholder, multiline = false, rows = 4,
  prefix = null, isTiny,
}) {
  const [focused, setFocused] = useState(false);
  const labelSize  = isTiny ? "0.62rem" : "0.70rem";
  const inputSize  = isTiny ? "0.82rem" : "0.88rem";
  const padV       = isTiny ? "10px" : "13px";
  const padH       = prefix ? (isTiny ? "12px 12px 12px 70px" : "13px 14px 13px 80px") : (isTiny ? "10px 12px" : "12px 14px");

  const sharedStyle = {
    width:         "100%",
    padding:       padV + " " + (prefix ? (isTiny ? "12px 12px 12px 70px" : "13px 14px 13px 80px") : (isTiny ? "10px 12px" : "12px 14px")),
    fontFamily:    FONT_BODY,
    fontSize:      inputSize,
    fontWeight:    400,
    color:         C.forest,
    background:    focused ? "rgba(255,255,255,0.78)" : C.inputBg,
    border:        `1px solid ${focused ? C.accent : C.borderSolid}`,
    borderRadius:  "10px",
    outline:       "none",
    transition:    "background 0.2s ease, border-color 0.2s ease",
    boxShadow:     focused
      ? `0 0 0 3px rgba(45,115,86,0.10), 0 2px 12px rgba(13,43,30,0.06)`
      : "0 1px 4px rgba(13,43,30,0.05)",
    backdropFilter: "blur(6px)",
    resize:        multiline ? "none" : undefined,
    boxSizing:     "border-box",
    lineHeight:    1.6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      <label
        style={{
          fontFamily:    FONT_BODY,
          fontSize:      labelSize,
          fontWeight:    500,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color:         C.text,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        {/* Prefix badge (+91 / flag) */}
        {prefix && (
          <div
            style={{
              position:    "absolute",
              left:        "12px",
              top:         "50%",
              transform:   "translateY(-50%)",
              display:     "flex",
              alignItems:  "center",
              gap:         "5px",
              borderRight: `1px solid ${C.borderSolid}`,
              paddingRight: "9px",
              pointerEvents: "none",
              zIndex:      1,
            }}
          >
            {/* Indian flag micro SVG */}
            <svg width="16" height="11" viewBox="0 0 3 2" style={{ borderRadius: 2, boxShadow: "0 0 2px rgba(0,0,0,0.15)" }}>
              <path fill="#F4C430" d="M0 0h3v.67H0z"/>
              <path fill="#FFF"    d="M0 .67h3v.66H0z"/>
              <path fill="#138808" d="M0 1.33h3V2H0z"/>
              <circle cx="1.5" cy="1" r=".2" fill="#000080"/>
            </svg>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize:   isTiny ? "0.68rem" : "0.74rem",
                fontWeight: 600,
                color:      C.forest,
                letterSpacing: "0.04em",
              }}
            >
              +91
            </span>
          </div>
        )}

        {multiline ? (
          <textarea
            name={name}
            value={value}
            placeholder={placeholder}
            rows={rows}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={sharedStyle}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...sharedStyle, padding: padH }}
          />
        )}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PhonePanel — left pane, call-us with Lottie
// ─────────────────────────────────────────────────────────────────────────────
const PhonePanel = memo(function PhonePanel({ isTiny, isMobile }) {
  const greenFilter =
    "grayscale(1) sepia(1) hue-rotate(100deg) saturate(0.9) brightness(0.78)";

  const lottieSize = isTiny ? "220px" : isMobile ? "280px" : "clamp(280px, 38vw, 420px)";
  const titleSize  = isTiny
    ? "clamp(1.5rem, 9vw, 2rem)"
    : isMobile
    ? "clamp(1.75rem, 7vw, 2.5rem)"
    : "clamp(2.2rem, 3.8vw, 3.6rem)";
  const bodySize   = isTiny ? "0.78rem" : isMobile ? "0.84rem" : "clamp(0.88rem, 1.2vw, 0.98rem)";

  const renderLottie = (data, extra = {}) => {
    const props = { animationData: data, loop: true, style: { width: "100%", height: "100%", ...extra } };
    return typeof Lottie === "function"
      ? <Lottie {...props} />
      : <Lottie.default {...props} />;
  };

  return (
    <motion.div
      variants={fadeUp}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            isTiny ? "1.25rem" : "1.75rem",
        width:          "100%",
      }}
    >
      {/* Lottie + bg */}
      <div
        style={{
          position:   "relative",
          width:      lottieSize,
          aspectRatio: "1/1",
          maxWidth:   "420px",
          margin:     "0 auto",
        }}
      >
        <img
          src={phoneBg}
          alt=""
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            width:      "100%",
            height:     "100%",
            objectFit: "contain",
            filter:     greenFilter,
            opacity:    1,
            zIndex:     0,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", filter: greenFilter, transform: "scale(1.04)" }}>
          {renderLottie(contactAnimation)}
        </div>
      </div>

      {/* Copy */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          textAlign:     "center",
          gap:           isTiny ? "0.65rem" : "0.9rem",
          maxWidth:      "440px",
          margin:        "0 auto",
        }}
      >
        {/* Eyebrow badge */}
        <span
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           "7px",
            fontFamily:    FONT_BODY,
            fontSize:      isTiny ? "0.55rem" : "0.62rem",
            fontWeight:    400,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color:         C.accent,
            padding:       "4px 13px",
            borderRadius:  "999px",
            border:        `1px solid ${C.borderSolid}`,
            background:    "rgba(255,255,255,0.65)",
          }}
        >
          <Phone size={10} color={C.accent} />
          Direct Hotline
        </span>

        {/* Title */}
        <h3
          style={{
            fontFamily:    FONT_DISPLAY,
            fontSize:      titleSize,
            fontWeight:    300,
            lineHeight:    1.06,
            color:         C.forest,
            margin:        0,
            letterSpacing: "0.01em",
          }}
        >
          Reach{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentLight }}>
            Out
          </em>{" "}
          Directly
        </h3>

        {/* Thin accent rule */}
        <div
          style={{
            width:      isTiny ? "28px" : "40px",
            height:     "1px",
            background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
            opacity:    0.45,
          }}
        />

        {/* Body */}
        <p
          style={{
            fontFamily:  FONT_DISPLAY,
            fontSize:    bodySize,
            fontWeight:  300,
            fontStyle:   "italic",
            color:       "rgba(13,43,30,0.60)",
            lineHeight:  1.80,
            margin:      0,
          }}
        >
          {isTiny
            ? "Our consulting team is ready. Reach out directly for priority project setup."
            : "Our core consulting team is ready to step in. Skip the waiting and reach out directly for priority project setup or design syntheses."}
        </p>

        {/* CTA */}
        <div style={{ paddingTop: "0.4rem" }}>
          <GlassButton
            onClick={() => window.open("tel:+919924774664")}
            fillDuration={1.8}
          >
            <Phone size={13} />
            Call Now
          </GlassButton>
        </div>
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// EmailPanel — right pane, contact form
// ─────────────────────────────────────────────────────────────────────────────
const EmailPanel = memo(function EmailPanel({ isTiny, isMobile }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const titleSize = isTiny
    ? "clamp(1.5rem, 9vw, 2rem)"
    : isMobile
    ? "clamp(1.75rem, 7vw, 2.5rem)"
    : "clamp(2.2rem, 3.8vw, 3.6rem)";
  const bodySize  = isTiny ? "0.78rem" : isMobile ? "0.84rem" : "clamp(0.88rem, 1.2vw, 0.98rem)";

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;
    const tn = name.trim(), te = email.trim(), tp = phone.trim(), tm = message.trim();

    if (!tn || tn.length < 2)
      return toast.error("Please enter your full name.", { style: { background: C.forest, color: "#fff", fontFamily: FONT_BODY } });

    if (tp) {
      const clean = tp.replace(/[\s-]/g, "");
      if (!/^[6-9]\d{9}$/.test(clean))
        return toast.error("Please enter a valid 10-digit Indian phone number.", { style: { background: C.forest, color: "#fff", fontFamily: FONT_BODY } });
    }

    if (!te || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(te))
      return toast.error("Please enter a valid email address.", { style: { background: C.forest, color: "#fff", fontFamily: FONT_BODY } });

    if (!tm || tm.length < 10)
      return toast.error("Message must be at least 10 characters.", { style: { background: C.forest, color: "#fff", fontFamily: FONT_BODY } });

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 2200));
      toast.success("Message sent successfully!", { style: { background: C.forest, color: "#fff", fontFamily: FONT_BODY } });
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Error sending message.", { style: { background: C.forest, color: "#fff", fontFamily: FONT_BODY } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLottie = (data, extra = {}) => {
    const props = { animationData: data, loop: true, style: { width: "100%", height: "100%", ...extra } };
    return typeof Lottie === "function"
      ? <Lottie {...props} />
      : <Lottie.default {...props} />;
  };

  const gridCols = isTiny ? "1fr" : "1fr 1fr";
  const formGap  = isTiny ? "1rem" : "1.25rem";

  return (
    <motion.div variants={fadeUp} style={{ width: "100%", maxWidth: "560px", margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
          >
            {/* Panel header */}
            <div
              style={{
                display:       "flex",
                flexDirection: "column",
                alignItems:    "center",
                textAlign:     "center",
                gap:           isTiny ? "0.55rem" : "0.75rem",
                marginBottom:  isTiny ? "1.5rem" : "2rem",
              }}
            >
              {/* Eyebrow badge */}
              <span
                style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           "7px",
                  fontFamily:    FONT_BODY,
                  fontSize:      isTiny ? "0.55rem" : "0.62rem",
                  fontWeight:    400,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color:         C.accent,
                  padding:       "4px 13px",
                  borderRadius:  "999px",
                  border:        `1px solid ${C.borderSolid}`,
                  background:    "rgba(255,255,255,0.65)",
                }}
              >
                <Mail size={10} color={C.accent} />
                Instant Inquiry
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily:    FONT_DISPLAY,
                  fontSize:      titleSize,
                  fontWeight:    300,
                  lineHeight:    1.06,
                  color:         C.forest,
                  margin:        0,
                  letterSpacing: "0.01em",
                }}
              >
                Send a{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentLight }}>
                  Message
                </em>
              </h3>

              {/* Rule */}
              <div
                style={{
                  width:      isTiny ? "28px" : "40px",
                  height:     "1px",
                  background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
                  opacity:    0.45,
                }}
              />

              {/* Subtitle */}
              <p
                style={{
                  fontFamily:  FONT_DISPLAY,
                  fontSize:    bodySize,
                  fontWeight:  300,
                  fontStyle:   "italic",
                  color:       "rgba(13,43,30,0.60)",
                  lineHeight:  1.80,
                  margin:      0,
                  maxWidth:    "400px",
                }}
              >
                {isTiny
                  ? "Drop your details and we'll follow up with a customised design setup."
                  : "Drop your details below and a representative will follow up with a customised design setup."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: formGap }}>
              {/* Name + Phone row */}
              <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: formGap }}>
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Arjun Mehta"
                  isTiny={isTiny}
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  prefix="+91"
                  isTiny={isTiny}
                />
              </div>

              {/* Email */}
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                isTiny={isTiny}
              />

              {/* Message */}
              <FormField
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project…"
                multiline
                rows={isTiny ? 3 : 4}
                isTiny={isTiny}
              />

              {/* Submit */}
              <div style={{ paddingTop: "0.25rem" }}>
                <GlassButton
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                  fillDuration={1.6}
                >
                  <Send size={13} />
                  {isSubmitting ? "Sending…" : "Submit Message"}
                </GlassButton>
              </div>
            </form>
          </motion.div>
        ) : (
          /* ── Success state ─────────────────────────────────────────── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              textAlign:      "center",
              gap:            isTiny ? "1rem" : "1.5rem",
              paddingTop:     "1rem",
              paddingBottom:  "1rem",
            }}
          >
            {/* Success Lottie */}
            <div
              style={{
                width:  isTiny ? "140px" : "180px",
                height: isTiny ? "140px" : "180px",
                filter: "grayscale(1) sepia(1) hue-rotate(100deg) saturate(0.9) brightness(0.78)",
              }}
            >
              {renderLottie(successAnimation)}
            </div>

            {/* Accent rule */}
            <div
              style={{
                width:      "40px",
                height:     "1px",
                background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
                opacity:    0.45,
              }}
            />

            <h3
              style={{
                fontFamily:    FONT_DISPLAY,
                fontSize:      isTiny ? "1.6rem" : "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight:    300,
                lineHeight:    1.1,
                color:         C.forest,
                margin:        0,
                letterSpacing: "0.01em",
              }}
            >
              Thank{" "}
              <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentLight }}>
                You
              </em>
            </h3>

            <p
              style={{
                fontFamily:  FONT_DISPLAY,
                fontSize:    bodySize,
                fontWeight:  300,
                fontStyle:   "italic",
                color:       "rgba(13,43,30,0.60)",
                lineHeight:  1.80,
                maxWidth:    "360px",
                margin:      0,
              }}
            >
              Your message has reached our inbox. Expect a follow-up within one business day.
            </p>

            {/* Reset link */}
            <button
              onClick={() => setSubmitted(false)}
              style={{
                fontFamily:    FONT_BODY,
                fontSize:      "0.62rem",
                fontWeight:    500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         C.accent,
                background:    "none",
                border:        "none",
                borderBottom:  `1px solid ${C.accentLight}`,
                paddingBottom: "2px",
                cursor:        "pointer",
                opacity:       0.80,
                transition:    "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.80"; }}
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ContactSection — Main export
// ─────────────────────────────────────────────────────────────────────────────
export default function ContactSection() {
  const headerRef      = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-40px" });

  const windowWidth = useWindowWidth();
  const bp          = getBreakpoint(windowWidth);
  const isTiny      = bp === "xxs" || bp === "xs";
  const isMobile    = bp === "sm"  || bp === "md";
  const isDesktop   = !isTiny && !isMobile && bp !== "sm";

  // Mobile tabs
  const [activeTab, setActiveTab] = useState("phone");
  const toggleTab = useCallback(() =>
    setActiveTab((p) => (p === "phone" ? "email" : "phone")), []);

  // ── Responsive spacing/type (matches ServicesSection exactly) ────────────
  const sectionPadH  = isTiny ? "1rem" : isMobile ? "1.25rem" : "clamp(1.5rem, 6vw, 6rem)";
  const headerPadT   = isTiny ? "2.5rem" : isMobile ? "3rem" : "4rem";
  const headerPadB   = isTiny ? "1.25rem" : isMobile ? "1.5rem" : "1.75rem";
  const headerGap    = isTiny ? "0.45rem" : isMobile ? "0.55rem" : "0.7rem";
  const eyebrowSize  = isTiny ? "0.55rem" : isMobile ? "0.60rem" : "clamp(0.60rem,0.90vw,0.72rem)";
  const eyebrowLineW = isTiny ? "10px" : isMobile ? "14px" : "18px";
  const titleSize    = isTiny
    ? "clamp(1.45rem, 8vw, 1.85rem)"
    : isMobile
    ? "clamp(1.75rem, 6.5vw, 2.4rem)"
    : "clamp(2rem, 4.5vw, 3.8rem)";
  const subtitleSize = isTiny ? "0.72rem" : isMobile ? "0.80rem" : "clamp(0.82rem,1.2vw,0.96rem)";
  const ruleW        = isTiny ? "28px" : "40px";
  const footerFS     = isTiny ? "0.50rem" : isMobile ? "0.54rem" : "0.58rem";
  const footerPadT   = isTiny ? "0.75rem" : "1.1rem";
  const footerPadB   = isTiny ? "2rem"    : "3rem";

  // On desktop show both panels side-by-side; on mobile show one tab at a time
  const showPhone = isDesktop || activeTab === "phone";
  const showEmail = isDesktop || activeTab === "email";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        position:        "relative",
        width:           "100%",
        overflow:        "hidden",
        backgroundColor: C.bg,
        backgroundImage: C.bgGrad,
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "flex-start",
        boxSizing:       "border-box",
      }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background:  C.forest,
            color:       "#ffffff",
            fontFamily:  FONT_BODY,
            fontSize:    "0.80rem",
            borderRadius: "10px",
          },
        }}
      />

      {/* ── Decorative lines — identical SVG to ServicesSection ─────────── */}
      <DecoLines isTiny={isTiny} />

      {/* ── Floating path animation (original feature, opacity-reduced) ─── */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          inset:         0,
          zIndex:        0,
          opacity:       0.18,
          pointerEvents: "none",
          overflow:      "hidden",
        }}
      >
        <FloatingPaths position={1}  />
        <FloatingPaths position={-1} />
      </div>

      {/* ── Section Header — exact ServicesSection structure ────────────── */}
      <header
        ref={headerRef}
        style={{
          width:         "100%",
          padding:       `${headerPadT} ${sectionPadH} ${headerPadB}`,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          textAlign:     "center",
          gap:           headerGap,
          position:      "relative",
          zIndex:        1,
          boxSizing:     "border-box",
        }}
      >
        {/* Eyebrow */}
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           isTiny ? "0.40rem" : "0.55rem",
            fontFamily:    FONT_BODY,
            fontSize:      eyebrowSize,
            fontWeight:    400,
            letterSpacing: isTiny ? "0.22em" : "0.28em",
            textTransform: "uppercase",
            color:         C.accent,
            opacity:       0.85,
          }}
        >
          <span style={{ display: "block", width: eyebrowLineW, height: "1px", background: C.accent, opacity: 0.45, flexShrink: 0 }} />
          {isTiny ? "Get In Touch" : "Design Synthesis · Get In Touch"}
          <span style={{ display: "block", width: eyebrowLineW, height: "1px", background: C.accent, opacity: 0.45, flexShrink: 0 }} />
        </motion.span>

        {/* Title */}
        <motion.h2
          id="contact-heading"
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily:    FONT_DISPLAY,
            fontSize:      titleSize,
            fontWeight:    300,
            lineHeight:    1.08,
            color:         C.forest,
            margin:        0,
            letterSpacing: "0.01em",
          }}
        >
          Conceived,{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentLight }}>
            Connected
          </em>{" "}
          &amp; Delivered
        </motion.h2>

        {/* Rule */}
        <motion.div
          variants={ruleVariant}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          style={{
            width:           ruleW,
            height:          "1px",
            background:      `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
            opacity:         0.45,
            margin:          isTiny ? "0.02rem 0" : "0.05rem 0",
            transformOrigin: "center",
          }}
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          transition={{ delay: 0.22 }}
          style={{
            fontFamily:  FONT_DISPLAY,
            fontSize:    subtitleSize,
            fontWeight:  300,
            fontStyle:   "italic",
            color:       "rgba(13,43,30,0.60)",
            lineHeight:  isTiny ? 1.7 : 1.85,
            maxWidth:    isTiny ? "280px" : "440px",
            margin:      0,
          }}
        >
          {isTiny
            ? "Call directly or send us a message — we respond within one business day."
            : "Reach our consulting team by phone or leave a message. We collaborate directly with clients, communities, and project leads."}
        </motion.p>
      </header>

      {/* ── Content Grid ──────────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        style={{
          position:      "relative",
          zIndex:        1,
          width:         "100%",
          padding:       `0 ${sectionPadH}`,
          boxSizing:     "border-box",
          display:       "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap:           isDesktop
            ? "clamp(2.5rem, 5vw, 6rem)"
            : isMobile ? "2.5rem" : "2rem",
          alignItems:    "start",
        }}
      >
        {/* Phone panel */}
        <div style={{ display: showPhone ? "block" : "none" }}>
          <PhonePanel isTiny={isTiny} isMobile={isMobile} />
        </div>

        {/* Vertical divider (desktop only) */}
        {isDesktop && (
          <div
            aria-hidden="true"
            style={{
              display:  "none", // handled by grid gap + a visual rule inside panels
            }}
          />
        )}

        {/* Email panel */}
        <div style={{ display: showEmail ? "block" : "none" }}>
          <EmailPanel isTiny={isTiny} isMobile={isMobile} />
        </div>
      </motion.div>

      {/* ── Mobile tab nav (pills + chevrons) — ServicesSection indicator style ── */}
      {!isDesktop && (
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            isTiny ? "0.85rem" : "1.1rem",
            width:          "100%",
            padding:        `${isTiny ? "1.25rem" : "1.75rem"} ${sectionPadH} 0`,
            boxSizing:      "border-box",
            position:       "relative",
            zIndex:         1,
          }}
        >
          {/* Prev */}
          <button
            onClick={toggleTab}
            aria-label="Previous"
            style={{
              width:          isTiny ? "32px" : "38px",
              height:         isTiny ? "32px" : "38px",
              borderRadius:   "50%",
              border:         `1px solid ${C.borderSolid}`,
              background:     "rgba(255,255,255,0.65)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              cursor:         "pointer",
              color:          C.forest,
              transition:     "background 0.2s ease",
              flexShrink:     0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.65)"; }}
          >
            <ChevronLeft size={isTiny ? 14 : 16} />
          </button>

          {/* Pill dots — identical to ServicesSection indicator */}
          <div style={{ display: "flex", gap: isTiny ? "5px" : "6px", alignItems: "center" }}>
            {["phone", "email"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  height:          isTiny ? "2.5px" : "3px",
                  borderRadius:    "999px",
                  cursor:          "pointer",
                  transition:      "all 0.45s ease",
                  width:           activeTab === tab
                    ? (isTiny ? "18px" : "28px")
                    : (isTiny ? "5px" : "7px"),
                  backgroundColor: activeTab === tab
                    ? C.accent
                    : "rgba(45,115,86,0.22)",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={toggleTab}
            aria-label="Next"
            style={{
              width:          isTiny ? "32px" : "38px",
              height:         isTiny ? "32px" : "38px",
              borderRadius:   "50%",
              border:         `1px solid ${C.borderSolid}`,
              background:     "rgba(255,255,255,0.65)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              cursor:         "pointer",
              color:          C.forest,
              transition:     "background 0.2s ease",
              flexShrink:     0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.65)"; }}
          >
            <ChevronRight size={isTiny ? 14 : 16} />
          </button>
        </div>
      )}

      {/* ── Section Footer — identical to ServicesSection ───────────────── */}
      <footer
        aria-hidden="true"
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        isTiny ? "0.65rem" : "1.1rem",
          padding:    `${footerPadT} ${sectionPadH} ${footerPadB}`,
          width:      "100%",
          position:   "relative",
          zIndex:     1,
          boxSizing:  "border-box",
          marginTop:  "1.5rem",
        }}
      >
        <div
          style={{
            flex:       1,
            height:     "1px",
            background: "linear-gradient(to right, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
          }}
        />
        <span
          style={{
            fontFamily:    FONT_BODY,
            fontSize:      footerFS,
            fontWeight:    400,
            letterSpacing: isTiny ? "0.16em" : "0.22em",
            textTransform: "uppercase",
            color:         "rgba(13,43,30,0.40)",
            whiteSpace:    "nowrap",
          }}
        >
          {isTiny ? "Contact us" : "Contact Us · Architecture & Design"}
        </span>
        <div
          style={{
            flex:       1,
            height:     "1px",
            background: "linear-gradient(to left, rgba(45,115,86,0.16), rgba(45,115,86,0.06), transparent)",
          }}
        />
      </footer>
    </section>
  );
}