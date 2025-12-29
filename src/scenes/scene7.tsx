import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Sequence, useVideoConfig } from "remotion";
import { Subtitle, CardNeumorphism, TitleCinematicIntro } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：6 (Scene 7)
 * 场景 ID：scene_7
 * 场景目标：Specific advice for Bicycles.
 * 布局方式：main-content.left-aligned (Implemented as centered focus for the image)
 * 持续时间：12.5 秒 (375 帧)
 * 
 * 组件清单：
 * - S7_Bike_Image: Annotated Image (Custom implementation using Img + Overlay Cards)
 * 
 * 时间轴事件：
 * - 0.0s - 12.5s: Show bicycle specific advice with annotations.
 * 
 * 字幕：
 * - 0.0s - 4.5s: Bicycles are safer than motorcycles.
 * - 4.5s - 8.5s: You should ride slowly.
 * - 8.5s - 12.5s: You should watch the road.
 */
export default function Scene7() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 颜色配置
  const primaryColor = "#2D9CDB";
  const secondaryColor = "#27AE60";
  const accentColor = "#F2994A";
  const backgroundColor = "#FFFFFF"; // JSON specified white

  // 动画控制
  // 1. 图像入场 - 缩放进入
  const imageScale = interpolate(frame, [0, 60], [0.9, 1], {
    extrapolateRight: "clamp",
  });
  const imageOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 2. 标注点动画
  // 标注 1: "Ride Slowly" - 对应字幕 2 (4.5s = 135帧)
  const annotation1Start = 135;
  const annotation1Opacity = interpolate(
    frame,
    [annotation1Start, annotation1Start + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const annotation1Y = interpolate(
    frame,
    [annotation1Start, annotation1Start + 20],
    [20, 0], // 向下浮动到位
    { extrapolateRight: "clamp" }
  );

  // 标注 2: "Watch Road" - 对应字幕 3 (8.5s = 255帧)
  const annotation2Start = 255;
  const annotation2Opacity = interpolate(
    frame,
    [annotation2Start, annotation2Start + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const annotation2Y = interpolate(
    frame,
    [annotation2Start, annotation2Start + 20],
    [20, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: backgroundColor }}>
      {/* 标题区域 - 即使 JSON 没明确要求，添加标题有助于上下文理解 */}
      <Sequence from={0} durationInFrames={375}>
        <div style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}>
           <TitleCinematicIntro 
             text="Bicycle Safety"
             subtitle="Advice for Cyclists"
             layout="contained"
           />
        </div>
      </Sequence>

      {/* 核心内容：带标注的图片 */}
      <Sequence from={0} durationInFrames={375}>
        <AbsoluteFill style={{ 
          justifyContent: "center", 
          alignItems: "center",
          marginTop: 60 // 给标题留出空间
        }}>
          <div style={{
            position: "relative",
            width: 800,
            height: 600,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${imageScale})`,
            opacity: imageOpacity,
          }}>
            {/* 主图片 */}
            <Img 
              src="http://35.232.154.66:5125/files/tools/b0ab61a2-82a2-4776-b359-1bbfe832bfb2.jpg?timestamp=1766976633&nonce=b5a7358f860a6daae8c8f98b5b10919e&sign=nCi5rkGFvWBFxZwBkRS4vZuMjv4ttLvobTX51P1ee0k="
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: 24,
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                objectFit: "cover"
              }}
            />

            {/* 标注 1: Ride Slowly (y: 0.8 -> 底部) */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: "80%",
              transform: `translate(-50%, -50%) translateY(${annotation1Y}px)`,
              opacity: annotation1Opacity,
              zIndex: 20
            }}>
              <CardNeumorphism 
                title="Ride Slowly"
                content=""
                icon="🚲"
                accentColor={secondaryColor}
                variant="raised"
                cardStyle={{ 
                  padding: "15px 30px", 
                  minWidth: 200,
                  backgroundColor: "rgba(255,255,255,0.95)"
                }}
              />
              {/* 连接线示意 */}
              <div style={{
                position: "absolute",
                top: -40,
                left: "50%",
                width: 2,
                height: 40,
                background: secondaryColor,
                opacity: 0.6
              }} />
              <div style={{
                position: "absolute",
                top: -44,
                left: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: secondaryColor,
                transform: "translateX(-4px)"
              }} />
            </div>

            {/* 标注 2: Watch Road (y: 0.2 -> 顶部) */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: "20%",
              transform: `translate(-50%, -50%) translateY(${annotation2Y}px)`,
              opacity: annotation2Opacity,
              zIndex: 20
            }}>
              <CardNeumorphism 
                title="Watch Road"
                content=""
                icon="👀"
                accentColor={primaryColor}
                variant="raised"
                cardStyle={{ 
                  padding: "15px 30px", 
                  minWidth: 200,
                  backgroundColor: "rgba(255,255,255,0.95)"
                }}
              />
               {/* 连接线示意 */}
               <div style={{
                position: "absolute",
                bottom: -40,
                left: "50%",
                width: 2,
                height: 40,
                background: primaryColor,
                opacity: 0.6
              }} />
              <div style={{
                position: "absolute",
                bottom: -44,
                left: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: primaryColor,
                transform: "translateX(-4px)"
              }} />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 字幕区域 */}
      <Sequence from={0} durationInFrames={135}>
        <Subtitle 
          text="Bicycles are safer than motorcycles."
          startFrame={0}
          durationInFrames={135}
        />
      </Sequence>
      
      <Sequence from={135} durationInFrames={120}>
        <Subtitle 
          text="You should ride slowly."
          startFrame={0}
          durationInFrames={120}
          emphasisWords={["should", "ride", "slowly"]}
        />
      </Sequence>

      <Sequence from={255} durationInFrames={120}>
        <Subtitle 
          text="You should watch the road."
          startFrame={0}
          durationInFrames={120}
          emphasisWords={["should", "watch"]}
        />
      </Sequence>
    </AbsoluteFill>
  );
}
