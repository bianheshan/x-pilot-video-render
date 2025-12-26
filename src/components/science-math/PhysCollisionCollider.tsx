import React, { useMemo, useRef } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

export interface PhysCollisionColliderProps {
  /** 标题 */
  title?: string;
  /** 小球数量 */
  ballCount?: number;
  /** 容器宽度 */
  containerWidth?: number;
  /** 容器高度 */
  containerHeight?: number;
  /** 是否显示速度矢量 */
  showVelocity?: boolean;
  /** 温度（影响速度） */
  temperature?: number;
}

/**
 * 多体碰撞实验
 * 
 * 模拟大量小球在容器内随机碰撞，展示气体分子运动论
 * 
 * 物理原理：
 * - 动量守恒：m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'
 * - 能量守恒（弹性碰撞）
 * - 气体分子运动论
 * - 麦克斯韦速度分布
 * 
 * 教学要点：
 * - 微观粒子的随机运动
 * - 宏观温度与微观动能的关系
 * - 压强的微观解释
 */
export const PhysCollisionCollider: React.FC<PhysCollisionColliderProps> = ({
  title = "多体碰撞 - 气体分子模拟",
  ballCount = 50,
  containerWidth = 800,
  containerHeight = 600,
  showVelocity = false,
  temperature = 1.0,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 初始化小球
  const initialBalls = useMemo(() => {
    const balls: Ball[] = [];
    for (let i = 0; i < ballCount; i++) {
      balls.push({
        id: i,
        x: Math.random() * (containerWidth - 40) + 20,
        y: Math.random() * (containerHeight - 40) + 20,
        vx: (Math.random() - 0.5) * 10 * temperature,
        vy: (Math.random() - 0.5) * 10 * temperature,
        radius: 8,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        mass: 1,
      });
    }
    return balls;
  }, [ballCount, containerWidth, containerHeight, temperature]);

  // 物理模拟
  const balls = useMemo(() => {
    const dt = 0.5; // 时间步长
    const currentBalls = JSON.parse(JSON.stringify(initialBalls)) as Ball[];

    // 模拟到当前帧
    for (let step = 0; step < frame; step++) {
      // 更新位置
      currentBalls.forEach((ball) => {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        // 墙壁碰撞
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = Math.abs(ball.vx);
        }
        if (ball.x + ball.radius > containerWidth) {
          ball.x = containerWidth - ball.radius;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = Math.abs(ball.vy);
        }
        if (ball.y + ball.radius > containerHeight) {
          ball.y = containerHeight - ball.radius;
          ball.vy = -Math.abs(ball.vy);
        }
      });

      // 球球碰撞检测
      for (let i = 0; i < currentBalls.length; i++) {
        for (let j = i + 1; j < currentBalls.length; j++) {
          const ball1 = currentBalls[i];
          const ball2 = currentBalls[j];

          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 碰撞检测
          if (distance < ball1.radius + ball2.radius) {
            // 碰撞响应（弹性碰撞）
            const nx = dx / distance;
            const ny = dy / distance;

            // 相对速度
            const dvx = ball1.vx - ball2.vx;
            const dvy = ball1.vy - ball2.vy;

            // 法向相对速度
            const dvn = dvx * nx + dvy * ny;

            // 如果正在分离，跳过
            if (dvn > 0) continue;

            // 冲量
            const impulse = (2 * dvn) / (ball1.mass + ball2.mass);

            // 更新速度
            ball1.vx -= impulse * ball2.mass * nx;
            ball1.vy -= impulse * ball2.mass * ny;
            ball2.vx += impulse * ball1.mass * nx;
            ball2.vy += impulse * ball1.mass * ny;

            // 分离重叠的球
            const overlap = ball1.radius + ball2.radius - distance;
            const separationX = (overlap / 2) * nx;
            const separationY = (overlap / 2) * ny;
            ball1.x -= separationX;
            ball1.y -= separationY;
            ball2.x += separationX;
            ball2.y += separationY;
          }
        }
      }
    }

    return currentBalls;
  }, [frame, initialBalls, containerWidth, containerHeight]);

  // 计算平均动能（温度）
  const avgKineticEnergy = useMemo(() => {
    const totalKE = balls.reduce((sum, ball) => {
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      return sum + 0.5 * ball.mass * speed * speed;
    }, 0);
    return totalKE / balls.length;
  }, [balls]);

  // 进入动画
  const opacity = interpolate(frame, [0, 20], [0, 1], {
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
          fontSize: 42,
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 容器 */}
      <div
        style={{
          position: "relative",
          width: containerWidth,
          height: containerHeight,
          border: `4px solid ${theme.colors.primary}`,
          borderRadius: 10,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        <svg width={containerWidth} height={containerHeight}>
          {/* 绘制小球 */}
          {balls.map((ball) => (
            <g key={ball.id}>
              {/* 小球 */}
              <circle
                cx={ball.x}
                cy={ball.y}
                r={ball.radius}
                fill={ball.color}
                style={{
                  filter: `drop-shadow(0 0 4px ${ball.color})`,
                }}
              />

              {/* 速度矢量 */}
              {showVelocity && (
                <line
                  x1={ball.x}
                  y1={ball.y}
                  x2={ball.x + ball.vx * 3}
                  y2={ball.y + ball.vy * 3}
                  stroke={ball.color}
                  strokeWidth={2}
                  opacity={0.6}
                  markerEnd="url(#arrowhead)"
                />
              )}
            </g>
          ))}

          {/* 箭头标记 */}
          {showVelocity && (
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill={theme.colors.primary} />
              </marker>
            </defs>
          )}
        </svg>
      </div>

      {/* 统计信息 */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 40,
          fontSize: 18,
          color: theme.colors.text,
        }}
      >
        <div>🔵 粒子数: {ballCount}</div>
        <div>🌡️ 平均动能: {avgKineticEnergy.toFixed(2)} J</div>
        <div>⚡ 温度: {temperature.toFixed(1)} K</div>
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: 15,
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        💡 气体分子的无规则运动，宏观温度是微观动能的统计平均
      </div>
    </div>
  );
};
