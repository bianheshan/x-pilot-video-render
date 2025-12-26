import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export type TimelineItem = {
  content: React.ReactNode;
  label?: string;
  timestamp?: string;
  side?: "left" | "right" | "auto";
  icon?: React.ReactNode;
  delay?: number;
};

interface TimelineLayoutProps {
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  lineColor?: string;
  lineWidth?: number;
  dotSize?: number;
  dotColor?: string;
  spacing?: number;
  padding?: number;
  backgroundColor?: string;
  staggerDelay?: number;
  autoAlternate?: boolean;
}

/**
 * 时间轴布局组件 - 展示时间序列或流程步骤
 * 支持垂直/水平方向、左右交替、自定义图标
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

  const isVertical = orientation === "vertical";

  const getItemAnimation = (index: number) => {
    const delay = index * staggerDelay;
    const startFrame = delay;

    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: {
        damping: 15,
        stiffness: 100,
        mass: 0.8,
      },
    });

    const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
      extrapolateRight: "clamp",
    });

    const slideDistance = isVertical ? 50 : 50;
    const slide = (1 - progress) * slideDistance;

    return {
      opacity,
      transform: isVertical ? `translateY(${slide}px)` : `translateX(${slide}px)`,
      scale: progress,
    };
  };

  // 时间线进度动画
  const lineProgress = interpolate(
    frame,
    [0, items.length * staggerDelay + 30],
    [0, 100],
    {
      extrapolateRight: "clamp",
    }
  );

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
        {/* 时间线主线 */}
        <div
          style={{
            position: "absolute",
            [isVertical ? "left" : "top"]: "50%",
            [isVertical ? "top" : "left"]: 0,
            [isVertical ? "width" : "height"]: lineWidth,
            [isVertical ? "height" : "width"]: "100%",
            backgroundColor: lineColor,
            transform: isVertical
              ? "translateX(-50%)"
              : "translateY(-50%)",
          }}
        >
          {/* 进度指示器 */}
          <div
            style={{
              position: "absolute",
              [isVertical ? "left" : "top"]: 0,
              [isVertical ? "top" : "left"]: 0,
              [isVertical ? "width" : "height"]: "100%",
              [isVertical ? "height" : "width"]: `${lineProgress}%`,
              backgroundColor: dotColor,
              transition: "all 0.3s ease",
            }}
          />
        </div>

        {/* 时间轴项目 */}
        {items.map((item, index) => {
          const animation = getItemAnimation(index);
          const side =
            item.side ||
            (autoAlternate ? (index % 2 === 0 ? "left" : "right") : "right");

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
              {/* 内容区域 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isVertical ? "row" : "column",
                  alignItems: "center",
                  width: isVertical ? "100%" : "auto",
                  gap: 30,
                }}
              >
                {/* 左侧/上侧内容 */}
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

                {/* 时间点 */}
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
                  {/* 图标或圆点 */}
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
                    {item.icon && (
                      <div style={{ fontSize: dotSize * 0.6 }}>{item.icon}</div>
                    )}
                  </div>

                  {/* 时间戳 */}
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

                  {/* 标签 */}
                  {item.label && (
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: dotColor,
                        whiteSpace: "nowrap",
                        opacity: animation.opacity,
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </div>

                {/* 右侧/下侧内容 */}
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

                {/* 水平方向的内容 */}
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
