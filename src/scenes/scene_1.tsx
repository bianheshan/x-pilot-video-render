import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, useVideoConfig, spring } from "remotion";
import { TitleCinematicIntro, CardGlassmorphism, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 1: Introduction to 'Should' and 'Advice'
 * 
 * Target: Introduction to the concept of 'Should' and 'Advice'.
 * Layout: main-content.center
 * Duration: 8.5 seconds (approx 255 frames)
 * 
 * Components:
 * - Kinetic Typography: "SHOULD = ADVICE"
 * - Info Card: "Advice" -> "A Good Idea"
 * 
 * Timeline:
 * - 0s-4s: Title enters and displays
 * - 4s-8.5s: Title exits, Definition Card enters
 */
export default function Scene1() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Configuration from JSON
  const backgroundColor = "#f4f6f7";
  const primaryColor = "#3498db";
  
  // Animation Constants
  const TRANSITION_START_FRAME = 4 * 30; // 4 seconds -> 120 frames

  // --- Animation Logic ---

  // 1. Title Animation (0s - 4s)
  // Enter: Fade in + Slide Up
  const titleEnterOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleEnterY = interpolate(frame, [0, 20], [50, 0], { extrapolateRight: "clamp" });
  
  // Exit: Fade out + Slide Up further
  const titleExitOpacity = interpolate(frame, [TRANSITION_START_FRAME - 15, TRANSITION_START_FRAME], [1, 0], { extrapolateRight: "clamp" });
  const titleExitY = interpolate(frame, [TRANSITION_START_FRAME - 15, TRANSITION_START_FRAME], [0, -50], { extrapolateRight: "clamp" });

  const titleStyle = {
    opacity: titleEnterOpacity * titleExitOpacity,
    transform: `translateY(${titleEnterY + titleExitY}px)`,
  };

  // 2. Card Animation (4s - 8.5s)
  // Enter: Elastic Bounce
  // We calculate a local frame for the card sequence relative to its start time
  const cardStartFrame = TRANSITION_START_FRAME;
  const cardLocalFrame = frame - cardStartFrame;
  
  const cardScale = spring({
    frame: cardLocalFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });
  
  const cardOpacity = interpolate(cardLocalFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      
      {/* --- Visual Content --- */}
      
      {/* Part 1: Kinetic Typography "SHOULD = ADVICE" */}
      <Sequence from={0} durationInFrames={TRANSITION_START_FRAME + 10}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={titleStyle}>
            <TitleCinematicIntro 
              text="SHOULD = ADVICE"
              subtitle="Grammar Concept"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Part 2: Definition Card "Advice = A Good Idea" */}
      <Sequence from={TRANSITION_START_FRAME} durationInFrames={135}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ 
            opacity: cardOpacity, 
            transform: `scale(${cardScale})`,
            width: 600 // Constrain width for better card appearance
          }}>
            <CardGlassmorphism
              title="Advice"
              content="A Good Idea"
              icon="💡"
              color={primaryColor}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* --- Subtitles --- */}
      {/* Using Sequence to manage subtitle timing precisely */}
      
      {/* 0.0s - 2.5s: "Today we learn the word should." */}
      <Sequence from={0} durationInFrames={75}>
        <Subtitle 
          text="Today we learn the word should."
          startFrame={0}
          durationInFrames={75}
        />
      </Sequence>

      {/* 2.5s - 4.2s: "Should is for advice." */}
      <Sequence from={75} durationInFrames={51}>
        <Subtitle 
          text="Should is for advice."
          startFrame={0} // Relative to Sequence start
          durationInFrames={51}
        />
      </Sequence>

      {/* 4.2s - 6.3s: "Advice means a good idea." */}
      <Sequence from={126} durationInFrames={63}>
        <Subtitle 
          text="Advice means a good idea."
          startFrame={0}
          durationInFrames={63}
        />
      </Sequence>

      {/* 6.3s - 8.5s: "This lesson is about safety." */}
      <Sequence from={189} durationInFrames={66}>
        <Subtitle 
          text="This lesson is about safety."
          startFrame={0}
          durationInFrames={66}
        />
      </Sequence>

    </AbsoluteFill>
  );
}
