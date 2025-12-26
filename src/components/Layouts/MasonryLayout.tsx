import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export type MasonryItem = {
  content: React.ReactNode;
  height?: number;
  animation?: "fade" | "slide" | "scale" | "spring" | "none";
  delay?: number;
};

interface MasonryLayoutProps {
  items: MasonryItem[];
  columns?: number;
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  staggerDelay?: number;
}

/**
 * 瀑布流布局组件 - 不等高的多列布局
 * 适用于展示不同尺寸的内容卡片、图片墙等
 */
export const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  items,
  columns = 3,
  gap = 20,
  padding = 40,
  backgroundColor = "transparent",
  staggerDelay = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 计算瀑布流布局
  const layout = useMemo(() => {
    const columnHeights = Array(columns).fill(0);
    const positions: Array<{ column: number; top: number; height: number }> = [];

    items.forEach((item) => {
      // 找到最短的列
      const minHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minHeight);

      positions.push({
        column: columnIndex,
        top: columnHeights[columnIndex],
        height: item.height || 200,
      });

      columnHeights[columnIndex] += (item.height || 200) + gap;
    });

    return { positions, totalHeight: Math.max(...columnHeights) };
  }, [items, columns, gap]);

  const getItemAnimation = (index: number, animation?: string) => {
    const animationType = animation || "spring";
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
          damping: 15,
          stiffness: 120,
          mass: 0.8,
        },
      });

      return {
        opacity: interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${progress}) translateY(${(1 - progress) * 30}px)`,
      };
    }

    if (animationType === "fade") {
      const opacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
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
      const scale = interpolate(frame, [startFrame, startFrame + 30], [0.7, 1], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `scale(${scale})` };
    }

    return { opacity: 1, transform: "none" };
  };

  const columnWidth = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;

  return (
    <AbsoluteFill style={{ backgroundColor, padding }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {items.map((item, index) => {
          const position = layout.positions[index];
          const animation = getItemAnimation(index, item.animation);

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `calc(${position.column} * (${columnWidth} + ${gap}px))`,
                top: position.top,
                width: columnWidth,
                height: position.height,
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
