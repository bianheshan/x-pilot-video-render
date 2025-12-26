/**
 * 动画工具函数
 * 提供常用的动画效果和缓动函数
 */

import { interpolate, spring } from "remotion";

/**
 * 缓动函数类型
 */
export type EasingFunction = (t: number) => number;

/**
 * 常用缓动函数
 */
export const Easing = {
  // 线性
  linear: (t: number) => t,

  // 二次方
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // 三次方
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // 弹性
  easeOutElastic: (t: number) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
  },

  // 回弹
  easeOutBounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

/**
 * 淡入动画
 */
export const fadeIn = (
  frame: number,
  startFrame: number = 0,
  duration: number = 15
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * 淡出动画
 */
export const fadeOut = (
  frame: number,
  endFrame: number,
  duration: number = 15
): number => {
  return interpolate(frame, [endFrame - duration, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * 淡入淡出动画
 */
export const fadeInOut = (
  frame: number,
  startFrame: number,
  endFrame: number,
  fadeDuration: number = 15
): number => {
  const fadeInValue = fadeIn(frame, startFrame, fadeDuration);
  const fadeOutValue = fadeOut(frame, endFrame, fadeDuration);
  return Math.min(fadeInValue, fadeOutValue);
};

/**
 * 滑入动画（从下方）
 */
export const slideUp = (
  frame: number,
  startFrame: number = 0,
  duration: number = 20,
  distance: number = 50
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * 滑入动画（从左侧）
 */
export const slideRight = (
  frame: number,
  startFrame: number = 0,
  duration: number = 20,
  distance: number = 50
): number => {
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [-distance, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
};

/**
 * 缩放动画
 */
export const scaleIn = (
  frame: number,
  startFrame: number = 0,
  duration: number = 20,
  fromScale: number = 0.8
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [fromScale, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * 弹簧动画
 */
export const springAnimation = (
  frame: number,
  fps: number = 30,
  config?: {
    damping?: number;
    mass?: number;
    stiffness?: number;
    overshootClamping?: boolean;
  }
): number => {
  return spring({
    frame,
    fps,
    config: {
      damping: 10,
      mass: 1,
      stiffness: 100,
      overshootClamping: false,
      ...config,
    },
  });
};

/**
 * 打字机效果
 */
export const typewriter = (
  frame: number,
  text: string,
  startFrame: number = 0,
  charsPerFrame: number = 0.5
): string => {
  const progress = Math.max(0, frame - startFrame);
  const visibleChars = Math.floor(progress * charsPerFrame);
  return text.slice(0, visibleChars);
};

/**
 * 波浪动画
 */
export const wave = (
  frame: number,
  frequency: number = 0.1,
  amplitude: number = 10
): number => {
  return Math.sin(frame * frequency) * amplitude;
};

/**
 * 脉冲动画
 */
export const pulse = (
  frame: number,
  frequency: number = 60,
  minScale: number = 1,
  maxScale: number = 1.1
): number => {
  return interpolate(frame % frequency, [0, frequency / 2, frequency], [
    minScale,
    maxScale,
    minScale,
  ]);
};
