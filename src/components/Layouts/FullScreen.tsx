import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface FullScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  animate?: boolean;
  animationDuration?: number;
  parallax?: boolean;
  parallaxSpeed?: number;
}

/**
 * 全屏布局组件 - 内容占满整个画面
 * 支持背景色、背景图、遮罩层、视差效果
 */
export const FullScreen: React.FC<FullScreenProps> = ({
  children,
  backgroundColor = "#000",
  backgroundImage,
  overlay = false,
  overlayOpacity = 0.5,
  animate = true,
  animationDuration = 30,
  parallax = false,
  parallaxSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();

  // 内容淡入动画
  const contentOpacity = animate
    ? interpolate(frame, [0, animationDuration], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  // 背景视差效果
  const backgroundY = parallax
    ? interpolate(frame, [0, 300], [0, -50 * parallaxSpeed], {
        extrapolateRight: "clamp",
      })
    : 0;

  const backgroundScale = parallax ? 1.1 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      {/* 背景图片 */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${backgroundY}px) scale(${backgroundScale})`,
          }}
        />
      )}

      {/* 遮罩层 */}
      {overlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
            zIndex: 1,
          }}
        />
      )}

      {/* 内容区域 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
          opacity: contentOpacity,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
