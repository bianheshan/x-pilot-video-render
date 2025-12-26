import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, random } from "remotion";
import { TitleGradient } from "../components/narrative-typography/TitleGradient";
import { IndGearMechanism } from "../components/3d-industrial/IndGearMechanism";
import { useTheme } from "../contexts/ThemeContext";

/**
 * 场景说明：引入主题 - 建立从文本到数学的认知框架
 * 知识点：大语言模型(LLM)的本质不是黑魔法，而是概率统计与数学计算的复杂结构
 * 持续时间：270 帧 (9 秒)
 * * 视觉隐喻：
 * 1. 背景：漂浮的二进制代码，象征原始数据环境
 * 2. 黑盒(Black Box)：象征大众对AI的神秘印象
 * 3. 齿轮(Gears)：黑盒展开后露出的内部结构，象征严密的数学逻辑
 */
export default function Scene1Intro() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const fps = 30;
  
  // ==============================
  // 1. 动画控制器
  // ==============================
  
  // 标题进入动画 (弹簧效果 + 故障风模拟)
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  // 故障效果强度 (0-60帧内随机抖动)
  const glitchIntensity = interpolate(frame, [0, 45, 60], [10, 5, 0], {
    extrapolateRight: "clamp"
  });
  
  const glitchX = random(frame) * glitchIntensity * (frame % 2 === 0 ? 1 : -1);
  const glitchY = random(frame + 1) * glitchIntensity * (frame % 2 === 0 ? -1 : 1);

  // 黑盒展开动画 (2秒开始，持续2秒)
  // 模拟从黑盒外部"看进去"的过程：盒子放大并透明度降低，露出内部
  const boxRevealProgress = interpolate(frame, [60, 120], [0, 1], {
    extrapolateRight: "clamp"
  });
  
  const boxScale = interpolate(boxRevealProgress, [0, 1], [1, 3]);
  const boxOpacity = interpolate(boxRevealProgress, [0, 0.5, 1], [1, 0.8, 0]);
  
  // 内部齿轮显现动画
  const gearOpacity = interpolate(frame, [90, 150], [0, 1], {
    extrapolateRight: "clamp"
  });

  // ==============================
  // 2. 背景生成 (二进制粒子)
  // ==============================
  
  // 使用 useMemo 生成固定的随机粒子位置，避免每帧重算导致抖动
  const binaryParticles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      char: Math.random() > 0.5 ? "0" : "1",
      x: random(i) * 100, // 0-100%
      y: random(i + 100) * 100, // 0-100%
      scale: 0.5 + random(i + 200) * 1,
      opacity: 0.2 + random(i + 300) * 0.3,
      speed: 0.2 + random(i + 400) * 0.5,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: theme.colors.backgroundBase || "#0f172a",
      overflow: "hidden" 
    }}>
      {/* * 层级 1: 背景层 - 漂浮的二进制代码
       * 视觉效果：营造深邃的数字空间感
       */}
      <AbsoluteFill>
        {binaryParticles.map((p, i) => {
          // 粒子向上漂浮动画
          const floatY = (p.y - (frame * p.speed)) % 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${floatY < 0 ? floatY + 100 : floatY}%`,
                fontSize: 24,
                fontFamily: "monospace",
                color: theme.colors.primary,
                opacity: p.opacity,
                transform: `scale(${p.scale})`,
                textShadow: `0 0 5px ${theme.colors.primary}`,
              }}
            >
              {p.char}
            </div>
          );
        })}
        
        {/* 径向渐变遮罩，让中心更亮 */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, transparent 0%, ${theme.colors.backgroundBase || "#0f172a"} 90%)`
        }} />
      </AbsoluteFill>

      {/* * 层级 2: 核心视觉隐喻
       * 包含：外部的"黑盒" 和 内部的"齿轮"
       */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        
        {/* 内部：复杂的齿轮结构 (代表数学/统计) */}
        <div style={{ 
          opacity: gearOpacity,
          transform: `scale(1.2)`, // 稍微放大以占据视觉中心
          zIndex: 1 
        }}>
          {/* 使用现有的工业组件模拟复杂的内部机制 */}
          <IndGearMechanism 
            gears={[
              { id: "g1", teeth: 12, x: 0, y: 0, radius: 60, color: theme.colors.primary },
              { id: "g2", teeth: 24, x: 100, y: 60, radius: 100, color: theme.colors.secondary },
              { id: "g3", teeth: 8, x: -80, y: 80, radius: 40, color: theme.colors.accent },
              { id: "g4", teeth: 16, x: -60, y: -90, radius: 70, color: theme.colors.textSecondary }
            ]}
            connections={[
              { from: "g1", to: "g2" },
              { from: "g1", to: "g3" },
              { from: "g1", to: "g4" }
            ]}
            speed={0.5} // 缓慢转动，体现精密感
          />
          {/* 补充说明文字，随齿轮出现 */}
          <div style={{
            marginTop: 200,
            textAlign: "center",
            fontFamily: "monospace",
            color: theme.colors.primary,
            fontSize: 14,
            opacity: 0.8
          }}>
            [PROBABILITY & STATISTICS ENGINE]
          </div>
        </div>

        {/* 外部：黑盒 (Black Box) */}
        {/* 随着 boxRevealProgress 增加，盒子放大并消失，仿佛镜头穿过了外壳 */}
        <div style={{
          position: "absolute",
          width: 300,
          height: 300,
          backgroundColor: "#000",
          border: `2px solid ${theme.colors.primary}`,
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 0 50px ${theme.colors.primary}40`, // 柔和光晕
          opacity: boxOpacity,
          transform: `scale(${boxScale})`,
          zIndex: 2,
        }}>
          {/* 黑盒表面的流光效果 */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(45deg, transparent 40%, ${theme.colors.primary}20 50%, transparent 60%)`,
            backgroundSize: "200% 200%",
            animation: "shine 3s infinite linear",
            borderRadius: 18,
          }} />
          
          <h2 style={{
            color: theme.colors.text,
            fontSize: 24,
            letterSpacing: 4,
            fontFamily: "sans-serif",
            fontWeight: "lighter"
          }}>
            BLACK BOX
          </h2>
        </div>
      </AbsoluteFill>

      {/* * 层级 3: 标题层
       * 位于最上层，带有故障(Glitch)效果
       */}
      <div style={{
        position: "absolute",
        top: 100,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        transform: `translate(${glitchX}px, ${glitchY}px)`, // 故障抖动
      }}>
        <div style={{ transform: `scale(${titleEntrance})` }}>
          <TitleGradient 
            text="LLM: 不是魔法，是数学"
            subtitle="THE MATHEMATICS BEHIND THE MAGIC"
            align="center"
          />
        </div>
      </div>

      {/* * 层级 4: 字幕层
       * 根据时间轴显示字幕
       */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "16px 32px",
          borderRadius: 8,
          border: `1px solid ${theme.colors.textSecondary}40`,
          backdropFilter: "blur(4px)"
        }}>
          <p style={{
            margin: 0,
            color: theme.colors.text,
            fontSize: 24,
            fontFamily: theme.fonts?.body || "sans-serif",
            fontWeight: 500
          }}>
            当我们谈论大模型时，我们究竟在谈论什么？是魔法吗？不，是概率与统计的极致堆叠。
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}