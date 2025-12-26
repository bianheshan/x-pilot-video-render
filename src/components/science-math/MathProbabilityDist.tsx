import React, { useRef, useEffect } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface MathProbabilityDistProps {
  /** 分布类型 */
  type?: "normal" | "uniform" | "exponential";
  /** 均值 (正态分布) */
  mean?: number;
  /** 标准差 (正态分布) */
  stdDev?: number;
  /** 是否动画参数 */
  animateParams?: boolean;
}

/**
 * 概率分布模拟
 * 
 * 高斯分布钟形曲线，支持动态改变方差和均值
 * 适用场景：统计学教学、数据分析、概率论
 * 
 * 教学要点：
 * - 正态分布的特征
 * - 均值和标准差的影响
 * - 68-95-99.7 规则
 * 
 * 知识准确性：使用标准正态分布公式，数值计算精确
 */
export const MathProbabilityDist: React.FC<MathProbabilityDistProps> = ({
  type = "normal",
  mean: initialMean = 0,
  stdDev: initialStdDev = 1,
  animateParams = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 动画参数
  const mean = animateParams
    ? interpolate(frame, [0, 60, 120], [0, 2, 0], { extrapolateRight: "clamp" })
    : initialMean;

  const stdDev = animateParams
    ? interpolate(frame, [0, 60, 120], [1, 0.5, 1.5], {
        extrapolateRight: "clamp",
      })
    : initialStdDev;

  // 正态分布概率密度函数
  const normalPDF = (x: number, mu: number, sigma: number): number => {
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return coefficient * Math.exp(exponent);
  };

  // 均匀分布
  const uniformPDF = (x: number, a: number, b: number): number => {
    return x >= a && x <= b ? 1 / (b - a) : 0;
  };

  // 指数分布
  const exponentialPDF = (x: number, lambda: number): number => {
    return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 清空画布
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, width, height);

    // 坐标系参数
    const padding = 60;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const xMin = mean - 4 * stdDev;
    const xMax = mean + 4 * stdDev;
    const yMax = normalPDF(mean, mean, stdDev) * 1.2;

    // 坐标转换
    const xToCanvas = (x: number) =>
      padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const yToCanvas = (y: number) =>
      height - padding - (y / yMax) * plotHeight;

    // 绘制坐标轴
    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 2;
    // X 轴
    ctx.beginPath();
    ctx.moveTo(padding, yToCanvas(0));
    ctx.lineTo(width - padding, yToCanvas(0));
    ctx.stroke();
    // Y 轴
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // 绘制网格
    ctx.strokeStyle = theme.colors.surfaceLight;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // 绘制分布曲线
    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();

    const samples = 500;
    for (let i = 0; i <= samples; i++) {
      const x = xMin + (i / samples) * (xMax - xMin);
      let y: number;

      switch (type) {
        case "normal":
          y = normalPDF(x, mean, stdDev);
          break;
        case "uniform":
          y = uniformPDF(x, mean - stdDev, mean + stdDev);
          break;
        case "exponential":
          y = exponentialPDF(x - xMin, 1 / stdDev);
          break;
        default:
          y = 0;
      }

      const canvasX = xToCanvas(x);
      const canvasY = yToCanvas(y);

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // 填充曲线下方区域
    ctx.lineTo(xToCanvas(xMax), yToCanvas(0));
    ctx.lineTo(xToCanvas(xMin), yToCanvas(0));
    ctx.closePath();
    ctx.fillStyle = `${theme.colors.primary}20`;
    ctx.fill();

    // 绘制均值线
    if (type === "normal") {
      ctx.strokeStyle = theme.colors.error;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xToCanvas(mean), yToCanvas(0));
      ctx.lineTo(xToCanvas(mean), yToCanvas(normalPDF(mean, mean, stdDev)));
      ctx.stroke();

      // 绘制标准差范围
      ctx.strokeStyle = theme.colors.warning;
      // μ - σ
      ctx.beginPath();
      ctx.moveTo(xToCanvas(mean - stdDev), yToCanvas(0));
      ctx.lineTo(
        xToCanvas(mean - stdDev),
        yToCanvas(normalPDF(mean - stdDev, mean, stdDev))
      );
      ctx.stroke();
      // μ + σ
      ctx.beginPath();
      ctx.moveTo(xToCanvas(mean + stdDev), yToCanvas(0));
      ctx.lineTo(
        xToCanvas(mean + stdDev),
        yToCanvas(normalPDF(mean + stdDev, mean, stdDev))
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 绘制标签
    ctx.fillStyle = theme.colors.text;
    ctx.font = `14px ${theme.fonts.mono}`;
    ctx.textAlign = "center";

    // X 轴标签
    for (let i = 0; i <= 8; i++) {
      const x = xMin + (i / 8) * (xMax - xMin);
      const canvasX = xToCanvas(x);
      ctx.fillText(x.toFixed(1), canvasX, height - padding + 25);
    }

    // Y 轴标签
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * yMax;
      const canvasY = yToCanvas(y);
      ctx.fillText(y.toFixed(2), padding - 10, canvasY + 5);
    }

    // 参数标签
    ctx.fillStyle = theme.colors.primary;
    ctx.font = `18px ${theme.fonts.body}`;
    ctx.textAlign = "left";
    if (type === "normal") {
      ctx.fillText(`μ (均值) = ${mean.toFixed(2)}`, width - padding - 200, 40);
      ctx.fillText(
        `σ (标准差) = ${stdDev.toFixed(2)}`,
        width - padding - 200,
        70
      );
    }
  }, [frame, type, mean, stdDev, theme]);

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        fontFamily: theme.fonts.body,
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
        }}
      >
        {type === "normal" && "正态分布 (高斯分布)"}
        {type === "uniform" && "均匀分布"}
        {type === "exponential" && "指数分布"}
      </h2>

      {/* 画布 */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        style={{
          border: `2px solid ${theme.colors.surfaceLight}`,
          borderRadius: 8,
          boxShadow: `0 4px 20px ${theme.colors.surfaceLight}40`,
        }}
      />

      {/* 说明 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        {type === "normal" &&
          "钟形曲线展示数据的分布规律，68% 的数据在 ±1σ 范围内"}
        {type === "uniform" && "所有值出现的概率相等"}
        {type === "exponential" && "描述事件发生的时间间隔"}
      </div>
    </div>
  );
};
