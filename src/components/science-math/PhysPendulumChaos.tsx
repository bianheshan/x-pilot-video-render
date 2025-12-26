import React, { useRef, useEffect, useState } from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface PhysPendulumChaosProps {
  /** 标题 */
  title?: string;
  /** 是否显示轨迹 */
  showTrail?: boolean;
  /** 重力加速度 */
  gravity?: number;
}

/**
 * 混沌摆模拟
 * 
 * 双摆系统，展示混沌理论和不可预测性
 * 适用场景：混沌理论教学、非线性动力学、初始条件敏感性
 * 
 * 教学要点：
 * - 混沌系统的特征
 * - 初始条件的微小差异导致巨大差异
 * - 确定性系统的不可预测性
 * 
 * 知识准确性：使用龙格-库塔法数值求解双摆运动方程
 */
export const PhysPendulumChaos: React.FC<PhysPendulumChaosProps> = ({
  title = "双摆混沌系统",
  showTrail = true,
  gravity = 9.8,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 双摆状态
  const [state, setState] = useState({
    theta1: Math.PI / 2, // 第一摆角度
    theta2: Math.PI / 2, // 第二摆角度
    omega1: 0, // 第一摆角速度
    omega2: 0, // 第二摆角速度
    trail: [] as Array<{ x: number; y: number }>,
  });

  // 双摆参数
  const m1 = 1; // 第一摆质量
  const m2 = 1; // 第二摆质量
  const l1 = 150; // 第一摆长度
  const l2 = 150; // 第二摆长度
  const g = gravity;

  // 双摆运动方程（使用龙格-库塔法求解）
  const doublePendulumDerivatives = (
    theta1: number,
    theta2: number,
    omega1: number,
    omega2: number
  ) => {
    const delta = theta2 - theta1;
    const denominator1 =
      (m1 + m2) * l1 - m2 * l1 * Math.cos(delta) * Math.cos(delta);
    const denominator2 =
      (l2 / l1) * denominator1;

    const dtheta1 = omega1;
    const dtheta2 = omega2;

    const domega1 =
      (m2 * l1 * omega1 * omega1 * Math.sin(delta) * Math.cos(delta) +
        m2 * g * Math.sin(theta2) * Math.cos(delta) +
        m2 * l2 * omega2 * omega2 * Math.sin(delta) -
        (m1 + m2) * g * Math.sin(theta1)) /
      denominator1;

    const domega2 =
      (-m2 * l2 * omega2 * omega2 * Math.sin(delta) * Math.cos(delta) +
        (m1 + m2) * g * Math.sin(theta1) * Math.cos(delta) -
        (m1 + m2) * l1 * omega1 * omega1 * Math.sin(delta) -
        (m1 + m2) * g * Math.sin(theta2)) /
      denominator2;

    return { dtheta1, dtheta2, domega1, domega2 };
  };

  // 更新双摆状态
  useEffect(() => {
    const dt = 0.05; // 时间步长

    setState((prevState) => {
      const { theta1, theta2, omega1, omega2, trail } = prevState;

      // 龙格-库塔法（RK4）
      const k1 = doublePendulumDerivatives(theta1, theta2, omega1, omega2);
      const k2 = doublePendulumDerivatives(
        theta1 + 0.5 * dt * k1.dtheta1,
        theta2 + 0.5 * dt * k1.dtheta2,
        omega1 + 0.5 * dt * k1.domega1,
        omega2 + 0.5 * dt * k1.domega2
      );
      const k3 = doublePendulumDerivatives(
        theta1 + 0.5 * dt * k2.dtheta1,
        theta2 + 0.5 * dt * k2.dtheta2,
        omega1 + 0.5 * dt * k2.domega1,
        omega2 + 0.5 * dt * k2.domega2
      );
      const k4 = doublePendulumDerivatives(
        theta1 + dt * k3.dtheta1,
        theta2 + dt * k3.dtheta2,
        omega1 + dt * k3.domega1,
        omega2 + dt * k3.domega2
      );

      const newTheta1 =
        theta1 + (dt / 6) * (k1.dtheta1 + 2 * k2.dtheta1 + 2 * k3.dtheta1 + k4.dtheta1);
      const newTheta2 =
        theta2 + (dt / 6) * (k1.dtheta2 + 2 * k2.dtheta2 + 2 * k3.dtheta2 + k4.dtheta2);
      const newOmega1 =
        omega1 + (dt / 6) * (k1.domega1 + 2 * k2.domega1 + 2 * k3.domega1 + k4.domega1);
      const newOmega2 =
        omega2 + (dt / 6) * (k1.domega2 + 2 * k2.domega2 + 2 * k3.domega2 + k4.domega2);

      // 计算第二个摆的位置用于轨迹
      const x2 = l1 * Math.sin(newTheta1) + l2 * Math.sin(newTheta2);
      const y2 = l1 * Math.cos(newTheta1) + l2 * Math.cos(newTheta2);

      // 更新轨迹
      const newTrail = showTrail
        ? [...trail, { x: x2, y: y2 }].slice(-200)
        : [];

      return {
        theta1: newTheta1,
        theta2: newTheta2,
        omega1: newOmega1,
        omega2: newOmega2,
        trail: newTrail,
      };
    });
  }, [frame, showTrail, g, l1, l2, m1, m2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = 200;

    // 清空画布
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, width, height);

    // 计算摆的位置
    const x1 = centerX + l1 * Math.sin(state.theta1);
    const y1 = centerY + l1 * Math.cos(state.theta1);
    const x2 = x1 + l2 * Math.sin(state.theta2);
    const y2 = y1 + l2 * Math.cos(state.theta2);

    // 绘制轨迹
    if (showTrail && state.trail.length > 1) {
      ctx.strokeStyle = theme.colors.primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      state.trail.forEach((point, i) => {
        const x = centerX + point.x;
        const y = centerY + point.y;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // 绘制固定点
    ctx.fillStyle = theme.colors.text;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // 绘制第一根摆杆
    ctx.strokeStyle = theme.colors.textSecondary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // 绘制第一个摆球
    ctx.fillStyle = theme.colors.warning;
    ctx.beginPath();
    ctx.arc(x1, y1, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制第二根摆杆
    ctx.strokeStyle = theme.colors.textSecondary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 绘制第二个摆球
    ctx.fillStyle = theme.colors.primary;
    ctx.beginPath();
    ctx.arc(x2, y2, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制能量信息
    const kineticEnergy =
      0.5 * m1 * Math.pow(l1 * state.omega1, 2) +
      0.5 *
        m2 *
        Math.pow(
          Math.sqrt(
            Math.pow(l1 * state.omega1 * Math.cos(state.theta1), 2) +
              Math.pow(l2 * state.omega2 * Math.cos(state.theta2), 2)
          ),
          2
        );
    const potentialEnergy =
      -m1 * g * l1 * Math.cos(state.theta1) -
      m2 * g * (l1 * Math.cos(state.theta1) + l2 * Math.cos(state.theta2));
    const totalEnergy = kineticEnergy + potentialEnergy;

    ctx.fillStyle = theme.colors.text;
    ctx.font = `16px ${theme.fonts.mono}`;
    ctx.textAlign = "left";
    ctx.fillText(`动能: ${kineticEnergy.toFixed(2)} J`, 20, height - 80);
    ctx.fillText(`势能: ${potentialEnergy.toFixed(2)} J`, 20, height - 50);
    ctx.fillText(`总能量: ${totalEnergy.toFixed(2)} J`, 20, height - 20);
  }, [state, theme, showTrail, l1, l2, m1, m2, g]);

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
        {title}
      </h2>

      {/* 画布 */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        style={{
          border: `2px solid ${theme.colors.surfaceLight}`,
          borderRadius: 8,
          boxShadow: `0 4px 20px ${theme.colors.surfaceLight}40`,
        }}
      />

      {/* 说明 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        双摆系统展示混沌现象：初始条件的微小差异会导致完全不同的运动轨迹
      </div>
    </div>
  );
};
