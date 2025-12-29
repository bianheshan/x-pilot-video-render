import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, useVideoConfig, spring } from "remotion";
import { SplitScreen, ListStaggeredEntry, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 8: Specific advice for motorcycles
 * Concept: Motorcycles are faster but more dangerous, requiring specific safety measures.
 * Layout: Split Screen (Left Focus)
 * Duration: 7.0 seconds (210 frames)
 */
export default function Scene8() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Configuration from JSON
  const backgroundColor = "#fdedec"; // Light reddish background for caution context
  const accentColor = "#e74c3c"; // Red accent for danger/warning

  // Animations
  // Left content slide-in spring
  const leftContentX = spring({
    frame,
    fps,
    from: -50,
    to: 0,
    config: { damping: 12, stiffness: 100 }
  });

  const leftContentOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp"
  });

  // Right content fade-in
  const rightContentOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateRight: "clamp"
  });

  const rightContentScale = spring({
    frame: frame - 10,
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 15, stiffness: 100 }
  });

  // Component: Left Side - Safety Points
  const LeftContent = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 60px",
        transform: `translateX(${leftContentX}px)`,
        opacity: leftContentOpacity,
      }}
    >
      <h2
        style={{
          fontFamily: theme.fonts.heading,
          color: accentColor,
          fontSize: 48,
          marginBottom: 40,
          fontWeight: "bold",
        }}
      >
        Motorcycle Safety
      </h2>
      
      <ListStaggeredEntry
        title=""
        items={[
          "⚠️ Be very careful",
          "🛡️ Wear safety gear"
        ]}
      />
      
      <div style={{ 
        marginTop: 40, 
        padding: 20, 
        backgroundColor: "rgba(231, 76, 60, 0.1)", 
        borderRadius: 12,
        borderLeft: `4px solid ${accentColor}`,
        fontFamily: theme.fonts.body,
        color: theme.colors.text
      }}>
        <p style={{ margin: 0, fontSize: 20 }}>
          High speed requires high alert.
        </p>
      </div>
    </div>
  );

  // Component: Right Side - Image
  const RightContent = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        opacity: rightContentOpacity,
        transform: `scale(${rightContentScale})`,
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(231, 76, 60, 0.15)",
          border: `6px solid white`,
          backgroundColor: "white",
        }}
      >
        <Img
          src="http://35.232.154.66:5125/files/tools/06ae71b2-b959-420e-86d4-40b61e00f7ab.jpg?timestamp=1766976638&nonce=3df057d1e9fef5776f98be8e49a80443&sign=V5WAZWLYTZC6_BwCerwpdkI_z2sEYBgwrQ138iJmi6o="
          alt="Motorcycle"
          style={{
            display: "block",
            width: "100%",
            maxWidth: 600,
            height: "auto",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "15px 20px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Motorcycles: Faster 🏍️
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <SplitScreen
        left={<LeftContent />}
        right={<RightContent />}
        ratio={0.4} // Left focus as requested in layout logic, giving text slightly less space but visual emphasis
        animate={true}
        dividerColor="rgba(231, 76, 60, 0.2)"
      />

      {/* Subtitles synced with timeline */}
      <Subtitle
        text="Motorcycles are faster than bicycles."
        startFrame={0}
        durationInFrames={75}
      />
      <Subtitle
        text="You should be very careful."
        startFrame={75}
        durationInFrames={60}
      />
      <Subtitle
        text="You should wear safety gear."
        startFrame={135}
        durationInFrames={75}
      />
    </AbsoluteFill>
  );
}
