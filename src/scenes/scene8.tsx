import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img } from "remotion";
import { Subtitle, CardGlassmorphism } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 8: Specific advice for Motorcycles
 * 
 * Target: Specific advice for Motorcycles.
 * Layout: main-content.right-aligned (Implemented as centered focus with annotations)
 * Duration: 13.0 seconds (390 frames)
 * 
 * Components:
 * - Annotated Image: Motorcycle with safety points
 * - Subtitles: 3 segments
 */
export default function Scene8() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Color Palette from JSON
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const accentColor = "#F2994A";
  
  // Animation Timing Constants
  // Segment 1: 0 - 4.5s (0 - 135 frames) -> Intro / Comparison
  // Segment 2: 4.5s - 8.5s (135 - 255 frames) -> "Be Careful"
  // Segment 3: 8.5s - 13.0s (255 - 390 frames) -> "Safety Gear"
  
  // 1. Image Entry Animation
  const imageScale = interpolate(frame, [0, 60], [0.95, 1], {
    extrapolateRight: "clamp",
  });
  const imageOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 2. Annotation 1: Be Careful (Corresponds to "You should be very careful")
  // Starts at 4.5s (135f)
  const annot1Start = 135;
  const annot1Opacity = interpolate(frame, [annot1Start, annot1Start + 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const annot1Y = interpolate(frame, [annot1Start, annot1Start + 20], [20, 0], {
    extrapolateRight: "clamp",
  });

  // 3. Annotation 2: Safety Gear (Corresponds to "You should wear safety gear")
  // Starts at 8.5s (255f)
  const annot2Start = 255;
  const annot2Opacity = interpolate(frame, [annot2Start, annot2Start + 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const annot2Y = interpolate(frame, [annot2Start, annot2Start + 20], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFF" }}>
      
      {/* Header / Context Label */}
      <div style={{ 
        position: 'absolute', 
        top: 60, 
        left: 60, 
        opacity: imageOpacity,
        zIndex: 1 
      }}>
        <h2 style={{ 
          fontFamily: theme.fonts.heading, 
          color: primaryColor,
          fontSize: 48,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 15
        }}>
          Motorcycles
          <span style={{ fontSize: 32, opacity: 0.6 }}>🏍️</span>
        </h2>
        <p style={{
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary,
            fontSize: 24,
            marginTop: 10,
            maxWidth: 400
        }}>
            Faster than bicycles, requiring extra caution.
        </p>
      </div>

      {/* Main Content Area: Annotated Image */}
      <AbsoluteFill style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: 40 // Slight offset to account for header
      }}>
        <div style={{
          position: 'relative',
          width: '75%', 
          maxWidth: 1100,
          aspectRatio: '16/9',
          transform: `scale(${imageScale})`,
          opacity: imageOpacity,
        }}>
          {/* The Motorcycle Image */}
          <Img 
            src="http://35.232.154.66:5125/files/tools/98bdbcfa-1185-46bf-b743-c3105a0491fd.jpg?timestamp=1766976646&nonce=df26e347116692cb3ee3b4f3f46a4161&sign=OkJ4uFS1twq6V_qa6LqdATaIM_aSqDyGGtzVNWyB3u8="
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 32,
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              border: '4px solid #F9F9F9'
            }}
          />

          {/* Annotation 1: Be Careful (Position: x=0.8, y=0.5 from JSON) */}
          <div style={{
            position: 'absolute',
            left: '80%',
            top: '50%',
            transform: `translate(-50%, calc(-50% + ${annot1Y}px))`,
            opacity: annot1Opacity,
            zIndex: 10
          }}>
             <CardGlassmorphism 
                title="Be Careful"
                content="High Alert"
                icon="⚠️"
                accentColor={accentColor}
                cardStyle={{ 
                    minWidth: 180,
                    padding: 16,
                    backdropFilter: 'blur(16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: `0 10px 30px ${accentColor}40`,
                    border: `1px solid ${accentColor}40`
                }}
             />
             {/* Connector Dot */}
             <div style={{
                 position: 'absolute',
                 left: '50%',
                 top: '100%',
                 marginTop: 8,
                 width: 16,
                 height: 16,
                 borderRadius: '50%',
                 backgroundColor: accentColor,
                 transform: 'translateX(-50%)',
                 boxShadow: `0 0 0 4px rgba(255,255,255,0.8)`
             }} />
          </div>

          {/* Annotation 2: Safety Gear (Position: x=0.5, y=0.2 from JSON) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '20%',
            transform: `translate(-50%, calc(-50% + ${annot2Y}px))`,
            opacity: annot2Opacity,
            zIndex: 10
          }}>
             <CardGlassmorphism 
                title="Safety Gear"
                content="Helmet Required"
                icon="🛡️"
                accentColor={secondaryColor}
                cardStyle={{ 
                    minWidth: 200,
                    padding: 16,
                    backdropFilter: 'blur(16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: `0 10px 30px ${secondaryColor}40`,
                    border: `1px solid ${secondaryColor}40`
                }}
             />
             {/* Connector Dot */}
             <div style={{
                 position: 'absolute',
                 left: '50%',
                 top: '100%',
                 marginTop: 8,
                 width: 16,
                 height: 16,
                 borderRadius: '50%',
                 backgroundColor: secondaryColor,
                 transform: 'translateX(-50%)',
                 boxShadow: `0 0 0 4px rgba(255,255,255,0.8)`
             }} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Subtitles */}
      <Subtitle
        text="Motorcycles are faster than bicycles."
        startFrame={0}
        durationInFrames={135}
      />
      
      <Subtitle
        text="You should be very careful."
        startFrame={135}
        durationInFrames={120}
        emphasisWords={["careful"]}
      />
      
      <Subtitle
        text="You should wear safety gear."
        startFrame={255}
        durationInFrames={135}
        emphasisWords={["safety", "gear"]}
      />
    </AbsoluteFill>
  );
}
