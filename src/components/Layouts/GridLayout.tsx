import React from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type GridItemAnimation =
  | "fade"
  | "slide"
  | "scale"
  | "spring"
  | "pop"
  | "pop-in"
  | "none";

export type GridItem = {
  content: React.ReactNode;
  span?: { rows?: number; cols?: number };
  animation?: GridItemAnimation;
  delay?: number;
  style?: CSSProperties;
};

interface GridLayoutProps {
  items: GridItem[];
  columns?: number;
  rows?: number;
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  backgroundOverlay?: string;
  staggerDelay?: number;
  globalAnimation?: GridItemAnimation;
  containerStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  minRowHeight?: number;
}

/**
 * 网格布局组件 - 多用于知识可视化的要点拼贴，可跨行列并支持多种入场动画。
 */
export const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  columns = 2,
  rows,
  gap = 20,
  padding = 40,
  backgroundColor = "transparent",
  backgroundOverlay,
  staggerDelay = 5,
  globalAnimation = "spring",
  containerStyle,
  itemStyle,
  minRowHeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🛡️ 防护措施：验证 items 是否为有效数组
  if (!Array.isArray(items)) {
    console.error('[GridLayout] items must be an array, got:', typeof items);
    return (
      <AbsoluteFill style={{ 
        backgroundColor, 
        padding,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ef4444",
        fontSize: 24,
        textAlign: "center",
      }}>
        ⚠️ GridLayout Error: "items" prop must be an array
      </AbsoluteFill>
    );
  }

  if (items.length === 0) {
    console.warn('[GridLayout] items array is empty');
    return (
      <AbsoluteFill style={{ 
        backgroundColor, 
        padding,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#9ca3af",
        fontSize: 20,
      }}>
        Grid: No items to display
      </AbsoluteFill>
    );
  }

  const computedRows = rows ?? Math.max(1, Math.ceil(items.length / columns));

  const getItemAnimation = (
    index: number,
    animation?: GridItemAnimation,
    itemDelay?: number
  ) => {
    const animationType = animation || globalAnimation;
    const delay = typeof itemDelay === "number" ? itemDelay : index * staggerDelay;
    const startFrame = delay;

    if (animationType === "none") {
      return { opacity: 1, transform: "none" };
    }

    if (animationType === "spring") {
      const progress = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.5 },
      });
      return {
        opacity: interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
      };
    }

    if (animationType === "pop" || animationType === "pop-in") {
      const progress = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 14, stiffness: 140, mass: 0.4 },
      });
      const scale = 0.85 + Math.min(progress, 1) * 0.2;
      return {
        opacity: interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${scale})`,
      };
    }

    if (animationType === "fade") {
      const opacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: "none" };
    }

    if (animationType === "slide") {
      const slideY = interpolate(frame, [startFrame, startFrame + 25], [40, 0], {
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
        extrapolateRight: "clamp",
      });
      return { opacity, transform: `translateY(${slideY}px)` };
    }

    if (animationType === "scale") {
      const scale = interpolate(frame, [startFrame, startFrame + 30], [0.6, 1], {
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
      {backgroundOverlay && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: backgroundOverlay,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${computedRows}, ${minRowHeight ? `${minRowHeight}px` : "1fr"})`,
          gap,
          width: "100%",
          height: "100%",
          ...containerStyle,
        }}
      >
        {items.map((item, index) => {
          const animation = getItemAnimation(index, item.animation, item.delay);
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
                display: "flex",
                alignItems: "stretch",
                ...animation,
                ...itemStyle,
                ...item.style,
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
