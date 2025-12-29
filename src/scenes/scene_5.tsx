import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Sequence } from "remotion";
import { SplitScreen, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 5: Introduction to Context and Comparatives
 * 
 * Target: Introduce context (Bicycles vs Motorcycles) and comparatives (Safer vs Faster).
 * Layout: Split Screen Horizontal (Interpreted as Left/Right comparison)
 * Duration: 8.5 seconds (255 frames)
 * 
 * Content:
 * - Left: Bicycles (Safer) - Enters at 0s
 * - Right: Motorcycles (Faster) - Enters at ~2s
 * 
 * Audio/Subtitles:
 * - "This lesson is about bicycles." (0-2s)
 * - "This lesson is about motorcycles." (2-4s)
 * - "Bicycles are safer than motorcycles." (4-6.2s)
 * - "Motorcycles are faster than bicycles." (6.2-8.5s)
 */

// Helper component for the content panels
const ComparisonPanel: React.FC<{
  imageSrc: string;
  label: string;
  subLabel: string;
  bgColor: string;
  delay: number;
  textColor: string;
}> = ({ imageSrc, label, subLabel, bgColor, delay, textColor }) => {
  const frame = useCurrentFrame();
  
  // Animation: Fade in and slide up
  const opacity = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  
  const translateY = interpolate(
    frame,
    [delay, delay + 20],
    [50, 0],
    { extrapolateRight: "clamp" }
  );

  // Subtle zoom effect for the image
  const scale = interpolate(
    frame,
    [delay, delay + 200],
    [1, 1.05],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: 40,
        boxSizing: "border-box",
      }}
    >
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        marginBottom: 30,
        width: "80%",
        aspectRatio: "4/3",
        position: "relative"
      }}>
        <Img 
          src={imageSrc} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transform: `scale(${scale})`
          }} 
        />
      </div>
      
      <h2 style={{
        fontFamily: "Roboto Rounded, sans-serif",
        fontSize: 42,
        fontWeight: "bold",
        color: textColor,
        margin: 0,
        textAlign: "center"
      }}>
        {label}
      </h2>
      <p style={{
        fontFamily: "Open Sans, sans-serif",
        fontSize: 28,
        color: textColor,
        opacity: 0.9,
        marginTop: 10,
        fontWeight: 600,
        textAlign: "center"
      }}>
        {subLabel}
      </p>
    </div>
  );
};

export default function Scene5() {
  const theme = useTheme();
  
  // JSON Data Extraction
  // primary_color: "#3498db"
  // secondary_color: "#2ecc71" (Green - Good for "Safer")
  // accent_color: "#e74c3c" (Red - Good for "Faster/Danger")
  const safeColor = "#2ecc71"; // From secondary_color
  const fastColor = "#e74c3c"; // From accent_color
  
  const bicycleImage = "http://35.232.154.66:5125/files/tools/4562915a-ce2c-4c83-a56d-76003e8db1ac.jpg?timestamp=1766976627&nonce=f412ea6e93c2e5f3beb6cfadb04e5c96&sign=XbN1-kxBrk2-abJgr9iSPMEs35OFCsvhgA_psn8llU8=";
  const motorcycleImage = "http://35.232.154.66:5125/files/tools/1b509774-6de8-4644-bd36-15c3f40a3dd5.jpg?timestamp=1766976626&nonce=51f007306f706c7b18e1e7f7b8f21e50&sign=hKj-qLg_bLw8cWdXf-VxkvWnmU0gpVfoYpbEBFP4Uk4=";

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* 
        Layout: SplitScreen
        We use SplitScreen to show the comparison.
        Left side appears at 0s (Frame 0).
        Right side appears at 2s (Frame 60) to match the narration.
      */}
      <SplitScreen
        left={
          <ComparisonPanel
            imageSrc={bicycleImage}
            label="Bicycles"
            subLabel="(Safer)"
            bgColor={safeColor}
            delay={0}
            textColor="#ffffff"
          />
        }
        right={
          <ComparisonPanel
            imageSrc={motorcycleImage}
            label="Motorcycles"
            subLabel="(Faster)"
            bgColor={fastColor}
            delay={60} // Starts at 2 seconds
            textColor="#ffffff"
          />
        }
        ratio={0.5}
        gap={10}
        dividerColor="rgba(255,255,255,0.5)"
        animate={true}
      />

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={60}>
        <Subtitle 
          text="This lesson is about bicycles."
          startFrame={0}
          durationInFrames={60}
        />
      </Sequence>
      
      <Sequence from={60} durationInFrames={60}>
        <Subtitle 
          text="This lesson is about motorcycles."
          startFrame={0}
          durationInFrames={60}
        />
      </Sequence>

      <Sequence from={120} durationInFrames={66}>
        <Subtitle 
          text="Bicycles are safer than motorcycles."
          startFrame={0}
          durationInFrames={66}
        />
      </Sequence>

      <Sequence from={186} durationInFrames={69}>
        <Subtitle 
          text="Motorcycles are faster than bicycles."
          startFrame={0}
          durationInFrames={69}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
