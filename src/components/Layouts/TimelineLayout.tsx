import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type TimelineItem = {
  content: React.ReactNode;
  label?: string;
  timestamp?: string;
  side?: "left" | "right" | "auto";
  icon?: React.ReactNode;
  /** Delay for this item (frames). */
  delay?: number;
};

export interface TimelineLayoutProps {
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  lineColor?: string;
  lineWidth?: number;
  dotSize?: number;
  dotColor?: string;
  spacing?: number;
  padding?: number;
  backgroundColor?: string;
  /** Base stagger delay (frames) used when item.delay is not provided. */
  staggerDelay?: number;
  autoAlternate?: boolean;
}

/**
 * 时间轴布局组件 - 展示时间序列或流程步骤
 * - 所有动效为帧驱动（避免 CSS transition）
 * - 支持 item.delay（帧）与全局 staggerDelay 叠加
 */
export const TimelineLayout: React.FC<TimelineLayoutProps> = ({
  items,
  orientation = "vertical",
  lineColor = "rgba(255,255,255,0.3)",
  lineWidth = 3,
  dotSize = 20,
  dotColor = "#3b82f6",
  spacing = 200,
  padding = 60,
  backgroundColor = "transparent",
  staggerDelay = 10,
  autoAlternate = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🛡️ 防护措施：验证 items 是否为有效数组
  if (!Array.isArray(items)) {
    console.error('[TimelineLayout] items must be an array, got:', typeof items);
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
        ⚠️ TimelineLayout Error: "items" prop must be an array
      </AbsoluteFill>
    );
  }

  if (items.length === 0) {
    console.warn('[TimelineLayout] items array is empty');
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
        Timeline: No items to display
      </AbsoluteFill>
    );
  }

  const isVertical = orientation === "vertical";

  const getStartFrame = (item: TimelineItem, index: number) => {
    const perItemDelay = Math.max(0, Math.floor(item.delay ?? 0));
    return perItemDelay + index * staggerDelay;
  };

  const getItemAnimation = (item: TimelineItem, index: number) => {
    const startFrame = getStartFrame(item, index);

    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 15, stiffness: 100, mass: 0.8 },
    });

    const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
      extrapolateRight: "clamp",
    });

    const slideDistance = 50;
    const slide = (1 - progress) * slideDistance;

    return {
      opacity,
      transform: isVertical ? `translateY(${slide}px)` : `translateX(${slide}px)`,
      scale: progress,
      startFrame,
    };
  };

  const lastEndFrame = items.reduce((max, item, idx) => {
    const start = getStartFrame(item, idx);
    return Math.max(max, start + 45);
  }, 1);

  const lineProgress = interpolate(frame, [0, lastEndFrame], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor, padding }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: isVertical ? "center" : "flex-start",
          justifyContent: "flex-start",
          gap: spacing,
        }}
      >
        <div
          style={{
            position: "absolute",
            [isVertical ? "left" : "top"]: "50%",
            [isVertical ? "top" : "left"]: 0,
            [isVertical ? "width" : "height"]: lineWidth,
            [isVertical ? "height" : "width"]: "100%",
            backgroundColor: lineColor,
            transform: isVertical ? "translateX(-50%)" : "translateY(-50%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              [isVertical ? "left" : "top"]: 0,
              [isVertical ? "top" : "left"]: 0,
              [isVertical ? "width" : "height"]: "100%",
              [isVertical ? "height" : "width"]: `${lineProgress}%`,
              backgroundColor: dotColor,
            }}
          />
        </div>

        {items.map((item, index) => {
          const animation = getItemAnimation(item, index);
          const side =
            item.side || (autoAlternate ? (index % 2 === 0 ? "left" : "right") : "right");

          const isLeft = side === "left";

          return (
            <div
              key={index}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: isVertical ? "row" : "column",
                alignItems: "center",
                width: isVertical ? "100%" : "auto",
                opacity: animation.opacity,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: isVertical ? "row" : "column",
                  alignItems: "center",
                  width: isVertical ? "100%" : "auto",
                  gap: 30,
                }}
              >
                {isVertical && (
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      paddingRight: 40,
                      opacity: isLeft ? animation.opacity : 0,
                      transform: animation.transform,
                    }}
                  >
                    {isLeft && item.content}
                  </div>
                )}

                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: "50%",
                      backgroundColor: dotColor,
                      border: `${lineWidth}px solid ${backgroundColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${animation.scale})`,
                      boxShadow: `0 0 20px ${dotColor}`,
                    }}
                  >
                    {item.icon && <div style={{ fontSize: dotSize * 0.6 }}>{item.icon}</div>}
                  </div>

                  {item.timestamp && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.6)",
                        whiteSpace: "nowrap",
                        opacity: animation.opacity,
                      }}
                    >
                      {item.timestamp}
                    </div>
                  )}

                  {item.label && (
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: dotColor,
                        whiteSpace: "nowrap",
                        opacity: animation.opacity,
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </div>

                {isVertical && (
                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      paddingLeft: 40,
                      opacity: !isLeft ? animation.opacity : 0,
                      transform: animation.transform,
                    }}
                  >
                    {!isLeft && item.content}
                  </div>
                )}

                {!isVertical && (
                  <div
                    style={{
                      opacity: animation.opacity,
                      transform: animation.transform,
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
