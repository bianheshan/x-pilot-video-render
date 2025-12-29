import React from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface SplitScreenProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number;
  gap?: number;
  backgroundColor?: string;
  dividerColor?: string;
  dividerWidth?: number;
  showDivider?: boolean;
  animate?: boolean;
  animationDuration?: number;
  leftStyle?: CSSProperties;
  rightStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  labelLeft?: string;
  labelRight?: string;
}

/**
 * 分屏布局组件 - 提供左右（或内容）对比展示，并内置轻量动画与可视化标注能力。
 */
export const SplitScreen: React.FC<SplitScreenProps> = ({
  left,
  right,
  ratio = 0.5,
  gap = 20,
  backgroundColor = "#000",
  dividerColor = "rgba(255,255,255,0.2)",
  dividerWidth = 2,
  showDivider = true,
  animate = true,
  animationDuration = 30,
  leftStyle,
  rightStyle,
  containerStyle,
  labelLeft,
  labelRight,
}) => {
  const frame = useCurrentFrame();
  const clampedRatio = Math.min(Math.max(ratio, 0.15), 0.85);

  const fade = (offset = 0) =>
    animate
      ? interpolate(frame, [offset, offset + animationDuration], [0, 1], {
          extrapolateRight: "clamp",
        })
      : 1;

  const leftOpacity = fade(0);
  const rightOpacity = fade(5);

  const leftWidth = `calc(${clampedRatio * 100}% - ${gap / 2}px)`;
  const rightWidth = `calc(${(1 - clampedRatio) * 100}% - ${gap / 2}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          gap,
          position: "relative",
          ...containerStyle,
        }}
      >
        <div
          style={{
            width: leftWidth,
            height: "100%",
            position: "relative",
            opacity: leftOpacity,
            ...leftStyle,
          }}
        >
          {labelLeft && (
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 30,
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                fontSize: 18,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {labelLeft}
            </div>
          )}
          {left}
        </div>

        {showDivider && dividerWidth > 0 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${clampedRatio * 100}%`,
              width: dividerWidth,
              background: dividerColor,
              transform: `translateX(-${dividerWidth / 2}px)`,
              boxShadow: "0 0 20px rgba(0,0,0,0.35)",
            }}
          />
        )}

        <div
          style={{
            width: rightWidth,
            height: "100%",
            position: "relative",
            opacity: rightOpacity,
            ...rightStyle,
          }}
        >
          {labelRight && (
            <div
              style={{
                position: "absolute",
                top: 30,
                right: 30,
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                fontSize: 18,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {labelRight}
            </div>
          )}
          {right}
        </div>
      </div>
    </AbsoluteFill>
  );
};
