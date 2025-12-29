import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CardGlassmorphism, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 12: Conclusion and final safety message.
 * 
 * Target: Warm closing message.
 * Layout: Center focus
 * Background: #27AE60 (Green)
 * Duration: 14 seconds
 * 
 * Components:
 * - Info Card: "Good Job!", "Safety is important.", Icon: Star
 */
export default function Scene12() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation: Spring scale up for the card
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  });

  // Background floating elements animation
  const floatY = interpolate(frame, [0, 420], [0, -20], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#27AE60", // Explicitly requested in JSON
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Decoration: Subtle floating circles to match "Clean Educational Vector" style */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "15%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            transform: `translateY(${floatY}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            transform: `translateY(${floatY * 1.5}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "30%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            transform: `translateY(${floatY * 0.5}px)`,
          }}
        />
      </AbsoluteFill>

      {/* Main Content: Celebration Card */}
      <div style={{ transform: `scale(${scale})`, zIndex: 1 }}>
        <CardGlassmorphism
          title="Good Job!"
          content={
            <div style={{ textAlign: "center", paddingTop: 10 }}>
              <div style={{ fontSize: 28, marginBottom: 16, fontWeight: 500 }}>
                Safety is important.
              </div>
              <div style={{ fontSize: 80, marginTop: 10 }}>⭐</div>
            </div>
          }
          icon="🎉"
          accentColor="#F2994A" // Accent color from JSON
          style={{
            width: 600,
            minHeight: 350,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* Subtitles - Based on JSON timing */}
      <Subtitle
        text="Today we learned should."
        startFrame={0}
        durationInFrames={105} // 0s - 3.5s
      />
      <Subtitle
        text="Should gives advice."
        startFrame={105} // 3.5s
        durationInFrames={105} // 3.5s - 7.0s
      />
      <Subtitle
        text="Safety is important."
        startFrame={210} // 7.0s
        durationInFrames={105} // 7.0s - 10.5s
      />
      <Subtitle
        text="You should be careful."
        startFrame={315} // 10.5s
        durationInFrames={105} // 10.5s - 14.0s
      />
    </AbsoluteFill>
  );
}
