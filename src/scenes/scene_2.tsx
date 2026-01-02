import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { SplitScreen, CardGlassmorphism, ListBulletPoints, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：1
 * 场景 ID：scene_2
 * 场景目标：Introduce the first major category: Task Organization.
 * 布局方式：split-screen-horizontal
 * 持续时间：12.5 秒 (375 帧)
 * 
 * 组件清单：
 * - S2_Title: info-card (CardGlassmorphism)
 * - S2_Tools_Comparison: key-value-list (ListBulletPoints)
 */
export default function Scene2() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 颜色配置
  const primaryColor = "#2563EB";
  const secondaryColor = "#3B82F6";
  
  // 动画控制
  // 1. 左侧标题入场 (0-5s -> 0-150帧): slide-in-left
  const leftSlideX = interpolate(frame, [0, 45], [-100, 0], {
    extrapolateRight: "clamp"
  });
  const leftOpacity = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp"
  });

  // 2. 右侧列表入场 (5-11s -> 150-330帧): staggered-fade-in
  // 列表整体淡入，内部项由组件自身或 Sequence 控制
  const rightOpacity = interpolate(frame, [150, 180], [0, 1], {
    extrapolateRight: "clamp"
  });
  const rightSlideY = interpolate(frame, [150, 180], [30, 0], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ 
      background: "linear-gradient(to bottom, #ffffff, #e0f2fe)"
    }}>
      <SplitScreen
        ratio={0.4}
        gap={40}
        showDivider={true}
        
        // 左侧区域：任务组织标题卡片
        left={
          <div style={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            padding: 60,
            opacity: leftOpacity,
            transform: `translateX(${leftSlideX}px)`
          }}>
            <CardGlassmorphism
              title="Task Organization"
              content="Organize, assign, and track individual work items."
              icon="clipboard-check"
              accentColor={primaryColor}
              align="center"
            />
          </div>
        }
        
        // 右侧区域：工具对比列表
        right={
          <div style={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            padding: 60,
            opacity: rightOpacity,
            transform: `translateY(${rightSlideY}px)`
          }}>
            <ListBulletPoints
              title="Top Tools Comparison"
              items={[
                { 
                  title: "Trello", 
                  description: "Visual Kanban Boards for intuitive workflow tracking", 
                  icon: "📊",
                  accentColor: "#0079BF" 
                },
                { 
                  title: "Asana", 
                  description: "Multi-View Tracking (List, Board, Timeline)", 
                  icon: "✅",
                  accentColor: "#F06A6A"
                },
                { 
                  title: "Todoist", 
                  description: "Simple To-Do Lists for personal productivity", 
                  icon: "📝",
                  accentColor: "#E44332"
                }
              ]}
              showIndex={false}
              twoColumns={false}
            />
          </div>
        }
      />

      {/* 字幕 1: 0s - 4.5s (135帧) */}
      <Sequence from={0} durationInFrames={135}>
        <Subtitle
          text="First up, Task Organization. This is about ensuring team accountability."
          startFrame={0}
          durationInFrames={135}
        />
      </Sequence>

      {/* 字幕 2: 4.5s - 12.5s (240帧) */}
      <Sequence from={135} durationInFrames={240}>
        <Subtitle
          text="Use Trello for visual Kanban workflows, Asana for complex projects needing multiple views, or Todoist for personal productivity."
          startFrame={0}
          durationInFrames={240}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
