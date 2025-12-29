import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { ListStaggeredEntry, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 11: Review key concepts.
 * 
 * Target: Summarize the lesson points (Should = Advice, Grammar Rule, Safety).
 * Layout: main-content.center
 * Duration: 13.0 seconds (390 frames)
 * 
 * Components:
 * - ListStaggeredEntry (Mapped from bullet-points for better animation support)
 * 
 * Subtitles:
 * - "Should is for advice."
 * - "After should, use the base verb."
 * - "You should be safe."
 */
export default function Scene11() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Config colors
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const accentColor = "#F2994A";
  const backgroundColor = "#EAF2F8"; // From JSON scene background

  // Animation for the main container
  const containerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const containerTranslateY = interpolate(frame, [0, 20], [50, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main Content: Review List */}
      <Sequence from={0} durationInFrames={390}>
        <div
          style={{
            opacity: containerOpacity,
            transform: `translateY(${containerTranslateY}px)`,
            width: "100%",
            maxWidth: 1000,
            padding: 60,
          }}
        >
          {/* Using ListStaggeredEntry for the "slide-up-staggered" intent */}
          <ListStaggeredEntry
            title="Review"
            items={[
              {
                title: "Should = Advice",
                description: "Used to give a good idea",
                icon: "💡", // Mapped from 'lightbulb'
                accentColor: primaryColor,
              },
              {
                title: "Should + Base Verb",
                description: "No -ing, No -s",
                icon: "🛠️", // Mapped from 'tools'
                accentColor: accentColor,
              },
              {
                title: "Be Safe!",
                description: "Wear a helmet & ride carefully",
                icon: "❤️", // Mapped from 'heart'
                accentColor: secondaryColor,
              },
            ]}
            staggerDelay={15} // Stagger animation for items
          />
        </div>
      </Sequence>

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={120}>
        <Subtitle
          text="Should is for advice."
          startFrame={0}
          durationInFrames={120}
        />
      </Sequence>
      
      <Sequence from={120} durationInFrames={150}>
        <Subtitle
          text="After should, use the base verb."
          startFrame={0}
          durationInFrames={150}
        />
      </Sequence>
      
      <Sequence from={270} durationInFrames={120}>
        <Subtitle
          text="You should be safe."
          startFrame={0}
          durationInFrames={120}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
