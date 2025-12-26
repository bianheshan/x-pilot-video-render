import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Planet {
  /** 行星名称 */
  name: string;
  /** 半长轴 (AU) */
  semiMajorAxis: number;
  /** 离心率 */
  eccentricity: number;
  /** 轨道周期 (相对单位) */
  period: number;
  /** 行星半径 (像素) */
  radius: number;
  /** 行星颜色 */
  color: string;
}

export interface PhysGravityOrbitProps {
  /** 行星数组 */
  planets?: Planet[];
  /** 标题 */
  title?: string;
  /** 是否显示轨道 */
  showOrbits?: boolean;
  /** 是否显示开普勒定律说明 */
  showKeplerLaws?: boolean;
  /** 时间缩放因子 */
  timeScale?: number;
}

/**
 * 引力轨道模拟
 * 
 * 模拟行星绕恒星运动，展示开普勒三大定律
 * 
 * 开普勒三大定律：
 * 1. 椭圆定律：行星绕太阳的轨道是椭圆，太阳位于一个焦点
 * 2. 面积定律：行星与太阳的连线在相等时间内扫过相等面积
 * 3. 周期定律：T² ∝ a³（周期平方与半长轴立方成正比）
 * 
 * 教学要点：
 * - 万有引力定律的应用
 * - 椭圆轨道的几何特性
 * - 角动量守恒
 * - 能量守恒
 */
export const PhysGravityOrbit: React.FC<PhysGravityOrbitProps> = ({
  planets = [
    { name: "水星", semiMajorAxis: 80, eccentricity: 0.2, period: 88, radius: 6, color: "#8C7853" },
    { name: "金星", semiMajorAxis: 120, eccentricity: 0.01, period: 225, radius: 10, color: "#FFC649" },
    { name: "地球", semiMajorAxis: 160, eccentricity: 0.017, period: 365, radius: 10, color: "#4A90E2" },
    { name: "火星", semiMajorAxis: 200, eccentricity: 0.09, period: 687, radius: 8, color: "#E27B58" },
  ],
  title = "引力轨道模拟 - 开普勒定律",
  showOrbits = true,
  showKeplerLaws = true,
  timeScale = 0.5,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 计算行星位置（使用椭圆参数方程）
  const planetPositions = useMemo(() => {
    return planets.map((planet) => {
      // 时间参数（角度）
      const t = (frame * timeScale * 2 * Math.PI) / planet.period;
      
      // 椭圆参数
      const a = planet.semiMajorAxis; // 半长轴
      const e = planet.eccentricity; // 离心率
      const b = a * Math.sqrt(1 - e * e); // 半短轴
      
      // 椭圆参数方程
      const x = a * Math.cos(t);
      const y = b * Math.sin(t);
      
      // 焦点偏移（太阳在焦点）
      const c = a * e;
      
      return {
        ...planet,
        x: x - c,
        y: y,
        angle: t,
      };
    });
  }, [frame, planets, timeScale]);

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const centerX = 640;
  const centerY = 360;

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
        backgroundColor: "#000814",
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#FFD60A",
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
          textShadow: "0 0 20px rgba(255, 214, 10, 0.5)",
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg
        width={1280}
        height={600}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* 太阳光晕 */}
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="#FDB813" stopOpacity="1" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 绘制轨道 */}
        {showOrbits && planets.map((planet, index) => {
          const a = planet.semiMajorAxis;
          const e = planet.eccentricity;
          const b = a * Math.sqrt(1 - e * e);
          const c = a * e;

          return (
            <ellipse
              key={`orbit-${index}`}
              cx={centerX - c}
              cy={centerY}
              rx={a}
              ry={b}
              fill="none"
              stroke={planet.color}
              strokeWidth={1}
              strokeDasharray="5,5"
              opacity={0.3}
            />
          );
        })}

        {/* 太阳 */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={40}
            fill="url(#sunGlow)"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={20}
            fill="#FDB813"
            style={{
              filter: "drop-shadow(0 0 20px #FF6B35)",
            }}
          />
        </g>

        {/* 绘制行星 */}
        {planetPositions.map((planet, index) => {
          const px = centerX + planet.x;
          const py = centerY + planet.y;

          return (
            <g key={`planet-${index}`}>
              {/* 连线（展示面积定律） */}
              <line
                x1={centerX}
                y1={centerY}
                x2={px}
                y2={py}
                stroke={planet.color}
                strokeWidth={1}
                opacity={0.3}
              />

              {/* 行星 */}
              <circle
                cx={px}
                cy={py}
                r={planet.radius}
                fill={planet.color}
                style={{
                  filter: `drop-shadow(0 0 10px ${planet.color})`,
                }}
              />

              {/* 行星名称 */}
              <text
                x={px}
                y={py - planet.radius - 10}
                fill={planet.color}
                fontSize={14}
                fontWeight="bold"
                textAnchor="middle"
                style={{ fontFamily: theme.fonts.body }}
              >
                {planet.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 开普勒定律说明 */}
      {showKeplerLaws && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 30,
            fontSize: 14,
            color: "#FFD60A",
          }}
        >
          <div>📐 第一定律：椭圆轨道</div>
          <div>📊 第二定律：面积守恒</div>
          <div>⏱️ 第三定律：T² ∝ a³</div>
        </div>
      )}
    </div>
  );
};
