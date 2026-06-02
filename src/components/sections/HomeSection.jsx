import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CLOUDS = [
  {
    src: "/home/cloud1.webp",
    style: {
      top: "2%",
      left: "-5%",
      width: "clamp(260px, 36vw, 580px)",
    },
    baseOpacity: 0.9,
    drift: { from: "-8vw", to: "112vw", duration: 40 },
    loadFrom: { x: -180, y: -50 },
    parallax: 180, 
  },
  {
    src: "/home/cloud2.webp",
    style: {
      top: "0%",
      left: "35%",
      width: "clamp(200px, 30vw, 500px)",
    },
    baseOpacity: 0.75,
    drift: { from: "32vw", to: "118vw", duration: 55 },
    loadFrom: { x: 180, y: -40 },
    parallax: 240,
  },
  {
    src: "/home/cloud3.webp",
    style: {
      top: "4%",
      left: "-18%",
      width: "clamp(160px, 22vw, 380px)",
    },
    baseOpacity: 0.5,
    drift: { from: "-16vw", to: "114vw", duration: 65 },
    loadFrom: { x: 0, y: 40 },
    parallax: 140,
  },
  {
    src: "/home/cloud4.webp",
    style: {
      top: "22%",
      left: "-10%",
      width: "clamp(180px, 24vw, 420px)",
    },
    baseOpacity: 0.4,
    drift: { from: "-10vw", to: "116vw", duration: 78 },
    loadFrom: { x: 0, y: -30 },
    parallax: 200,
  },
];

export default function HomeSection() {
  const wrapperRef = useRef(null);
  const sceneRef = useRef(null);
  const titleWrapRef = useRef(null);
  const cloudRefs = useRef([]);
  const scenePicRef = useRef(null);
  const sceneImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Position Setup via GSAP (GSAP handles centering natively now)
      gsap.set(titleWrapRef.current, { 
        left: "50%",
        xPercent: -50,
        opacity: 0, 
        y: 60, 
        scale: 1.05 
      });
      
      gsap.set(scenePicRef.current, { 
        left: "50%",
        xPercent: -50 
      });
      
      gsap.set(sceneImgRef.current, { 
        opacity: 0, 
        y: 60 
      });
      
      cloudRefs.current.forEach((el, i) => {
        if (el) {
          gsap.set(el, {
            opacity: 0,
            x: CLOUDS[i].loadFrom.x,
            y: CLOUDS[i].loadFrom.y,
          });
        }
      });

      // 2. Cinematic Entrance Timeline
      const entryTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      cloudRefs.current.forEach((el, i) => {
        if (el) {
          entryTl.to(
            el,
            { opacity: CLOUDS[i].baseOpacity, x: 0, y: 0, duration: 1.6 },
            i * 0.08
          );
        }
      });
      
      entryTl.to(
        titleWrapRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 1.4 },
        0.1
      );
      entryTl.to(
        sceneImgRef.current,
        { opacity: 1, y: 0, duration: 1.5 },
        0.2
      );

      // 3. Ambient Clouds Horizontal Drift
      cloudRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { x: CLOUDS[i].drift.from },
            {
              x: CLOUDS[i].drift.to,
              duration: CLOUDS[i].drift.duration,
              ease: "none",
              repeat: -1,
              delay: 2.0 + i * 0.8,
            }
          );
        }
      });

      // 4. Parallax Scroll Actions
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Pulls title up natively without altering horizontal alignment
      scrollTl.to(titleWrapRef.current, {
        y: "-110vh",
        ease: "none"
      }, 0);

      // Subtle depth slide to the backdrop picture layout
      scrollTl.to(scenePicRef.current, {
        y: "8vh",
        ease: "none"
      }, 0);

      // Parallax cloud layers moving out of frame vertically
      cloudRefs.current.forEach((el, i) => {
        if (!el) return;
        scrollTl.to(el, {
          y: () => -CLOUDS[i].parallax * 1.5,
          ease: "none"
        }, 0);
      });

    }, wrapperRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .hs-wrapper { position: relative; width: 100%; height: 100vh; overflow: visible; display: block; }
        .hs-scene { position: relative; width: 100%; height: 100vh; overflow: hidden; background: #7ab8d8; }
        .hs-sky { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to bottom, #7ab8d8 0%, #f5deb0 100%); }
        .hs-cloud { position: absolute; pointer-events: none; aspect-ratio: 3 / 2; will-change: transform, opacity; z-index: 2; display: block; height: auto; }
        
        /* Cleaned up centering CSS to let GSAP handle horizontal alignments safely */
        .hs-title-wrap { 
          position: absolute; 
          z-index: 3; 
          bottom: 42%; 
          width: 100%; 
          text-align: center; 
          pointer-events: none; 
        }
        .hs-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 9vw, 160px); color: #ffffff !important; opacity: 1 !important; line-height: 1; letter-spacing: -0.02em; }
        
        .hs-scene-picture { 
          position: absolute; 
          z-index: 4; 
          width: 100%; 
          height: 105%; 
          pointer-events: none; 
          bottom: -18vh;
        }

        @media (max-width: 1024px) {
          .hs-scene-picture {
            bottom: -12vh; 
            height: 106%;
          }
        }

        @media (max-width: 768px) {
          .hs-scene-picture {
            bottom: -14vh; 
            height: 108%;
          }
        }

        @media (max-width: 480px) {
          .hs-scene-picture {
            bottom: -15vh; 
            height: 110%;
          }
        }

        .hs-scene-img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: bottom center; }
      `}</style>

      <div ref={wrapperRef} className="hs-wrapper">
        <div ref={sceneRef} className="hs-scene">
          <div className="hs-sky" />
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
          <div ref={titleWrapRef} className="hs-title-wrap">
            <h1 className="hs-title">DESIGN SYNTHESIS</h1>
          </div>
          <picture ref={scenePicRef} className="hs-scene-picture">
            <source media="(max-width: 768px)" srcSet="/home/beachMobile.webp" />
            <img
              ref={sceneImgRef}
              src="/home/beachDesktop.webp"
              alt="Modern coastal house"
              className="hs-scene-img"
            />
          </picture>
        </div>
      </div>
    </>
  );
}