import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { 
  CardGlassmorphism, 
  IndDroneSwarm, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 7: Conclusion and Quit India reference.
 * Target: Illustrate the convergence of diverse groups into national unity and the final Quit India movement.
 * 
 * Components:
 * - S7_C1_Unity_Particles: IndDroneSwarm (Simulating people converging)
 * - S7_C2_Quit_India: CardGlassmorphism (Info card)
 * 
 * Duration: 14.0 seconds (420 frames)
 */
export default function Scene7() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Color Palette from JSON
  const primaryColor = "#FF9933"; // Saffron
  const secondaryColor = "#138808"; // Green
  const accentColor = "#000080"; // Navy Blue
  const whiteColor = "#FFFFFF";

  // Animation for Card (Scale Up Bounce)
  // Delay card appearance slightly to let particles form first
  const cardDelay = 60; 
  const cardScale = spring({
    frame: frame - cardDelay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
    durationInFrames: 30
  });

  const cardOpacity = interpolate(
    frame,
    [cardDelay, cardDelay + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Background Gradient Animation (Subtle pulse)
  const gradientPulse = interpolate(frame, [0, 210, 420], [0.8, 1.2, 0.8]);

  return (
    <AbsoluteFill
      style={{
        // Radial gradient representing the Indian Flag tricolor metaphorically
        background: `radial-gradient(circle at center, ${primaryColor}40 0%, ${whiteColor} 40%, ${secondaryColor}40 100%)`,
        backgroundSize: "200% 200%",
      }}
    >
      {/* 
        Component 1: Unity Particles (IndDroneSwarm)
        Visual Metaphor: Diverse groups (particles) converging to form a unified nation.
        Using IndDroneSwarm to simulate the organic movement of the masses.
      */}
      <Sequence from={0} durationInFrames={420}>
        <div style={{ opacity: 0.6 }}>
          <IndDroneSwarm 
            droneCount={80}
            swarmRadius={350}
            showTrails={true}
            formationType="sphere" // Sphere represents Unity/Wholeness
            color={accentColor} // Chakra blue for the particles
          />
        </div>
      </Sequence>

      {/* 
        Component 2: Quit India Info Card (CardGlassmorphism)
        Visual Anchor: The final political movement.
      */}
      <Sequence from={cardDelay} durationInFrames={420 - cardDelay}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ 
            transform: `scale(${Math.max(0, cardScale)})`, 
            opacity: cardOpacity 
          }}>
            <CardGlassmorphism
              title="1942: Quit India Movement"
              content="Mass movement demanding immediate transfer of power."
              icon="✊" // Fist icon for resistance/strength
              eyebrow="The Final Push"
              accentColor={primaryColor}
              variant="raised"
              cardStyle={{
                width: 500,
                backdropFilter: "blur(12px)",
                background: "rgba(255, 255, 255, 0.65)",
                border: `1px solid ${primaryColor}`,
                boxShadow: `0 10px 30px -5px ${accentColor}30`
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Subtitles */}
      <Subtitle
        text="Diverse groups participated, each with their own aspirations. Despite internal conflicts, the Congress under Gandhi forged a national unity. By 1942, the 'Quit India' movement marked the final push towards independence."
        startFrame={0}
        durationInFrames={420}
      />
    </AbsoluteFill>
  );
}
