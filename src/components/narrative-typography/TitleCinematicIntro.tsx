import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TitleCinematicIntroProps {
  text: string;
  subtitle?: string;
  color?: string;
  glowColor?: string;
}

/**
 * 电影级开场标题
 * 极具冲击力的大标题，带光扫、模糊和 3D 挤压效果
 * 自动使用当前主题的颜色
 */
export const TitleCinematicIntro: React.FC<TitleCinematicIntroProps> = ({
  text,
  subtitle,
  color,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // 使用主题颜色（如果未提供自定义颜色）
  const finalColor = color || theme.colors.text;
  const finalGlowColor = glowColor || theme.colors.primary;

  // 弹性进入动画
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 20,
      mass: 0.5,
    },
  });

  // 光扫效果位置
  const lightSweep = interpolate(frame, [0, 60], [-200, 200], {
    extrapolateRight: "clamp",
  });

  // 模糊效果（从模糊到清晰）
  const blur = interpolate(frame, [0, 30], [20, 0], {
    extrapolateRight: "clamp",
  });

  // 字母间距动画
  const letterSpacing = interpolate(frame, [0, 40], [30, 0], {
    extrapolateRight: "clamp",
  });

  // 副标题延迟进入
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 50% 50%, ${finalGlowColor}22 0%, transparent 70%)`,
          opacity: 0.6,
        }}
      />

      {/* 主标题 */}
      <div
        style={{
          position: "relative",
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: finalColor,
            margin: 0,
            letterSpacing: `${letterSpacing}px`,
            textTransform: "uppercase",
            fontFamily: theme.fonts.heading,
            textShadow: `
              0 0 20px ${finalGlowColor}88,
              0 0 40px ${finalGlowColor}66,
              0 0 60px ${finalGlowColor}44,
              0 10px 30px rgba(0,0,0,0.8)
            `,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {text}
          
          {/* 光扫效果 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: lightSweep,
              width: 100,
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${finalGlowColor}aa, transparent)`,
              transform: "skewX(-20deg)",
              filter: "blur(10px)",
            }}
          />
        </h1>

        {/* 3D 挤压效果（文字阴影层） */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            fontSize: 120,
            fontWeight: 900,
            color: finalGlowColor,
            margin: 0,
            letterSpacing: `${letterSpacing}px`,
            textTransform: "uppercase",
            fontFamily: theme.fonts.heading,
            opacity: 0.3,
            transform: "translateZ(-50px) translateY(5px)",
            filter: "blur(2px)",
            zIndex: -1,
          }}
        >
          {text}
        </div>
      </div>

      {/* 副标题 */}
      {subtitle && (
        <p
          style={{
            fontSize: 32,
            color: theme.colors.textSecondary,
            marginTop: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            fontWeight: 300,
            opacity: subtitleOpacity,
            textShadow: `0 0 10px ${finalGlowColor}44`,
            fontFamily: theme.fonts.body,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* 底部装饰线 */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: interpolate(frame, [20, 60], [0, 600], {
            extrapolateRight: "clamp",
          }),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${finalGlowColor}, transparent)`,
          boxShadow: `0 0 10px ${finalGlowColor}`,
        }}
      />
    </div>
  );
};
