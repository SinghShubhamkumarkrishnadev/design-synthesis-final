import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall } from "lucide-react";

const FloatingConsultButton = ({
  revolvingText = "FREE 30 MINUTES • CONSULT • ",
  revolvingSpeed = 12,
  popupHeading = "30-minutes call",
  popupDescription =
    "This will be a brief, free call with one of Design Synthesis's producers to discuss your project and determine if we're a good fit.",
  popupBadgeText = "Free",
  ctaButtonText = "Book a call",
  ctaButtonAction = () => {
    window.location.href = "tel:+919924774664";
  },
  position = { bottom: "1.25rem", left: "1.25rem" },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-md w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-4rem)]"
            style={{
              bottom: "calc(5.5rem + 16px)",
              left: "1.25rem",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 left-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="10" y1="10" x2="30" y2="30" />
                <line x1="30" y1="10" x2="10" y2="30" />
              </svg>
            </button>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight">
                  {popupHeading}
                </h3>
                <span className="shrink-0 text-black px-3 py-1 sm:px-4 sm:py-2 border-2 border-black rounded-full text-xs sm:text-sm font-medium">
                  {popupBadgeText}
                </span>
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                {popupDescription}
              </p>

              <button
                className="w-full bg-neutral-900 hover:bg-emerald-800 active:scale-95 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-900/20"
                onClick={() => {
                  ctaButtonAction();
                  setIsOpen(false);
                }}
              >
                {ctaButtonText}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed z-50" style={position}>
        <motion.button
          className="relative flex items-center justify-center
                     w-14 h-14 sm:w-20 md:w-24 md:h-24 sm:h-20
                     rounded-full bg-white border border-neutral-200/80
                     text-neutral-500 hover:text-neutral-900
                     shadow-xl hover:shadow-2xl
                     transition-all group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open consultation booking"
        >
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: revolvingSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <path
                  id="circlePath"
                  d="M 100,100 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
                />
              </defs>
              <text
                style={{
                  fill: "#15803d",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                }}
                className="text-[26px] sm:text-[24px] md:text-[23.5px]"
              >
                <textPath href="#circlePath" startOffset="0%">
                  {revolvingText}
                </textPath>
              </text>
            </svg>
          </motion.div>

          <PhoneCall
            className="relative z-10 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 transform group-hover:scale-110 group-hover:text-emerald-700 transition-all duration-300"
            strokeWidth={1.75}
          />
        </motion.button>
      </div>
    </>
  );
};

export default FloatingConsultButton;