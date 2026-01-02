import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  IndTerrainMap, 
  CardGlassmorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：3
 * 场景 ID：scene_4
 * 场景目标：Know: See the pathology from the surgeon's perspective.
 * 布局方式：中心聚焦 (Simulated Arthroscopic View)
 * 持续时间：5.5 秒 (165 帧)
 * 
 * 组件清单：
 * - S4_C1: 模拟关节镜视野 (使用 IndTerrainMap 模拟组织表面)
 * - S4_C2: 信息卡片 (CardGlassmorphism)
 * 
 * 视觉策略：
 * 使用圆形遮罩 + 黑色背景模拟内窥镜/关节镜的视野。
 * 使用 IndTerrainMap 模拟红肿的滑囊组织表面。
 */
export default function Scene4() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 场景配置
  const durationInFrames = 165; // 5.5s * 30fps
  
  // 颜色配置 (覆盖默认主题以适应医学内窥镜风格)
  const inflamedColor = "#FF4444"; // 发炎组织的红色
  const tissueColor = "#FFB6C1";   // 正常组织的粉色
  
  // 动画 1: 关节镜视野 "光圈打开" (Iris Open)
  // 通过 clipPath 实现圆形展开效果
  const irisRadius = interpolate(
    frame,
    [0, 45],
    [0, 50], // 0% -> 50% (半径)
    { extrapolateRight: "clamp" }
  );
  
  // 动画 2: 镜头推进 (Dolly In)
  // 放大内部的组织贴图，模拟摄像头向前移动
  const cameraZoom = interpolate(
    frame,
    [0, 165],
    [1, 1.4],
    { extrapolateRight: "clamp" }
  );

  // 动画 3: 卡片入场
  const cardOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });
  const cardY = interpolate(frame, [30, 60], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      
      {/* 1. 关节镜视野模拟区域 */}
      <AbsoluteFill style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
      }}>
        {/* 镜头容器 */}
        <div style={{
          width: 900,
          height: 900,
          position: "relative",
          // 使用 clipPath 模拟圆形的关节镜视野
          clipPath: `circle(${irisRadius}% at center)`,
          backgroundColor: "#1a0505", // 深红色背景底色
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)", // 内部暗角 (Vignette)
          borderRadius: "50%", // 确保容器本身也是圆的
          overflow: "hidden"
        }}>
          
          {/* 内部组织模拟 - 使用 IndTerrainMap 模拟凹凸不平的滑囊表面 */}
          <div style={{
            width: "100%",
            height: "100%",
            transform: `scale(${cameraZoom})`,
            transformOrigin: "center center"
          }}>
            <IndTerrainMap 
              heightData={[
                [10, 15, 20, 25, 20, 15, 10],
                [15, 25, 35, 40, 35, 25, 15],
                [20, 35, 50, 60, 50, 35, 20], // 中间隆起，模拟肿胀
                [25, 40, 60, 70, 60, 40, 25],
                [20, 35, 50, 60, 50, 35, 20],
                [15, 25, 35, 40, 35, 25, 15],
                [10, 15, 20, 25, 20, 15, 10]
              ]}
              showContours={true}
              colorScheme="heatmap" // 热力图配色正好符合"发炎"的视觉隐喻 (红/黄)
            />
          </div>

          {/* 叠加层：模拟湿润反光和组织质感 */}
          <AbsoluteFill style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 40%)",
            mixBlendMode: "overlay",
            pointerEvents: "none"
          }} />
          
          {/* 叠加层：严重的暗角效果 (Vignette) */}
          <AbsoluteFill style={{
            background: "radial-gradient(circle, transparent 50%, #000000 100%)",
            pointerEvents: "none"
          }} />
          
          {/* 叠加层：模拟发炎的红色脉动 */}
          <AbsoluteFill style={{
            background: `radial-gradient(circle, ${inflamedColor}22, transparent)`,
            opacity: interpolate(frame % 60, [0, 30, 60], [0.3, 0.6, 0.3]),
            mixBlendMode: "color-dodge"
          }} />
          
          {/* 准星/刻度 (增加医学仪器的感觉) */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "50%",
            opacity: 0.5
          }} />
        </div>
      </AbsoluteFill>

      {/* 2. 信息卡片 - 位于底部 */}
      <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`
        }}>
          <div style={{ pointerEvents: "auto" }}>
            <CardGlassmorphism
              title="Arthroscopic View"
              content="Inflamed Subacromial Bursa Visualization"
              icon="👁️"
              accentColor={theme.colors.accent} // 使用配置中的红色 #E63946
              variant="pressed"
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* 3. 字幕 */}
      <Subtitle
        text="An arthroscope is introduced, revealing the inflamed subacromial bursa causing the pain."
        startFrame={0}
        durationInFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
}
