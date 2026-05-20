"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import toast, { Toaster } from "react-hot-toast";
import { Send, ChevronRight, ChevronLeft, Phone, Mail } from "lucide-react";
import FloatingPaths from "./FloatingPaths"; // Integrated background path animation

// Assets
import contactAnimation from "../../assets/blue phone.json";
import successAnimation from "../../assets/sendmail.json";
import phoneBg from "../../assets/phonebg.png";

// Premium Scroll-Reveal Motion Configurations
const fadeInReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const greenPhoneFilter =
  "grayscale(1) sepia(1) hue-rotate(100deg) saturate(0.9) brightness(0.8)";

/* ==========================================================================
   REUSABLE LIQUID GLASS BUTTON COMPONENT (UPDATED WITH PROGRESSIVE FILL)
   ========================================================================== */
function LiquidGlassButton({
  children,
  className = "",
  isSubmitting,
  fillDuration = 2,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Motion variants for the liquid filling effect
  const liquidVariants = {
    empty: {
      x: "-105%",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Snappy fallback when mouse leaves
      },
    },
    filled: {
      x: "0%",
      transition: {
        duration: fillDuration, // Controlled slow filling speed
        ease: "linear", // Linear ensures a constant, steady fluid rise
      },
    },
  };

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        className={`
          group relative overflow-hidden inline-flex items-center justify-center gap-3
          w-full sm:w-auto px-10 py-4.5 rounded-xl text-xs font-bold uppercase tracking-widest
          text-[#2c4a3b] transition-colors duration-300 hover:text-white border border-zinc-400/30
          cursor-pointer select-none backdrop-blur-xs shadow-md shadow-zinc-900/5
          ${className}
        `}
        {...props}
      >
        {/* Liquid wave fill layer - responds instantly to hover state matching mid-animation frames */}
        <motion.div
          className="absolute inset-0 z-0 bg-[#2c4a3b]"
          variants={liquidVariants}
          animate={isHovered ? "filled" : "empty"}
          initial="empty"
          style={{
            // Mask creating subtle wave/distortion effect as it drags from the left
            clipPath: "polygon(0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Dynamic 3D Inner Glass Shadow Border */}
        <div
          className="absolute inset-0 z-10 pointer-events-none rounded-xl transition-opacity duration-300 group-hover:opacity-40
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.4),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.35),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.2),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.2),inset_0_0_6px_6px_rgba(0,0,0,0.05)]"
        />

        {/* SVG Distorted Glass Overlay */}
        <div
          className="absolute inset-0 z-10 opacity-70 pointer-events-none rounded-xl"
          style={{ backdropFilter: 'url("#button-glass-filter")' }}
        />

        {/* Foreground Content */}
        <span className="relative z-20 flex items-center justify-center gap-3">
          {children}
        </span>
      </motion.button>

      {/* SVG Turbulence definitions injected under the container safely */}
      <svg className="absolute w-0 h-0 hidden" aria-hidden="true">
        <defs>
          <filter id="button-glass-filter" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.04"
              numOctaves="1"
              result="noise"
            />
            <feGaussianBlur
              in="noise"
              stdDeviation="1.5"
              result="blurredNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.5" result="final" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ==========================================================================
   MAIN CONTACT SECTION COMPONENT
   ========================================================================== */
export default function ContactSection() {
  const [activeTab, setActiveTab] = useState("phone");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const togglePage = () =>
    setActiveTab((prev) => (prev === "phone" ? "email" : "phone"));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please fill in required fields correctly.");
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 2200));
      toast.success("Message sent successfully!");
      setIsSubmittedSuccessfully(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Error sending message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLottie = (animationData, extraStyle = {}) => {
    const props = {
      animationData,
      loop: true,
      className: "w-full h-full",
      style: extraStyle,
    };
    return typeof Lottie === "function" ? (
      <Lottie {...props} />
    ) : (
      <Lottie.default {...props} />
    );
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full overflow-x-hidden bg-[#eff2f0] font-sans flex items-center justify-center py-20 px-4 sm:px-8 lg:px-16"
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1c2e24",
            color: "#ffffff",
          },
        }}
      />

      {/* Radial glow background layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 72% 48% at 50% 50%, #eef4f1 0%, transparent 72%)`,
        }}
        aria-hidden="true"
      />

      {/* Floating lines background animation - right-to-left direction */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <motion.div
        className="max-w-7xl w-full mx-auto min-h-[80vh] flex flex-col justify-between lg:justify-center gap-12 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={containerStagger}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full min-h-[75vh] gap-16 lg:gap-24 items-center">
          {/* ========================================================= */}
          {/* LEFT SIDE: PHONE / CALL US SECTION                        */}
          {/* ========================================================= */}
          <motion.div
            className={`flex-col justify-center p-2 lg:flex ${
              activeTab === "phone" ? "flex" : "hidden"
            }`}
            variants={fadeInReveal}
          >
            {/* ================= MOBILE HEADING FIRST ================= */}
            <div className="space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left relative z-20 lg:hidden mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#dee5e1] rounded-full text-xs font-semibold uppercase tracking-widest text-[#1c2e24] border border-zinc-300/60">
                  <Phone size={12} className="text-[#2c4a3b]" /> Direct Hotline
                </div>

                <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-[#1b1b1b] tracking-tight leading-none">
                  Contact{" "}
                  <span className="text-[#2c4a3b] font-serif italic font-normal">
                    us
                  </span>
                </h2>
              </div>
            </div>

            {/* ================= PHONE ANIMATION ================= */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] mx-auto mb-8 flex items-center justify-center">
              <img
                src={phoneBg}
                alt="Phone background graphic"
                className="absolute inset-0 w-full h-full object-contain -z-0 opacity-100 pointer-events-none"
                style={{ filter: greenPhoneFilter }}
              />

              <div
                className="relative z-10 w-full h-full scale-105"
                style={{ filter: greenPhoneFilter }}
              >
                {renderLottie(contactAnimation)}
              </div>
            </div>

            {/* ================= DESKTOP HEADING ================= */}
            <div className="space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left hidden lg:block">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#dee5e1] rounded-full text-xs font-semibold uppercase tracking-widest text-[#1c2e24] border border-zinc-300/60">
                <Phone size={12} className="text-[#2c4a3b]" /> Direct Hotline
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1b1b1b] tracking-tight leading-none">
                Contact{" "}
                <span className="text-[#2c4a3b] font-serif italic font-normal">
                  us
                </span>
              </h2>

              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                Our core consulting team is ready to step in. Skip the waiting
                lines and reach out directly for priority project setup or
                design syntheses.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 w-full">
                <LiquidGlassButton
                  fillDuration={1.8}
                  onClick={() => window.open("tel:+919924774664")}
                >
                  Call Now
                </LiquidGlassButton>
              </div>
            </div>

            {/* ================= MOBILE CONTENT BELOW ANIMATION ================= */}
            <div className="space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left lg:hidden">
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                Our core consulting team is ready to step in. Skip the waiting
                lines and reach out directly for priority project setup or
                design syntheses.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 w-full">
                <LiquidGlassButton
                  fillDuration={1.8}
                  onClick={() => window.open("tel:+919924774664")}
                >
                  Call Now
                </LiquidGlassButton>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: EMAIL FORM SECTION                            */}
          {/* ========================================================= */}
          <motion.div
            className={`flex-col justify-center p-2 lg:flex ${
              activeTab === "email" ? "flex" : "hidden"
            }`}
            variants={fadeInReveal}
          >
            <AnimatePresence mode="wait">
              {!isSubmittedSuccessfully ? (
                <motion.div
                  key="email-form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-xl mx-auto lg:mx-0"
                >
                  <div className="text-center lg:text-left mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#dee5e1] rounded-full text-xs font-semibold uppercase tracking-widest text-[#1c2e24] border border-zinc-300/60">
                      <Mail size={12} className="text-[#2c4a3b]" /> Instant
                      Inquiry
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-black text-[#1b1b1b] tracking-tight leading-none">
                      Send a{" "}
                      <span className="text-[#2c4a3b] font-serif italic font-normal">
                        Message
                      </span>
                    </h3>
                    <p className="text-zinc-500 text-base font-medium max-w-md mx-auto lg:mx-0">
                      Drop your details below and a representative will follow
                      up with a customized design setup.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          placeholder="Full Name"
                          onChange={handleChange}
                          className="w-full border-b-2 border-zinc-300 py-4 focus:border-[#2c4a3b] outline-none transition-all text-base bg-transparent text-[#1b1b1b] placeholder-zinc-400 font-medium"
                          required
                        />
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          placeholder="Phone Number"
                          onChange={handleChange}
                          className="w-full border-b-2 border-zinc-300 py-4 focus:border-[#2c4a3b] outline-none transition-all text-base bg-transparent text-[#1b1b1b] placeholder-zinc-400 font-medium"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="w-full border-b-2 border-zinc-300 py-4 focus:border-[#2c4a3b] outline-none transition-all text-base bg-transparent text-[#1b1b1b] placeholder-zinc-400 font-medium"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <textarea
                        name="message"
                        rows="4"
                        value={formData.message}
                        placeholder="Your Message"
                        onChange={handleChange}
                        className="w-full border-b-2 border-zinc-300 py-4 focus:border-[#2c4a3b] outline-none transition-all resize-none text-base bg-transparent text-[#1b1b1b] placeholder-zinc-400 font-medium leading-relaxed"
                        required
                      ></textarea>
                    </div>

                    <div className="w-full pt-2">
                      <LiquidGlassButton
                        type="submit"
                        isSubmitting={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "SENDING..." : "SUBMIT MESSAGE"}
                        <Send size={14} />
                      </LiquidGlassButton>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="email-success-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 90 }}
                  className="w-full max-w-md mx-auto lg:mx-0 text-center lg:text-left py-8 space-y-6 flex flex-col items-center lg:items-start justify-center"
                >
                  <div className="w-52 h-52 filter sepia brightness-50 hue-rotate-60">
                    {renderLottie(successAnimation)}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
                      Thank You!
                    </h3>
                    <p className="text-zinc-600 text-base font-medium max-w-sm leading-relaxed">
                      Your message has reached our inbox successfully. Expect a
                      follow-up outline from us within one business day.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmittedSuccessfully(false)}
                    className="text-xs text-[#2c4a3b] font-bold uppercase tracking-widest hover:text-zinc-900 transition-colors duration-200 cursor-pointer border-b-2 border-[#2c4a3b] pb-0.5"
                  >
                    Send another response
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- IN-PAGE BOTTOM NAVIGATION CONTROLS (Hidden on Desktop layouts) --- */}
        <div className="flex items-center justify-center gap-6 mt-8 lg:hidden">
          <button
            onClick={togglePage}
            className="p-3 bg-white border border-zinc-200 text-zinc-800 hover:bg-[#2c4a3b] hover:text-white rounded-full transition-all shadow-sm active:scale-90 flex items-center justify-center"
            aria-label="Previous pane"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            <span
              className={`h-2 rounded-full transition-all duration-300 ${activeTab === "phone" ? "bg-[#2c4a3b] w-5" : "bg-zinc-300 w-2"}`}
            />
            <span
              className={`h-2 rounded-full transition-all duration-300 ${activeTab === "email" ? "bg-[#2c4a3b] w-5" : "bg-zinc-300 w-2"}`}
            />
          </div>

          <button
            onClick={togglePage}
            className="p-3 bg-white border border-zinc-200 text-zinc-800 hover:bg-[#2c4a3b] hover:text-white rounded-full transition-all shadow-sm active:scale-90 flex items-center justify-center"
            aria-label="Next pane"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
