import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img } from "remotion";
import { LogicComparisonSlider, Subtitle, TitleCard } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：4 (Scene 5)
 * 场景 ID：scene_5
 * 场景目标：Introduce context: Bicycles vs Motorcycles (Comparatives).
 * 布局方式：split-screen-vertical
 * 持续时间：16.0 秒 (480 帧)
 * 
 * 组件清单：
 * - S5_Comparison: before-after-comparison (LogicComparisonSlider)
 */
export default function Scene5() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 颜色配置
  const bgValue = "#F4F6F7"; // JSON background value
  
  // 动画控制
  // 0-16s: 整体淡入
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  
  // 图片 URL
  const bicycleImg = "http://35.232.154.66:5125/files/tools/9254df91-28a1-40a2-82fd-05c99397b520.jpg?timestamp=1766976633&nonce=cd6523843f2fca226347988b3da5e643&sign=lD9KPglKAaG5mCtAlWVzCDFKEj_qYaQH0a5xtdT43mw=";
  const motorcycleImg = "http://35.232.154.66:5125/files/tools/2b4b3c18-2077-4d48-91ef-c6ae9f7066e9.jpg?timestamp=1766976634&nonce=3daec3c6e8fc78dd4db1bbb308f2dae6&sign=n0VmjeOsdj_sbMnqWsslAboZKQSCV9KaC1PTWulreFc=";

  return (
    <AbsoluteFill style={{ backgroundColor: bgValue }}>
      
      {/* 标题区域 - 强调主题 */}
      <div style={{ 
        position: "absolute", 
        top: 40, 
        left: 0, 
        width: "100%", 
        zIndex: 10,
        opacity 
      }}>
        <TitleCard 
          title="Comparatives" 
          subtitle="Bicycles vs Motorcycles"
        />
      </div>

      {/* 核心对比组件 */}
      <div style={{ 
        position: "absolute",
        top: 180,
        left: 100,
        right: 100,
        bottom: 180,
        opacity,
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        borderRadius: 20,
        overflow: "hidden"
      }}>
        <LogicComparisonSlider 
          title="" // 标题已在外部显示
          beforeContent={
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <Img 
                src={bicycleImg} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Bicycle"
              />
              <div style={{
                position: "absolute",
                top: 20,
                left: 20,
                padding: "10px 20px",
                background: "rgba(255,255,255,0.9)",
                borderRadius: 8,
                color: theme.colors.primary,
                fontWeight: "bold",
                fontSize: 24,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                SAFER
              </div>
            </div>
          }
          afterContent={
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <Img 
                src={motorcycleImg} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Motorcycle"
              />
              <div style={{
                position: "absolute",
                top: 20,
                right: 20,
                padding: "10px 20px",
                background: "rgba(255,255,255,0.9)",
                borderRadius: 8,
                color: theme.colors.accent,
                fontWeight: "bold",
                fontSize: 24,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                FASTER
              </div>
            </div>
          }
          beforeLabel="Bicycle"
          afterLabel="Motorcycle"
          initialPosition={0.5}
          autoAnimate={true}
          handleColor={theme.colors.primary}
        />
      </div>

      {/* 字幕区域 */}
      <div style={{ position: "absolute", bottom: 50, width: "100%" }}>
        <Subtitle
          text="This lesson is about bicycles."
          startFrame={0}
          durationInFrames={120} // 0-4s
        />
        <Subtitle
          text="This lesson is about motorcycles."
          startFrame={120}
          durationInFrames={120} // 4-8s
        />
        <Subtitle
          text={<span>Bicycles are <strong style={{ color: theme.colors.primary }}>safer</strong> than motorcycles.</span>}
          startFrame={240}
          durationInFrames={120} // 8-12s
        />
        <Subtitle
          text={<span>Motorcycles are <strong style={{ color: theme.colors.accent }}>faster</strong> than bicycles.</span>}
          startFrame={360}
          durationInFrames={120} // 12-16s
        />
      </div>
    </AbsoluteFill>
  );
}
