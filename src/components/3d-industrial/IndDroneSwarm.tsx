import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

interface IndDroneSwarmProps {
  droneCount?: number;
  swarmRadius?: number;
  showTrails?: boolean;
  showConnections?: boolean;
}

interface Drone {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

/**
 * IndDroneSwarm - 无人机集群仿真
 * 
 * 展示无人机集群的协同飞行、避障和编队行为
 * 
 * 特性：
 * - Boids 算法（分离、对齐、聚合）
 * - 3D 空间运动
 * - 编队飞行
 * - 轨迹追踪
 * - 通信网络可视化
 */
export const IndDroneSwarm: React.FC<IndDroneSwarmProps> = ({
  droneCount = 20,
  swarmRadius = 200,
  showTrails = true,
  showConnections = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 初始化无人机位置
  const initializeDrones = (): Drone[] => {
    const drones: Drone[] = [];
    for (let i = 0; i < droneCount; i++) {
      drones.push({
        id: i,
        x: random(`drone-x-${i}`) * 400 - 200,
        y: random(`drone-y-${i}`) * 300 - 150,
        z: random(`drone-z-${i}`) * 200 - 100,
        vx: (random(`drone-vx-${i}`) - 0.5) * 2,
        vy: (random(`drone-vy-${i}`) - 0.5) * 2,
        vz: (random(`drone-vz-${i}`) - 0.5) * 2,
      });
    }
    return drones;
  };

  // Boids 算法 - 计算无人机行为
  const updateDrones = (drones: Drone[]): Drone[] => {
    const separationDist = 50;
    const alignmentDist = 100;
    const cohesionDist = 150;
    const maxSpeed = 3;
    const maxForce = 0.1;

    return drones.map((drone) => {
      let separationForce = { x: 0, y: 0, z: 0 };
      let alignmentForce = { x: 0, y: 0, z: 0 };
      let cohesionForce = { x: 0, y: 0, z: 0 };
      let separationCount = 0;
      let alignmentCount = 0;
      let cohesionCount = 0;

      // 计算与其他无人机的相互作用
      drones.forEach((other) => {
        if (other.id === drone.id) return;

        const dx = drone.x - other.x;
        const dy = drone.y - other.y;
        const dz = drone.z - other.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // 分离力 - 避免碰撞
        if (dist < separationDist && dist > 0) {
          separationForce.x += dx / dist;
          separationForce.y += dy / dist;
          separationForce.z += dz / dist;
          separationCount++;
        }

        // 对齐力 - 与邻居速度对齐
        if (dist < alignmentDist) {
          alignmentForce.x += other.vx;
          alignmentForce.y += other.vy;
          alignmentForce.z += other.vz;
          alignmentCount++;
        }

        // 聚合力 - 向群体中心移动
        if (dist < cohesionDist) {
          cohesionForce.x += other.x;
          cohesionForce.y += other.y;
          cohesionForce.z += other.z;
          cohesionCount++;
        }
      });

      // 平均化力
      if (separationCount > 0) {
        separationForce.x /= separationCount;
        separationForce.y /= separationCount;
        separationForce.z /= separationCount;
      }

      if (alignmentCount > 0) {
        alignmentForce.x = alignmentForce.x / alignmentCount - drone.vx;
        alignmentForce.y = alignmentForce.y / alignmentCount - drone.vy;
        alignmentForce.z = alignmentForce.z / alignmentCount - drone.vz;
      }

      if (cohesionCount > 0) {
        cohesionForce.x = cohesionForce.x / cohesionCount - drone.x;
        cohesionForce.y = cohesionForce.y / cohesionCount - drone.y;
        cohesionForce.z = cohesionForce.z / cohesionCount - drone.z;
      }

      // 限制力的大小
      const limitForce = (force: { x: number; y: number; z: number }) => {
        const mag = Math.sqrt(force.x * force.x + force.y * force.y + force.z * force.z);
        if (mag > maxForce) {
          force.x = (force.x / mag) * maxForce;
          force.y = (force.y / mag) * maxForce;
          force.z = (force.z / mag) * maxForce;
        }
        return force;
      };

      separationForce = limitForce(separationForce);
      alignmentForce = limitForce(alignmentForce);
      cohesionForce = limitForce(cohesionForce);

      // 应用力
      let vx = drone.vx + separationForce.x * 1.5 + alignmentForce.x + cohesionForce.x;
      let vy = drone.vy + separationForce.y * 1.5 + alignmentForce.y + cohesionForce.y;
      let vz = drone.vz + separationForce.z * 1.5 + alignmentForce.z + cohesionForce.z;

      // 限制速度
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed > maxSpeed) {
        vx = (vx / speed) * maxSpeed;
        vy = (vy / speed) * maxSpeed;
        vz = (vz / speed) * maxSpeed;
      }

      // 更新位置
      let x = drone.x + vx;
      let y = drone.y + vy;
      let z = drone.z + vz;

      // 边界检测 - 环绕
      if (x > swarmRadius) x = -swarmRadius;
      if (x < -swarmRadius) x = swarmRadius;
      if (y > swarmRadius * 0.75) y = -swarmRadius * 0.75;
      if (y < -swarmRadius * 0.75) y = swarmRadius * 0.75;
      if (z > swarmRadius * 0.5) z = -swarmRadius * 0.5;
      if (z < -swarmRadius * 0.5) z = swarmRadius * 0.5;

      return { ...drone, x, y, z, vx, vy, vz };
    });
  };

  // 模拟无人机运动
  const drones = React.useMemo(() => {
    let currentDrones = initializeDrones();
    for (let i = 0; i < frame; i++) {
      currentDrones = updateDrones(currentDrones);
    }
    return currentDrones;
  }, [frame, droneCount]);

  // 3D 到 2D 投影
  const project3D = (x: number, y: number, z: number) => {
    const perspective = 600;
    const scale = perspective / (perspective + z);
    return {
      x: 540 + x * scale,
      y: 360 + y * scale,
      scale,
    };
  };

  // 渲染无人机
  const renderDrone = (drone: Drone) => {
    const projected = project3D(drone.x, drone.y, drone.z);
    const size = 8 * projected.scale;
    const opacity = interpolate(projected.scale, [0.5, 1.5], [0.3, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <g key={`drone-${drone.id}`} opacity={opacity}>
        {/* 无人机主体 */}
        <circle
          cx={projected.x}
          cy={projected.y}
          r={size}
          fill={theme.colors.primary}
          stroke={theme.colors.accent}
          strokeWidth={1}
        />
        
        {/* 旋翼 */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const armLength = size * 1.5;
          return (
            <line
              key={`arm-${angle}`}
              x1={projected.x}
              y1={projected.y}
              x2={projected.x + Math.cos(rad) * armLength}
              y2={projected.y + Math.sin(rad) * armLength}
              stroke={theme.colors.primary}
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}

        {/* ID 标签 */}
        <text
          x={projected.x}
          y={projected.y - size - 5}
          fill={theme.colors.text}
          fontSize={10}
          textAnchor="middle"
          opacity={0.7}
        >
          {drone.id}
        </text>
      </g>
    );
  };

  // 渲染连接线
  const renderConnections = () => {
    if (!showConnections) return null;

    const connections: React.ReactElement[] = [];
    const maxConnectionDist = 100;

    drones.forEach((drone, i) => {
      drones.slice(i + 1).forEach((other) => {
        const dx = drone.x - other.x;
        const dy = drone.y - other.y;
        const dz = drone.z - other.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxConnectionDist) {
          const p1 = project3D(drone.x, drone.y, drone.z);
          const p2 = project3D(other.x, other.y, other.z);
          const opacity = interpolate(dist, [0, maxConnectionDist], [0.5, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          connections.push(
            <line
              key={`connection-${drone.id}-${other.id}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={theme.colors.accent}
              strokeWidth={1}
              opacity={opacity * 0.3}
            />
          );
        }
      });
    });

    return connections;
  };

  // 渲染轨迹
  const renderTrails = () => {
    if (!showTrails || frame < 10) return null;

    return drones.map((drone) => {
      const trailPoints: { x: number; y: number }[] = [];
      const trailLength = 20;

      for (let i = Math.max(0, frame - trailLength); i < frame; i++) {
        const projected = project3D(
          drone.x - drone.vx * (frame - i),
          drone.y - drone.vy * (frame - i),
          drone.z - drone.vz * (frame - i)
        );
        trailPoints.push({ x: projected.x, y: projected.y });
      }

      if (trailPoints.length < 2) return null;

      const pathData = trailPoints
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

      return (
        <path
          key={`trail-${drone.id}`}
          d={pathData}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={1}
          opacity={0.3}
        />
      );
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width="1080" height="720" style={{ overflow: "visible" }}>
        {/* 背景网格 */}
        <defs>
          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={theme.colors.text}
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="1080" height="720" fill="url(#grid-pattern)" />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          无人机集群仿真
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect
            width="250"
            height="120"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            集群参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            无人机数量: {droneCount}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            活动范围: {swarmRadius * 2}m
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            算法: Boids (分离/对齐/聚合)
          </text>
        </g>

        {/* 渲染连接线 */}
        {renderConnections()}

        {/* 渲染轨迹 */}
        {renderTrails()}

        {/* 渲染无人机 */}
        {drones.map(renderDrone)}

        {/* 中心标记 */}
        <circle
          cx="540"
          cy="360"
          r="5"
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="2"
          opacity="0.5"
        />
        <circle
          cx="540"
          cy="360"
          r="100"
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};
