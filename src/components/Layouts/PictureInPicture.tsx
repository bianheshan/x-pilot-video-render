import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface PictureInPictureProps {
  main: React.ReactNode;
  pip: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  pipSize?: { width: number; height: number };
  offset?: { x: number; y: number };
  animate?: boolean;
  pipDelay?: number;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * 画中画布局组件 - 主内容 + 小窗口
 * 适用于讲解者 + 内容展示的场景
 * 支持弹簧动画效果
 */
export const PictureInPicture: React.FC<PictureInPictureProps> = ({
  main,
  pip,
  position = "bottom-right",
  pipSize = { width: 320, height: 180 },
  offset = { x: 40, y: 40 },
  animate = true,
  pipDelay = 20,
  borderColor = "rgba(255,255,255,0.2)",
  borderWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: offset.y, left: offset.x },
    "top-right": { top: offset.y, right: offset.x },
    "bottom-left": { bottom: offset.y, left: offset.x },
    "bottom-right": { bottom: offset.y, right: offset.x },
  };

  // 主内容淡入
  const mainOpacity = animate
    ? interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  // PIP 窗口弹簧动画
  const pipProgress = animate
    ? spring({
        frame: frame - pipDelay,
        fps,
        config: {
          damping: 12,
          stiffness: 100,
          mass: 0.5,
        },
      })
    : 1;

  const pipOpacity = animate
    ? interpolate(frame, [pipDelay, pipDelay + 15], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill>
      {/* 主内容 */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          opacity: mainOpacity,
        }}
      >
        {main}
      </div>

      {/* 画中画窗口 */}
      <div
        style={{
          position: "absolute",
          width: pipSize.width,
          height: pipSize.height,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          border: `${borderWidth}px solid ${borderColor}`,
          transform: `scale(${pipProgress})`,
          opacity: pipOpacity,
          ...positionStyles[position],
        }}
      >
        {pip}
      </div>
    </AbsoluteFill>
  );
};
