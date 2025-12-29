import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface StatLiquidBubbleProps {
  percentage: number;
  label: string;
  size?: number;
  liquidColor?: string;
  duration?: number;
}

/**
 * 注水球
 * 一个球体内水位上升，且水面有波浪起伏
 */
export const StatLiquidBubble: React.FC<StatLiquidBubbleProps> = ({
  percentage,
  label,
  size = 400,
  liquidColor,
  duration = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const bubbleColor = liquidColor || theme.colors.primary;

  // 水位上升动画
  const currentLevel = interpolate(
    frame,
    [0, duration],
    [100, 100 - percentage],
    {
      extrapolateRight: "clamp",
      easing: (t) => {
        // 缓动函数
        return 1 - Math.pow(1 - t, 3);
      },
    }
  );

  // 波浪动画
  const wave1 = Math.sin(frame / 10) * 8;
  const wave2 = Math.cos(frame / 8) * 6;
  const wave3 = Math.sin(frame / 12) * 4;

  // 容器进入动画
  const containerScale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const containerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 气泡动画
  const bubbles = Array.from({ length: 12 }).map((_, i) => {
    const bubbleFrame = (frame + i * 15) % 150;
    const y = interpolate(bubbleFrame, [0, 150], [currentLevel, -10]);
    const x = 30 + (i % 4) * 15 + Math.sin(bubbleFrame / 10) * 5;
    const opacity = interpolate(bubbleFrame, [0, 30, 120, 150], [0, 0.8, 0.8, 0]);
    const size = 4 + (i % 3) * 2;

    return { x, y, opacity, size };
  });

  // 数字显示
  const displayValue = Math.floor(100 - currentLevel);

  // 发光效果
  const glowIntensity = 0.6 + Math.sin(frame / 15) * 0.4;

  const maskId = `liquid-mask-${label.replace(/\s/g, "")}`;
  const gradientId = `liquid-gradient-${label.replace(/\s/g, "")}`;

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
        background: theme.colors.background,
        overflow: "hidden",
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 50% 60%, ${bubbleColor}22 0%, transparent 70%)`,
          opacity: glowIntensity,
        }}
      />

      {/* 主容器 */}
      <div
        style={{
          transform: `scale(${containerScale})`,
          opacity: containerOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* SVG 球体 */}
        <div style={{ position: "relative" }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              {/* 液体渐变 */}
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={bubbleColor} stopOpacity="1" />
                <stop offset="50%" stopColor={bubbleColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={bubbleColor} stopOpacity="0.6" />
              </linearGradient>

              {/* 圆形遮罩 */}
              <clipPath id={maskId}>
                <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} />
              </clipPath>

              {/* 高光滤镜 */}
              <filter id="shine">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 球体外框 */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke={theme.colors.surfaceLight}
              strokeWidth="3"
            />

            {/* 液体容器 */}
            <g clipPath={`url(#${maskId})`}>
              {/* 液体主体 */}
              <rect
                x="0"
                y={`${currentLevel}%`}
                width={size}
                height={size}
                fill={`url(#${gradientId})`}
              />

              {/* 波浪层 1 */}
              <path
                d={`
                  M 0 ${(currentLevel * size) / 100 + wave1}
                  Q ${size / 4} ${(currentLevel * size) / 100 + wave1 - 10}, ${size / 2} ${(currentLevel * size) / 100 + wave1}
                  T ${size} ${(currentLevel * size) / 100 + wave1}
                  V ${size}
                  H 0
                  Z
                `}
                fill={bubbleColor}
                opacity="0.6"
              />

              {/* 波浪层 2 */}
              <path
                d={`
                  M 0 ${(currentLevel * size) / 100 + wave2}
                  Q ${size / 4} ${(currentLevel * size) / 100 + wave2 + 8}, ${size / 2} ${(currentLevel * size) / 100 + wave2}
                  T ${size} ${(currentLevel * size) / 100 + wave2}
                  V ${size}
                  H 0
                  Z
                `}
                fill={bubbleColor}
                opacity="0.4"
              />

              {/* 波浪层 3 */}
              <path
                d={`
                  M 0 ${(currentLevel * size) / 100 + wave3}
                  Q ${size / 4} ${(currentLevel * size) / 100 + wave3 - 6}, ${size / 2} ${(currentLevel * size) / 100 + wave3}
                  T ${size} ${(currentLevel * size) / 100 + wave3}
                  V ${size}
                  H 0
                  Z
                `}
                fill={bubbleColor}
                opacity="0.3"
              />

              {/* 气泡 */}
              {bubbles.map((bubble, i) => (
                <circle
                  key={i}
                  cx={`${bubble.x}%`}
                  cy={`${bubble.y}%`}
                  r={bubble.size}
                  fill="white"
                  opacity={bubble.opacity * 0.6}
                />
              ))}
            </g>

            {/* 球体高光 */}
            <ellipse
              cx={size / 2 - 60}
              cy={size / 2 - 80}
              rx="80"
              ry="60"
              fill="white"
              opacity="0.3"
              filter="url(#shine)"
            />

            {/* 球体边缘高光 */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.4"
              strokeDasharray="10 20"
            />

            {/* 外发光 */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 5}
              fill="none"
              stroke={bubbleColor}
              strokeWidth="4"
              opacity={glowIntensity * 0.5}
              filter="url(#shine)"
            />
          </svg>

          {/* 中心百分比 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 100,
              fontWeight: "bold",
              color: currentLevel < 50 ? bubbleColor : theme.colors.text,
              fontFamily: theme.fonts.mono,
              textShadow:
                currentLevel < 50
                  ? `0 0 30px ${bubbleColor}`
                  : `0 2px 10px ${theme.colors.shadow}`,
              mixBlendMode: currentLevel < 50 ? "normal" : "difference",
              zIndex: 10,
            }}
          >
            {displayValue}
            <span style={{ fontSize: 50 }}>%</span>
          </div>
        </div>

        {/* 标签 */}
        <h3
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0,
            fontFamily: theme.fonts.body,
            textTransform: "uppercase",
            letterSpacing: 3,
            textShadow: `0 0 20px ${bubbleColor}66`,
          }}
        >
          {label}
        </h3>

        {/* 水位指示器 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 20,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.mono,
          }}
        >
          <div
            style={{
              width: 200,
              height: 30,
              background: theme.colors.surface,
              borderRadius: 15,
              overflow: "hidden",
              border: `2px solid ${bubbleColor}44`,
            }}
          >
            <div
              style={{
                width: `${displayValue}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${bubbleColor}, ${bubbleColor}cc)`,
                boxShadow: `0 0 10px ${bubbleColor}`,
              }}
            />
          </div>
          <span style={{ color: bubbleColor, fontWeight: "bold" }}>
            {displayValue}% FILLED
          </span>
        </div>
      </div>

      {/* 装饰水滴 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const dropFrame = (frame + i * 20) % 100;
        const dropY = interpolate(dropFrame, [0, 100], [-10, 110]);
        const dropX = 20 + i * 10;
        const dropOpacity = interpolate(dropFrame, [0, 20, 80, 100], [0, 1, 1, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dropX}%`,
              top: `${dropY}%`,
              width: 8,
              height: 12,
              background: bubbleColor,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(45deg)",
              opacity: dropOpacity * 0.6,
              boxShadow: `0 0 10px ${bubbleColor}`,
            }}
          />
        );
      })}

      {/* 完成提示 */}
      {displayValue >= percentage && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 20,
            color: bubbleColor,
            fontFamily: theme.fonts.mono,
            opacity: interpolate(frame, [duration, duration + 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 10px ${bubbleColor}`,
          }}
        >
          ✓ LIQUID FILLED
        </div>
      )}
    </div>
  );
};
