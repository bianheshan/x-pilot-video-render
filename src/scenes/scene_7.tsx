import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img } from "remotion";
import { SplitScreen, ListStaggeredEntry, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 7: Specific advice for bicycles
 * Target: Specific advice for bicycles (Ride slowly, Watch the road).
 * Layout: Split Screen (Image Left, Points Right)
 * Duration: 6.0 seconds (180 frames)
 */
export default function Scene7() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Configuration from JSON
  const backgroundColor = "#e8f6f3"; // Light mint background
  const primaryColor = "#3498db";
  const secondaryColor = "#2ecc71";
  
  // Animation Control
  // 1. Image Fade In (Left)
  const imageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const imageScale = interpolate(frame, [0, 20], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  // 2. List Slide In (Right)
  const listTranslateX = interpolate(frame, [10, 30], [50, 0], {
    extrapolateRight: "clamp",
  });
  const listOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Left Content: Bicycle Image with Caption
  const LeftContent = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: imageOpacity,
        transform: `scale(${imageScale})`,
        padding: 40,
      }}
    >
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
          padding: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Img
          src="http://35.232.154.66:5125/files/tools/d650eee4-0e6b-4ea7-b4b4-54434a8c96df.jpg?timestamp=1766976626&nonce=664312202bb664f7ed463edb25d75888&sign=co0IO745gXCcq1EjWVC5aC7662ttqxXfqfQhC-ucBuw="
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 400,
            borderRadius: 12,
            objectFit: "cover",
          }}
        />
        <div
          style={{
            marginTop: 15,
            fontSize: 24,
            fontWeight: "bold",
            color: primaryColor,
            fontFamily: theme.fonts.heading,
          }}
        >
          Bicycles: Safer
        </div>
      </div>
    </div>
  );

  // Right Content: Safety Points List
  const RightContent = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 60,
        opacity: listOpacity,
        transform: `translateX(${listTranslateX}px)`,
      }}
    >
      <ListStaggeredEntry
        title="Safety Advice"
        items={[
          "🚲 Ride slowly",
          "👁️ Watch the road"
        ]}
      />
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <SplitScreen
        left={<LeftContent />}
        right={<RightContent />}
        ratio={0.5}
        animate={true}
      />

      {/* Subtitles */}
      <Subtitle
        text="Bicycles are safer than motorcycles."
        startFrame={0}
        durationInFrames={75} // 0.0s - 2.5s
      />
      <Subtitle
        text="You should ride slowly."
        startFrame={75}
        durationInFrames={51} // 2.5s - 4.2s
      />
      <Subtitle
        text="You should watch the road."
        startFrame={126}
        durationInFrames={54} // 4.2s - 6.0s
      />
    </AbsoluteFill>
  );
}
