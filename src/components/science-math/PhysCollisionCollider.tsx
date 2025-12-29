import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

type Seed = string | number;

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
  /** 温度系数（影响初始速度强度；为“相对量”，不是绝对温度单位 K） */
  temperature?: number;
  /** 仿真长度（帧）。为了性能与可复现性，组件会预计算 0..durationInFrames-1 的状态。 */
  durationInFrames?: number;
  /** 是否循环播放仿真 */
  loop?: boolean;
  /** Deterministic seed (avoid Math.random). */
  seed?: Seed;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const cloneBalls = (balls: Ball[]): Ball[] => balls.map((b) => ({ ...b }));

const cellKey = (cx: number, cy: number) => `${cx},${cy}`;

/**
 * 多体碰撞实验（帧驱动、可复现）
 *
 * 设计目标：
 * - Remotion 渲染确定性：不使用 Math.random
 * - 性能：预计算有限帧数，并用空间哈希降低碰撞检测开销
 * - 准确性：数值模型是“简化弹性碰撞示意”，展示概念而非绝对单位
 */
export const PhysCollisionCollider: React.FC<PhysCollisionColliderProps> = ({
  title = "多体碰撞（示意）",
  ballCount = 50,
  containerWidth = 800,
  containerHeight = 600,
  showVelocity = false,
  temperature = 1.0,
  durationInFrames = 300,
  loop = true,
  seed,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const durationFrames = Math.max(1, Math.floor(durationInFrames));
  const simFrame = loop ? frame % durationFrames : Math.min(frame, durationFrames - 1);
  const seedBase = (seed ?? "PhysCollisionCollider").toString();

  const initialBalls = useMemo(() => {
    const balls: Ball[] = [];

    const radius = 8;
    const margin = radius + 2;

    for (let i = 0; i < ballCount; i++) {
      const rx = random(`${seedBase}:x:${i}`);
      const ry = random(`${seedBase}:y:${i}`);
      const rDir = random(`${seedBase}:dir:${i}`) * Math.PI * 2;
      const rSpeed = 4 + random(`${seedBase}:speed:${i}`) * 6;

      const speed = rSpeed * clamp(temperature, 0, 10);

      const hue = Math.floor(random(`${seedBase}:hue:${i}`) * 360);

      balls.push({
        id: i,
        x: margin + rx * (containerWidth - margin * 2),
        y: margin + ry * (containerHeight - margin * 2),
        vx: Math.cos(rDir) * speed,
        vy: Math.sin(rDir) * speed,
        radius,
        color: `hsl(${hue}, 70%, 60%)`,
        mass: 1,
      });
    }

    return balls;
  }, [ballCount, containerHeight, containerWidth, seedBase, temperature]);

  const precomputed = useMemo(() => {
    const dt = 0.5;
    const balls = cloneBalls(initialBalls);
    const out: Ball[][] = [];

    // Cell size ~ diameter for coarse spatial hashing.
    const cellSize = Math.max(16, balls[0]?.radius ? balls[0].radius * 2 + 4 : 20);

    for (let step = 0; step < durationFrames; step++) {
      // Integrate
      for (const b of balls) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Wall collisions (elastic)
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx);
        }
        if (b.x + b.radius > containerWidth) {
          b.x = containerWidth - b.radius;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = Math.abs(b.vy);
        }
        if (b.y + b.radius > containerHeight) {
          b.y = containerHeight - b.radius;
          b.vy = -Math.abs(b.vy);
        }
      }

      // Spatial hash
      const grid = new Map<string, number[]>();
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const cx = Math.floor(b.x / cellSize);
        const cy = Math.floor(b.y / cellSize);
        const key = cellKey(cx, cy);
        const arr = grid.get(key);
        if (arr) arr.push(i);
        else grid.set(key, [i]);
      }

      // Collisions (check neighbor cells)
      for (let i = 0; i < balls.length; i++) {
        const b1 = balls[i];
        const cx = Math.floor(b1.x / cellSize);
        const cy = Math.floor(b1.y / cellSize);

        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const key = cellKey(cx + ox, cy + oy);
            const candidates = grid.get(key);
            if (!candidates) continue;

            for (const j of candidates) {
              if (j <= i) continue;
              const b2 = balls[j];

              const dx = b2.x - b1.x;
              const dy = b2.y - b1.y;
              const dist2 = dx * dx + dy * dy;
              const minDist = b1.radius + b2.radius;
              if (dist2 >= minDist * minDist) continue;

              const dist = Math.sqrt(dist2) || 1e-6;
              const nx = dx / dist;
              const ny = dy / dist;

              // Relative velocity
              const dvx = b1.vx - b2.vx;
              const dvy = b1.vy - b2.vy;
              const dvn = dvx * nx + dvy * ny;
              if (dvn > 0) continue;

              // Elastic impulse
              const impulse = (2 * dvn) / (b1.mass + b2.mass);
              b1.vx -= impulse * b2.mass * nx;
              b1.vy -= impulse * b2.mass * ny;
              b2.vx += impulse * b1.mass * nx;
              b2.vy += impulse * b1.mass * ny;

              // Separate overlap
              const overlap = minDist - dist;
              const sepX = (overlap / 2) * nx;
              const sepY = (overlap / 2) * ny;
              b1.x -= sepX;
              b1.y -= sepY;
              b2.x += sepX;
              b2.y += sepY;
            }
          }
        }
      }

      out.push(cloneBalls(balls));
    }

    return out;
  }, [containerHeight, containerWidth, durationFrames, initialBalls]);

  const balls = precomputed[simFrame] ?? initialBalls;

  const avgKineticEnergy = useMemo(() => {
    if (balls.length === 0) return 0;
    const total = balls.reduce((sum, b) => sum + 0.5 * b.mass * (b.vx * b.vx + b.vy * b.vy), 0);
    return total / balls.length;
  }, [balls]);

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

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
      <h2
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: theme.colors.text,
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

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
          {balls.map((b) => (
            <g key={b.id}>
              <circle
                cx={b.x}
                cy={b.y}
                r={b.radius}
                fill={b.color}
                style={{ filter: `drop-shadow(0 0 4px ${b.color})` }}
              />

              {showVelocity && (
                <line
                  x1={b.x}
                  y1={b.y}
                  x2={b.x + b.vx * 3}
                  y2={b.y + b.vy * 3}
                  stroke={b.color}
                  strokeWidth={2}
                  opacity={0.6}
                  markerEnd="url(#arrowhead)"
                />
              )}
            </g>
          ))}

          {showVelocity && (
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={theme.colors.primary} />
              </marker>
            </defs>
          )}
        </svg>
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 40,
          fontSize: 18,
          color: theme.colors.text,
        }}
      >
        <div>粒子数: {ballCount}</div>
        <div>平均动能(相对): {avgKineticEnergy.toFixed(2)}</div>
        <div>温度系数: {temperature.toFixed(2)}</div>
      </div>

      <div
        style={{
          marginTop: 15,
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: "center",
          maxWidth: 1000,
        }}
      >
        提示：该模型用于演示“随机运动与碰撞”概念；数值为相对量，非严格物理单位。
      </div>
    </div>
  );
};
