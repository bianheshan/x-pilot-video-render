import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export type CircularItem = {
  content: React.ReactNode;
  size?: number;
  animation?: "fade" | "rotate" | "scale" | "spring" | "orbit" | "none";
  delay?: number;
};

interface CircularLayoutProps {
  items: CircularItem[];
  radius?: number;
  centerContent?: React.ReactNode;
  centerSize?: number;
  startAngle?: number;
  backgroundColor?: string;
  rotationSpeed?: number;
  staggerDelay?: number;
}

/**
 * 环形布局组件 - 将内容排列成圆形
 * 适用于展示关系网络、循环流程、放射状结构
 */
export const CircularLayout: React.FC<CircularLayoutProps> = ({
  items,
  radius = 300,
  centerContent,
  centerSize = 150,
  startAngle = 0,
  backgroundColor = "transparent",
  rotationSpeed = 0,
  staggerDelay = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const angleStep = (2 * Math.PI) / items.length;
  const globalRotation = rotationSpeed * frame * 0.5;

  const getItemAnimation = (index: number, animation?: string) => {
    const animationType = animation || "spring";
    const delay = index * staggerDelay;
    const startFrame = delay;

    if (animationType === "none") {
      return { opacity: 1, transform: "scale(1)" };
    }

    if (animationType === "spring") {
      const progress = spring({
        frame: frame - startFrame,
        fps,
        config: {
          damping: 12,
          stiffness: 100,
          mass: 0.5,
        },
      });

      return {
        opacity: interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${progress})`,
      };
    }

    if (animationType === "fade") {
      const opacity = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: "scale(1)" };
    }

    if (animationType === "rotate") {
      const rotation = interpolate(frame, [startFrame, startFrame + 40], [180, 0], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `rotate(${rotation}deg)` };
    }

    if (animationType === "scale") {
      const scale = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})` };
    }

    if (animationType === "orbit") {
      const orbitRadius = interpolate(frame, [startFrame, startFrame + 40], [0, radius], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: "scale(1)", orbitRadius };
    }

    return { opacity: 1, transform: "scale(1)" };
  };

  // 中心内容动画
  const centerAnimation = spring({
    frame,
    fps,
    config: {
      damping: 20,
      stiffness: 80,
      mass: 1,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
        }}
      >
        {/* 中心内容 */}
        {centerContent && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: centerSize,
              height: centerSize,
              transform: `translate(-50%, -50%) scale(${centerAnimation})`,
              opacity: interpolate(frame, [0, 20], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {centerContent}
          </div>
        )}

        {/* 环形排列的项目 */}
        {items.map((item, index) => {
          const angle = startAngle + angleStep * index + (globalRotation * Math.PI) / 180;
          const animation = getItemAnimation(index, item.animation);
          const itemRadius =
            animation.orbitRadius !== undefined ? animation.orbitRadius : radius;

          const x = Math.cos(angle) * itemRadius;
          const y = Math.sin(angle) * itemRadius;
          const itemSize = item.size || 80;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: itemSize,
                height: itemSize,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) ${animation.transform}`,
                opacity: animation.opacity,
              }}
            >
              {item.content}
            </div>
          );
        })}

        {/* 连接线（可选） */}
        {items.length > 0 && (
          <svg
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: radius * 2.5,
              height: radius * 2.5,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              opacity: interpolate(frame, [20, 50], [0, 0.3], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};
