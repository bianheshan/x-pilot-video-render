import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img, Sequence } from "remotion";
import { 
  SplitScreen, 
  ListStaggeredEntry, 
  CardNeumorphism, 
  TitleCinematicIntro,
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 1: Impact of WWI
 * Target: Explain the economic and political impact of WWI as the catalyst for nationalism.
 * Layout: Split Screen (Left: Key Stats, Right: Historical Image)
 * Duration: 14.5s (435 frames)
 */
export default function Scene1() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Config from JSON
  const durationInFrames = 435; // 14.5s * 30fps
  const primaryColor = "#FF9933";
  const secondaryColor = "#138808";
  const backgroundColor = "#EFE6D5"; // Historical paper color
  const textColor = "#2C2C2C";

  // Animation for Left Column (Slide In)
  const leftOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const leftTranslateX = interpolate(frame, [0, 20], [-50, 0], { extrapolateRight: "clamp" });

  // Animation for Right Column (Fade In Slow)
  const rightOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });
  const rightScale = interpolate(frame, [10, 40], [0.95, 1], { extrapolateRight: "clamp" });

  // Left Content: Key Stats List
  const LeftContent = () => (
    <div style={{ 
      padding: 40, 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center",
      opacity: leftOpacity,
      transform: `translateX(${leftTranslateX}px)`
    }}>
      <div style={{ marginBottom: 40 }}>
        <TitleCinematicIntro 
          text="Impact of World War I"
          subtitle="The Catalyst for Nationalism"
          layout="contained"
        />
      </div>
      
      <ListStaggeredEntry 
        title="Economic Hardships"
        items={[
          { 
            title: "Defense Expenditure", 
            description: "Huge Increase ⬆",
            icon: "🛡️",
            accentColor: "#d32f2f" // Red for alarm
          },
          { 
            title: "Taxes", 
            description: "Income Tax Introduced",
            icon: "💰",
            accentColor: primaryColor
          },
          { 
            title: "Prices (1913-1918)", 
            description: "Doubled 📈",
            icon: "🏷️",
            accentColor: secondaryColor
          }
        ]}
        staggerDelay={15}
      />
    </div>
  );

  // Right Content: Historical Image
  const RightContent = () => (
    <div style={{ 
      padding: 40, 
      height: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      opacity: rightOpacity,
      transform: `scale(${rightScale})`
    }}>
      <CardNeumorphism 
        title="Forced Recruitment"
        eyebrow="1918 Archives"
        content={
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 8 }}>
            <Img 
              src="http://35.232.154.66:5125/files/tools/4569de06-613d-4df8-9af2-0107af1f072c.jpg?timestamp=1767022369&nonce=1b773d30675e663301bf6991c093a12a&sign=6lnyxo6-iu-ATG4xzGWvMVUv7asVn7hsKQ-lC0_K4DY="
              style={{ 
                width: "100%", 
                height: "auto", 
                display: "block",
                filter: "sepia(0.3) contrast(1.1)" // Historical effect
              }}
            />
          </div>
        }
        footer="Villagers were called upon to supply soldiers"
        accentColor={textColor}
      />
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Main Layout */}
      <SplitScreen 
        left={<LeftContent />}
        right={<RightContent />}
        ratio={0.5}
        showDivider={true}
        leftStyle={{ backgroundColor: "transparent" }}
        rightStyle={{ backgroundColor: "rgba(0,0,0,0.03)" }}
      />

      {/* Subtitle Overlay */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <Subtitle 
          text="Modern nationalism in India arose from the anti-colonial struggle. The First World War created a new economic situation: defense expenditure soared, taxes increased, and prices doubled between 1913 and 1918."
          startFrame={0}
          durationInFrames={durationInFrames}
          variant="solid"
          emphasisWords={["First World War", "defense expenditure", "taxes increased", "prices doubled"]}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
