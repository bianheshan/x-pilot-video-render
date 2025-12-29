import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  CardGlassmorphism, 
  ListStaggeredEntry, 
  Subtitle, 
  TitleCinematicIntro,
  SplitScreen
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：2
 * 场景 ID：scene_3
 * 场景目标：Explain the form/rule: Should + Base Verb.
 * 布局方式：split-screen / main-content.center (implemented as split view)
 * 持续时间：16.0 秒 (480 帧)
 * 
 * 组件清单：
 * - S3_Rule_Block: key-value-list (Rule: Should + Base Verb, No -ing, No -s)
 * - S3_Examples: bullet-points (Correct Examples)
 * 
 * 时间轴事件：
 * - 0-16s: Show rules first, then examples.
 */
export default function Scene3() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 颜色配置
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const errorColor = "#E74C3C";
  
  // 动画控制
  // 左侧规则块进入动画 (Slide In Left)
  const leftEntrance = interpolate(frame, [0, 20], [-50, 0], {
    extrapolateRight: "clamp"
  });
  const leftOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp"
  });

  // 右侧示例块进入动画 (Fade In Staggered) - 配合字幕在 9.5s (285帧) 左右开始
  const rightStartFrame = 285;
  const rightEntrance = interpolate(frame, [rightStartFrame, rightStartFrame + 20], [50, 0], {
    extrapolateRight: "clamp"
  });
  const rightOpacity = interpolate(frame, [rightStartFrame, rightStartFrame + 20], [0, 1], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 60
      }}
    >
      {/* 左侧：语法规则 */}
      <div style={{ 
        flex: 1, 
        transform: `translateX(${leftEntrance}px)`,
        opacity: leftOpacity,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <CardGlassmorphism
          title="Grammar Rule"
          icon="rules"
          accentColor={primaryColor}
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ 
                fontSize: 40, 
                fontWeight: "bold", 
                color: primaryColor,
                padding: "20px",
                background: "rgba(45, 156, 219, 0.1)",
                borderRadius: 12,
                textAlign: "center"
              }}>
                Should + Base Verb
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 10 }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 15,
                  fontSize: 32,
                  color: errorColor,
                  fontWeight: 500
                }}>
                  <span style={{ fontSize: 40 }}>❌</span> 
                  <span>No <span style={{ textDecoration: "line-through" }}>-ing</span></span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 15,
                  fontSize: 32,
                  color: errorColor,
                  fontWeight: 500
                }}>
                  <span style={{ fontSize: 40 }}>❌</span> 
                  <span>No <span style={{ textDecoration: "line-through" }}>-s</span></span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* 右侧：正确示例 - 延迟显示 */}
      <div style={{ 
        flex: 1, 
        transform: `translateX(${rightEntrance}px)`,
        opacity: rightOpacity,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <ListStaggeredEntry
          title="Correct Examples"
          items={[
            { 
              title: "Should wear", 
              description: "Correct form",
              icon: "✅",
              accentColor: secondaryColor 
            },
            { 
              title: "Should be", 
              description: "Base verb 'be'",
              icon: "✅",
              accentColor: secondaryColor 
            },
            { 
              title: "Should follow", 
              description: "Base verb 'follow'",
              icon: "✅",
              accentColor: secondaryColor 
            }
          ]}
          staggerDelay={10}
        />
      </div>

      {/* 字幕区域 */}
      <Subtitle
        text="After should, use the base verb."
        startFrame={0}
        durationInFrames={135} // 4.5s
      />
      <Subtitle
        text="Do not add -ing. Do not add -s."
        startFrame={135} // 4.5s
        durationInFrames={150} // 5.0s
      />
      <Subtitle
        text="We say: Should wear. Should be. Should follow."
        startFrame={285} // 9.5s
        durationInFrames={195} // 6.5s
      />
    </AbsoluteFill>
  );
}
