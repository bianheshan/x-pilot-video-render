import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 6: Strategy vs Tactics
 * Target: Distinguish between the plan (Strategy) and the action (Tactics).
 * Duration: 30s (170s - 200s)
 */
export default function Scene6() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Scene Timing Constants
  const sceneStartSeconds = 170.0;
  
  // Animation Configuration: Slide In
  const slideConfig = {
    damping: 20,
    stiffness: 90,
    mass: 0.8,
  };

  // Left Card Animation (Strategy) - Slide from Left
  const leftSlideProgress = spring({
    frame,
    fps,
    config: slideConfig,
    delay: 5,
  });
  const leftTranslateX = interpolate(leftSlideProgress, [0, 1], [-150, 0]);
  const leftOpacity = interpolate(leftSlideProgress, [0, 0.5], [0, 1]);

  // Right Card Animation (Tactics) - Slide from Right
  const rightSlideProgress = spring({
    frame,
    fps,
    config: slideConfig,
    delay: 15, // Slight stagger
  });
  const rightTranslateX = interpolate(rightSlideProgress, [0, 1], [150, 0]);
  const rightOpacity = interpolate(rightSlideProgress, [0, 0.5], [0, 1]);

  // Image Resources
  const strategyImage = "http://35.232.154.66:5125/files/tools/78cfc056-cb02-46f4-9475-f4374c516167.jpg?timestamp=1767453839&nonce=780306b291a4769a9ea36ae70d8bd8f3&sign=Hwo9PxdlZUZ6ntpaOLzTn9UpIyBWp5sAdFzyJBo-T0M=";
  const tacticsImage = "http://35.232.154.66:5125/files/tools/b383cc90-151b-471e-8a70-025d8b1a1925.jpg?timestamp=1767453835&nonce=4519256786ce9295c0761da2c798404f&sign=PjRa_5oKWpNAV_jTRDNsgG-Lugoc81QVYBBR2lHUZgo=";

  // Subtitles Data
  const subtitles = [
    { text: "Before you start posting, remember the difference between Strategy and Tactics.", start: 170.0, end: 176.0 },
    { text: "Strategy is your map. It defines who you are targeting and why.", start: 176.0, end: 182.0 },
    { text: "Tactics are the vehicle. They are the specific actions like writing a blog or running an ad.", start: 182.0, end: 190.0 },
    { text: "Tactics without strategy is just noise. Strategy without tactics is just a dream.", start: 190.0, end: 197.0 },
    { text: "You need both to succeed.", start: 197.0, end: 200.0 },
  ];

  // Styles
  const cardContainerStyle: React.CSSProperties = {
    flex: 1,
    background: "#F4F7F6",
    borderRadius: 32,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)",
  };

  const imageContainerStyle: React.CSSProperties = {
    flex: 2,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  };

  const textContainerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    textAlign: "center",
    background: "#FFFFFF",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: 48,
    fontWeight: 700,
    color: "#0056D2", // Primary Color
    marginBottom: 12,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.body,
    fontSize: 32,
    color: "#64748b",
    fontWeight: 600,
  };

  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      {/* Background decoration */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute",
          width: "50%",
          height: "100%",
          left: 0,
          background: "linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)"
        }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 2,
          height: "80%",
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(to bottom, transparent, #e2e8f0, transparent)"
        }} />
      </AbsoluteFill>

      <SafeArea padding={80} paddingBottom={180} style={{ zIndex: 1 }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: 60, 
          height: "100%", 
          alignItems: "center" 
        }}>
          
          {/* Left Card: Strategy */}
          <div style={{ 
            ...cardContainerStyle, 
            transform: `translateX(${leftTranslateX}%)`,
            opacity: leftOpacity
          }}>
            <div style={imageContainerStyle}>
              <Img 
                src={strategyImage} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={textContainerStyle}>
              <h2 style={titleStyle}>Strategy</h2>
              <span style={subtitleStyle}>(The Map)</span>
            </div>
          </div>

          {/* Right Card: Tactics */}
          <div style={{ 
            ...cardContainerStyle, 
            transform: `translateX(${rightTranslateX}%)`,
            opacity: rightOpacity
          }}>
            <div style={imageContainerStyle}>
              <Img 
                src={tacticsImage} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={textContainerStyle}>
              <h2 style={{ ...titleStyle, color: "#00C896" }}>Tactics</h2> {/* Accent Color */}
              <span style={subtitleStyle}>(The Drive)</span>
            </div>
          </div>

        </div>
      </SafeArea>

      {/* Subtitles */}
      {subtitles.map((sub, i) => {
        const startFrame = Math.max(0, Math.round((sub.start - sceneStartSeconds) * fps));
        const durationInFrames = Math.max(1, Math.round((sub.end - sub.start) * fps));
        
        return (
          <Subtitle
            key={i}
            text={sub.text}
            startFrame={startFrame}
            durationInFrames={durationInFrames}
          />
        );
      })}
    </AbsoluteFill>
  );
}
