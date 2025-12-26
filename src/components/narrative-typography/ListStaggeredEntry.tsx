import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface ListStaggeredEntryProps {
  items: string[];
  title?: string;
  accentColor?: string;
  staggerDelay?: number;
}

/**
 * 弹性列表
 * 列表项依次带弹性地滑入，拒绝僵硬
 */
export const ListStaggeredEntry: React.FC<ListStaggeredEntryProps> = ({
  items,
  title = "Key Points",
  accentColor,
  staggerDelay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  
  // 使用主题颜色或传入的颜色
  const highlightColor = accentColor || theme.colors.primary;

  // 标题进入动画
  const titleY = interpolate(frame, [0, 25], [-50, 0], {
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: theme.colors.background,
        padding: 80,
        overflow: "hidden",
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `radial-gradient(circle at 20% 50%, ${highlightColor}11 0%, transparent 50%)`,
        }}
      />

      {/* 标题 */}
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 60,
          fontFamily: theme.fonts.heading,
          textTransform: "uppercase",
          letterSpacing: 3,
          textShadow: `0 0 20px ${highlightColor}66`,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        {title}
      </h2>

      {/* 列表容器 */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          flexDirection: "column",
          gap: 25,
        }}
      >
        {items.map((item, index) => {
          // 每个项目的延迟开始帧
          const startFrame = 20 + index * staggerDelay;

          // 弹性进入动画
          const itemSpring = spring({
            frame: frame - startFrame,
            fps,
            config: {
              damping: 15,
              mass: 0.5,
              stiffness: 100,
            },
          });

          // X 轴滑入
          const itemX = interpolate(
            itemSpring,
            [0, 1],
            [-100, 0]
          );

          // 透明度
          const itemOpacity = interpolate(
            frame,
            [startFrame, startFrame + 15],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // 缩放动画
          const itemScale = interpolate(
            itemSpring,
            [0, 1],
            [0.8, 1]
          );

          // 序号动画
          const numberRotate = interpolate(
            frame,
            [startFrame, startFrame + 20],
            [180, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // 高亮效果
          const isHighlighted = frame >= startFrame && frame < startFrame + 30;
          const highlightOpacity = isHighlighted
            ? interpolate(
                frame,
                [startFrame, startFrame + 15, startFrame + 25, startFrame + 30],
                [0, 1, 1, 0]
              )
            : 0;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 25,
                transform: `translateX(${itemX}px) scale(${itemScale})`,
                opacity: itemOpacity,
                position: "relative",
              }}
            >
              {/* 序号圆圈 */}
              <div
                style={{
                  minWidth: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${highlightColor}, ${highlightColor}cc)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 28,
                  fontWeight: "bold",
                  color: theme.colors.text,
                  boxShadow: `0 0 20px ${highlightColor}66`,
                  transform: `rotate(${numberRotate}deg)`,
                  position: "relative",
                }}
              >
                {index + 1}
                
                {/* 脉冲效果 */}
                {isHighlighted && (
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      border: `3px solid ${highlightColor}`,
                      opacity: highlightOpacity,
                      transform: `scale(${1 + highlightOpacity * 0.5})`,
                    }}
                  />
                )}
              </div>

              {/* 内容卡片 */}
              <div
                style={{
                  flex: 1,
                  padding: "20px 30px",
                  background: theme.colors.surface,
                  backdropFilter: "blur(10px)",
                  borderRadius: 15,
                  border: `2px solid ${isHighlighted ? highlightColor : theme.colors.surfaceLight}`,
                  boxShadow: isHighlighted
                    ? `0 0 30px ${highlightColor}44`
                    : `0 5px 15px ${theme.colors.shadow}`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* 高亮扫光 */}
                {isHighlighted && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: interpolate(
                        frame,
                        [startFrame, startFrame + 30],
                        [-100, 200],
                        {
                          extrapolateRight: "clamp",
                        }
                      ),
                      width: 100,
                      height: "100%",
                      background: `linear-gradient(90deg, transparent, ${highlightColor}44, transparent)`,
                      transform: "skewX(-20deg)",
                      filter: "blur(10px)",
                    }}
                  />
                )}

                <p
                  style={{
                    fontSize: 24,
                    color: theme.colors.text,
                    margin: 0,
                    fontFamily: theme.fonts.body,
                    lineHeight: 1.5,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {item}
                </p>
              </div>

              {/* 连接线 */}
              {index < items.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    top: 60,
                    width: 2,
                    height: 25,
                    background: `linear-gradient(to bottom, ${highlightColor}, transparent)`,
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 进度指示器 */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          gap: 10,
        }}
      >
        {items.map((_, index) => {
          const dotStartFrame = 20 + index * staggerDelay;
          const dotActive = frame >= dotStartFrame;
          const dotOpacity = dotActive ? 1 : 0.3;

          return (
            <div
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: highlightColor,
                opacity: dotOpacity,
                boxShadow: dotActive ? `0 0 10px ${highlightColor}` : "none",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
