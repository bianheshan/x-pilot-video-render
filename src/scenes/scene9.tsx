import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { CardNeumorphism, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 9: Highlight common mistakes (Negative Example).
 * Target: Contrast the wrong grammar ("should wearing") with the right grammar ("should wear").
 * Layout: Split Screen Vertical (Top/Bottom) for direct comparison.
 * Duration: 12 seconds (360 frames)
 * 
 * Timeline:
 * - 0.0s - 6.5s: Top half (Wrong example) enters with shake animation.
 * - 6.5s - 12.0s: Bottom half (Right example) enters with bounce animation.
 */
export default function Scene9() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Configuration
  const wrongBg = "#FFE6E6"; // Light red background from JSON for error context
  const rightBg = "#E8F8F5"; // Light green background for success context
  const wrongAccent = "#E74C3C"; // Red accent
  const rightAccent = "#27AE60"; // Green accent

  // Timing
  const switchFrame = 195; // 6.5 seconds * 30 fps

  // --- Animation Logic ---

  // 1. Top Card (Wrong) - Shake Effect
  const topEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 }
  });

  const topOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const topTranslateY = interpolate(topEntrance, [0, 1], [-50, 0]);
  
  // Shake animation triggers shortly after entrance (around frame 30)
  const shake = interpolate(
    frame,
    [30, 35, 40, 45, 50, 55, 60],
    [0, -15, 15, -10, 10, -5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Bottom Card (Right) - Bounce Effect
  const bottomEntrance = spring({
    frame: frame - switchFrame,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.6 }
  });

  const bottomOpacity = interpolate(frame, [switchFrame, switchFrame + 20], [0, 1], { extrapolateRight: "clamp" });
  const bottomScale = interpolate(bottomEntrance, [0, 1], [0.5, 1]);

  // Styles
  const cardContentStyle = {
    fontSize: 32,
    fontWeight: 700,
    fontFamily: theme.fonts.heading,
  };

  return (
    <AbsoluteFill style={{ flexDirection: "column" }}>
      
      {/* Top Section: The Mistake */}
      <div style={{
        flex: 1,
        backgroundColor: wrongBg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderBottom: "2px solid rgba(0,0,0,0.05)",
        zIndex: 2
      }}>
        <div style={{
          opacity: topOpacity,
          transform: `translateY(${topTranslateY}px) translateX(${shake}px)`,
          width: 600
        }}>
          <CardNeumorphism
            title="Do NOT Say"
            content={
              <div style={{ ...cardContentStyle, color: "#C0392B" }}>
                You should <span style={{ textDecoration: "underline", textDecorationThickness: 3 }}>wearing</span>...
              </div>
            }
            icon="❌"
            accentColor={wrongAccent}
            variant="pressed"
          />
        </div>
      </div>

      {/* Bottom Section: The Correction */}
      <div style={{
        flex: 1,
        backgroundColor: rightBg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        zIndex: 2
      }}>
        <div style={{
          opacity: bottomOpacity,
          transform: `scale(${bottomScale})`,
          width: 600
        }}>
          <CardNeumorphism
            title="SAY"
            content={
              <div style={{ ...cardContentStyle, color: "#27AE60" }}>
                You should <span style={{ textDecoration: "underline", textDecorationThickness: 3 }}>wear</span>...
              </div>
            }
            icon="✅"
            accentColor={rightAccent}
            variant="raised"
          />
        </div>
      </div>

      {/* Subtitles */}
      <Subtitle
        text="Do not say: You should wearing a helmet."
        startFrame={0}
        durationInFrames={195}
        variant="solid"
        emphasisWords={["not", "wearing"]}
      />
      
      <Subtitle
        text="Say: You should wear a helmet."
        startFrame={195}
        durationInFrames={165}
        variant="solid"
        emphasisWords={["Say", "wear"]}
      />

    </AbsoluteFill>
  );
}
