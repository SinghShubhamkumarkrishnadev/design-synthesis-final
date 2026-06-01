import React, { useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';

const C = {
  deep:     "#0D2B1E",
  forest:   "#2D7356",
  muted:    "rgba(13,43,30,0.52)",
  cardOpen: "#f5f7f5",
};
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";

export const TeamContent = React.forwardRef(({ overviewData, membersData }, ref) => {
  const [activeData, setActiveData] = useState(overviewData);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateContent: (index) => {
      const nextData = index === -1 ? overviewData : membersData[index];
      if (nextData.id === activeData.id) return;

      const ctx = gsap.context(() => {
        gsap.timeline()
          .to('.animate-team-text', {
            opacity: 0,
            y: -12,
            duration: 0.22,
            stagger: 0.02,
            ease: 'power2.in',
            onComplete: () => {
              setActiveData(nextData);
            }
          })
          .to('.animate-team-text', {
            opacity: 1,
            y: 0,
            duration: 0.40,
            stagger: 0.04,
            ease: 'power2.out'
          });
      }, containerRef);

      return () => ctx.revert();
    }
  }));

  return (
    <div 
      ref={containerRef} 
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(1.5rem, 5vw, 4rem)",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "460px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        
        {/* Index Tracking Label */}
        <div className="animate-team-text" style={{ fontFamily: SANS, fontSize: "clamp(.60rem, 1.1vw, .72rem)", tracking: ".26em", textTransform: "uppercase", color: C.forest, fontWeight: 500, letterSpacing: ".26em" }}>
          {activeData.index}
        </div>

        {/* Serif Identity Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <h2 className="animate-team-text" style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", color: C.deep, margin: 0, lineHeight: 1.1, letterSpacing: ".01em" }}>
            {activeData.name ? (
              <>
                {activeData.name.split(' ')[0]}{' '}
                <em style={{ fontStyle: "italic", color: C.forest, fontWeight: 300 }}>
                  {activeData.name.split(' ').slice(1).join(' ')}
                </em>
              </>
            ) : (
              <>
                The{" "}
                <em style={{ fontStyle: "italic", color: C.forest, fontWeight: 300 }}>
                  Collective
                </em>
              </>
            )}
          </h2>
          
          {/* SANS Subtitle */}
          <h3 className="animate-team-text" style={{ fontFamily: SANS, fontSize: "clamp(.65rem, 1.2vw, .78rem)", fontWeight: 700, letterSpacing: ".20em", color: C.deep, textTransform: "uppercase", margin: "0.2rem 0 0" }}>
            {activeData.role}
          </h3>
        </div>

        {/* Core Rule Line — Replicates FAQ style exactly */}
        <div 
          className="animate-team-text"
          style={{
            width: "70px",
            height: "2px",
            background: "linear-gradient(to right, transparent, #2D7356, transparent)",
            margin: "0.2rem 0",
            transformOrigin: "left",
          }}
        />

        {/* Editorial Description Text */}
        <p className="animate-team-text" style={{ fontFamily: SANS, fontSize: "clamp(.78rem, 1.3vw, .88rem)", fontWeight: 400, lineHeight: 1.80, color: "rgba(13,43,30,.68)", margin: 0 }}>
          {activeData.description}
        </p>

        {/* Italic Blockquote Block */}
        <blockquote className="animate-team-text" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(.90rem, 1.6vw, 1.1rem)", fontWeight: 300, color: C.muted, borderLeft: `2px solid ${C.forest}`, paddingLeft: "14px", margin: "0.4rem 0 0", py: "4px" }}>
          "{activeData.quote}"
        </blockquote>

        {/* Dash Indicators Progress Array */}
        <div className="animate-team-text" style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "0.5rem" }}>
          {[-1, 0, 1, 2, 3, 4].map((i) => {
            const isActive = (i === -1 && activeData.id === 'overview') || (i !== -1 && activeData.id === i + 1);
            return (
              <span
                key={i}
                style={{
                  height: "1.5px",
                  width: isActive ? "24px" : "12px",
                  background: isActive ? C.forest : "rgba(13,43,30,0.15)",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
});

TeamContent.displayName = 'TeamContent';