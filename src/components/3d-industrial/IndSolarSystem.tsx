import React from "react";
import { useCurrentFrame, interpolate, random, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Planet {
  /** 行星名称 */
  name: string;
  /** 轨道半径 */
  orbitRadius: number;
  /** 行星半径 */
  radius: number;
  /** 公转周期（帧） */
  period: number;
  /** 颜色 */
  color: string;
  /** 是否有光环 */
  hasRing?: boolean;
}

export interface IndSolarSystemProps {
  /** 标题 */
  title?: string;
  /** 行星配置 */
  planets?: Planet[];
  /** 时间缩放 */
  timeScale?: number;
  /** 是否显示轨道 */
  showOrbits?: boolean;
  /** 是否显示标签 */
  showLabels?: boolean;
}

/**
 * 太阳系模拟
 * 
 * 展示太阳系行星运动，遵循开普勒定律
 * 
 * 天文原理：
 * - 开普勒第一定律：椭圆轨道
 * - 开普勒第二定律：面积定律
 * - 开普勒第三定律：周期定律 T² ∝ a³
 * - 万有引力定律
 * 
 * 教学要点：
 * - 天体运动
 * - 轨道力学
 * - 行星特征
 * - 宇宙尺度
 */
export const IndSolarSystem: React.FC<IndSolarSystemProps> = ({
  title = "太阳系行星运动",
  planets = [
    { name: "水星", orbitRadius: 80, radius: 6, period: 88, color: "#8C7853" },
    { name: "金星", orbitRadius: 120, radius: 10, period: 225, color: "#FFC649" },
    { name: "地球", orbitRadius: 160, radius: 11, period: 365, color: "#4A90E2" },
    { name: "火星", orbitRadius: 200, radius: 8, period: 687, color: "#E27B58" },
    { name: "木星", orbitRadius: 280, radius: 25, period: 4333, color: "#C88B3A" },
    { name: "土星", orbitRadius: 360, radius: 22, period: 10759, color: "#FAD5A5", hasRing: true },
    { name: "天王星", orbitRadius: 420, radius: 16, period: 30687, color: "#4FD0E0" },
    { name: "海王星", orbitRadius: 480, radius: 15, period: 60190, color: "#4169E1" },
  ],
  timeScale = 0.5,
  showOrbits = true,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { fps } = useVideoConfig();

  // 太阳中心
  const centerX = 540;
  const centerY = 360;

  // 计算行星位置
  const getPlanetPosition = (planet: Planet) => {
    const angle = ((frame * timeScale) / planet.period) * 360;
    const radian = (angle * Math.PI) / 180;

    const x = centerX + planet.orbitRadius * Math.cos(radian);
    const y = centerY + planet.orbitRadius * Math.sin(radian);

    return { x, y, angle };
  };

  // 绘制行星
  const renderPlanet = (planet: Planet) => {
    const pos = getPlanetPosition(planet);

    return (
      <g key={planet.name}>
        {/* 行星主体 */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={planet.radius}
          fill={planet.color}
          stroke="#FFFFFF"
          strokeWidth={1}
          style={{
            filter: `drop-shadow(0 0 ${planet.radius}px ${planet.color}80)`,
          }}
        />

        {/* 土星光环 */}
        {planet.hasRing && (
          <ellipse
            cx={pos.x}
            cy={pos.y}
            rx={planet.radius * 1.8}
            ry={planet.radius * 0.3}
            fill="none"
            stroke={planet.color}
            strokeWidth={3}
            opacity={0.6}
          />
        )}

        {/* 行星标签 */}
        {showLabels && (
          <text
            x={pos.x}
            y={pos.y + planet.radius + 15}
            fill="#FFFFFF"
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            {planet.name}
          </text>
        )}

        {/* 运动轨迹点 */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={2}
          fill={planet.color}
          opacity={0.3}
        />
      </g>
    );
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
        backgroundColor: "#000000",
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
          {/* 太阳渐变 */}
          <radialGradient id="sunGradient">
            <stop offset="0%" stopColor="#FFF9E3" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>

          {/* 发光效果 */}
          <filter id="sunGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 背景星空 */}
        {Array.from({ length: 200 }).map((_, i) => {
          const starX = random(`star-x-${i}`) * 1080;
          const starY = random(`star-y-${i}`) * 720;
          const starR = random(`star-r-${i}`) * 1.5;
          const starOpacity = random(`star-opacity-${i}`) * 0.8 + 0.2;
          const starDur = random(`star-dur-${i}`) * 3 + 2;
          const starPhase = random(`star-phase-${i}`) * Math.PI * 2;

          const twinkle = 0.75 + 0.25 * Math.sin((frame / fps) * ((2 * Math.PI) / starDur) + starPhase);

          return (
            <circle
              key={`star-${i}`}
              cx={starX}
              cy={starY}
              r={starR}
              fill="#FFFFFF"
              opacity={starOpacity * twinkle}
            />
          );
        })}

        {/* 行星轨道 */}
        {showOrbits && planets.map(planet => (
          <circle
            key={`orbit-${planet.name}`}
            cx={centerX}
            cy={centerY}
            r={planet.orbitRadius}
            fill="none"
            stroke="#333"
            strokeWidth={1}
            strokeDasharray="5,5"
            opacity={0.5}
          />
        ))}

        {/* 太阳 */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={40}
            fill="url(#sunGradient)"
            filter="url(#sunGlow)"
          />
          {/* 太阳光芒 */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 + (frame * 0.5);
            const radian = (angle * Math.PI) / 180;
            const x1 = centerX + 45 * Math.cos(radian);
            const y1 = centerY + 45 * Math.sin(radian);
            const x2 = centerX + 60 * Math.cos(radian);
            const y2 = centerY + 60 * Math.sin(radian);

            return (
              <line
                key={`ray-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFD700"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.6}
              />
            );
          })}
          <text
            x={centerX}
            y={centerY + 70}
            fill="#FFFFFF"
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            太阳
          </text>
        </g>

        {/* 行星 */}
        {planets.map(planet => renderPlanet(planet))}

        {/* 信息面板 */}
        <g>
          <rect
            x={20}
            y={20}
            width={250}
            height={180}
            rx={10}
            fill="#000000"
            fillOpacity={0.7}
            stroke="#4A90E2"
            strokeWidth={2}
          />
          <text
            x={145}
            y={50}
            fill="#FFFFFF"
            fontSize={18}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            太阳系数据
          </text>
          <text
            x={40}
            y={80}
            fill="#FFD700"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            太阳质量: 1.989×10³⁰ kg
          </text>
          <text
            x={40}
            y={105}
            fill="#4A90E2"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            地球公转周期: 365.25 天
          </text>
          <text
            x={40}
            y={130}
            fill="#E27B58"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            火星公转周期: 687 天
          </text>
          <text
            x={40}
            y={155}
            fill="#C88B3A"
            fontSize={14}
            style={{ fontFamily: theme.fonts.body }}
          >
            木星公转周期: 11.86 年
          </text>
          <text
            x={40}
            y={180}
            fill="#00FFFF"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            时间缩放: {timeScale}x
          </text>
        </g>

        {/* 开普勒定律说明 */}
        <g>
          <rect
            x={810}
            y={20}
            width={250}
            height={120}
            rx={10}
            fill="#000000"
            fillOpacity={0.7}
            stroke="#50C878"
            strokeWidth={2}
          />
          <text
            x={935}
            y={50}
            fill="#FFFFFF"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            开普勒定律
          </text>
          <text
            x={830}
            y={75}
            fill="#50C878"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            第一定律: 椭圆轨道
          </text>
          <text
            x={830}
            y={95}
            fill="#50C878"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            第二定律: 面积定律
          </text>
          <text
            x={830}
            y={115}
            fill="#50C878"
            fontSize={12}
            style={{ fontFamily: theme.fonts.body }}
          >
            第三定律: T² ∝ a³
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
        🪐 太阳系行星运动 | 开普勒定律 | 天体力学
      </div>
    </div>
  );
};
