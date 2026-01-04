import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOpenSans } from "@remotion/google-fonts/OpenSans";

// Load fonts
const { fontFamily: fontHeading } = loadFont();
const { fontFamily: fontBody } = loadOpenSans();

export default function Scene1() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Colors from config
  const primaryColor = "#0056D2";
  const accentColor = "#00C896";
  const textColor = "#1A1A1A";
  const bgColor = "#FFFFFF";

  // --- Animations ---

  // 1. Title Entry (Mask Reveal) - Starts at 1s
  const titleStartFrame = fps * 1;
  const titleProgress = spring({
    frame: frame - titleStartFrame,
    fps,
    config: { damping: 200 },
  });
  
  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // 2. Morphing Logic (Chaos -> Bridge) - Starts around 5s, ends around 10s
  const morphStartFrame = fps * 5;
  const morphDuration = fps * 4;
  const morphProgress = interpolate(
    frame,
    [morphStartFrame, morphStartFrame + morphDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Chaos Animation (Jitter)
  const chaosJitter = Math.sin(frame * 0.5) * 5 * (1 - morphProgress); // Reduces as it morphs
  
  // Bridge Draw Animation
  const bridgeDraw = interpolate(morphProgress, [0.2, 1], [0, 1], { extrapolateRight: "clamp" });

  // 3. Definition Card Entry - Starts at 14s
  const defStartFrame = fps * 14;
  const defProgress = spring({
    frame: frame - defStartFrame,
    fps,
    config: { mass: 0.8, damping: 12 },
  });
  const defY = interpolate(defProgress, [0, 1], [100, 0]);
  const defOpacity = interpolate(defProgress, [0, 1], [0, 1]);


  // --- Subtitles Data (Converted to relative frames) ---
  // Scene starts at 0.0s absolute time
  const subtitles = [
    { text: "When you hear 'Marketing', you might think of flashy advertisements, cold calls, or viral social media posts.", start: 0, end: 7.5 },
    { text: "But that is just the tip of the iceberg. At its core, marketing is not just about selling.", start: 7.5, end: 14.0 },
    { text: "It is the strategic bridge between a product and the people who actually need it. It is about creating value.", start: 14.0, end: 22.0 },
  ];

  return (
    <AbsoluteFill style={{ background: bgColor, overflow: "hidden" }}>
      
      {/* Background Decoration: Subtle Grid */}
      <AbsoluteFill style={{ zIndex: 0, opacity: 0.05 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={primaryColor} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </AbsoluteFill>

      <SafeArea padding={60} paddingBottom={160} style={{ zIndex: 1 }}>
        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "space-between",
          paddingTop: 40
        }}>
          
          {/* Component 1: Title */}
          <div style={{ 
            opacity: titleOpacity, 
            transform: `translateY(${titleY}px)`,
            textAlign: "center"
          }}>
            <h1 style={{
              fontFamily: fontHeading,
              fontSize: 80,
              fontWeight: 800,
              color: primaryColor,
              margin: 0,
              lineHeight: 1.1
            }}>
              Marketing ≠ Just Sales
            </h1>
            <div style={{
              width: 120,
              height: 6,
              background: accentColor,
              margin: "20px auto",
              borderRadius: 3,
              transform: `scaleX(${titleProgress})`
            }} />
          </div>

          {/* Component 2: Visual Metaphor (Chaos Cloud -> Bridge) */}
          <div style={{ 
            flex: 1, 
            width: "100%", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            position: "relative"
          }}>
            <svg width={800} height={400} viewBox="0 0 800 400" style={{ overflow: 'visible' }}>
              {/* Chaos Layer (Fades Out) */}
              <g style={{ opacity: 1 - morphProgress, transform: `translate(${chaosJitter}px, ${chaosJitter}px)` }}>
                <path 
                  d="M100,200 Q150,50 200,200 T300,200 T400,100 T500,300 T600,150 T700,200" 
                  fill="none" 
                  stroke="#FF4D4F" 
                  strokeWidth={8} 
                  strokeLinecap="round"
                  strokeDasharray="10 20"
                />
                 <path 
                  d="M120,220 Q180,300 250,220 T350,180 T450,250 T550,150 T650,280" 
                  fill="none" 
                  stroke="#FF4D4F" 
                  strokeWidth={4} 
                  strokeLinecap="round"
                  opacity={0.6}
                />
                <text x="400" y="350" textAnchor="middle" fill="#FF4D4F" fontFamily={fontBody} fontSize={24} fontWeight="bold">NOISE / ADS</text>
              </g>

              {/* Bridge Layer (Fades In & Draws) */}
              <g style={{ opacity: morphProgress }}>
                {/* Bridge Arch */}
                <path 
                  d="M100,300 C100,300 250,100 400,100 C550,100 700,300 700,300" 
                  fill="none" 
                  stroke={primaryColor} 
                  strokeWidth={12} 
                  strokeLinecap="round"
                  strokeDasharray={1000}
                  strokeDashoffset={1000 * (1 - bridgeDraw)}
                />
                {/* Bridge Deck */}
                <line 
                  x1="50" y1="300" x2="750" y2="300" 
                  stroke={primaryColor} 
                  strokeWidth={8}
                  strokeDasharray={800}
                  strokeDashoffset={800 * (1 - bridgeDraw)} 
                />
                {/* Pillars */}
                <line x1="250" y1="300" x2="250" y2="160" stroke={primaryColor} strokeWidth={4} strokeDasharray="10 10" opacity={bridgeDraw} />
                <line x1="550" y1="300" x2="550" y2="160" stroke={primaryColor} strokeWidth={4} strokeDasharray="10 10" opacity={bridgeDraw} />
                
                {/* Connection Label */}
                <text 
                  x="400" 
                  y="80" 
                  textAnchor="middle" 
                  fill={accentColor} 
                  fontFamily={fontHeading} 
                  fontSize={32} 
                  fontWeight="bold"
                  style={{ opacity: interpolate(bridgeDraw, [0.8, 1], [0, 1]) }}
                >
                  CONNECTION
                </text>
              </g>
            </svg>
          </div>

          {/* Component 3: Definition Quote */}
          <div style={{
            opacity: defOpacity,
            transform: `translateY(${defY}px)`,
            background: "rgba(244, 247, 246, 0.9)", // Secondary color with opacity
            borderLeft: `8px solid ${accentColor}`,
            padding: "32px 48px",
            borderRadius: "0 16px 16px 0",
            maxWidth: 900,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}>
            <p style={{
              fontFamily: fontHeading,
              fontSize: 32,
              color: textColor,
              margin: "0 0 16px 0",
              lineHeight: 1.4,
              fontStyle: "italic"
            }}>
              "Marketing is the process of getting people to notice, trust, and choose your product."
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <div style={{ width: 24, height: 2, background: "#999" }} />
              <span style={{
                fontFamily: fontBody,
                fontSize: 18,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: 1
              }}>
                Core Definition
              </span>
            </div>
          </div>

        </div>
      </SafeArea>

      {/* Subtitles Layer */}
      {subtitles.map((sub, index) => {
        const startFrame = Math.round(sub.start * fps);
        const duration = Math.round((sub.end - sub.start) * fps);
        return (
          <Subtitle
            key={index}
            text={sub.text}
            startFrame={startFrame}
            durationInFrames={duration}
          />
        );
      })}
    </AbsoluteFill>
  );
}
