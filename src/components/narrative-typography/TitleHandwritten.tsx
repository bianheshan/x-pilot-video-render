import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TitleHandwrittenProps {
  text: string;
  color?: string;
  strokeWidth?: number;
  speed?: number;
}

/**
 * 手写笔迹标题
 * 模拟真实笔迹书写过程，适合教育和故事讲述
 */
export const TitleHandwritten: React.FC<TitleHandwrittenProps> = ({
  text,
  color,
  strokeWidth = 4,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const textColor = color || theme.colors.text;

  // 书写进度（0-100%）
  const writingProgress = interpolate(
    frame,
    [0, 90 / speed],
    [0, 100],
    {
      extrapolateRight: "clamp",
    }
  );

  // 笔尖位置动画
  const penX = interpolate(
    frame,
    [0, 90 / speed],
    [0, 100],
    {
      extrapolateRight: "clamp",
    }
  );

  // 纸张进入动画
  const paperScale = interpolate(frame, [0, 20], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  const paperOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 笔尖闪烁（书写时）
  const penOpacity = writingProgress < 100 ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        overflow: "hidden",
      }}
    >
      {/* 纸张纹理背景 */}
      <div
        style={{
          position: "absolute",
          width: "90%",
          height: "80%",
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
          boxShadow: `0 20px 60px ${theme.colors.shadow}`,
          transform: `scale(${paperScale})`,
          opacity: paperOpacity,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(200,200,200,0.3) 39px,
              rgba(200,200,200,0.3) 40px
            )
          `,
        }}
      />

      {/* SVG 手写文字 */}
      <svg
        width="80%"
        height="60%"
        viewBox="0 0 1200 400"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <defs>
          {/* 笔触滤镜（模拟墨水扩散） */}
          <filter id="ink-diffusion">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* 手写文字路径 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="160"
          fontWeight="400"
          fontFamily={theme.fonts.heading}
          fill="none"
          stroke={textColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2000"
          strokeDashoffset={2000 - (writingProgress / 100) * 2000}
          filter="url(#ink-diffusion)"
        >
          {text}
        </text>

        {/* 文字阴影（已写完的部分） */}
        <text
          x="50%"
          y="50.5%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="160"
          fontWeight="400"
          fontFamily={theme.fonts.heading}
          fill="none"
          stroke={textColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2000"
          strokeDashoffset={2000 - (writingProgress / 100) * 2000}
          opacity="0.2"
          filter="blur(3px)"
        >
          {text}
        </text>

        {/* 笔尖 */}
        {writingProgress < 100 && (
          <g opacity={penOpacity}>
            {/* 笔尖圆点 */}
            <circle
              cx={`${penX}%`}
              cy="50%"
              r={6 + 2 * (0.5 + 0.5 * Math.sin(frame * 0.35))}
              fill={textColor}
              opacity="0.8"
            />

            {/* 笔尖光晕 */}
            <circle
              cx={`${penX}%`}
              cy="50%"
              r={12 + 4 * (0.5 + 0.5 * Math.sin(frame * 0.35))}
              fill={color}
              opacity="0.2"
            />
          </g>
        )}
      </svg>

      {/* 书写音效提示 */}
      {writingProgress < 100 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 18,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.mono,
            opacity: 0.6,
          }}
        >
          ✍️ Writing...
        </div>
      )}

      {/* 完成提示 */}
      {writingProgress >= 100 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 18,
            color: theme.colors.success,
            fontFamily: theme.fonts.mono,
            opacity: interpolate(frame, [90 / speed, 100 / speed], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          ✓ Complete
        </div>
      )}

      {/* 纸张边缘阴影 */}
      <div
        style={{
          position: "absolute",
          width: "90%",
          height: "80%",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.05)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
