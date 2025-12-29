import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { 
  CardGlassmorphism, 
  CardNeumorphism, 
  Subtitle, 
  StatLiquidBubble 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 1: Introduce the topic and key vocabulary.
 * Target: Introduce the word Should and link it to Advice and Safety.
 * Duration: 15 seconds (450 frames)
 * 
 * Components:
 * - Title Card: "SHOULD" (Advice = A Good Idea)
 * - Visual Metaphor: Safety Icon (Shield)
 * - Background: Clean Educational Vector style
 */
export default function Scene1() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Color Palette from JSON
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const accentColor = "#F2994A";
  const textColor = "#333333";
  const bgColor = "#F0F4F8";

  // --- Animations ---

  // 1. Title Card Entry (Slow Fade In Up) - Starts at 0s
  const titleOpacity = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 45], [50, 0], { extrapolateRight: "clamp" });

  // 2. Safety Icon Entry (Morph/Float) - Times with "Safety" subtitle (approx 11s / 330 frames)
  // We start a bit earlier to prep the visual
  const shieldStartFrame = 300; 
  const shieldScale = spring({
    frame: frame - shieldStartFrame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });
  const shieldOpacity = interpolate(frame, [shieldStartFrame, shieldStartFrame + 30], [0, 1], { extrapolateRight: "clamp" });

  // Background subtle movement
  const bgBubbleY = interpolate(frame, [0, 450], [0, -50]);

  // Subtitles Data
  const subtitles = [
    { id: "S1_SUB1", text: "Today we learn the word should.", start: 0, end: 4 },
    { id: "S1_SUB2", text: "Should is for advice.", start: 4, end: 7.5 },
    { id: "S1_SUB3", text: "Advice means a good idea.", start: 7.5, end: 11 },
    { id: "S1_SUB4", text: "This lesson is about safety.", start: 11, end: 15 }
  ];

  return (
    <AbsoluteFill style={{ background: bgColor }}>
      
      {/* --- Background Layer --- */}
      <AbsoluteFill style={{ overflow: "hidden", zIndex: 0 }}>
        {/* Subtle floating shapes for "particle behavior" */}
        <div style={{ 
          position: "absolute", 
          top: "10%", 
          right: "10%", 
          opacity: 0.1,
          transform: `translateY(${bgBubbleY}px)`
        }}>
          <StatLiquidBubble 
            value={100} 
            label="" 
            color={primaryColor} 
            size={300} 
            duration={450}
          />
        </div>
        <div style={{ 
          position: "absolute", 
          bottom: "10%", 
          left: "5%", 
          opacity: 0.05,
          transform: `translateY(${-bgBubbleY}px)`
        }}>
          <StatLiquidBubble 
            value={100} 
            label="" 
            color={secondaryColor} 
            size={200} 
            duration={400}
          />
        </div>
      </AbsoluteFill>

      {/* --- Main Content Layer --- */}
      <AbsoluteFill style={{ 
        zIndex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "column",
        gap: 60
      }}>
        
        {/* Component 1: Title Card (SHOULD) */}
        <div style={{ 
          opacity: titleOpacity, 
          transform: `translateY(${titleY}px)`,
          width: 600
        }}>
          <CardGlassmorphism
            title="SHOULD"
            content={
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <p style={{ fontSize: 24, color: textColor, margin: 0 }}>
                  Advice = <strong style={{ color: secondaryColor }}>A Good Idea</strong>
                </p>
              </div>
            }
            icon="💡"
            accentColor={primaryColor}
            cardStyle={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              border: `1px solid rgba(255, 255, 255, 0.8)`,
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
            }}
          />
        </div>

        {/* Component 2: Safety Icon (Shield) */}
        {/* Appears when talking about safety */}
        <div style={{ 
          opacity: shieldOpacity,
          transform: `scale(${Math.max(0, shieldScale)})`,
          marginTop: 20
        }}>
          <CardNeumorphism
            title=""
            content={
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                padding: 20
              }}>
                <span style={{ fontSize: 80, lineHeight: 1 }}>🛡️</span>
                <span style={{ 
                  marginTop: 10, 
                  fontSize: 24, 
                  fontWeight: "bold", 
                  color: accentColor,
                  fontFamily: theme.fonts.heading 
                }}>
                  SAFETY
                </span>
              </div>
            }
            variant="raised"
            accentColor={accentColor}
            width={200}
          />
        </div>

      </AbsoluteFill>

      {/* --- Subtitles Layer --- */}
      <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none" }}>
        {subtitles.map((sub) => {
          const startFrame = sub.start * 30;
          const durationFrames = (sub.end - sub.start) * 30;
          
          // Only render if within range to save resources, though Sequence handles this too.
          // Using Sequence for cleaner timeline management.
          return (
            <Sequence 
              key={sub.id} 
              from={startFrame} 
              durationInFrames={durationFrames}
            >
              <Subtitle
                text={sub.text}
                startFrame={0} // Relative to Sequence
                durationInFrames={durationFrames}
                variant="solid" // High contrast for education
                speakerLabel="Teacher"
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>

    </AbsoluteFill>
  );
}
