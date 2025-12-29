import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img, Sequence } from "remotion";
import { LogicComparisonSlider, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 9: Correct common grammar mistakes.
 * Target: Explain grammatical category (Modal Verb).
 * Layout: main-content.center
 * Duration: 6.0 seconds (180 frames)
 * 
 * Components:
 * - S9_Correction: before-after-comparison (LogicComparisonSlider)
 * 
 * Timeline:
 * - 0.0s - 6.0s: Show incorrect then correct form (flip-reveal)
 */
export default function Scene9() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Colors from config
  const primaryColor = "#3498db";
  const secondaryColor = "#2ecc71";
  const accentColor = "#e74c3c";
  const textColor = "#2c3e50";
  const backgroundColor = "#f4f6f7";

  // Animation: Flip Reveal
  // Rotate X from 90 to 0 degrees to simulate a flip down/up effect
  const flipProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const rotateX = interpolate(flipProgress, [0, 1], [90, 0]);
  const opacity = interpolate(flipProgress, [0, 1], [0, 1]);

  // Image URLs
  const beforeImageSrc = "http://35.232.154.66:5125/files/tools/5de4ae13-b056-43b1-818a-c693712ace40.jpg?timestamp=1766976638&nonce=0d2a54e6ecc897a5ecce5a0049249fc1&sign=U7x3i4O3mGGR2gEZwwXzYCIs3ZvIKK1xc-YNR7r5Drg=";
  const afterImageSrc = "http://35.232.154.66:5125/files/tools/b0fa842f-2bd0-4514-8018-92ad97521246.jpg?timestamp=1766976638&nonce=0962f91f41ff67dc6c11a69842d092cd&sign=GsymmP2YWvZu_KK1ufJzwqrwNKpnZTI3qZD0fXSbDrk=";

  // Content for the "Before" side (Incorrect)
  const BeforeContent = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#ffebee" }}>
      <Img 
        src={beforeImageSrc} 
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} 
      />
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: accentColor,
        color: "white",
        padding: "10px 20px",
        borderRadius: 8,
        fontFamily: theme.fonts.heading,
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        DO NOT SAY
      </div>
      <div style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        color: accentColor,
        fontFamily: theme.fonts.heading,
        fontSize: 32,
        fontWeight: "bold",
        textShadow: "0 2px 4px rgba(255,255,255,0.8)",
        background: "rgba(255,255,255,0.9)",
        padding: 10
      }}>
        "You should wearing..."
      </div>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 120,
        color: accentColor,
        opacity: 0.8
      }}>
        ✕
      </div>
    </div>
  );

  // Content for the "After" side (Correct)
  const AfterContent = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#e8f5e9" }}>
      <Img 
        src={afterImageSrc} 
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} 
      />
      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        background: secondaryColor,
        color: "white",
        padding: "10px 20px",
        borderRadius: 8,
        fontFamily: theme.fonts.heading,
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        SAY
      </div>
      <div style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        color: secondaryColor,
        fontFamily: theme.fonts.heading,
        fontSize: 32,
        fontWeight: "bold",
        textShadow: "0 2px 4px rgba(255,255,255,0.8)",
        background: "rgba(255,255,255,0.9)",
        padding: 10
      }}>
        "You should wear..."
      </div>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 120,
        color: secondaryColor,
        opacity: 0.8
      }}>
        ✓
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ 
      backgroundColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      perspective: 1000 // For 3D rotation
    }}>
      
      {/* Main Content Container with Flip Animation */}
      <div style={{
        width: 1000,
        height: 600,
        transform: `rotateX(${rotateX}deg)`,
        opacity,
        transformOrigin: "center top",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        borderRadius: 20,
        overflow: "hidden",
        background: "white"
      }}>
        <LogicComparisonSlider
          before={BeforeContent}
          after={AfterContent}
          initialPosition={50}
        />
      </div>

      {/* Title Overlay */}
      <div style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        opacity
      }}>
        <h1 style={{
          fontFamily: theme.fonts.heading,
          color: textColor,
          fontSize: 48,
          margin: 0
        }}>
          Common Mistakes
        </h1>
      </div>

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={90}>
        <Subtitle 
          text="Do not say: You should wearing a helmet."
          startFrame={0}
          durationInFrames={90}
        />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Subtitle 
          text="Say: You should wear a helmet."
          startFrame={0}
          durationInFrames={90}
        />
      </Sequence>

    </AbsoluteFill>
  );
}
