import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  ListStaggeredEntry, 
  CardGlassmorphism, 
  Subtitle, 
  SafeArea,
  TitleCinematicIntro
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 4: Provide simple examples with pauses for repetition.
 * Target: Provide simple examples with pauses for repetition.
 * Layout: main-content.center
 * Duration: 16.0 seconds (480 frames)
 * 
 * Components:
 * - S4_Sentences: List of example sentences (ListStaggeredEntry)
 * - S4_Instruction: Instruction card "Listen and Repeat" (CardGlassmorphism)
 */
export default function Scene4() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Colors from config
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const accentColor = "#F2994A";
  const textColor = "#333333";
  const backgroundColor = "#E8F8F5"; // From JSON background.value

  // Animation Controls
  // The sentences need to appear roughly at 0s, 4s, and 7.5s based on subtitles.
  // 4s = 120 frames, 7.5s = 225 frames.
  // We can approximate this using the staggerDelay of ListStaggeredEntry.
  // Or better, control the list visibility manually for precise sync.
  
  // Instruction card appears at 11.5s (345 frames)
  const instructionOpacity = interpolate(
    frame,
    [345, 365],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const instructionScale = interpolate(
    frame,
    [345, 365],
    [0.8, 1],
    { extrapolateRight: "clamp" }
  );

  // Pulse effect for the instruction card during "Repeat" phase
  const pulse = interpolate(
    frame,
    [365, 400, 435, 470],
    [1, 1.05, 1, 1.05],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <SafeArea padding={60}>
        <AbsoluteFill style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center",
          gap: 60
        }}>
          
          {/* Header to set context */}
          <div style={{ marginBottom: 20 }}>
            <TitleCinematicIntro
              text="Practice Examples"
              subtitle="Using 'Should' for advice"
              layout="contained"
            />
          </div>

          {/* S4_Sentences: Displayed as a staggered list */}
          {/* We use a large staggerDelay (110 frames ~ 3.6s) to match the slow narration */}
          <div style={{ width: "100%", maxWidth: 800 }}>
            <ListStaggeredEntry
              title="Read Aloud"
              items={[
                { 
                  title: "You should wear a helmet.", 
                  icon: "⛑️",
                  description: "Safety First",
                  accentColor: primaryColor
                },
                { 
                  title: "You should be careful.", 
                  icon: "⚠️", 
                  description: "Awareness",
                  accentColor: accentColor
                },
                { 
                  title: "You should follow the rules.", 
                  icon: "📋",
                  description: "Obedience",
                  accentColor: secondaryColor
                }
              ]}
              staggerDelay={110} 
            />
          </div>

          {/* S4_Instruction: Listen and Repeat */}
          <div style={{ 
            opacity: instructionOpacity, 
            transform: `scale(${instructionScale * pulse})`,
            marginTop: 40
          }}>
            <CardGlassmorphism
              title="Listen and Repeat"
              content="Pause the video if you need more time."
              icon="🔊"
              accentColor="#9B51E0"
              variant="raised"
              cardStyle={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "2px solid #9B51E0"
              }}
            />
          </div>

        </AbsoluteFill>
      </SafeArea>

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={120}>
        <Subtitle 
          text="You should wear a helmet."
          startFrame={0}
          durationInFrames={120}
        />
      </Sequence>
      
      <Sequence from={120} durationInFrames={105}>
        <Subtitle 
          text="You should be careful."
          startFrame={0}
          durationInFrames={105}
        />
      </Sequence>

      <Sequence from={225} durationInFrames={120}>
        <Subtitle 
          text="You should follow the rules."
          startFrame={0}
          durationInFrames={120}
        />
      </Sequence>

      <Sequence from={345} durationInFrames={135}>
        <Subtitle 
          text="Pause. Repeat."
          startFrame={0}
          durationInFrames={135}
          emphasisWords={["Pause", "Repeat"]}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
