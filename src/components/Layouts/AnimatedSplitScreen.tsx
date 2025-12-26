import React from "react";
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
}

/**
 * 动画分屏布局组件 - 支持多种分屏动画效果
 * 支持水平/垂直分屏、滑动、擦除、缩放、旋转等动画
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
  dividerColor = "rgba(255,255,255,0.1)",
  dividerWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getAnimationStyles = () => {
    if (animation === "none") {
      return {
        leftStyle: { opacity: 1, transform: "none" },
        rightStyle: { opacity: 1, transform: "none" },
      };
    }

    if (animation === "spring") {
      const leftProgress = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 80, mass: 1 },
      });
      const rightProgress = spring({
        frame: frame - 10,
        fps,
        config: { damping: 15, stiffness: 80, mass: 1 },
      });

      return {
        leftStyle: {
          opacity: leftProgress,
          transform:
            direction === "horizontal"
              ? `translateX(${(1 - leftProgress) * -100}%)`
              : `translateY(${(1 - leftProgress) * -100}%)`,
        },
        rightStyle: {
          opacity: rightProgress,
          transform:
            direction === "horizontal"
              ? `translateX(${(1 - rightProgress) * 100}%)`
              : `translateY(${(1 - rightProgress) * 100}%)`,
        },
      };
    }

    if (animation === "slide") {
      const leftSlide = interpolate(frame, [0, animationDuration], [-100, 0], {
        extrapolateRight: "clamp",
      });
      const rightSlide = interpolate(frame, [10, animationDuration + 10], [100, 0], {
        extrapolateRight: "clamp",
      });

      return {
        leftStyle: {
          opacity: 1,
          transform:
            direction === "horizontal"
              ? `translateX(${leftSlide}%)`
              : `translateY(${leftSlide}%)`,
        },
        rightStyle: {
          opacity: 1,
          transform:
            direction === "horizontal"
              ? `translateX(${rightSlide}%)`
              : `translateY(${rightSlide}%)`,
        },
      };
    }

    if (animation === "wipe") {
      const wipeProgress = interpolate(frame, [0, animationDuration], [0, 100], {
        extrapolateRight: "clamp",
      });

      return {
        leftStyle: {
          opacity: 1,
          clipPath:
            direction === "horizontal"
              ? `inset(0 ${100 - wipeProgress}% 0 0)`
              : `inset(0 0 ${100 - wipeProgress}% 0)`,
        },
        rightStyle: {
          opacity: 1,
          clipPath:
            direction === "horizontal"
              ? `inset(0 0 0 ${wipeProgress}%)`
              : `inset(${wipeProgress}% 0 0 0)`,
        },
      };
    }

    if (animation === "zoom") {
      const leftScale = interpolate(frame, [0, animationDuration], [0.5, 1], {
        extrapolateRight: "clamp",
      });
      const rightScale = interpolate(frame, [10, animationDuration + 10], [0.5, 1], {
        extrapolateRight: "clamp",
      });
      const leftOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      const rightOpacity = interpolate(frame, [10, 30], [0, 1], {
        extrapolateRight: "clamp",
      });

      return {
        leftStyle: {
          opacity: leftOpacity,
          transform: `scale(${leftScale})`,
        },
        rightStyle: {
          opacity: rightOpacity,
          transform: `scale(${rightScale})`,
        },
      };
    }

    if (animation === "rotate") {
      const leftRotate = interpolate(frame, [0, animationDuration], [-90, 0], {
        extrapolateRight: "clamp",
      });
      const rightRotate = interpolate(frame, [10, animationDuration + 10], [90, 0], {
        extrapolateRight: "clamp",
      });
      const leftOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      const rightOpacity = interpolate(frame, [10, 30], [0, 1], {
        extrapolateRight: "clamp",
      });

      return {
        leftStyle: {
          opacity: leftOpacity,
          transform: `perspective(1000px) rotateY(${leftRotate}deg)`,
        },
        rightStyle: {
          opacity: rightOpacity,
          transform: `perspective(1000px) rotateY(${rightRotate}deg)`,
        },
      };
    }

    return {
      leftStyle: { opacity: 1, transform: "none" },
      rightStyle: { opacity: 1, transform: "none" },
    };
  };

  const { leftStyle, rightStyle } = getAnimationStyles();

  const isHorizontal = direction === "horizontal";
  const leftSize = `calc(${ratio * 100}% - ${gap / 2}px)`;
  const rightSize = `calc(${(1 - ratio) * 100}% - ${gap / 2}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          width: "100%",
          height: "100%",
          gap,
        }}
      >
        {/* 左侧/上侧内容 */}
        <div
          style={{
            width: isHorizontal ? leftSize : "100%",
            height: isHorizontal ? "100%" : leftSize,
            position: "relative",
            overflow: "hidden",
            ...leftStyle,
          }}
        >
          {left}
        </div>

        {/* 分隔线 */}
        {gap === 0 && dividerWidth > 0 && (
          <div
            style={{
              width: isHorizontal ? dividerWidth : "100%",
              height: isHorizontal ? "100%" : dividerWidth,
              backgroundColor: dividerColor,
              position: "absolute",
              [isHorizontal ? "left" : "top"]: `${ratio * 100}%`,
              transform: isHorizontal
                ? `translateX(-${dividerWidth / 2}px)`
                : `translateY(-${dividerWidth / 2}px)`,
            }}
          />
        )}

        {/* 右侧/下侧内容 */}
        <div
          style={{
            width: isHorizontal ? rightSize : "100%",
            height: isHorizontal ? "100%" : rightSize,
            position: "relative",
            overflow: "hidden",
            ...rightStyle,
          }}
        >
          {right}
        </div>
      </div>
    </AbsoluteFill>
  );
};
