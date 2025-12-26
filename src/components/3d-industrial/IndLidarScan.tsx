import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface LidarPoint {
  /** 距离 */
  distance: number;
  /** 角度 */
  angle: number;
  /** 强度 */
  intensity: number;
}

export interface IndLidarScanProps {
  /** 标题 */
  title?: string;
  /** 扫描半径 */
  scanRadius?: number;
  /** 扫描速度 */
  scanSpeed?: number;
  /** 点云密度 */
  pointDensity?: number;
  /** 是否显示障碍物 */
  showObstacles?: boolean;
}

/**
 * 激光雷达扫描
 * 
 * 展示 LiDAR 点云扫描和环境感知
 * 
 * 技术原理：
 * - 激光测距：TOF（飞行时间）
 * - 点云生成：3D 空间采样
 * - 障碍物检测：聚类算法
 * - SLAM：同步定位与建图
 * 
 * 教学要点：
 * - 自动驾驶感知
 * - 机器人导航
 * - 3D 重建
 * - 环境建模
 */
export const IndLidarScan: React.FC<IndLidarScanProps> = ({
  title = "激光雷达扫描",
  scanRadius = 300,
  scanSpeed = 2,
  pointDensity = 360,
  showObstacles = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // LiDAR 中心
  const centerX = 540;
  const centerY = 360;

  // 扫描角度
  const scanAngle = (frame * scanSpeed) % 360;

  // 生成障碍物
  const obstacles = useMemo(() => {
    return [
      { x: 200, y: 200, width: 80, height: 120, type: "building" },
      { x: 700, y: 150, width: 100, height: 100, type: "building" },
      { x: 350, y: 500, width: 60, height: 60, type: "car" },
      { x: 800, y: 450, width: 50, height: 80, type: "person" },
      { x: 150, y: 550, width: 40, height: 40, type: "box" },
    ];
  }, []);

  // 生成点云数据
  const pointCloud = useMemo(() => {
    const points: LidarPoint[] = [];

    for (let i = 0; i < pointDensity; i++) {
      const angle = (i / pointDensity) * 360;
      const radian = (angle * Math.PI) / 180;

      // 射线方向
      const dirX = Math.cos(radian);
      const dirY = Math.sin(radian);

      // 检测射线与障碍物的交点
      let minDistance = scanRadius;
      let hitIntensity = 0.3;

      for (const obstacle of obstacles) {
        // 简化：检测射线与矩形的交点
        const obstacleX = obstacle.x - centerX;
        const obstacleY = obstacle.y - centerY;

        // 射线与矩形边界的交点检测
        const corners = [
          { x: obstacleX, y: obstacleY },
          { x: obstacleX + obstacle.width, y: obstacleY },
          { x: obstacleX + obstacle.width, y: obstacleY + obstacle.height },
          { x: obstacleX, y: obstacleY + obstacle.height },
        ];

        for (let j = 0; j < corners.length; j++) {
          const c1 = corners[j];
          const c2 = corners[(j + 1) % corners.length];

          // 射线与线段的交点
          const t = rayLineIntersection(
            0, 0, dirX, dirY,
            c1.x, c1.y, c2.x, c2.y
          );

          if (t !== null && t < minDistance) {
            minDistance = t;
            hitIntensity = 1.0;
          }
        }
      }

      points.push({
        distance: minDistance,
        angle,
        intensity: hitIntensity,
      });
    }

    return points;
  }, [obstacles, scanRadius, pointDensity]);

  // 射线与线段交点检测
  const rayLineIntersection = (
    rayX: number, rayY: number, rayDirX: number, rayDirY: number,
    x1: number, y1: number, x2: number, y2: number
  ): number | null => {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const det = rayDirX * dy - rayDirY * dx;
    if (Math.abs(det) < 0.001) return null;

    const t = ((x1 - rayX) * dy - (y1 - rayY) * dx) / det;
    const u = ((x1 - rayX) * rayDirY - (y1 - rayY) * rayDirX) / det;

    if (t >= 0 && u >= 0 && u <= 1) {
      return t;
    }

    return null;
  };

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
        backgroundColor: "#0A0A0A",
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#FFFFFF",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg width={1080} height={720} style={{ overflow: "visible" }}>
        <defs>
          {/* 扫描线渐变 */}
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF00" stopOpacity={0} />
            <stop offset="50%" stopColor="#00FF00" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#00FF00" stopOpacity={0} />
          </linearGradient>

          {/* 发光效果 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 扫描范围圆 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={scanRadius}
          fill="none"
          stroke="#00FF00"
          strokeWidth={2}
          strokeDasharray="10,5"
          opacity={0.3}
        />

        {/* 距离圈 */}
        {[100, 200, 300].map(r => (
          <circle
            key={`range-${r}`}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="#333"
            strokeWidth={1}
            strokeDasharray="5,5"
            opacity={0.3}
          />
        ))}

        {/* 障碍物（真实位置） */}
        {showObstacles && obstacles.map((obstacle, index) => (
          <rect
            key={`obstacle-${index}`}
            x={obstacle.x}
            y={obstacle.y}
            width={obstacle.width}
            height={obstacle.height}
            fill="#333"
            stroke="#666"
            strokeWidth={2}
            opacity={0.5}
          />
        ))}

        {/* 点云 */}
        {pointCloud.map((point, index) => {
          const radian = (point.angle * Math.PI) / 180;
          const x = centerX + point.distance * Math.cos(radian);
          const y = centerY + point.distance * Math.sin(radian);

          // 根据强度设置颜色
          const color = point.intensity > 0.8 ? "#FF0000" : "#00FF00";
          const size = point.intensity > 0.8 ? 3 : 2;

          return (
            <circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r={size}
              fill={color}
              opacity={point.intensity}
              filter="url(#glow)"
            />
          );
        })}

        {/* 扫描线 */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + scanRadius * Math.cos((scanAngle * Math.PI) / 180)}
          y2={centerY + scanRadius * Math.sin((scanAngle * Math.PI) / 180)}
          stroke="#00FF00"
          strokeWidth={2}
          opacity={0.8}
          filter="url(#glow)"
        />

        {/* 扫描扇形区域 */}
        <path
          d={`
            M ${centerX} ${centerY}
            L ${centerX + scanRadius * Math.cos(((scanAngle - 30) * Math.PI) / 180)} ${centerY + scanRadius * Math.sin(((scanAngle - 30) * Math.PI) / 180)}
            A ${scanRadius} ${scanRadius} 0 0 1 ${centerX + scanRadius * Math.cos(((scanAngle + 30) * Math.PI) / 180)} ${centerY + scanRadius * Math.sin(((scanAngle + 30) * Math.PI) / 180)}
            Z
          `}
          fill="#00FF00"
          opacity={0.1}
        />

        {/* LiDAR 传感器 */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={20}
            fill="#333"
            stroke="#00FF00"
            strokeWidth={3}
            filter="url(#glow)"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={10}
            fill="#00FF00"
            opacity={0.5}
          >
            <animate
              attributeName="r"
              values="10;15;10"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* 坐标轴 */}
        <g opacity={0.5}>
          {/* X 轴 */}
          <line
            x1={centerX - scanRadius}
            y1={centerY}
            x2={centerX + scanRadius}
            y2={centerY}
            stroke="#666"
            strokeWidth={1}
            strokeDasharray="5,5"
          />
          <text
            x={centerX + scanRadius + 10}
            y={centerY + 5}
            fill="#666"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            X
          </text>
          {/* Y 轴 */}
          <line
            x1={centerX}
            y1={centerY - scanRadius}
            x2={centerX}
            y2={centerY + scanRadius}
            stroke="#666"
            strokeWidth={1}
            strokeDasharray="5,5"
          />
          <text
            x={centerX + 5}
            y={centerY - scanRadius - 10}
            fill="#666"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            Y
          </text>
        </g>

        {/* 信息面板 */}
        <g>
          <rect
            x={20}
            y={20}
            width={220}
            height={150}
            rx={10}
            fill="#000000"
            fillOpacity={0.8}
            stroke="#00FF00"
            strokeWidth={2}
          />
          <text
            x={130}
            y={50}
            fill="#FFFFFF"
            fontSize={18}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            LiDAR 数据
          </text>
          <text
            x={40}
            y={80}
            fill="#00FF00"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            扫描角度: {scanAngle.toFixed(1)}°
          </text>
          <text
            x={40}
            y={105}
            fill="#00FF00"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            点云数量: {pointCloud.length}
          </text>
          <text
            x={40}
            y={130}
            fill="#00FF00"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            扫描半径: {scanRadius}m
          </text>
          <text
            x={40}
            y={155}
            fill="#FF0000"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            障碍物: {obstacles.length} 个
          </text>
        </g>

        {/* 图例 */}
        <g>
          <rect
            x={840}
            y={20}
            width={220}
            height={100}
            rx={10}
            fill="#000000"
            fillOpacity={0.8}
            stroke="#00FF00"
            strokeWidth={2}
          />
          <text
            x={950}
            y={50}
            fill="#FFFFFF"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            图例
          </text>
          <circle cx={870} cy={70} r={4} fill="#00FF00" />
          <text
            x={885}
            y={75}
            fill="#FFFFFF"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            空旷区域
          </text>
          <circle cx={870} cy={95} r={4} fill="#FF0000" />
          <text
            x={885}
            y={100}
            fill="#FFFFFF"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            障碍物检测
          </text>
        </g>
      </svg>

      {/* 说明文字 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        📡 激光雷达点云扫描 | 环境感知 | SLAM 建图
      </div>
    </div>
  );
};
