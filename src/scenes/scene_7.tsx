import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  LogicComparisonSlider, 
  Subtitle, 
  TitleCinematicIntro,
  SafeArea 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景索引：6 (Scene 7)
 * 场景 ID：scene_7
 * 场景目标：Believe: Visualize the successful outcome.
 * 布局方式：Before/After Comparison
 * 持续时间：6.5 秒 (195 帧)
 * 
 * 组件清单：
 * - S7_C1: before-after-comparison (LogicComparisonSlider)
 */
export default function Scene7() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 场景配置
  const durationInFrames = 195; // 6.5s * 30fps
  
  // 颜色配置 (来自 JSON config)
  const background = "radial-gradient(circle, #FFFFFF, #E3F2FD)";
  const primaryColor = "#0077B6";
  const secondaryColor = "#90E0EF";
  
  // 动画控制
  const opacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const slideUp = interpolate(
    frame,
    [0, 30],
    [50, 0],
    { extrapolateRight: "clamp" }
  );

  // 图片资源
  const beforeImage = "http://35.232.154.66:5125/files/tools/8b56efab-19f6-4003-bcfd-067c822a5a3e.jpg?timestamp=1767338040&nonce=b1921f616287bff3e0631c7836806cfb&sign=7M72f63YvooUUlbXd9lPH9BVhf0HC3HnLJ92ZgF0LTA=";
  const afterImage = "http://35.232.154.66:5125/files/tools/2544e7aa-2f5e-4b05-8ceb-1bafeb22e863.jpg?timestamp=1767338040&nonce=df5f0b916847cdf58f9016d7f2846a76&sign=LWBkZdCjVhG0DuLVwqftPmLvYjkZUNODnK_HvbT1ufY=";

  return (
    <AbsoluteFill style={{ background }}>
      <SafeArea>
        {/* 标题区域 - 增加上下文 */}
        <Sequence from={0} durationInFrames={durationInFrames}>
          <div style={{ opacity, transform: `translateY(${slideUp}px)` }}>
            <TitleCinematicIntro
              text="Surgical Outcome"
              subtitle="Restoring Joint Space & Mobility"
              layout="contained"
              align="center"
              color="#000000"  // ← 修复：使用 color 而不是 titleStyle
              showBackdrop={false}  // ← 关闭背景光晕，避免透明效果
            />
          </div>
        </Sequence>

        {/* 核心对比组件 */}
        <Sequence from={15} durationInFrames={durationInFrames - 15}>
          <div style={{
            marginTop: 180, // 给标题留出空间
            height: 600,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: interpolate(frame, [15, 45], [0, 1])
          }}>
            <div style={{ 
              width: "80%", 
              height: "100%", 
              boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
              borderRadius: 24,
              overflow: "hidden"
            }}>
              <LogicComparisonSlider
                title="Decompression Result"
                beforeLabel="Impingement (Before)"
                afterLabel="Decompressed (After)"
                initialPosition={0.3}
                autoAnimate={true}
                handleColor={primaryColor}
                beforeContent={
                  <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <img 
                      src={beforeImage} 
                      alt="Shoulder Impingement"
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        filter: "sepia(0.2) contrast(1.1)" // 视觉微调增强对比
                      }} 
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      background: "rgba(230, 57, 70, 0.9)", // Accent color for warning
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontWeight: "bold",
                      fontSize: 14,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}>
                      ⚠️ Inflammation
                    </div>
                  </div>
                }
                afterContent={
                  <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <img 
                      src={afterImage} 
                      alt="Decompressed Shoulder"
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover" 
                      }} 
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 20,
                      right: 20,
                      background: "rgba(0, 119, 182, 0.9)", // Primary color for success
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontWeight: "bold",
                      fontSize: 14,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}>
                      ✅ Clear Space
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </Sequence>

        {/* 字幕 */}
        <Subtitle
          text="This decompression creates more space, allowing the rotator cuff to move freely without friction."
          startFrame={0}
          durationInFrames={durationInFrames}
          speakerLabel="Narrator"
          variant="solid"
          emphasisWords={["creates more space", "freely", "without friction"]}
        />
      </SafeArea>
    </AbsoluteFill>
  );
}
