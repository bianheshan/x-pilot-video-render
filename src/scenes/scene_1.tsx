import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  SplitScreen, 
  CardGlassmorphism, 
  ListStaggeredEntry, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 1: Anatomy - Shoulder Joint Structure
 * Target: Identify the key anatomical structures of the shoulder.
 * 
 * Layout: SplitScreen
 * - Left: Introduction Card (Anatomy)
 * - Right: Anatomical Structures List (Simulating the labels of the 3D model)
 * 
 * Duration: 6.5 seconds (195 frames)
 */
export default function Scene1() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Colors from JSON config
  const primaryColor = "#0077B6";
  const secondaryColor = "#90E0EF";
  const accentColor = "#E63946";
  const textColor = "#333333";
  const backgroundColor = "#F0F8FF";

  // Animation timing
  // Scene duration: 6.5s = 195 frames
  
  // Left side animation (Title)
  const leftOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const leftSlide = interpolate(frame, [0, 30], [-50, 0], { extrapolateRight: "clamp" });

  // Right side animation (List) starts slightly later
  const rightOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const rightSlide = interpolate(frame, [20, 50], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      
      {/* Main Layout: SplitScreen */}
      <SplitScreen
        ratio={0.4}
        gap={40}
        showDivider={true}
        dividerWidth={2}
        
        // Left Content: Title Information
        left={
          <div style={{ 
            opacity: leftOpacity, 
            transform: `translateX(${leftSlide}px)`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <CardGlassmorphism
              title="Anatomy"
              content="Shoulder Joint Structure"
              icon="🦴"
              eyebrow="Part 01"
              accentColor={primaryColor}
              cardStyle={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${secondaryColor}`,
                boxShadow: "0 8px 32px rgba(0, 119, 182, 0.1)"
              }}
            />
          </div>
        }

        // Right Content: Structural Breakdown (Simulating the 3D labels)
        right={
          <div style={{ 
            opacity: rightOpacity, 
            transform: `translateX(${rightSlide}px)`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
             <ListStaggeredEntry
              title="Key Structures"
              items={[
                { 
                  title: "Humeral Head", 
                  description: "The ball of the joint",
                  icon: "⚪",
                  accentColor: primaryColor 
                },
                { 
                  title: "Glenoid", 
                  description: "The socket of the shoulder blade",
                  icon: "🛡️",
                  accentColor: primaryColor
                },
                { 
                  title: "Acromion", 
                  description: "The bony roof above the joint",
                  icon: "🏠",
                  accentColor: accentColor // Highlight as it's key to impingement
                },
                { 
                  title: "Rotator Cuff", 
                  description: "Group of muscles and tendons",
                  icon: "💪",
                  accentColor: secondaryColor
                }
              ]}
              staggerDelay={15}
              cardStyle={{
                background: "white",
                color: textColor,
                borderLeft: `4px solid ${primaryColor}`
              }}
            />
          </div>
        }
      />

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={195}>
        <Subtitle
          text="The shoulder joint is a complex structure where the humeral head meets the glenoid."
          startFrame={0}
          durationInFrames={195}
          variant="clean"
        />
      </Sequence>

    </AbsoluteFill>
  );
}
