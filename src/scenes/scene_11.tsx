import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, spring, useVideoConfig } from "remotion";
import { ListBulletPoints, TitleCinematicIntro, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 11: Recap and Conclusion
 * 
 * Target: Recap the main learning points about "Should" and safety.
 * Layout: Center content with a transition from list to final statement.
 * Background: Gradient (Blue to Green)
 * Duration: 12 seconds (360 frames)
 * 
 * Components:
 * - S11_Recap: Bullet points reviewing the lesson (Should = Advice, Base Verb, Be Safe).
 * - S11_Final: Kinetic typography for the final safety message.
 */
export default function Scene11() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene Configuration
  const SCENE_DURATION = 360; // 12 seconds
  const TRANSITION_FRAME = 240; // 8 seconds where recap ends and final text begins

  // --- Animation Phase 1: Recap List (0s - 8s) ---
  
  // Fade in at start, Fade out at 8s
  const recapOpacity = interpolate(
    frame,
    [0, 20, TRANSITION_FRAME - 20, TRANSITION_FRAME],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Slide up effect for the list
  const recapTranslateY = interpolate(
    frame,
    [0, 20],
    [50, 0],
    { extrapolateRight: "clamp" }
  );

  // --- Animation Phase 2: Final Statement (8s - 12s) ---

  // Zoom in effect for the final text
  const finalScale = spring({
    frame: frame - TRANSITION_FRAME,
    fps,
    config: { stiffness: 100, damping: 10 },
    from: 0.5,
    to: 1,
    durationInFrames: 30
  });

  const finalOpacity = interpolate(
    frame,
    [TRANSITION_FRAME, TRANSITION_FRAME + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(to top, #3498db, #2ecc71)",
      }}
    >
      {/* Phase 1: Recap Bullet Points */}
      <Sequence from={0} durationInFrames={TRANSITION_FRAME}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: recapOpacity,
            transform: `translateY(${recapTranslateY}px)`,
            padding: 60,
          }}
        >
          <div style={{ width: "100%", maxWidth: 800 }}>
            <ListBulletPoints
              title="Review"
              items={[
                "Should = Advice",
                "Use Base Verb",
                "Be Safe"
              ]}
              // Assuming the component handles icon mapping or simple text lists
              // If the component supports an 'icons' prop, we would pass ["info-circle", "check", "shield-check"]
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Phase 2: Final Kinetic Typography */}
      <Sequence from={TRANSITION_FRAME} durationInFrames={SCENE_DURATION - TRANSITION_FRAME}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: finalOpacity,
            transform: `scale(${frame > TRANSITION_FRAME ? finalScale : 0.5})`,
          }}
        >
          <TitleCinematicIntro
            text="You should be careful."
            subtitle="Safety is important"
          />
        </AbsoluteFill>
      </Sequence>

      {/* Subtitles */}
      {/* 0.0s - 4.5s: Should is for advice. After should, use the base verb. */}
      <Subtitle
        text="Should is for advice. After should, use the base verb."
        startFrame={0}
        durationInFrames={135}
      />

      {/* 4.5s - 8.0s: Today we learned should. Should gives advice. */}
      <Subtitle
        text="Today we learned should. Should gives advice."
        startFrame={135}
        durationInFrames={105}
      />

      {/* 8.0s - 12.0s: Safety is important. You should be careful. */}
      <Subtitle
        text="Safety is important. You should be careful."
        startFrame={240}
        durationInFrames={120}
      />
    </AbsoluteFill>
  );
}
