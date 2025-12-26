import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface PhysSpringMassProps {
  /** 标题 */
  title?: string;
  /** 质量 (kg) */
  mass?: number;
  /** 弹簧常数 (N/m) */
  springConstant?: number;
  /** 阻尼系数 */
  damping?: number;
  /** 初始位移 (m) */
  initialDisplacement?: number;
  /** 是否显示能量图 */
  showEnergyGraph?: boolean;
}

/**
 * 弹簧阻尼系统
 * 
 * 模拟物体挂在弹簧上的简谐运动和阻尼振动
 * 
 * 物理原理：
 * - 胡克定律：F = -kx
 * - 牛顿第二定律：F = ma
 * - 阻尼力：F_d = -bv
 * - 运动方程：mẍ + bẋ + kx = 0
 * 
 * 教学要点：
 * - 简谐运动
 * - 阻尼振动
 * - 能量转换
 * - 共振频率
 */
export const PhysSpringMass: React.FC<PhysSpringMassProps> = ({
  title = "弹簧阻尼系统 - 简谐运动",
  mass = 1.0,
  springConstant = 10.0,
  damping = 0.1,
  initialDisplacement = 100,
  showEnergyGraph = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 计算运动参数
  const omega0 = Math.sqrt(springConstant / mass); // 固有角频率
  const gamma = damping / (2 * mass); // 阻尼系数
  const omegaD = Math.sqrt(omega0 * omega0 - gamma * gamma); // 阻尼角频率

  // 时间
  const t = frame / 30; // 秒

  // 位移（阻尼振动方程）
  const displacement = useMemo(() => {
    if (gamma >= omega0) {
      // 过阻尼或临界阻尼
      return initialDisplacement * Math.exp(-gamma * t);
    } else {
      // 欠阻尼
      return initialDisplacement * Math.exp(-gamma * t) * Math.cos(omegaD * t);
    }
  }, [t, gamma, omega0, omegaD, initialDisplacement]);

  // 速度
  const velocity = useMemo(() => {
    if (gamma >= omega0) {
      return -initialDisplacement * gamma * Math.exp(-gamma * t);
    } else {
      return (
        initialDisplacement *
        Math.exp(-gamma * t) *
        (-gamma * Math.cos(omegaD * t) - omegaD * Math.sin(omegaD * t))
      );
    }
  }, [t, gamma, omega0, omegaD, initialDisplacement]);

  // 能量
  const kineticEnergy = 0.5 * mass * velocity * velocity;
  const potentialEnergy = 0.5 * springConstant * displacement * displacement;
  const totalEnergy = kineticEnergy + potentialEnergy;

  // 绘制历史轨迹
  const history = useMemo(() => {
    const points = [];
    const maxPoints = 150;
    for (let i = Math.max(0, frame - maxPoints); i <= frame; i++) {
      const ti = i / 30;
      let disp;
      if (gamma >= omega0) {
        disp = initialDisplacement * Math.exp(-gamma * ti);
      } else {
        disp = initialDisplacement * Math.exp(-gamma * ti) * Math.cos(omegaD * ti);
      }
      points.push({ frame: i, displacement: disp });
    }
    return points;
  }, [frame, gamma, omega0, omegaD, initialDisplacement]);

  // 进入动画
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const centerX = 640;
  const centerY = 200;
  const massY = centerY + displacement;

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
          fontSize: 42,
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <div style={{ display: "flex", gap: 40 }}>
        {/* 左侧：弹簧系统 */}
        <svg width={400} height={600} style={{ overflow: "visible" }}>
          {/* 固定点 */}
          <rect
            x={centerX - 100}
            y={centerY - 50}
            width={200}
            height={20}
            fill={theme.colors.textSecondary}
            rx={5}
          />

          {/* 弹簧 */}
          <g>
            {Array.from({ length: 20 }).map((_, i) => {
              const springY = centerY + (i * (massY - centerY)) / 20;
              const nextSpringY = centerY + ((i + 1) * (massY - centerY)) / 20;
              const offset = i % 2 === 0 ? -20 : 20;

              return (
                <line
                  key={`spring-${i}`}
                  x1={centerX + (i % 2 === 0 ? 0 : offset)}
                  y1={springY}
                  x2={centerX + ((i + 1) % 2 === 0 ? 0 : offset)}
                  y2={nextSpringY}
                  stroke={theme.colors.primary}
                  strokeWidth={3}
                />
              );
            })}
          </g>

          {/* 质量块 */}
          <rect
            x={centerX - 40}
            y={massY - 40}
            width={80}
            height={80}
            fill={theme.colors.secondary}
            rx={5}
            style={{
              filter: `drop-shadow(0 4px 8px ${theme.colors.secondary}40)`,
            }}
          />

          {/* 质量标签 */}
          <text
            x={centerX}
            y={massY}
            fill="white"
            fontSize={20}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            {mass} kg
          </text>

          {/* 平衡位置线 */}
          <line
            x1={centerX - 100}
            y1={centerY}
            x2={centerX + 100}
            y2={centerY}
            stroke={theme.colors.textSecondary}
            strokeWidth={1}
            strokeDasharray="5,5"
            opacity={0.5}
          />
        </svg>

        {/* 右侧：位移-时间图 */}
        <svg width={600} height={600}>
          {/* 坐标轴 */}
          <line
            x1={50}
            y1={300}
            x2={550}
            y2={300}
            stroke={theme.colors.textSecondary}
            strokeWidth={2}
          />
          <line
            x1={50}
            y1={50}
            x2={50}
            y2={550}
            stroke={theme.colors.textSecondary}
            strokeWidth={2}
          />

          {/* 网格 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`grid-${i}`}
              x1={50}
              y1={100 + i * 100}
              x2={550}
              y2={100 + i * 100}
              stroke={theme.colors.textSecondary}
              strokeWidth={1}
              opacity={0.2}
            />
          ))}

          {/* 绘制轨迹 */}
          <polyline
            points={history
              .map((p) => {
                const x = 50 + ((p.frame - (frame - history.length)) * 500) / history.length;
                const y = 300 - p.displacement * 1.5;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={3}
          />

          {/* 标签 */}
          <text
            x={300}
            y={30}
            fill={theme.colors.text}
            fontSize={18}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            位移-时间图
          </text>

          {/* 能量图 */}
          {showEnergyGraph && (
            <g>
              <text
                x={300}
                y={580}
                fill={theme.colors.text}
                fontSize={14}
                textAnchor="middle"
                style={{ fontFamily: theme.fonts.body }}
              >
                动能: {kineticEnergy.toFixed(2)} J | 势能: {potentialEnergy.toFixed(2)} J | 总能量: {totalEnergy.toFixed(2)} J
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 参数显示 */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 30,
          fontSize: 16,
          color: theme.colors.textSecondary,
        }}
      >
        <div>⚙️ k = {springConstant} N/m</div>
        <div>🎯 ω₀ = {omega0.toFixed(2)} rad/s</div>
        <div>💨 γ = {gamma.toFixed(3)}</div>
        <div>📊 位移 = {displacement.toFixed(1)} cm</div>
      </div>
    </div>
  );
};
