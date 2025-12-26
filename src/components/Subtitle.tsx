import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SubtitleProps {
  text: string;
  startFrame?: number;
  durationInFrames?: number;
  position?: "top" | "center" | "bottom";
  style?: React.CSSProperties;
  animate?: boolean;
}

/**
 * 字幕组件 - 支持多种位置和动画效果
 * AI 可以直接调用此组件显示字幕
 */
export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  startFrame = 0,
  durationInFrames = 90,
  position = "bottom",
  style = {},
  animate = true,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  // 淡入淡出动画
  const opacity = animate
    ? interpolate(
        relativeFrame,
        [0, 10, durationInFrames - 10, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // 位置映射
  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: "10%", justifyContent: "center" },
    center: { top: "50%", transform: "translateY(-50%)", justifyContent: "center" },
    bottom: { bottom: "10%", justifyContent: "center" },
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        padding: "0 60px",
        opacity,
        ...positionStyles[position],
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "20px 40px",
          borderRadius: 12,
          maxWidth: "90%",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: 42,
            fontWeight: 600,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.4,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
