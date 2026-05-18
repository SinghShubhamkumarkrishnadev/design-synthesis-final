import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import toast, { Toaster } from "react-hot-toast";
import { Send, ChevronRight, ChevronLeft, Phone, Mail } from "lucide-react";

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
          }
        }}
      />

      <motion.div 
        className="max-w-7xl w-full mx-auto min-h-[80vh] flex flex-col justify-between lg:justify-center gap-12"
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
            {/* Phone animation wrapper — filter shifts blue → dark green */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] mx-auto mb-8 flex items-center justify-center">
              {/* Background graphic — tinted to match green theme */}
              <img 
                src={phoneBg} 
                alt="Phone background graphic" 
                className="absolute inset-0 w-full h-full object-contain -z-0 opacity-100 pointer-events-none"
                style={{ filter: greenPhoneFilter }}
              />
              {/* Lottie phone animation — CSS filter applied to recolor blue → dark green */}
              <div
                className="relative z-10 w-full h-full scale-105"
                style={{ filter: greenPhoneFilter }}
              >
                {renderLottie(contactAnimation)}
              </div>
            </div>

            <div className="space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#dee5e1] rounded-full text-xs font-semibold uppercase tracking-widest text-[#1c2e24] border border-zinc-300/60">
                <Phone size={12} className="text-[#2c4a3b]" /> Direct Hotline
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1b1b1b] tracking-tight leading-none">
                Contact <span className="text-[#2c4a3b] font-serif italic font-normal">us</span>
              </h2>
              
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                Our core consulting team is ready to step in. Skip the waiting lines and reach out directly for priority project setup or design syntheses.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.a
                  whileHover={{ scale: 1.03, backgroundColor: "#1c2e24" }}
                  whileTap={{ scale: 0.98 }}
                  href="tel:+919924774664"
                  className="w-full sm:w-auto bg-[#2c4a3b] text-white px-10 py-4.5 rounded-xl font-bold tracking-widest transition-colors shadow-lg shadow-zinc-900/10 uppercase text-xs text-center"
                >
                  Call Now
                </motion.a>
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
                      <Mail size={12} className="text-[#2c4a3b]" /> Instant Inquiry
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-black text-[#1b1b1b] tracking-tight leading-none">
                      Send a <span className="text-[#2c4a3b] font-serif italic font-normal">Message</span>
                    </h3>
                    <p className="text-zinc-500 text-base font-medium max-w-md mx-auto lg:mx-0">
                      Drop your details below and a representative will follow up with a customized design setup.
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

                    <motion.button
                      whileHover={{ scale: 1.01, backgroundColor: "#1c2e24" }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full mt-6 bg-[#2c4a3b] text-white py-4.5 rounded-xl font-bold tracking-widest flex items-center justify-center gap-3 transition-colors shadow-md shadow-zinc-900/10 cursor-pointer text-xs uppercase"
                    >
                      {isSubmitting ? "SENDING..." : "SUBMIT MESSAGE"}
                      <Send size={14} />
                    </motion.button>
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
                      Your message has reached our inbox successfully. Expect a follow-up outline from us within one business day.
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
            <span className={`h-2 rounded-full transition-all duration-300 ${activeTab === "phone" ? "bg-[#2c4a3b] w-5" : "bg-zinc-300 w-2"}`} />
            <span className={`h-2 rounded-full transition-all duration-300 ${activeTab === "email" ? "bg-[#2c4a3b] w-5" : "bg-zinc-300 w-2"}`} />
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