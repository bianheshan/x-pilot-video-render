import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface SplitScreenProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number; // 左侧占比，默认 0.5 (50%)
  gap?: number;
  backgroundColor?: string;
  dividerColor?: string;
  dividerWidth?: number;
  animate?: boolean;
  animationDuration?: number;
}

/**
 * 分屏布局组件 - 左右分屏展示内容
 * 适用于对比、并列展示等场景
 * 支持简单的淡入动画
 */
export const SplitScreen: React.FC<SplitScreenProps> = ({
  left,
  right,
  ratio = 0.5,
  gap = 20,
  backgroundColor = "#000",
  dividerColor = "rgba(255,255,255,0.1)",
  dividerWidth = 0,
  animate = true,
  animationDuration = 30,
}) => {
  const frame = useCurrentFrame();
  
  const leftOpacity = animate
    ? interpolate(frame, [0, animationDuration], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  const rightOpacity = animate
    ? interpolate(frame, [5, animationDuration + 5], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  const leftWidth = `calc(${ratio * 100}% - ${gap / 2}px)`;
  const rightWidth = `calc(${(1 - ratio) * 100}% - ${gap / 2}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div style={{ display: "flex", width: "100%", height: "100%", gap }}>
        <div
          style={{
            width: leftWidth,
            height: "100%",
            position: "relative",
            opacity: leftOpacity,
          }}
        >
          {left}
        </div>

        {/* 分隔线 */}
        {gap === 0 && dividerWidth > 0 && (
          <div
            style={{
              width: dividerWidth,
              height: "100%",
              backgroundColor: dividerColor,
              position: "absolute",
              left: `${ratio * 100}%`,
              transform: `translateX(-${dividerWidth / 2}px)`,
            }}
          />
        )}

        <div
          style={{
            width: rightWidth,
            height: "100%",
            position: "relative",
            opacity: rightOpacity,
          }}
        >
          {right}
        </div>
      </div>
    </AbsoluteFill>
  );
};
