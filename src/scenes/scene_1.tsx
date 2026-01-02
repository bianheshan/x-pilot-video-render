import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, spring, useVideoConfig } from "remotion";
import { TitleKineticGlitch, StatRollingCounter, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 1: Hook - Chaos vs Order
 * 
 * Target: Hook the audience by highlighting the complexity of modern work and the solution.
 * Layout: main-content.center
 * Duration: 10.5 seconds (approx 315 frames)
 * 
 * Timeline:
 * - 0.0s - 4.5s: "CHAOS vs ORDER" (Kinetic Glitch)
 * - 4.5s - 10.5s: "48 Tools" (Rolling Counter)
 */
export default function Scene1() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Configuration from JSON
  const bgBase = "#F3F4F6";
  const primaryColor = "#2563EB";
  const accentColor = "#F59E0B";
  const textColor = "#1F2937";

  // Timeline markers (seconds * 30fps)
  const switchTime = 4.5;
  const switchFrame = Math.floor(switchTime * 30); // 135 frames
  const totalDuration = 315; // 10.5s

  return (
    <AbsoluteFill style={{ background: bgBase }}>
      
      {/* Phase 1: The Problem (Chaos) */}
      <Sequence from={0} durationInFrames={switchFrame}>
        {/* TitleKineticGlitch is a full-screen component, used exclusively in this sequence */}
        <TitleKineticGlitch 
          text="CHAOS vs ORDER"
          subtitle="Navigating the Complexity"
        />
        
        {/* Transition: Fade out to white/background at the end of this sequence */}
        <AbsoluteFill style={{ 
          opacity: interpolate(frame, [switchFrame - 15, switchFrame], [0, 1]),
          background: bgBase 
        }} />

        <Subtitle 
          text="Managing a project can often feel like navigating chaos without a map."
          startFrame={0}
          durationInFrames={switchFrame}
        />
      </Sequence>

      {/* Phase 2: The Solution (48 Tools) */}
      <Sequence from={switchFrame} durationInFrames={totalDuration - switchFrame}>
        <Phase2Content 
          primaryColor={primaryColor} 
          accentColor={accentColor} 
          textColor={textColor} 
        />
        
        <Subtitle 
          text="Today, we are breaking down a comprehensive guide covering 48 tools across 12 essential categories."
          startFrame={0}
          durationInFrames={totalDuration - switchFrame}
        />
      </Sequence>

    </AbsoluteFill>
  );
}

/**
 * Internal component for Phase 2 content to ensure hooks (spring) run relative to the sequence start.
 */
const Phase2Content = ({ primaryColor, accentColor, textColor }: { primaryColor: string, accentColor: string, textColor: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation: Scale up with bounce
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 }
  });

  // Animation: Fade in
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      opacity
    }}>
      <div style={{ 
        transform: `scale(${scale})`, 
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20
      }}>
        {/* Big Number Display */}
        <div style={{ 
          fontSize: 140, 
          fontWeight: 900, 
          color: primaryColor,
          lineHeight: 1,
          textShadow: "0 10px 30px rgba(37, 99, 235, 0.2)",
          fontFamily: "Roboto, sans-serif"
        }}>
          <StatRollingCounter 
            targetValue={48}
            durationInFrames={60}
          />
        </div>

        {/* Label & Suffix */}
        <div style={{ 
          fontSize: 42, 
          fontWeight: 700, 
          color: textColor,
          letterSpacing: "-0.02em"
        }}>
          Tools <span style={{ color: accentColor }}>Covered</span>
        </div>
        
        <div style={{ 
          fontSize: 24, 
          color: textColor, 
          opacity: 0.7,
          fontWeight: 500
        }}>
          in this Ultimate Guide
        </div>
      </div>
    </AbsoluteFill>
  );
};
