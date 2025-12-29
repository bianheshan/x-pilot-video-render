import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { CardNeumorphism, Subtitle, TitleCinematicIntro } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：9
 * 场景 ID：scene_10
 * 场景目标：Interactive Practice/Quiz.
 * 布局方式：main-content.center (Stacked Quiz Cards)
 * 持续时间：19.5 秒 (585 帧)
 * 
 * 组件清单：
 * - S10_Quiz_1: solution-steps (Mapped to CardNeumorphism with custom reveal)
 * - S10_Quiz_2: solution-steps (Mapped to CardNeumorphism with custom reveal)
 */
export default function Scene10() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // JSON Configuration
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const backgroundColor = "#F0F3F4";
  
  // Animation Timing (30fps)
  // Q1: Enter at 2s (60f), Reveal Answer at 7s (210f)
  const q1EnterFrame = 60;
  const q1RevealFrame = 210;
  
  // Q2: Enter at 9.5s (285f), Reveal Answer at 14.5s (435f)
  const q2EnterFrame = 285;
  const q2RevealFrame = 435;

  // Q1 Animation
  const q1Opacity = interpolate(frame, [q1EnterFrame, q1EnterFrame + 20], [0, 1], { extrapolateRight: "clamp" });
  const q1TranslateY = interpolate(frame, [q1EnterFrame, q1EnterFrame + 20], [50, 0], { extrapolateRight: "clamp" });
  const q1AnswerOpacity = interpolate(frame, [q1RevealFrame, q1RevealFrame + 15], [0, 1], { extrapolateRight: "clamp" });
  
  // Q2 Animation
  const q2Opacity = interpolate(frame, [q2EnterFrame, q2EnterFrame + 20], [0, 1], { extrapolateRight: "clamp" });
  const q2TranslateY = interpolate(frame, [q2EnterFrame, q2EnterFrame + 20], [50, 0], { extrapolateRight: "clamp" });
  const q2AnswerOpacity = interpolate(frame, [q2RevealFrame, q2RevealFrame + 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      
      {/* Title / Intro Area */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{ position: "absolute", top: 100, width: "100%" }}>
           <TitleCinematicIntro 
             text="Let's Practice"
             subtitle="Listen and Choose"
             layout="contained"
           />
        </div>
      </Sequence>

      {/* Quiz Container */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60, top: 80 }}>
        
        {/* Quiz 1: You ___ wear a helmet. */}
        <div style={{ 
          opacity: q1Opacity, 
          transform: `translateY(${q1TranslateY}px)`,
          marginBottom: 60,
          width: "100%",
          maxWidth: 800
        }}>
          <CardNeumorphism
            title="Practice 1"
            eyebrow="Question"
            accentColor={primaryColor}
            content={
              <div style={{ 
                fontSize: 42, 
                fontFamily: theme.fonts.heading, 
                color: theme.colors.text,
                textAlign: "center",
                padding: "20px 0"
              }}>
                You 
                <span style={{ 
                  display: "inline-block", 
                  minWidth: 180, 
                  borderBottom: `4px solid ${primaryColor}`,
                  margin: "0 15px",
                  color: secondaryColor,
                  position: "relative"
                }}>
                  {/* Blank Line Placeholder */}
                  <span style={{ opacity: 0 }}>SHOULD</span>
                  
                  {/* Revealed Answer */}
                  <span style={{ 
                    position: "absolute", 
                    left: 0, 
                    right: 0, 
                    opacity: q1AnswerOpacity,
                    fontWeight: "bold"
                  }}>
                    SHOULD
                  </span>
                </span>
                wear a helmet.
              </div>
            }
          />
        </div>

        {/* Quiz 2: Bicycles are safer ___ motorcycles. */}
        <div style={{ 
          opacity: q2Opacity, 
          transform: `translateY(${q2TranslateY}px)`,
          width: "100%",
          maxWidth: 800
        }}>
          <CardNeumorphism
            title="Practice 2"
            eyebrow="Question"
            accentColor={primaryColor}
            content={
              <div style={{ 
                fontSize: 42, 
                fontFamily: theme.fonts.heading, 
                color: theme.colors.text,
                textAlign: "center",
                padding: "20px 0"
              }}>
                Bicycles are safer 
                <span style={{ 
                  display: "inline-block", 
                  minWidth: 140, 
                  borderBottom: `4px solid ${primaryColor}`,
                  margin: "0 15px",
                  color: secondaryColor,
                  position: "relative"
                }}>
                   {/* Blank Line Placeholder */}
                   <span style={{ opacity: 0 }}>THAN</span>
                   
                   {/* Revealed Answer */}
                   <span style={{ 
                    position: "absolute", 
                    left: 0, 
                    right: 0, 
                    opacity: q2AnswerOpacity,
                    fontWeight: "bold"
                  }}>
                    THAN
                  </span>
                </span>
                motorcycles.
              </div>
            }
          />
        </div>

      </AbsoluteFill>

      {/* Subtitles */}
      <Subtitle
        text="Listen and choose."
        startFrame={0}
        durationInFrames={90} // 0.0 - 3.0s
      />
      <Subtitle
        text="You ___ wear a helmet."
        startFrame={90}
        durationInFrames={120} // 3.0 - 7.0s
      />
      <Subtitle
        text="Should."
        startFrame={210}
        durationInFrames={75} // 7.0 - 9.5s
        variant="solid"
        emphasisWords={["Should"]}
      />
      <Subtitle
        text="Bicycles are safer ___ motorcycles."
        startFrame={285}
        durationInFrames={150} // 9.5 - 14.5s
      />
      <Subtitle
        text="Than."
        startFrame={435}
        durationInFrames={75} // 14.5 - 17.0s
        variant="solid"
        emphasisWords={["Than"]}
      />
      <Subtitle
        text="Pause."
        startFrame={510}
        durationInFrames={75} // 17.0 - 19.5s
      />

    </AbsoluteFill>
  );
}
