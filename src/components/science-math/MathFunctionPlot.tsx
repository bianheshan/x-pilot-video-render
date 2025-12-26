import React, { useRef, useEffect } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface MathFunctionPlotProps {
  /** 函数表达式 (使用 x 作为变量) */
  expression: string;
  /** 函数名称 */
  functionName?: string;
  /** X 轴范围 */
  xRange?: [number, number];
  /** Y 轴范围 */
  yRange?: [number, number];
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 动画参数 (如 a, b, c 等) */
  animatedParams?: Record<string, { from: number; to: number }>;
}

/**
 * 数学函数绘图仪
 * 
 * 实时绘制 y=f(x) 曲线，支持参数调整动画
 * 适用场景：函数教学、数学分析、参数影响演示
 * 
 * 教学要点：
 * - 函数图像的直观展示
 * - 参数变化对函数的影响
 * - 函数的性质（单调性、极值等）
 * 
 * 知识准确性：使用精确的数学计算，采样点足够密集
 */
export const MathFunctionPlot: React.FC<MathFunctionPlotProps> = ({
  expression = "Math.sin(x)",
  functionName = "y = sin(x)",
  xRange = [-10, 10],
  yRange = [-5, 5],
  showGrid = true,
  animatedParams = {},
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 计算动画参数
  const params: Record<string, number> = {};
  Object.entries(animatedParams).forEach(([key, { from, to }]) => {
    params[key] = interpolate(frame, [0, 120], [from, to], {
      extrapolateRight: "clamp",
    });
  });

  // 安全的函数求值
  const evaluateFunction = (x: number): number | null => {
    try {
      // 创建函数上下文
      const func = new Function(
        "x",
        ...Object.keys(params),
        `return ${expression}`
      );
      const result = func(x, ...Object.values(params));
      return isFinite(result) ? result : null;
    } catch {
      return null;
    }
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

    // 坐标转换函数
    const xToCanvas = (x: number) =>
      ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    const yToCanvas = (y: number) =>
      height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = theme.colors.surfaceLight;
      ctx.lineWidth = 1;

      // 垂直网格线
      for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
        const canvasX = xToCanvas(x);
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, height);
        ctx.stroke();
      }

      // 水平网格线
      for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
        const canvasY = yToCanvas(y);
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(width, canvasY);
        ctx.stroke();
      }
    }

    // 绘制坐标轴
    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 2;

    // X 轴
    if (yRange[0] <= 0 && yRange[1] >= 0) {
      const y0 = yToCanvas(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(width, y0);
      ctx.stroke();

      // X 轴箭头
      ctx.beginPath();
      ctx.moveTo(width - 10, y0 - 5);
      ctx.lineTo(width, y0);
      ctx.lineTo(width - 10, y0 + 5);
      ctx.stroke();
    }

    // Y 轴
    if (xRange[0] <= 0 && xRange[1] >= 0) {
      const x0 = xToCanvas(0);
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, height);
      ctx.stroke();

      // Y 轴箭头
      ctx.beginPath();
      ctx.moveTo(x0 - 5, 10);
      ctx.lineTo(x0, 0);
      ctx.lineTo(x0 + 5, 10);
      ctx.stroke();
    }

    // 绘制函数曲线
    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let started = false;
    const samples = 1000; // 高密度采样确保准确性

    for (let i = 0; i <= samples; i++) {
      const x = xRange[0] + (i / samples) * (xRange[1] - xRange[0]);
      const y = evaluateFunction(x);

      if (y !== null && y >= yRange[0] && y <= yRange[1]) {
        const canvasX = xToCanvas(x);
        const canvasY = yToCanvas(y);

        if (!started) {
          ctx.moveTo(canvasX, canvasY);
          started = true;
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      } else {
        started = false;
      }
    }

    ctx.stroke();

    // 绘制坐标轴标签
    ctx.fillStyle = theme.colors.text;
    ctx.font = `14px ${theme.fonts.mono}`;
    ctx.textAlign = "center";

    // X 轴标签
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
      if (x === 0) continue;
      const canvasX = xToCanvas(x);
      const canvasY = yToCanvas(0);
      ctx.fillText(
        x.toString(),
        canvasX,
        Math.min(Math.max(canvasY + 20, 20), height - 5)
      );
    }

    // Y 轴标签
    ctx.textAlign = "right";
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
      if (y === 0) continue;
      const canvasX = xToCanvas(0);
      const canvasY = yToCanvas(y);
      ctx.fillText(
        y.toString(),
        Math.min(Math.max(canvasX - 10, 30), width - 10),
        canvasY + 5
      );
    }
  }, [
    frame,
    expression,
    xRange,
    yRange,
    showGrid,
    params,
    theme,
    evaluateFunction,
  ]);

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
        函数绘图仪
      </h2>

      {/* 函数表达式 */}
      <div
        style={{
          fontSize: 32,
          color: theme.colors.primary,
          marginBottom: 30,
          fontFamily: theme.fonts.mono,
          fontWeight: "bold",
        }}
      >
        {functionName}
      </div>

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

      {/* 参数显示 */}
      {Object.keys(animatedParams).length > 0 && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
            fontSize: 18,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.mono,
          }}
        >
          {Object.entries(params).map(([key, value]) => (
            <div key={key}>
              {key} = {value.toFixed(2)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
