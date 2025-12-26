import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TitleLiquidFillProps {
  text: string;
  liquidColor?: string;
  backgroundColor?: string;
  waveSpeed?: number;
}

/**
 * 液体填充字
 * 文字内部像水杯一样被彩色液体注满
 * 自动使用当前主题的颜色
 */
export const TitleLiquidFill: React.FC<TitleLiquidFillProps> = ({
  text,
  liquidColor,
  backgroundColor,
  waveSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 使用主题颜色（如果未提供自定义颜色）
  const finalLiquidColor = liquidColor || theme.colors.primary;
  const finalBackgroundColor = backgroundColor || theme.colors.background;

  // 液体填充高度（从下往上）
  const fillHeight = interpolate(frame, [0, 90], [100, 0], {
    extrapolateRight: "clamp",
  });

  // 波浪动画
  const wave1 = Math.sin((frame * waveSpeed) / 10) * 10;
  const wave2 = Math.cos((frame * waveSpeed) / 8) * 8;
  const wave3 = Math.sin((frame * waveSpeed) / 12) * 6;

  // 文字缩放动画
  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  // 气泡动画
  const bubbles = Array.from({ length: 8 }).map((_, i) => {
    const bubbleFrame = (frame + i * 10) % 120;
    const y = interpolate(bubbleFrame, [0, 120], [100, -10]);
    const x = 20 + i * 10 + Math.sin(bubbleFrame / 10) * 5;
    const opacity = interpolate(bubbleFrame, [0, 30, 90, 120], [0, 1, 1, 0]);
    const size = 5 + (i % 3) * 3;

    return { x, y, opacity, size };
  });

  const maskId = `liquid-mask-${text.replace(/\s/g, "")}`;
  const gradientId = `liquid-gradient-${text.replace(/\s/g, "")}`;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: finalBackgroundColor,
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          {/* 渐变定义 */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={finalLiquidColor} stopOpacity="1" />
            <stop offset="50%" stopColor={finalLiquidColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={finalLiquidColor} stopOpacity="0.6" />
          </linearGradient>

          {/* 文字遮罩 */}
          <mask id={maskId}>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="200"
              fontWeight="900"
              fontFamily={theme.fonts.heading}
              fill="white"
              letterSpacing="10"
            >
              {text}
            </text>
          </mask>
        </defs>

        {/* 文字轮廓 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="200"
          fontWeight="900"
          fontFamily={theme.fonts.heading}
          fill="none"
          stroke={theme.colors.surface}
          strokeWidth="3"
          letterSpacing="10"
        >
          {text}
        </text>

        {/* 液体容器（应用文字遮罩） */}
        <g mask={`url(#${maskId})`}>
          {/* 液体主体 */}
          <rect
            x="0"
            y={fillHeight + "%"}
            width="100%"
            height="100%"
            fill={`url(#${gradientId})`}
          />

          {/* 波浪层 1 */}
          <path
            d={`
              M 0 ${fillHeight + wave1}
              Q 480 ${fillHeight + wave1 - 15}, 960 ${fillHeight + wave1}
              T 1920 ${fillHeight + wave1}
              V 1080
              H 0
              Z
            `}
            fill={finalLiquidColor}
            opacity="0.6"
          />

          {/* 波浪层 2 */}
          <path
            d={`
              M 0 ${fillHeight + wave2}
              Q 480 ${fillHeight + wave2 + 10}, 960 ${fillHeight + wave2}
              T 1920 ${fillHeight + wave2}
              V 1080
              H 0
              Z
            `}
            fill={finalLiquidColor}
            opacity="0.4"
          />

          {/* 波浪层 3 */}
          <path
            d={`
              M 0 ${fillHeight + wave3}
              Q 480 ${fillHeight + wave3 - 8}, 960 ${fillHeight + wave3}
              T 1920 ${fillHeight + wave3}
              V 1080
              H 0
              Z
            `}
            fill={finalLiquidColor}
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

          {/* 高光效果 */}
          <ellipse
            cx="50%"
            cy={`${fillHeight + 20}%`}
            rx="400"
            ry="30"
            fill="white"
            opacity="0.3"
            filter="blur(20px)"
          />
        </g>

        {/* 文字高光 */}
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="200"
          fontWeight="900"
          fontFamily={theme.fonts.heading}
          fill="white"
          opacity="0.1"
          letterSpacing="10"
          filter="blur(2px)"
        >
          {text}
        </text>
      </svg>

      {/* 填充百分比显示 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 28,
          color: finalLiquidColor,
          fontFamily: theme.fonts.mono,
          fontWeight: "bold",
          textShadow: `0 0 10px ${finalLiquidColor}`,
        }}
      >
        {Math.round(100 - fillHeight)}%
      </div>
    </div>
  );
};
