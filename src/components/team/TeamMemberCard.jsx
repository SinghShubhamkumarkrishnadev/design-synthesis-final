import React from 'react';

// Shared visual design constants
const C = {
  deep:   "#0D2B1E",
  forest: "#2D7356",
};
const SANS  = "'DM Sans', system-ui, sans-serif";

export const TeamMemberCard = React.forwardRef(({ member, index }, ref) => {
  return (
    <div
      ref={ref}
      className="team-member-card"
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: "clamp(240px, 28vw, 330px)",
        transformOrigin: "bottom center",
        transform: "translateX(-50%)",
        userSelect: "none",
        pointerEvents: "none",
        willChange: "transform, opacity",
        zIndex: 10 + index,
      }}
    >
      <div style={{ relative: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Profile Frame with matching FAQ Card visual boundary styles */}
        <div style={{
          width: "100%",
          aspectRatio: "3/4",
          overflow: "hidden",
          borderRadius: "140px 140px 24px 24px",
          background: "rgba(232, 236, 232, 0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: "0 10px 30px rgba(13,43,30,0.06)",
          border: "1.5px solid rgba(45,115,86,0.12)",
        }}>
          <img
            src={member.image}
            alt={member.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: "contrast(1.03) brightness(0.97)"
            }}
            draggable="false"
          />
        </div>
        
        {/* Dynamic Frame Label under center card slot */}
        <div 
          className="member-label" 
          style={{ 
            opacity: 0, 
            marginTop: "14px", 
            textAlign: "center",
            transition: "opacity 0.3s ease" 
          }}
        >
          <p style={{
            fontFamily: SANS,
            fontSize: "clamp(0.65rem, 1.1vw, 0.75rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".22em",
            color: C.deep,
            margin: 0
          }}>
            {member.name}
          </p>
        </div>
      </div>
    </div>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';