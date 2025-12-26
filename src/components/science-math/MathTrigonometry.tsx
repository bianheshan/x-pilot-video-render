import React, { useRef, useEffect } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface MathTrigonometryProps {
  /** 标题 */
  title?: string;
  /** 是否显示余弦 */
  showCosine?: boolean;
  /** 旋转速度 */
  rotationSpeed?: number;
}

/**
 * 三角函数单位圆
 * 
 * 动态展示单位圆旋转与 Sin/Cos 波形的对应关系
 * 适用场景：三角函数教学、周期运动、波动现象
 * 
 * 教学要点：
 * - 单位圆与三角函数的关系
 * - 正弦和余弦的周期性
 * - 相位差的概念
 * 
 * 知识准确性：严格遵循数学定义，角度与波形完全对应
 */
export const MathTrigonometry: React.FC<MathTrigonometryProps> = ({
  title = "三角函数与单位圆",
  showCosine = true,
  rotationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 当前角度（弧度）
  const angle = (frame * rotationSpeed * Math.PI) / 60;

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

    // 单位圆中心和半径
    const circleX = 250;
    const circleY = height / 2;
    const radius = 150;

    // 波形起始位置
    const waveStartX = 450;
    const waveY = height / 2;
    const waveWidth = 500;
    const waveHeight = 150;

    // === 绘制单位圆 ===
    ctx.strokeStyle = theme.colors.surfaceLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制坐标轴
    ctx.strokeStyle = theme.colors.textSecondary;
    ctx.lineWidth = 1;
    // X 轴
    ctx.beginPath();
    ctx.moveTo(circleX - radius - 20, circleY);
    ctx.lineTo(circleX + radius + 20, circleY);
    ctx.stroke();
    // Y 轴
    ctx.beginPath();
    ctx.moveTo(circleX, circleY - radius - 20);
    ctx.lineTo(circleX, circleY + radius + 20);
    ctx.stroke();

    // 计算当前点的位置
    const pointX = circleX + radius * Math.cos(angle);
    const pointY = circleY - radius * Math.sin(angle);

    // 绘制半径线
    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(circleX, circleY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();

    // 绘制角度弧
    ctx.strokeStyle = theme.colors.warning;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(circleX, circleY, 40, 0, -angle, true);
    ctx.stroke();

    // 绘制投影线（正弦）
    ctx.strokeStyle = theme.colors.error;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, circleY);
    ctx.stroke();

    // 绘制投影线（余弦）
    if (showCosine) {
      ctx.strokeStyle = theme.colors.success;
      ctx.beginPath();
      ctx.moveTo(pointX, pointY);
      ctx.lineTo(circleX, pointY);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 绘制运动点
    ctx.fillStyle = theme.colors.primary;
    ctx.beginPath();
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
    ctx.fill();

    // === 绘制波形图 ===
    // 绘制坐标轴
    ctx.strokeStyle = theme.colors.textSecondary;
    ctx.lineWidth = 1;
    // X 轴
    ctx.beginPath();
    ctx.moveTo(waveStartX, waveY);
    ctx.lineTo(waveStartX + waveWidth, waveY);
    ctx.stroke();
    // Y 轴
    ctx.beginPath();
    ctx.moveTo(waveStartX, waveY - waveHeight - 20);
    ctx.lineTo(waveStartX, waveY + waveHeight + 20);
    ctx.stroke();

    // 绘制正弦波
    ctx.strokeStyle = theme.colors.error;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= waveWidth; i++) {
      const t = (i / waveWidth) * 4 * Math.PI;
      const y = waveY - waveHeight * Math.sin(t - angle);
      if (i === 0) {
        ctx.moveTo(waveStartX + i, y);
      } else {
        ctx.lineTo(waveStartX + i, y);
      }
    }
    ctx.stroke();

    // 绘制余弦波
    if (showCosine) {
      ctx.strokeStyle = theme.colors.success;
      ctx.beginPath();
      for (let i = 0; i <= waveWidth; i++) {
        const t = (i / waveWidth) * 4 * Math.PI;
        const y = waveY - waveHeight * Math.cos(t - angle);
        if (i === 0) {
          ctx.moveTo(waveStartX + i, y);
        } else {
          ctx.lineTo(waveStartX + i, y);
        }
      }
      ctx.stroke();
    }

    // 绘制当前值指示线
    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(waveStartX, waveY - waveHeight * Math.sin(angle));
    ctx.lineTo(waveStartX + 50, waveY - waveHeight * Math.sin(angle));
    ctx.stroke();
    ctx.setLineDash([]);

    // === 绘制标签 ===
    ctx.fillStyle = theme.colors.text;
    ctx.font = `16px ${theme.fonts.body}`;
    ctx.textAlign = "center";

    // 角度标签
    ctx.fillText(
      `θ = ${((angle * 180) / Math.PI).toFixed(1)}°`,
      circleX,
      circleY - radius - 30
    );

    // 正弦值标签
    ctx.fillStyle = theme.colors.error;
    ctx.fillText(
      `sin(θ) = ${Math.sin(angle).toFixed(3)}`,
      circleX + radius + 80,
      pointY
    );

    // 余弦值标签
    if (showCosine) {
      ctx.fillStyle = theme.colors.success;
      ctx.fillText(
        `cos(θ) = ${Math.cos(angle).toFixed(3)}`,
        pointX,
        circleY + radius + 30
      );
    }

    // 波形标签
    ctx.fillStyle = theme.colors.error;
    ctx.textAlign = "left";
    ctx.fillText("y = sin(θ)", waveStartX + waveWidth + 10, waveY - 50);

    if (showCosine) {
      ctx.fillStyle = theme.colors.success;
      ctx.fillText("y = cos(θ)", waveStartX + waveWidth + 10, waveY + 50);
    }
  }, [frame, angle, showCosine, theme]);

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
          marginBottom: 40,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 画布 */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={400}
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
        单位圆上的点旋转，投影形成正弦和余弦波形
      </div>
    </div>
  );
};
