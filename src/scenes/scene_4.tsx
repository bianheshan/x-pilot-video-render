import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { 
  GridLayout, 
  CardNeumorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 4: Provide simple safety examples.
 * Target: Provide simple safety examples.
 * Layout: grid-layout-3
 * Duration: 8.0 seconds (240 frames)
 * 
 * Components:
 * - S4_Helmet: Card (Wear a helmet)
 * - S4_Careful: Card (Be careful)
 * - S4_Rules: Card (Follow the rules)
 */
export default function Scene4() {
  const theme = useTheme();
  const { fps } = useVideoConfig();
  
  // Colors from config
  const primaryColor = "#3498db";
  const secondaryColor = "#2ecc71";
  const accentColor = "#e74c3c";
  const backgroundColor = "#ffffff";

  // Grid Items Configuration
  // Syncing with subtitles: 0s, 2s, 4s
  const items = [
    {
      content: (
        <CardNeumorphism
          title="Wear"
          content="a helmet"
          icon="helmet-safety" // Assuming icon component handles string or fallback
          style={{ 
            borderColor: primaryColor,
            color: primaryColor 
          }}
        />
      ),
      span: { cols: 1, rows: 1 },
      animation: "pop", // Corresponds to 'pop-in'
      delay: 0, // Starts at 0s
    },
    {
      content: (
        <CardNeumorphism
          title="Be"
          content="careful"
          icon="exclamation-triangle"
          style={{ 
            borderColor: accentColor,
            color: accentColor 
          }}
        />
      ),
      span: { cols: 1, rows: 1 },
      animation: "pop",
      delay: 60, // Starts at 2s (60 frames)
    },
    {
      content: (
        <CardNeumorphism
          title="Follow"
          content="the rules"
          icon="traffic-light"
          style={{ 
            borderColor: secondaryColor,
            color: secondaryColor 
          }}
        />
      ),
      span: { cols: 1, rows: 1 },
      animation: "pop",
      delay: 120, // Starts at 4s (120 frames)
    }
  ];

  return (
    <AbsoluteFill style={{ background: backgroundColor }}>
      {/* 
        Main Content Area 
        Wrapping GridLayout to restrict height and provide padding 
      */}
      <div style={{ 
        position: 'absolute',
        top: 200,
        left: 100,
        right: 100,
        height: 600,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <GridLayout
          items={items}
          columns={3}
          gap={40}
          staggerDelay={0} // We control delay manually in items
        />
      </div>

      {/* 
        Subtitles 
        Based on the subtitles array in JSON
      */}
      <Subtitle
        text="You should wear a helmet."
        startFrame={0}
        durationInFrames={60}
      />
      <Subtitle
        text="You should be careful."
        startFrame={60}
        durationInFrames={60}
      />
      <Subtitle
        text="You should follow the rules."
        startFrame={120}
        durationInFrames={60}
      />
    </AbsoluteFill>
  );
}
