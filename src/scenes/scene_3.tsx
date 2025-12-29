import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  SplitScreen, 
  CardGlassmorphism, 
  ListStaggeredEntry,
  TitleCinematicIntro,
  Subtitle
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 3: Teach the form constraints (No -ing, No -s).
 * 
 * Target: Explain grammatical category (Modal Verb).
 * Layout: Split Screen (Left: Rules, Right: Examples)
 * Duration: 10 seconds (300 frames)
 * 
 * Components:
 * - Left: Bullet points for rules (Base Verb, No -ing, No -s)
 * - Right: List of correct examples (Should wear, Should be, Should follow)
 */
export default function Scene3() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Configuration from JSON
  const primaryColor = "#3498db";
  const secondaryColor = "#2ecc71"; // Green for correct
  const accentColor = "#e74c3c";    // Red for incorrect
  const backgroundColor = "#f4f6f7";

  // Animation for Left Side (Rules) - Slide in from left
  const leftOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const leftTranslateX = interpolate(frame, [0, 20], [-50, 0], { extrapolateRight: "clamp" });

  // Animation for Right Side (Examples) - Slide in from right at 6s (180 frames)
  const rightStartFrame = 180;
  const rightOpacity = interpolate(frame, [rightStartFrame, rightStartFrame + 20], [0, 1], { extrapolateRight: "clamp" });
  const rightTranslateX = interpolate(frame, [rightStartFrame, rightStartFrame + 20], [50, 0], { extrapolateRight: "clamp" });

  // Custom component for the Left Side Content
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
          text="Form of Should"
          subtitle="Grammar Rules"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Rule 1: Correct */}
        <Sequence from={10} durationInFrames={290}>
          <CardGlassmorphism 
            title="Rule 1"
            content="Use Base Verb"
            icon="✅"
            color={secondaryColor}
          />
        </Sequence>

        {/* Rule 2: Incorrect */}
        <Sequence from={75} durationInFrames={225}>
           <CardGlassmorphism 
            title="Rule 2"
            content="No -ing"
            icon="❌"
            color={accentColor}
          />
        </Sequence>

        {/* Rule 3: Incorrect */}
        <Sequence from={120} durationInFrames={180}>
           <CardGlassmorphism 
            title="Rule 3"
            content="No -s"
            icon="❌"
            color={accentColor}
          />
        </Sequence>
      </div>
    </div>
  );

  // Custom component for the Right Side Content
  const RightContent = () => (
    <div style={{ 
      padding: 40, 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center",
      opacity: rightOpacity,
      transform: `translateX(${rightTranslateX}px)`
    }}>
      <div style={{ marginBottom: 30 }}>
         <h2 style={{ 
           fontFamily: theme.fonts.heading, 
           color: primaryColor,
           fontSize: 36,
           marginBottom: 10
         }}>
           Correct Examples
         </h2>
         <p style={{ fontFamily: theme.fonts.body, color: theme.colors.textSecondary }}>
           Always use the base form
         </p>
      </div>

      <ListStaggeredEntry 
        title=""
        items={[
          "✅ Should wear",
          "✅ Should be",
          "✅ Should follow"
        ]}
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
        gap={40}
        animate={false} // We handle animation internally
      />

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={75}>
        <Subtitle 
          text="After should, use the base verb."
          startFrame={0}
          durationInFrames={75}
        />
      </Sequence>
      
      <Sequence from={75} durationInFrames={45}>
        <Subtitle 
          text="Do not add -ing."
          startFrame={0}
          durationInFrames={45}
        />
      </Sequence>

      <Sequence from={120} durationInFrames={45}>
        <Subtitle 
          text="Do not add -s."
          startFrame={0}
          durationInFrames={45}
        />
      </Sequence>

      <Sequence from={165} durationInFrames={135}>
        <Subtitle 
          text="We say: Should wear. Should be. Should follow."
          startFrame={0}
          durationInFrames={135}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
