import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  TitleCinematicIntro, 
  CardNeumorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 10: Interactive Practice
 * Target: Interactive practice.
 * Duration: 8.0 seconds (240 frames)
 * 
 * Content:
 * - Title: Practice
 * - Step 1: You ___ wear a helmet. -> SHOULD
 * - Step 2: Bicycles are safer ___ motorcycles. -> THAN
 */
export default function Scene10() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Colors from config
  const primaryColor = "#3498db";
  const secondaryColor = "#2ecc71";
  const backgroundColor = "#eaf2f8";

  // Animation timing
  // 0s - 1.5s: Intro title
  // 1.5s - 4.5s: Question 1
  // 4.5s - 8.0s: Question 2
  
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const q1Opacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });
  const q1TranslateY = interpolate(frame, [45, 65], [50, 0], { extrapolateRight: "clamp" });
  
  const q2Opacity = interpolate(frame, [135, 155], [0, 1], { extrapolateRight: "clamp" });
  const q2TranslateY = interpolate(frame, [135, 155], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      
      {/* Title Section */}
      <div style={{ 
        position: "absolute", 
        top: 100, 
        width: "100%", 
        opacity: titleOpacity,
        zIndex: 10
      }}>
        <TitleCinematicIntro 
          text="Practice"
          subtitle="Listen and choose the correct word"
        />
      </div>

      {/* Quiz Content Area */}
      <div style={{
        position: "absolute",
        top: 350,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        padding: "0 60px"
      }}>
        
        {/* Question 1 */}
        <div style={{ 
          opacity: q1Opacity, 
          transform: `translateY(${q1TranslateY}px)`,
          width: "100%",
          maxWidth: 800
        }}>
          <CardNeumorphism
            title="Question 1"
            content={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 32 }}>
                <span>You ___ wear a helmet.</span>
                <span style={{ color: primaryColor, fontWeight: 'bold' }}>SHOULD</span>
              </div>
            }
          />
        </div>

        {/* Question 2 */}
        <div style={{ 
          opacity: q2Opacity, 
          transform: `translateY(${q2TranslateY}px)`,
          width: "100%",
          maxWidth: 800
        }}>
          <CardNeumorphism
            title="Question 2"
            content={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 32 }}>
                <span>Bicycles are safer ___ motorcycles.</span>
                <span style={{ color: secondaryColor, fontWeight: 'bold' }}>THAN</span>
              </div>
            }
          />
        </div>

      </div>

      {/* Subtitles */}
      <Sequence from={0} durationInFrames={45}>
        <Subtitle 
          text="Listen and choose."
          startFrame={0}
          durationInFrames={45}
        />
      </Sequence>
      
      <Sequence from={45} durationInFrames={90}>
        <Subtitle 
          text="You ___ wear a helmet. Should."
          startFrame={0}
          durationInFrames={90}
        />
      </Sequence>
      
      <Sequence from={135} durationInFrames={105}>
        <Subtitle 
          text="Bicycles are safer ___ motorcycles. Than."
          startFrame={0}
          durationInFrames={105}
        />
      </Sequence>

    </AbsoluteFill>
  );
}
