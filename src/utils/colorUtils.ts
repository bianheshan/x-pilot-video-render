import { interpolateColors } from "remotion";

/**
 * 颜色工具函数
 */

/**
 * 将十六进制颜色转换为 RGB
 */
export function hexToRgb(hex: string): string {
  // 移除 # 号
  const cleanHex = hex.replace("#", "");
  
  // 解析 RGB 值
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

/**
 * 为颜色添加透明度
 */
export function addAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb}, ${alpha})`;
}

/**
 * 混合两个颜色
 */
export function mixColors(color1: string, color2: string, ratio: number = 0.5): string {
  const rgb1 = hexToRgb(color1).split(", ").map(Number);
  const rgb2 = hexToRgb(color2).split(", ").map(Number);
  
  const r = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
  const g = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
  const b = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);
  
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * 安全的颜色插值（强制校验输入并使用 interpolateColors）
 */
export function safeInterpolateColor(
  input: number,
  inputRange: number[],
  outputRange: string[]
): string {
  if (!Array.isArray(inputRange) || !Array.isArray(outputRange)) {
    throw new Error("safeInterpolateColor: inputRange/outputRange 需要数组");
  }

  if (inputRange.length !== outputRange.length) {
    throw new Error("safeInterpolateColor: inputRange 与 outputRange 长度必须一致");
  }

  if (inputRange.some((v) => typeof v !== "number" || Number.isNaN(v))) {
    throw new Error("safeInterpolateColor: inputRange 只能包含数字");
  }

  if (outputRange.some((v) => typeof v !== "string")) {
    throw new Error("safeInterpolateColor: outputRange 只能包含颜色字符串");
  }

  return interpolateColors(input, inputRange, outputRange);
}

/**
 * 将透明度插值封装为安全版本，返回 `rgba`，便于与透明渐变配合
 */
export function safeInterpolateAlpha(
  input: number,
  inputRange: number[],
  outputRange: [number, number],
  baseColor: string
): string {
  const [startAlpha, endAlpha] = outputRange;
  if ([startAlpha, endAlpha].some((v) => typeof v !== "number" || Number.isNaN(v))) {
    throw new Error("safeInterpolateAlpha: outputRange 必须是数字透明度");
  }
  const alpha = interpolateColors(
    input,
    inputRange,
    [addAlpha(baseColor, startAlpha), addAlpha(baseColor, endAlpha)]
  );
  return alpha;
}
