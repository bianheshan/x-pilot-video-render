import React from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type CameraMovement = 
  | "push-in"      // 推进（镜头推近）
  | "pull-out"     // 拉远
  | "pan-left"     // 向左摇
  | "pan-right"    // 向右摇
  | "tilt-up"      // 向上仰
  | "tilt-down"    // 向下俯
  | "orbit"        // 环绕
  | "dolly-zoom"   // 变焦推拉（希区柯克效果）
  | "none";

interface CameraRigProps {
  children: React.ReactNode;
  movement?: CameraMovement;
  startFrame?: number;
  durationInFrames?: number;
  intensity?: number; // 运动强度 (0-1)
  easing?: "linear" | "spring" | "ease-in" | "ease-out";
  backgroundColor?: string;
  perspective?: number;
  style?: CSSProperties;
}

/**
 * 相机运镜组件 - 模拟真实镜头运动，让静态场景具备电影感
 * 
 * 使用场景：
 * - 开场：push-in 从全景推进到主体
 * - 展示细节：tilt-down 从上到下扫描
 * - 展示全貌：orbit 环绕主体旋转
 * - 紧张感：dolly-zoom 希区柯克效果
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  movement = "none",
  startFrame = 0,
  durationInFrames = 90,
  intensity = 1,
  easing = "spring",
  backgroundColor = "transparent",
  perspective = 1000,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  // 通用插值函数
  const getProgress = () => {
    if (easing === "spring") {
      return spring({
        frame: localFrame,
        fps,
        config: { damping: 15, stiffness: 80 },
      });
    }
    
    const progress = Math.min(localFrame / durationInFrames, 1);
    
    if (easing === "ease-in") {
      return progress * progress;
    }
    if (easing === "ease-out") {
      return 1 - (1 - progress) * (1 - progress);
    }
    return progress; // linear
  };

  const progress = getProgress();

  // 相机变换计算
  const getCameraTransform = (): string => {
    const i = intensity;

    switch (movement) {
      case "push-in":
        // 推进：从远到近
        const scale = interpolate(progress, [0, 1], [0.5, 1.2 * i]);
        return `scale(${scale})`;

      case "pull-out":
        // 拉远：从近到远
        const scaleOut = interpolate(progress, [0, 1], [1.2 * i, 0.5]);
        return `scale(${scaleOut})`;

      case "pan-left":
        // 向左摇：水平移动
        const panLeft = interpolate(progress, [0, 1], [0, -30 * i]);
        return `translateX(${panLeft}%)`;

      case "pan-right":
        // 向右摇
        const panRight = interpolate(progress, [0, 1], [0, 30 * i]);
        return `translateX(${panRight}%)`;

      case "tilt-up":
        // 向上仰
        const tiltUp = interpolate(progress, [0, 1], [0, -20 * i]);
        return `translateY(${tiltUp}%)`;

      case "tilt-down":
        // 向下俯
        const tiltDown = interpolate(progress, [0, 1], [0, 20 * i]);
        return `translateY(${tiltDown}%)`;

      case "orbit":
        // 环绕：绕 Y 轴旋转
        const rotateY = interpolate(progress, [0, 1], [0, 360 * i]);
        return `rotateY(${rotateY}deg)`;

      case "dolly-zoom":
        // 希区柯克效果：同时推近 + 视野变窄
        const dollyScale = interpolate(progress, [0, 1], [0.8, 1.5 * i]);
        return `scale(${dollyScale})`;

      default:
        return "none";
    }
  };

  const cameraTransform = getCameraTransform();

  return (
    <AbsoluteFill style={{ backgroundColor, perspective, overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: cameraTransform,
          transformStyle: "preserve-3d",
          transition: easing === "linear" ? "none" : undefined,
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
