import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface CardGlassmorphismProps {
  title: string;
  content: string;
  icon?: string;
  accentColor?: string;
}

/**
 * 毛玻璃卡片
 * 高级模糊背景，边缘高光，极简现代风格
 * 自动使用当前主题的颜色
 */
export const CardGlassmorphism: React.FC<CardGlassmorphismProps> = ({
  title,
  content,
  icon = "✨",
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 使用主题颜色（如果未提供自定义颜色）
  const finalAccentColor = accentColor || theme.colors.primary;

  // 卡片进入动画
  const cardY = interpolate(frame, [0, 40], [100, 0], {
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardScale = interpolate(frame, [0, 40], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  // 背景光效移动
  const lightX = interpolate(frame, [0, 200], [0, 100], {
    extrapolateRight: "extend",
  });

  const lightY = 50 + Math.sin(frame / 30) * 20;

  // 边缘光晕动画
  const glowIntensity = 0.5 + Math.sin(frame / 20) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* 动态背景光效 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
        }}
      />

      {/* 背景装饰圆 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: -200,
          right: -200,
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          bottom: -100,
          left: -100,
          filter: "blur(60px)",
        }}
      />

      {/* 毛玻璃卡片 */}
      <div
        style={{
          position: "relative",
          width: 700,
          padding: 60,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRadius: 30,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            0 0 40px ${finalAccentColor}${Math.round(glowIntensity * 0.3 * 255).toString(16).padStart(2, '0')}
          `,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        {/* 顶部高光 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            width: "80%",
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            borderRadius: "50%",
            filter: "blur(2px)",
          }}
        />

        {/* 图标 */}
        <div
          style={{
            fontSize: 60,
            marginBottom: 20,
            textAlign: "center",
            filter: `drop-shadow(0 0 20px ${finalAccentColor})`,
          }}
        >
          {icon}
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: theme.colors.text,
            margin: "0 0 30px 0",
            textAlign: "center",
            fontFamily: theme.fonts.heading,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            letterSpacing: 1,
          }}
        >
          {title}
        </h2>

        {/* 分隔线 */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${finalAccentColor}, transparent)`,
            marginBottom: 30,
            boxShadow: `0 0 10px ${finalAccentColor}`,
          }}
        />

        {/* 内容 */}
        <p
          style={{
            fontSize: 24,
            lineHeight: 1.8,
            color: theme.colors.textSecondary,
            margin: 0,
            textAlign: "center",
            fontFamily: theme.fonts.body,
            textShadow: "0 1px 5px rgba(0,0,0,0.2)",
          }}
        >
          {content}
        </p>

        {/* 底部装饰点 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 40,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: finalAccentColor,
                opacity: 0.6 + Math.sin(frame / 15 + i) * 0.4,
                boxShadow: `0 0 10px ${finalAccentColor}`,
              }}
            />
          ))}
        </div>

        {/* 边缘光晕效果 */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 30,
            background: `linear-gradient(135deg, ${finalAccentColor}44, transparent, ${finalAccentColor}44)`,
            opacity: glowIntensity,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>

      {/* 浮动粒子 */}
      {Array.from({ length: 15 }).map((_, i) => {
        const particleY = interpolate(
          (frame + i * 10) % 200,
          [0, 200],
          [100, -10]
        );
        const particleX = 10 + i * 6 + Math.sin(frame / 20 + i) * 3;
        const particleOpacity = interpolate(
          (frame + i * 10) % 200,
          [0, 50, 150, 200],
          [0, 0.6, 0.6, 0]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${particleX}%`,
              top: `${particleY}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "white",
              opacity: particleOpacity,
              boxShadow: "0 0 10px rgba(255,255,255,0.8)",
            }}
          />
        );
      })}
    </div>
  );
};
