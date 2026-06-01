import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { teamData } from './teamData';
import { TeamMemberCard } from './TeamMemberCard';
import { TeamContent } from './TeamContent';

gsap.registerPlugin(ScrollTrigger);

// Custom responsive scale reader hook matching FAQ logic
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

export default function TeamCarousel() {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const contentRef = useRef(null);

  const ww = useWindowWidth();
  const isDesktop = ww >= 1024;

  const { overview, members } = teamData;

  useEffect(() => {
    const cards = cardsRef.current;
    const totalStates = members.length;

    // Apply baseline 3D canvas properties via standard element configuration
    if (cardsContainerRef.current) {
      cardsContainerRef.current.style.perspective = "1200px";
      cardsContainerRef.current.style.transformStyle = "preserve-3d";
    }

    const applyArcLayout = (progress) => {
      // Maps scroll metrics uniformly into positional states
      const currentPosition = progress * totalStates - 0.5;

      cards.forEach((card, i) => {
        if (!card) return;
        const offset = i - currentPosition;
        
        // 3D Trigonometric curve spacing values
        const translateX = offset * (isDesktop ? 160 : 110);
        const translateZ = -Math.abs(offset) * 110;
        const rotateY = offset * -22;
        const opacity = Math.max(0.15, 1 - Math.abs(offset) * 0.65);
        const scale = offset === 0 ? 1.12 : Math.max(0.78, 1 - Math.abs(offset) * 0.14);

        gsap.set(card, {
          xPercent: -50,
          x: translateX,
          z: translateZ,
          rotateY: rotateY,
          scale: scale,
          opacity: progress === 0 ? 0.55 : opacity,
        });

        const label = card.querySelector('.member-label');
        if (label) {
          label.style.opacity = Math.abs(offset) < 0.25 && progress > 0 ? "1" : "0";
        }
      });

      // Update structural content tree targets
      if (progress < 0.06) {
        contentRef.current?.updateContent(-1);
      } else {
        const targetIndex = Math.min(
          totalStates - 1,
          Math.floor((progress - 0.04) * (totalStates / 0.96))
        );
        contentRef.current?.updateContent(targetIndex);
      }
    };

    applyArcLayout(0);

    // Build standard scroll trigger binding pipeline
    const triggerInstance = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * 3.0}`,
      pin: true,
      scrub: 0.45,
      onUpdate: (self) => {
        applyArcLayout(self.progress);
      },
    });

    return () => {
      triggerInstance.kill();
    };
  }, [members.length, isDesktop]);

  return (
    <div 
      ref={sectionRef} 
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      {/* LEFT ASPECT: 3D CHARACTER FIELD CANVAS */}
      <div 
        style={{
          position: "relative",
          width: isDesktop ? "55%" : "100%",
          height: isDesktop ? "100%" : "50%",
          display: "flex",
          alignItems: "end",
          justifyContent: "center",
          paddingBottom: isDesktop ? "5rem" : "2rem",
          boxSizing: "border-box",
          overflow: "hidden"
        }}
      >
        <div 
          ref={cardsContainerRef} 
          style={{
            position: "relative",
            width: "100%",
            height: "65vh",
            display: "flex",
            alignItems: "end",
            justifyContent: "center"
          }}
        >
          {members.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              ref={(el) => (cardsRef.current[index] = el)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT ASPECT: DATA CONSOLE */}
      <div style={{ width: isDesktop ? "45%" : "100%", height: isDesktop ? "100%" : "50%" }}>
        <TeamContent 
          ref={contentRef} 
          overviewData={overview} 
          membersData={members} 
        />
      </div>
    </div>
  );
}