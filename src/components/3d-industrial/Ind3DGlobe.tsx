import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface Connection {
  from: { lat: number; lon: number; city: string };
  to: { lat: number; lon: number; city: string };
  value?: number;
}

export interface Ind3DGlobeProps {
  connections?: Connection[];
  title?: string;
  showGrid?: boolean;
  showCities?: boolean;
}

/**
 * Ind3DGlobe - 全球数据网络（使用 D3.js 地理投影）
 * 
 * 使用 D3.js 的正交投影实现真实的球面投影
 * 
 * 特性：
 * - D3 正交投影
 * - 大圆航线计算
 * - 自动旋转
 * - 数据流动画
 * - 城市标注
 */
export const Ind3DGlobe: React.FC<Ind3DGlobeProps> = ({
  connections = [
    {
      from: { lat: 39.9, lon: 116.4, city: "北京" },
      to: { lat: 40.7, lon: -74.0, city: "纽约" },
      value: 100,
    },
    {
      from: { lat: 31.2, lon: 121.5, city: "上海" },
      to: { lat: 51.5, lon: -0.1, city: "伦敦" },
      value: 80,
    },
    {
      from: { lat: 22.3, lon: 114.2, city: "香港" },
      to: { lat: 35.7, lon: 139.7, city: "东京" },
      value: 90,
    },
    {
      from: { lat: 1.3, lon: 103.8, city: "新加坡" },
      to: { lat: -33.9, lon: 151.2, city: "悉尼" },
      value: 70,
    },
    {
      from: { lat: 37.8, lon: -122.4, city: "旧金山" },
      to: { lat: 48.9, lon: 2.4, city: "巴黎" },
      value: 85,
    },
  ],
  title = "全球数据网络",
  showGrid = true,
  showCities = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 地球参数
  const radius = 250;
  const centerX = 540;
  const centerY = 360;

  // 旋转角度
  const rotation = interpolate(frame, [0, 300], [0, 360]);

  // 创建 D3 投影
  const projection = useMemo(() => {
    return d3
      .geoOrthographic()
      .scale(radius)
      .translate([centerX, centerY])
      .rotate([-rotation, -20, 0]);
  }, [rotation, radius, centerX, centerY]);

  // 创建路径生成器
  const pathGenerator = d3.geoPath().projection(projection);

  // 生成经纬网格
  const graticule = d3.geoGraticule();

  // 生成大圆航线
  const generateArc = (from: { lat: number; lon: number }, to: { lat: number; lon: number }) => {
    const interpolator = d3.geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
    const points: [number, number][] = [];
    for (let i = 0; i <= 50; i++) {
      points.push(interpolator(i / 50));
    }
    return {
      type: "LineString" as const,
      coordinates: points,
    };
  };

  // 检查点是否在可见半球
  const isVisible = (lon: number, lat: number) => {
    const point = projection([lon, lat]);
    if (!point) return false;
    const [x, y] = point;
    const dx = x - centerX;
    const dy = y - centerY;
    return dx * dx + dy * dy <= radius * radius;
  };

  // 渲染城市点
  const renderCities = () => {
    if (!showCities) return null;

    const cities = new Set<string>();
    connections.forEach((conn) => {
      cities.add(JSON.stringify(conn.from));
      cities.add(JSON.stringify(conn.to));
    });

    return Array.from(cities).map((cityStr) => {
      const city = JSON.parse(cityStr);
      const point = projection([city.lon, city.lat]);
      if (!point || !isVisible(city.lon, city.lat)) return null;

      const [x, y] = point;
      const pulse = 1 + Math.sin(frame * 0.1 + city.lat) * 0.2;

      return (
        <g key={`city-${city.city}`}>
          {/* 城市点 */}
          <circle
            cx={x}
            cy={y}
            r={4 * pulse}
            fill={theme.colors.accent}
            opacity="0.8"
          />
          
          {/* 光晕 */}
          <circle
            cx={x}
            cy={y}
            r={8 * pulse}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth="2"
            opacity={0.4}
          />

          {/* 城市名称 */}
          <text
            x={x + 10}
            y={y - 10}
            fill={theme.colors.text}
            fontSize="12"
            opacity="0.9"
          >
            {city.city}
          </text>
        </g>
      );
    });
  };

  // 渲染连接线
  const renderConnections = () => {
    return connections.map((conn, index) => {
      const arc = generateArc(conn.from, conn.to);
      const pathData = pathGenerator(arc as any);
      if (!pathData) return null;

      // 检查起点和终点是否可见
      const fromVisible = isVisible(conn.from.lon, conn.from.lat);
      const toVisible = isVisible(conn.to.lon, conn.to.lat);
      if (!fromVisible && !toVisible) return null;

      // 数据流动画
      const progress = ((frame * 2 + index * 20) % 100) / 100;
      const color = d3.interpolateRgb(theme.colors.primary, theme.colors.accent)(progress);

      return (
        <g key={`connection-${index}`}>
          {/* 连接线 */}
          <path
            d={pathData}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth="2"
            opacity="0.3"
            strokeDasharray="5,5"
          />

          {/* 数据流 */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            opacity="0.8"
            strokeDasharray={`${progress * 100} ${(1 - progress) * 100}`}
            style={{
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />
        </g>
      );
    });
  };

  // 渲染星空背景
  const renderStars = () => {
    return Array.from({ length: 100 }).map((_, i) => {
      const starX = random(`star-x-${i}`) * 1080;
      const starY = random(`star-y-${i}`) * 720;
      const starR = random(`star-r-${i}`) * 2;
      const starOpacity = random(`star-opacity-${i}`) * 0.5 + 0.3;
      const twinkle = Math.sin(frame * 0.05 + i) * 0.3 + 0.7;

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
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width="1080" height="720" style={{ overflow: "visible" }}>
        {/* 背景 */}
        <rect width="1080" height="720" fill="#0a0a1a" />

        {/* 星空 */}
        {renderStars()}

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          {title}
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect
            width="220"
            height="140"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            网络状态
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            连接数: {connections.length}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            投影: D3 正交投影
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            旋转: {rotation.toFixed(1)}°
          </text>
          <text x="15" y="115" fill={theme.colors.text} fontSize="14">
            数据流: 实时传输
          </text>
        </g>

        {/* 地球主体 */}
        <g>
          {/* 地球背景 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="url(#earthGradient)"
            stroke={theme.colors.accent}
            strokeWidth="2"
          />

          {/* 渐变定义 */}
          <defs>
            <radialGradient id="earthGradient">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0a1929" />
            </radialGradient>
          </defs>

          {/* 经纬网格 */}
          {showGrid && (
            <path
              d={pathGenerator(graticule()) || ""}
              fill="none"
              stroke={theme.colors.text}
              strokeWidth="0.5"
              opacity="0.3"
            />
          )}

          {/* 连接线 */}
          {renderConnections()}

          {/* 城市点 */}
          {renderCities()}

          {/* 地球光晕 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 10}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth="2"
            opacity="0.3"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 20}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth="1"
            opacity="0.2"
          />
        </g>

        {/* 数据统计 */}
        <g transform="translate(810, 80)">
          <rect
            width="220"
            height="180"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            数据流量
          </text>
          {connections.slice(0, 5).map((conn, i) => (
            <g key={i} transform={`translate(15, ${50 + i * 25})`}>
              <text y="0" fill={theme.colors.text} fontSize="12">
                {conn.from.city} → {conn.to.city}
              </text>
              <rect
                y="5"
                width={180 * ((conn.value || 50) / 100)}
                height="8"
                fill={theme.colors.primary}
                rx="2"
              />
            </g>
          ))}
        </g>

        {/* 图例 */}
        <g transform="translate(50, 600)">
          <text x="0" y="0" fill={theme.colors.text} fontSize="14" fontWeight="bold">
            图例
          </text>
          <circle cx="10" cy="20" r="4" fill={theme.colors.accent} />
          <text x="20" y="24" fill={theme.colors.text} fontSize="12">
            城市节点
          </text>
          <line
            x1="5"
            y1="40"
            x2="15"
            y2="40"
            stroke={theme.colors.accent}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text x="20" y="44" fill={theme.colors.text} fontSize="12">
            数据连接
          </text>
        </g>
      </svg>
    </div>
  );
};
