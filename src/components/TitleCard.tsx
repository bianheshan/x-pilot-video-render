import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface TitleCardProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  durationInFrames?: number;
}

/**
 * 标题卡组件 - 用于章节开始或重要信息展示
 * 支持主标题和副标题，带有优雅的动画效果
 */
export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor = "#0f172a",
  textColor = "#ffffff",
  durationInFrames = 90,
}) => {
  const frame = useCurrentFrame();

  // 标题动画：从下方滑入
  const titleY = interpolate(frame, [0, 20], [50, 0], {
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 副标题动画：延迟出现
  const subtitleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 淡出动画
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "80%", padding: 40 }}>
        <h1
          style={{
            color: textColor,
            fontSize: 96,
            fontWeight: "bold",
            margin: 0,
            marginBottom: subtitle ? 30 : 0,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: textColor,
              fontSize: 48,
              margin: 0,
              opacity: subtitleOpacity * fadeOut,
              fontWeight: 300,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
