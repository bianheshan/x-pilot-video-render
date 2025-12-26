import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export type GridItem = {
  content: React.ReactNode;
  span?: { rows?: number; cols?: number };
  animation?: "fade" | "slide" | "scale" | "spring" | "none";
  delay?: number;
};

interface GridLayoutProps {
  items: GridItem[];
  columns?: number;
  rows?: number;
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  staggerDelay?: number;
  globalAnimation?: "fade" | "slide" | "scale" | "spring" | "none";
}

/**
 * 网格布局组件 - 支持多行多列的复杂网格布局
 * 支持单元格跨行跨列、独立动画、交错动画效果
 */
export const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  columns = 2,
  rows = 2,
  gap = 20,
  padding = 40,
  backgroundColor = "transparent",
  staggerDelay = 5,
  globalAnimation = "spring",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getItemAnimation = (index: number, animation?: string) => {
    const animationType = animation || globalAnimation;
    const delay = index * staggerDelay;
    const startFrame = delay;

    if (animationType === "none") {
      return { opacity: 1, transform: "none" };
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
        transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
      };
    }

    if (animationType === "fade") {
      const opacity = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: "none" };
    }

    if (animationType === "slide") {
      const slideY = interpolate(frame, [startFrame, startFrame + 30], [50, 0], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateY(${slideY}px)` };
    }

    if (animationType === "scale") {
      const scale = interpolate(frame, [startFrame, startFrame + 30], [0.5, 1], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})` };
    }

    return { opacity: 1, transform: "none" };
  };

  return (
    <AbsoluteFill style={{ backgroundColor, padding }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap,
          width: "100%",
          height: "100%",
        }}
      >
        {items.map((item, index) => {
          const animation = getItemAnimation(index, item.animation);
          const rowSpan = item.span?.rows || 1;
          const colSpan = item.span?.cols || 1;

          return (
            <div
              key={index}
              style={{
                gridRow: `span ${rowSpan}`,
                gridColumn: `span ${colSpan}`,
                position: "relative",
                overflow: "hidden",
                ...animation,
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
