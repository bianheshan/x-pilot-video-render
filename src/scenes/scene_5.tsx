import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  LogicFlowPath, 
  CardGlassmorphism, 
  Subtitle,
  SafeArea
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 5: The Salt March
 * 
 * Target: Depict the Salt March as a strategic symbol.
 * Layout: Full-screen immersive with map visualization and floating stats.
 * Duration: 15.5 seconds (465 frames)
 * 
 * Components:
 * - Map Route (LogicFlowPath): Simulates the journey from Sabarmati to Dandi.
 * - Stats Card (CardGlassmorphism): Displays distance, volunteers, and duration.
 */
export default function Scene5() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Colors from config
  // Primary: #FF9933 (Saffron/Orange)
  // Secondary: #138808 (Green)
  // Background: #FFFFFF (White) - using a paper-like tint #F9F9F9 for better contrast
  const bgColor = "#F9F9F9";
  const primaryColor = "#FF9933";
  const secondaryColor = "#138808";
  const textColor = "#2C2C2C";

  // Animation Controls
  const durationInFrames = 465; // 15.5s * 30fps
  
  // 1. Map Route Animation (Draws progressively)
  // The LogicFlowPath component handles internal animation, but we can control its container
  const mapOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  
  // 2. Stats Card Animation (Slide in from right)
  const statsSlideX = interpolate(frame, [45, 75], [100, 0], { extrapolateRight: "clamp" });
  const statsOpacity = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: "clamp" });

  // Define the route steps for the "Map"
  // Using custom coordinates to simulate a path down the coast of Gujarat
  const routeSteps = [
    { 
      id: "sabarmati", 
      label: "Sabarmati Ashram", 
      type: "start", 
      x: 300, 
      y: 150,
      description: "March 12, 1930" 
    },
    { 
      id: "aslali", 
      label: "Aslali", 
      type: "process", 
      x: 350, 
      y: 300 
    },
    { 
      id: "navsari", 
      label: "Navsari", 
      type: "process", 
      x: 450, 
      y: 500 
    },
    { 
      id: "dandi", 
      label: "Dandi Coast", 
      type: "end", 
      x: 550, 
      y: 650,
      description: "April 6, 1930" 
    }
  ];

  const routeConnections = [
    { from: "sabarmati", to: "aslali", label: "Start", dashed: true },
    { from: "aslali", to: "navsari", label: "Villages", dashed: true },
    { from: "navsari", to: "dandi", label: "Arrival", dashed: true }
  ];

  return (
    <AbsoluteFill style={{ background: bgColor }}>
      
      {/* Background Texture Effect (Paper grain simulation) */}
      <AbsoluteFill style={{ 
        opacity: 0.1, 
        backgroundImage: `radial-gradient(${theme.colors.textSecondary} 1px, transparent 1px)`,
        backgroundSize: "20px 20px" 
      }} />

      <SafeArea>
        {/* Layer 1: The Map Journey */}
        <div style={{ 
          opacity: mapOpacity, 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%",
          transform: "scale(0.9) translateX(-100px)" // Shift left to make room for stats
        }}>
          <LogicFlowPath 
            title="The Salt March Route"
            subtitle="Civil Disobedience Movement (1930)"
            steps={routeSteps}
            connections={routeConnections}
            layout="custom"
            theme="light"
          />
        </div>

        {/* Layer 2: Floating Stats Card */}
        <div style={{
          position: "absolute",
          right: 60,
          top: "30%",
          transform: `translateX(${statsSlideX}px)`,
          opacity: statsOpacity,
          width: 400
        }}>
          <CardGlassmorphism
            title="March Statistics"
            icon="👣"
            accentColor={secondaryColor}
            eyebrow="A Strategic Symbol"
            content={
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 20,
                marginTop: 10
              }}>
                {/* Custom Stat Row 1 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, color: theme.colors.textSecondary }}>Distance</span>
                  <span style={{ fontSize: 24, fontWeight: "bold", color: primaryColor }}>240 Miles</span>
                </div>
                
                {/* Custom Stat Row 2 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, color: theme.colors.textSecondary }}>Volunteers</span>
                  <span style={{ fontSize: 24, fontWeight: "bold", color: textColor }}>78</span>
                </div>
                
                {/* Custom Stat Row 3 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, color: theme.colors.textSecondary }}>Duration</span>
                  <span style={{ fontSize: 24, fontWeight: "bold", color: secondaryColor }}>24 Days</span>
                </div>

                <div style={{ 
                  marginTop: 10, 
                  paddingTop: 15, 
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  fontSize: 14,
                  fontStyle: "italic",
                  color: theme.colors.textSecondary
                }}>
                  "I want world sympathy in this battle of Right against Might."
                </div>
              </div>
            }
          />
        </div>

        {/* Layer 3: Subtitles */}
        <div style={{ position: "absolute", bottom: 50, left: 0, width: "100%" }}>
          <Subtitle
            text="In 1930, Gandhi launched the Civil Disobedience Movement with the Salt March. Walking 240 miles to Dandi with 78 volunteers, he ceremonially broke the salt law, a symbol of British oppression that united the rich and poor."
            startFrame={0} // Relative to scene start
            durationInFrames={465} // Full scene duration
            emphasisWords={["Salt March", "240 miles", "78 volunteers", "united"]}
          />
        </div>

      </SafeArea>
    </AbsoluteFill>
  );
}
