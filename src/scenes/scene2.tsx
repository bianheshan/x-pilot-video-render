import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { ListMindmapTree, Subtitle, TitleCinematicIntro } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：1
 * 场景 ID：scene_2
 * 场景目标：Define 'Should' as a modal verb.
 * 布局方式：split-screen-horizontal (Implemented as Centered Focus for Mindmap)
 * 持续时间：14.0 秒 (420 帧)
 * 
 * 组件清单：
 * - S2_Grammar_Structure: mindmap-growth -> ListMindmapTree
 */
export default function Scene2() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 提取配置颜色
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const accentColor = "#F2994A";
  
  // 背景配置
  const background = "linear-gradient(to bottom, #ffffff, #e6f7ff)";

  // 动画控制
  // 导图整体进入动画：缩放 + 淡入
  const mapOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const mapScale = interpolate(frame, [0, 45], [0.8, 1], { extrapolateRight: "clamp" });

  // 构建思维导图数据
  const mindmapData = {
    name: "Modal Verb",
    // 根节点样式
    style: { backgroundColor: primaryColor, color: "#fff", fontSize: 28 },
    children: [
      { 
        name: "Helps another verb",
        style: { borderColor: primaryColor, color: "#333" },
        children: [
          { name: "Run", style: { backgroundColor: "#eee" } },
          { name: "Eat", style: { backgroundColor: "#eee" } },
          { name: "Sleep", style: { backgroundColor: "#eee" } }
        ]
      },
      { 
        name: "SHOULD",
        style: { backgroundColor: accentColor, color: "#fff", fontWeight: "bold" },
        children: [
          { 
            name: "Good Idea",
            style: { borderColor: secondaryColor, color: secondaryColor, fontWeight: "bold" }
          }
        ]
      }
    ]
  };

  return (
    <AbsoluteFill style={{ background }}>
      
      {/* 标题区域 - 辅助理解 */}
      <Sequence from={0} durationInFrames={420}>
        <div style={{ 
          position: "absolute", 
          top: 60, 
          width: "100%", 
          textAlign: "center",
          opacity: mapOpacity 
        }}>
          <h2 style={{ 
            fontFamily: theme.fonts.heading, 
            color: theme.colors.textSecondary,
            fontSize: 32,
            margin: 0
          }}>
            Grammar Structure
          </h2>
        </div>
      </Sequence>

      {/* 核心组件：思维导图 */}
      <Sequence from={15} durationInFrames={405}>
        <AbsoluteFill style={{ 
          justifyContent: "center", 
          alignItems: "center",
          transform: `scale(${mapScale})`,
          opacity: mapOpacity
        }}>
          <div style={{ width: 1000, height: 600 }}>
            <ListMindmapTree 
              data={mindmapData} 
              lineColor={primaryColor}
              depthDistance={200} // 增加层级间距
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 字幕层 */}
      {/* 0-5s: The word should is a modal verb. */}
      <Subtitle
        text="The word should is a modal verb."
        startFrame={0}
        durationInFrames={150}
        speakerLabel="Teacher"
      />

      {/* 5-9.5s: A modal verb helps another verb. */}
      <Subtitle
        text="A modal verb helps another verb."
        startFrame={150}
        durationInFrames={135} // 4.5s * 30
      />

      {/* 9.5-14s: Should tells us what is a good idea. */}
      <Subtitle
        text="Should tells us what is a good idea."
        startFrame={285}
        durationInFrames={135} // 4.5s * 30
        emphasisWords={["good idea"]}
      />

    </AbsoluteFill>
  );
}
