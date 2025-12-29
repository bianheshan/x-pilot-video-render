import React from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type SplitDirection = "horizontal" | "vertical";
type SplitAnimation = "slide" | "wipe" | "zoom" | "rotate" | "spring" | "none";

interface AnimatedSplitScreenProps {
  left: React.ReactNode;
  right: React.ReactNode;
  direction?: SplitDirection;
  ratio?: number;
  gap?: number;
  backgroundColor?: string;
  animation?: SplitAnimation;
  animationDuration?: number;
  dividerColor?: string;
  dividerWidth?: number;
  showDivider?: boolean;
  containerStyle?: CSSProperties;
  leftStyle?: CSSProperties;
  rightStyle?: CSSProperties;
  labelLeft?: string;
  labelRight?: string;
}

/**
 * 动画分屏布局 - 覆盖横/纵切换、多个动画模式与标注辅助。
 */
export const AnimatedSplitScreen: React.FC<AnimatedSplitScreenProps> = ({
  left,
  right,
  direction = "horizontal",
  ratio = 0.5,
  gap = 0,
  backgroundColor = "#000",
  animation = "spring",
  animationDuration = 60,
  dividerColor = "rgba(255,255,255,0.15)",
  dividerWidth = 2,
  showDivider = true,
  containerStyle,
  leftStyle,
  rightStyle,
  labelLeft,
  labelRight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isHorizontal = direction === "horizontal";
  const clampedRatio = Math.min(Math.max(ratio, 0.15), 0.85);

  const buildAnimation = (mode: SplitAnimation) => {
    switch (mode) {
      case "spring": {
        const leftProgress = spring({ frame, fps, config: { damping: 16, stiffness: 120, mass: 0.7 } });
        const rightProgress = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 120, mass: 0.7 } });
        const axis = isHorizontal ? "X" : "Y";
        return {
          leftStyle: {
            opacity: leftProgress,
            transform: `translate${axis}(${(1 - leftProgress) * -100}%)`,
          },
          rightStyle: {
            opacity: rightProgress,
            transform: `translate${axis}(${(1 - rightProgress) * 100}%)`,
          },
        };
      }
      case "slide": {
        const leftSlide = interpolate(frame, [0, animationDuration], [-100, 0], { extrapolateRight: "clamp" });
        const rightSlide = interpolate(frame, [10, animationDuration + 10], [100, 0], { extrapolateRight: "clamp" });
        const axis = isHorizontal ? "X" : "Y";
        return {
          leftStyle: { transform: `translate${axis}(${leftSlide}%)` },
          rightStyle: { transform: `translate${axis}(${rightSlide}%)` },
        };
      }
      case "wipe": {
        const progress = interpolate(frame, [0, animationDuration], [0, 100], {
          extrapolateRight: "clamp",
        });
        const insetLeft = isHorizontal ? `inset(0 ${100 - progress}% 0 0)` : `inset(0 0 ${100 - progress}% 0)`;
        const insetRight = isHorizontal ? `inset(0 0 0 ${progress}%)` : `inset(${progress}% 0 0 0)`;
        return {
          leftStyle: { clipPath: insetLeft },
          rightStyle: { clipPath: insetRight },
        };
      }
      case "zoom": {
        const leftScale = interpolate(frame, [0, animationDuration], [0.6, 1], { extrapolateRight: "clamp" });
        const rightScale = interpolate(frame, [10, animationDuration + 10], [0.6, 1], {
          extrapolateRight: "clamp",
        });
        const leftOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
        const rightOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
        return {
          leftStyle: { transform: `scale(${leftScale})`, opacity: leftOpacity },
          rightStyle: { transform: `scale(${rightScale})`, opacity: rightOpacity },
        };
      }
      case "rotate": {
        const leftRotate = interpolate(frame, [0, animationDuration], [-90, 0], {
          extrapolateRight: "clamp",
        });
        const rightRotate = interpolate(frame, [10, animationDuration + 10], [90, 0], {
          extrapolateRight: "clamp",
        });
        const axis = isHorizontal ? "Y" : "X";
        return {
          leftStyle: {
            transform: `perspective(1000px) rotate${axis}(${leftRotate}deg)` ,
            opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
          },
          rightStyle: {
            transform: `perspective(1000px) rotate${axis}(${rightRotate}deg)` ,
            opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" }),
          },
        };
      }
      default:
        return {
          leftStyle: { opacity: 1 },
          rightStyle: { opacity: 1 },
        };
    }
  };

  const { leftStyle: animLeft, rightStyle: animRight } = buildAnimation(animation);

  const leftSize = `calc(${clampedRatio * 100}% - ${gap / 2}px)`;
  const rightSize = `calc(${(1 - clampedRatio) * 100}% - ${gap / 2}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          width: "100%",
          height: "100%",
          gap,
          position: "relative",
          ...containerStyle,
        }}
      >
        <div
          style={{
            width: isHorizontal ? leftSize : "100%",
            height: isHorizontal ? "100%" : leftSize,
            position: "relative",
            overflow: "hidden",
            ...animLeft,
            ...leftStyle,
          }}
        >
          {labelLeft && (
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 16,
                letterSpacing: 1,
                textTransform: "uppercase",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
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
              width: isHorizontal ? dividerWidth : "100%",
              height: isHorizontal ? "100%" : dividerWidth,
              background: dividerColor,
              left: isHorizontal ? `${clampedRatio * 100}%` : 0,
              top: isHorizontal ? 0 : `${clampedRatio * 100}%`,
              transform: isHorizontal
                ? `translateX(-${dividerWidth / 2}px)`
                : `translateY(-${dividerWidth / 2}px)`,
              boxShadow: "0 0 20px rgba(0,0,0,0.35)",
            }}
          />
        )}

        <div
          style={{
            width: isHorizontal ? rightSize : "100%",
            height: isHorizontal ? "100%" : rightSize,
            position: "relative",
            overflow: "hidden",
            ...animRight,
            ...rightStyle,
          }}
        >
          {labelRight && (
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 16,
                letterSpacing: 1,
                textTransform: "uppercase",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
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
