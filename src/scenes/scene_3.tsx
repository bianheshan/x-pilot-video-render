import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img, spring, useVideoConfig } from "remotion";
import { Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 3: Visualize the minimally invasive entry points.
 * Target: Know: Visualize the minimally invasive entry points.
 * 
 * Content:
 * - Annotated Image: Showing Posterior, Lateral, and Anterior Portals on a shoulder image.
 * - Animation: Image gentle zoom, annotations drawing out.
 * 
 * Duration: 5.0 seconds (150 frames)
 */
export default function Scene3() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Configuration from JSON
  const primaryColor = "#0077B6"; // Medical Blue
  const secondaryColor = "#90E0EF";
  const accentColor = "#E63946";
  const backgroundColor = "#FFFFFF";

  // Image Data
  const imageUrl = "http://35.232.154.66:5125/files/tools/98641f92-72a5-4c60-ba03-ccf089bb4c1e.jpg?timestamp=1767338040&nonce=d466b78cf30e4b14fb2044e93444bc98&sign=1igiTI88GftH7LBv6zWO53uLvyjlLHRAu2PKZG8DRkc=";
  
  const annotations = [
    { x: 0.3, y: 0.4, text: "Posterior Portal", delay: 30 },
    { x: 0.5, y: 0.5, text: "Lateral Portal", delay: 45 },
    { x: 0.7, y: 0.4, text: "Anterior Portal", delay: 60 },
  ];

  // Animation: Gentle Zoom In for the image
  const scale = interpolate(frame, [0, 150], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  const imageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* 1. Main Image Layer */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden' 
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${scale})`,
          opacity: imageOpacity,
        }}>
          <Img 
            src={imageUrl} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Using cover to fill screen, assuming image is high res
            }}
          />
        </div>
      </AbsoluteFill>

      {/* 2. Annotation Layer */}
      <AbsoluteFill>
        {annotations.map((ann, index) => {
          // Animation calculations for each annotation
          const dotProgress = spring({
            frame: frame - ann.delay,
            fps,
            config: { damping: 12, stiffness: 100 }
          });
          
          const lineProgress = interpolate(
            frame, 
            [ann.delay + 10, ann.delay + 30], 
            [0, 1], 
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          const textOpacity = interpolate(
            frame,
            [ann.delay + 20, ann.delay + 40],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          // Determine label position direction based on X coordinate
          // If on the left side (x < 0.5), label goes left. Right side, label goes right. Center, goes up.
          const isLeft = ann.x < 0.4;
          const isRight = ann.x > 0.6;
          
          // Line calculations
          const lineLength = 100;
          const lineAngle = isLeft ? -45 : (isRight ? 45 : -90); // Simple directional logic
          
          // Styles
          const dotSize = 24;
          
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${ann.x * 100}%`,
                top: `${ann.y * 100}%`,
                width: 0,
                height: 0,
                overflow: 'visible',
              }}
            >
              {/* Pulsing Dot Marker */}
              <div style={{
                position: 'absolute',
                left: -dotSize / 2,
                top: -dotSize / 2,
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: accentColor,
                border: `3px solid white`,
                boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                transform: `scale(${dotProgress})`,
                opacity: dotProgress,
                zIndex: 10,
              }} />

              {/* Connecting Line */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 4,
                height: lineLength * lineProgress,
                backgroundColor: primaryColor,
                transformOrigin: 'top center',
                transform: `rotate(${isLeft ? 135 : (isRight ? -135 : 180)}deg)`, // Adjust rotation to point outwards
                opacity: lineProgress,
                zIndex: 5,
                borderRadius: 2,
              }} />

              {/* Label Container */}
              <div style={{
                position: 'absolute',
                // Calculate end of line position approximately
                transform: `translate(${
                  isLeft ? `-${lineLength * 0.7 + 160}px` : (isRight ? `${lineLength * 0.7}px` : `-80px`)
                }, ${
                  isLeft || isRight ? `${lineLength * 0.7}px` : `-${lineLength + 50}px`
                })`,
                opacity: textOpacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-end' : (isRight ? 'flex-start' : 'center'),
                width: 200,
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: `1px solid ${secondaryColor}`,
                  boxShadow: '0 8px 32px rgba(0, 119, 182, 0.15)',
                  textAlign: isLeft ? 'right' : (isRight ? 'left' : 'center'),
                }}>
                  <span style={{
                    color: primaryColor,
                    fontFamily: theme.fonts.heading,
                    fontWeight: 700,
                    fontSize: 20,
                    display: 'block',
                    whiteSpace: 'nowrap'
                  }}>
                    {ann.text}
                  </span>
                  <span style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.body,
                    fontSize: 14,
                    marginTop: 4,
                    display: 'block'
                  }}>
                    Entry Point
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 3. Subtitle */}
      <Subtitle
        text="To treat this, arthroscopic surgery is performed through small incisions called portals."
        startFrame={0} // Relative to scene start
        durationInFrames={150}
        variant="clean"
      />
      
      {/* 4. Overlay Vignette for focus */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at center, transparent 40%, rgba(255,255,255,0.8) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
}
