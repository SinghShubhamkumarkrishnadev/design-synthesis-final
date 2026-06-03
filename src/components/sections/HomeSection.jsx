import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CLOUDS = [
  {
    src: "/home/cloud1.webp",
    style: { top: "2%", left: "-5%", width: "clamp(260px, 36vw, 580px)" },
    baseOpacity: 0.9,
    drift: { from: "-8vw", to: "112vw", duration: 40 },
    loadFrom: { x: -180, y: -50 },
    parallax: 180,
  },
  {
    src: "/home/cloud2.webp",
    style: { top: "0%", left: "35%", width: "clamp(200px, 30vw, 500px)" },
    baseOpacity: 0.75,
    drift: { from: "32vw", to: "118vw", duration: 55 },
    loadFrom: { x: 180, y: -40 },
    parallax: 240,
  },
  {
    src: "/home/cloud3.webp",
    style: { top: "4%", left: "-18%", width: "clamp(160px, 22vw, 380px)" },
    baseOpacity: 0.5,
    drift: { from: "-16vw", to: "114vw", duration: 65 },
    loadFrom: { x: 0, y: 40 },
    parallax: 140,
  },
  {
    src: "/home/cloud4.webp",
    style: { top: "22%", left: "-10%", width: "clamp(180px, 24vw, 420px)" },
    baseOpacity: 0.4,
    drift: { from: "-10vw", to: "116vw", duration: 78 },
    loadFrom: { x: 0, y: -30 },
    parallax: 200,
  },
];

const STATS = [
  { value: "200+", label: "Projects Completed" },
  { value: "12+",  label: "Years of Excellence" },
  { value: "98%",  label: "Client Satisfaction" },
  { value: "40+",  label: "Design Awards" },
];

export default function HomeSection() {
  const wrapperRef   = useRef(null);
  const sceneRef     = useRef(null);
  const titleWrapRef = useRef(null);
  const cloudRefs    = useRef([]);
  const scenePicRef  = useRef(null);
  const sceneImgRef  = useRef(null);
  // new content refs
  const eyebrowRef   = useRef(null);
  const subtitleRef  = useRef(null);
  const dividerRef   = useRef(null);
  const statsBarRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Initial states ────────────────────────────────────────────
      gsap.set(titleWrapRef.current, {
        left: "50%", xPercent: -50,
        opacity: 0, y: 60, scale: 1.05,
      });
      gsap.set(scenePicRef.current, { left: "50%", xPercent: -50 });
      gsap.set(sceneImgRef.current, { opacity: 0, y: 60 });

      gsap.set(eyebrowRef.current,  { opacity: 0, y: 20 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 22 });
      gsap.set(dividerRef.current,  { opacity: 0, scaleX: 0, transformOrigin: "center" });
      gsap.set(statsBarRef.current, { opacity: 0, y: 18 });

      cloudRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: 0, x: CLOUDS[i].loadFrom.x, y: CLOUDS[i].loadFrom.y });
      });

      // ── 2. Cinematic entrance — title animation untouched ────────────
      const entryTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      cloudRefs.current.forEach((el, i) => {
        if (el)
          entryTl.to(el, { opacity: CLOUDS[i].baseOpacity, x: 0, y: 0, duration: 1.6 }, i * 0.08);
      });

      // scene image — same as original
      entryTl.to(sceneImgRef.current, { opacity: 1, y: 0, duration: 1.5 }, 0.2);

      // title — exactly as original
      entryTl.to(titleWrapRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.4 }, 0.1);

      // new content staggers in after title settles
      entryTl
        .to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.7)
        .to(dividerRef.current,  { opacity: 1, scaleX: 1, duration: 0.7, ease: "power2.out" }, 0.9)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.0)
        .to(statsBarRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.1);

      // ── 3. Ambient cloud drift ───────────────────────────────────────
      cloudRefs.current.forEach((el, i) => {
        if (el)
          gsap.fromTo(el,
            { x: CLOUDS[i].drift.from },
            { x: CLOUDS[i].drift.to, duration: CLOUDS[i].drift.duration, ease: "none", repeat: -1, delay: 2.0 + i * 0.8 }
          );
      });

      // ── 4. Scroll parallax ───────────────────────────────────────────
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // original title pull — untouched
      scrollTl.to(titleWrapRef.current, { y: "-110vh", ease: "none" }, 0);

      // backdrop subtle depth — untouched
      scrollTl.to(scenePicRef.current, { y: "8vh", ease: "none" }, 0);

      // new elements scroll up at slightly slower rates for depth
      scrollTl
        .to(eyebrowRef.current,  { y: "-60vh", ease: "none" }, 0)
        .to(dividerRef.current,  { y: "-62vh", ease: "none" }, 0)
        .to(subtitleRef.current, { y: "-58vh", ease: "none" }, 0)
        .to(statsBarRef.current, { y: "-50vh", ease: "none" }, 0);

      // cloud parallax — untouched
      cloudRefs.current.forEach((el, i) => {
        if (!el) return;
        scrollTl.to(el, { y: () => -CLOUDS[i].parallax * 1.5, ease: "none" }, 0);
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        /* ── Base ───────────────────────────────────────────────────── */
        .hs-wrapper { position: relative; width: 100%; height: 100vh; overflow: visible; display: block; }
        .hs-scene   { position: relative; width: 100%; height: 100vh; overflow: hidden; background: #7ab8d8; }
        .hs-sky     { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to bottom, #7ab8d8 0%, #f5deb0 100%); }
        .hs-cloud   { position: absolute; pointer-events: none; aspect-ratio: 3 / 2; will-change: transform, opacity; z-index: 2; display: block; height: auto; }

        /* ── Original title — z-index 3, unchanged ──────────────────── */
        .hs-title-wrap {
          position: absolute;
          z-index: 3;
          bottom: 42%;
          width: 100%;
          text-align: center;
          pointer-events: none;
        }
        .hs-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 9vw, 160px);
          color: #ffffff !important;
          opacity: 1 !important;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        /* ── Scene picture — z-index 4 (above clouds, below new UI) ─── */
        .hs-scene-picture {
          position: absolute;
          z-index: 4;
          width: 100%;
          height: 105%;
          pointer-events: none;
          bottom: -18vh;
        }
        @media (max-width: 1024px) { .hs-scene-picture { bottom: -12vh; height: 106%; } }
        @media (max-width: 768px)  { .hs-scene-picture { bottom: -14vh; height: 108%; } }
        @media (max-width: 480px)  { .hs-scene-picture { bottom: -15vh; height: 110%; } }
        .hs-scene-img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: bottom center; }

        /* ── New content layer — z-index 5, always in front ────────── */

        /* Eyebrow + subtitle block, anchored top-left */
        .hs-top-left {
          position: absolute;
          z-index: 5;
          top: clamp(72px, 10vh, 120px);
          left: clamp(20px, 5vw, 80px);
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.2vh, 16px);
          pointer-events: none;
          max-width: clamp(200px, 34vw, 480px);
        }

        .hs-eyebrow {
          font-family: 'Inter', 'DM Sans', sans-serif;
          font-size: clamp(8px, 0.9vw, 12px);
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.70);
        }

        .hs-divider-h {
          width: clamp(28px, 3.5vw, 52px);
          height: 1px;
          background: rgba(255, 255, 255, 0.40);
          transform-origin: left center;
        }

        .hs-subtitle {
          font-family: 'Inter', 'DM Sans', sans-serif;
          font-size: clamp(11px, 1.15vw, 15px);
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.62);
          letter-spacing: 0.03em;
        }

        /* Stats bar — anchored bottom, above image */
        .hs-stats-bar {
          position: absolute;
          z-index: 5;
          bottom: clamp(16px, 3vh, 40px);
          left: 50%;
          transform: translateX(-50%);
          width: clamp(280px, 88vw, 1000px);
          display: flex;
          align-items: stretch;
          justify-content: center;
          pointer-events: none;
        }

        .hs-stat {
          flex: 1;
          text-align: center;
          padding: clamp(8px, 1.4vh, 18px) clamp(8px, 1.2vw, 18px);
          border-left: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(4px);
        }
        .hs-stat:first-child { border-left: none; }

        .hs-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 2.8vw, 44px);
          font-weight: 600;
          color: #ffffff;
          line-height: 1;
          display: block;
        }
        .hs-stat-label {
          font-family: 'Inter', 'DM Sans', sans-serif;
          font-size: clamp(7px, 0.7vw, 10px);
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.50);
          display: block;
          margin-top: 5px;
        }

        /* ── Responsive adjustments ─────────────────────────────────── */
        @media (max-width: 768px) {
          .hs-top-left {
            top: clamp(64px, 9vh, 96px);
            left: clamp(16px, 4vw, 28px);
            max-width: 72vw;
          }
          .hs-subtitle { display: none; }
          .hs-stats-bar { width: 96vw; bottom: 12px; }
        }

        @media (max-width: 480px) {
          .hs-stat-value { font-size: clamp(18px, 5.5vw, 28px); }
          .hs-stat-label { font-size: 7px; letter-spacing: 0.10em; }
          .hs-stat { padding: 8px 4px; }
        }
      `}</style>

      <div ref={wrapperRef} className="hs-wrapper">
        <div ref={sceneRef} className="hs-scene">

          {/* Sky gradient */}
          <div className="hs-sky" />

          {/* Clouds — z-index 2 */}
          {CLOUDS.map((cloud, i) => (
            <img
              key={i}
              ref={(el) => (cloudRefs.current[i] = el)}
              src={cloud.src}
              alt=""
              className="hs-cloud"
              style={{ ...cloud.style }}
            />
          ))}

          {/* Original title — z-index 3, fully untouched */}
          <div ref={titleWrapRef} className="hs-title-wrap">
            <h1 className="hs-title">DESIGN SYNTHESIS</h1>
          </div>

          {/* Scene image — z-index 4 */}
          <picture ref={scenePicRef} className="hs-scene-picture">
            <source media="(max-width: 768px)" srcSet="/home/beachMobile.webp" />
            <img
              ref={sceneImgRef}
              src="/home/beachDesktop.webp"
              alt="Modern coastal house"
              className="hs-scene-img"
            />
          </picture>

          {/* ── New content — z-index 5, always in front of image ── */}

          {/* Top-left: eyebrow + divider + subtitle */}
          <div className="hs-top-left">
            <span ref={eyebrowRef} className="hs-eyebrow">
              Interior Design &amp; Architecture Studio
            </span>
            <div ref={dividerRef} className="hs-divider-h" />
            <p ref={subtitleRef} className="hs-subtitle">
              Crafting spaces that move, inspire, and endure — where architectural
              precision meets the warmth of considered living.
            </p>
          </div>

          {/* Stats bar — bottom of scene */}
          <div ref={statsBarRef} className="hs-stats-bar">
            {STATS.map((s) => (
              <div key={s.label} className="hs-stat">
                <span className="hs-stat-value">{s.value}</span>
                <span className="hs-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}