import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1]; // expo-out — architectural deceleration

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease },
  },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease },
  },
};

/* ─────────────────────────────────────────────
   BRAND TITLE — letter-fall animation
───────────────────────────────────────────── */
function BrandTitle() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  const word1 = 'Design'.split('');
  const word2 = 'Synthesis'.split('');

  const letterVariants = {
    hidden: { opacity: 0, y: -32, filter: 'blur(4px)' },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.3,
        ease,
        delay: i * 0.055,
      },
    }),
  };

  return (
    <div ref={ref} className="overflow-hidden">
      {/* "Design" — light weight */}
      <div className="flex flex-nowrap" aria-label="Design Synthesis">
        {word1.map((char, i) => (
          <motion.span
            key={`d-${i}`}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="inline-block font-['Cormorant_Garamond',Garamond,Georgia,serif] font-light italic text-[clamp(24px,5vw,52px)] tracking-[0.08em] text-[#e6f8f4]/92 leading-none whitespace-nowrap shrink-0"
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* "Synthesis" — heavier weight, offset letter spacing */}
      <div className="flex flex-nowrap mt-[-2px]">
        {word2.map((char, i) => (
          <motion.span
            key={`s-${i}`}
            custom={i + word1.length + 2}
            variants={letterVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="inline-block font-['Cormorant_Garamond',Garamond,Georgia,serif] font-semibold not-italic text-[clamp(24px,5vw,52px)] tracking-[0.28em] text-white leading-none uppercase whitespace-nowrap shrink-0"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV LINK with left-to-right underline on hover
───────────────────────────────────────────── */
function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="relative inline-block group text-[clamp(12.5px,2.1vw,16px)] font-medium text-[#d2f0eb]/82 no-underline tracking-[0.06em] transition-colors duration-[350ms] ease-out pb-[2px] hover:text-white"
    >
      {children}
      {/* underline track */}
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#b4dcd2]/18" />
      {/* animated fill */}
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#b4dcd2]/75 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[550ms] ease-[cubic-bezier(0.33,1,0.68,1)]" />
    </a>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADING — mono label
───────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <motion.h4
      variants={fadeUp}
      className="font-mono uppercase text-[clamp(10px,1.4vw,12px)] text-[#b4dcd2]/50 tracking-[0.28em] mb-[14px]"
    >
      {children}
    </motion.h4>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden">

      {/* ── Background image ── */}
      <div className="absolute inset-0 w-full h-full bg-no-repeat bg-bottom bg-cover bg-[url('/footer.png')]" />

      {/* ── Gradient: bottom-anchored dark zone ── */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_top,rgba(2,18,18,1)_0px,rgba(2,18,18,1)_120px,rgba(3,24,24,0.97)_220px,rgba(4,30,30,0.93)_330px,rgba(5,36,36,0.82)_440px,rgba(6,40,40,0.52)_580px,rgba(6,42,42,0.18)_720px,transparent_900px)]" />

      {/* ── Subtle sky tint ── */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(180,210,205,0.05)_0%,transparent_35%)]" />

      {/* ── Content wrapper ── */}
      <div className="relative z-10 flex flex-col justify-end min-h-[580px] sm:min-h-[680px] md:min-h-[820px] lg:min-h-[960px] xl:min-h-[1080px] 2xl:min-h-[1180px]">
        <motion.div
          className="px-5 sm:px-8 md:px-14 lg:px-18 xl:px-24 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12 pt-6 md:pt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >

          {/* ── Hairline divider ── */}
          <motion.div
            variants={fadeUp}
            className="w-full mb-6 md:mb-10 h-[1px] bg-white/10"
          />

          {/* ── Main grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-10 sm:gap-x-14 md:gap-x-16 lg:gap-x-20 xl:gap-x-24 gap-y-7 sm:gap-y-9 md:gap-y-12 mb-8 md:mb-12">

            {/* ── BRAND ── */}
            <motion.div
              variants={fadeUpSlow}
              className="flex flex-col gap-3 col-span-2 md:col-span-1 lg:col-span-2"
            >
              {/* Large cinematic brand name */}
              <BrandTitle />

              {/* Sub-caption */}
              <motion.p
                variants={fadeUp}
                className="font-mono uppercase text-[clamp(10px,1.5vw,13px)] text-[#b4dcd2]/60 tracking-[0.14em] leading-[1.9] mt-[6px]"
              >
                Research Driven Architecture<br />
                &amp; Interior Design, Surat.
              </motion.p>

              {/* Quote — hidden on mobile */}
              <motion.p
                variants={fadeUp}
                className="hidden sm:block italic text-[clamp(11px,1.4vw,14px)] text-[#b4dcd2]/45 leading-[1.85] mt-[2px] border-l border-[#b4dcd2]/18 pl-[12px] font-['Cormorant_Garamond',Georgia,serif]"
              >
                "Designing spaces that balance research, emotion, functionality, and nature."
              </motion.p>
            </motion.div>

            {/* ── NAVIGATE ── */}
            <motion.div variants={containerVariants} className="flex flex-col">
              <SectionLabel>Navigate</SectionLabel>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {['About', 'Services', 'Works', 'Testimonials', 'Contact'].map((item, i) => (
                  <motion.li key={item} variants={fadeUp} custom={i}>
                    <NavLink href={`#${item.toLowerCase()}`}>{item}</NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* ── SERVICES + SECTORS ── */}
            <motion.div variants={containerVariants} className="flex flex-col">
              <SectionLabel>Services</SectionLabel>
              <ul className="flex flex-col gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                {['Architecture', 'Interior Design', 'Landscape Design'].map((item, i) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    className="cursor-default text-[clamp(12.5px,2.1vw,16px)] text-[#d2f0eb]/72 transition-colors duration-300 ease-in-out tracking-[0.03em] hover:text-white"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>

              <SectionLabel>Sectors</SectionLabel>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {['Residential / Commercial', 'Hospitality / Healthcare'].map((item, i) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    className="cursor-default text-[clamp(12.5px,2.1vw,16px)] text-[#d2f0eb]/72 transition-colors duration-300 ease-in-out tracking-[0.03em] hover:text-white"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* ── CONTACT ── */}
            <motion.div
              variants={containerVariants}
              className="flex flex-col col-span-2 md:col-span-1"
            >
              <SectionLabel>Contact</SectionLabel>

              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Address */}
                <motion.address
                  variants={fadeUp}
                  className="not-italic flex gap-2.5 items-start text-[clamp(12px,1.8vw,15px)] text-[#d2f0eb]/68 leading-[1.85]"
                >
                  <MapPin
                    size={14}
                    className="mt-[3px] shrink-0 text-[#b4dcd2]/45"
                  />
                  <span>
                    A-302, SNS ATRIA<br />
                    Maharana Pratap Road, Vesu<br />
                    Surat – 395007, GJ, India
                  </span>
                </motion.address>

                {/* Phone + Email */}
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {[
                    {
                      href: 'tel:+919924774664',
                      icon: <Phone size={12} />,
                      label: '+91 9924774664',
                    },
                    {
                      href: 'mailto:studio@designsynthesis.in',
                      icon: <Mail size={12} />,
                      label: 'studio@designsynthesis.in',
                    },
                  ].map(({ href, icon, label }) => (
                    <motion.a
                      key={href}
                      variants={fadeUp}
                      href={href}
                      className="flex items-center gap-2 font-mono group text-[clamp(11px,1.6vw,14px)] text-[#d2f0eb]/75 no-underline transition-colors duration-300 ease-in-out break-all tracking-[0.04em] hover:text-white"
                    >
                      <span className="text-[#b4dcd2]/40 shrink-0">
                        {icon}
                      </span>
                      {label}
                    </motion.a>
                  ))}
                </div>

                {/* Socials */}
                <motion.div variants={fadeUp} className="flex items-center gap-2.5 mt-1">
                  {[
                    { icon: <Instagram size={15} />, url: '#', label: 'Instagram' },
                    { icon: <Linkedin size={15} />, url: '#', label: 'LinkedIn' },
                    { icon: <Facebook size={15} />, url: '#', label: 'Facebook' },
                  ].map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.url}
                      aria-label={s.label}
                      className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-[#b4dcd2]/18 bg-white/5 text-[#d2f0eb]/65 transition-all duration-300 ease-in-out no-underline shrink-0 hover:scale-110 hover:bg-white/10 hover:border-[#b4dcd2]/50 hover:text-white"
                      whileTap={{ scale: 0.94 }}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>

          </div>

          {/* ── Bottom bar ── */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 sm:pt-5 border-t border-white/5"
          >
            <p className="font-mono text-center sm:text-left text-[clamp(10px,1.3vw,12.5px)] text-[#b4dcd2]/38 tracking-[0.15em]">
              © {currentYear} Design Synthesis. Crafted for permanence.
            </p>
            <p className="font-mono text-center sm:text-right text-[clamp(10px,1.3vw,12.5px)] text-[#b4dcd2]/28 tracking-[0.1em]">
              A service based in Surat, India.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </footer>
  );
}